/**
 * embed --stale egress regression tests against a REAL engine (PGLite, in-memory).
 *
 * Incident (2026-11): the autopilot `embed --stale` step ran every cycle and,
 * for every page, called getChunks() → `SELECT cc.*`, downloading the full
 * 1536-dim embedding column of every chunk only to filter `!embedded_at`
 * client-side. On a brain whose content had not changed in two weeks this was
 * ~4 MB of pure waste per cycle (~4 GB per billing cycle on Supabase Free).
 *
 * These tests record every row the driver hands back and assert that:
 *   1. a fully-embedded brain costs one count query and zero chunk rows;
 *   2. with stale chunks, no row carrying an embedding vector is ever read,
 *      only stale slugs are re-fetched, and already-embedded chunks survive;
 *   3. a chunk whose text changed (embedding NULLed, embedded_at kept by the
 *      upsert COALESCE) is detected as stale.
 */

import { describe, test, expect, mock, beforeAll, afterAll, beforeEach } from 'bun:test';
import { PGLiteEngine } from '../src/core/pglite-engine.ts';
import type { ChunkInput } from '../src/core/types.ts';

let embedBatchCalls: string[][] = [];

mock.module('../src/core/embedding.ts', () => ({
  embedBatch: async (texts: string[]) => {
    embedBatchCalls.push(texts);
    return texts.map(() => new Float32Array(1536).fill(0.25));
  },
}));

const { runEmbedCore } = await import('../src/commands/embed.ts');

interface RecordedQuery {
  sql: string;
  params: unknown[] | undefined;
  rows: Record<string, unknown>[];
}

let engine: PGLiteEngine;
let recorded: RecordedQuery[] = [];
let recording = false;

beforeAll(async () => {
  engine = new PGLiteEngine();
  await engine.connect({});
  await engine.initSchema();

  // Record every query issued through the engine and the rows it returned.
  // The rows are exactly what crossed the driver boundary — on Postgres,
  // what crossed the network (egress).
  const db = engine.db as unknown as {
    query: (sql: string, params?: unknown[]) => Promise<{ rows: Record<string, unknown>[] }>;
  };
  const originalQuery = db.query.bind(db);
  db.query = async (sql: string, params?: unknown[]) => {
    const result = await originalQuery(sql, params);
    if (recording) recorded.push({ sql, params, rows: result.rows });
    return result;
  };
});

afterAll(async () => {
  await engine.disconnect();
});

beforeEach(async () => {
  for (const table of ['content_chunks', 'links', 'tags', 'timeline_entries', 'page_versions', 'pages']) {
    await (engine as any).db.exec(`DELETE FROM ${table}`);
  }
  recorded = [];
  recording = false;
  embedBatchCalls = [];
});

const vector = (fill: number) => new Float32Array(1536).fill(fill);

async function seedPage(slug: string, chunks: ChunkInput[]) {
  await engine.putPage(slug, {
    type: 'concept',
    title: slug,
    compiled_truth: chunks.map(c => c.chunk_text).join('\n'),
    timeline: '',
  });
  await engine.upsertChunks(slug, chunks);
}

function rowsCarryingEmbeddings(queries: RecordedQuery[]): number {
  return queries
    .flatMap(q => q.rows)
    .filter(row => 'embedding' in row && row.embedding !== null && row.embedding !== undefined)
    .length;
}

function chunkRowsReturned(queries: RecordedQuery[]): number {
  return queries
    .filter(q => /content_chunks/i.test(q.sql) && !/count\(/i.test(q.sql))
    .flatMap(q => q.rows)
    .length;
}

describe('embed --stale egress (PGLite engine)', () => {
  test('fully-embedded brain: one count query, zero chunk rows, no page listing', async () => {
    await seedPage('fresh/a', [
      { chunk_index: 0, chunk_text: 'alpha', chunk_source: 'compiled_truth', embedding: vector(0.1) },
      { chunk_index: 1, chunk_text: 'beta', chunk_source: 'compiled_truth', embedding: vector(0.2) },
    ]);
    await seedPage('fresh/b', [
      { chunk_index: 0, chunk_text: 'gamma', chunk_source: 'compiled_truth', embedding: vector(0.3) },
    ]);

    recording = true;
    const result = await runEmbedCore(engine, { stale: true });
    recording = false;

    expect(result.embedded).toBe(0);
    expect(embedBatchCalls.length).toBe(0);
    expect(rowsCarryingEmbeddings(recorded)).toBe(0);
    expect(chunkRowsReturned(recorded)).toBe(0);
    // listPages (`SELECT p.* FROM pages`) must not run on the stale path.
    expect(recorded.some(q => /SELECT\s+p\.\*/i.test(q.sql))).toBe(false);
    expect(recorded.length).toBe(1);
  });

  test('stale chunks: no embedding vector is read, only stale slugs re-fetched, fresh embeddings preserved', async () => {
    await seedPage('fresh/a', [
      { chunk_index: 0, chunk_text: 'alpha', chunk_source: 'compiled_truth', embedding: vector(0.1) },
    ]);
    await seedPage('mixed/b', [
      { chunk_index: 0, chunk_text: 'already embedded', chunk_source: 'compiled_truth', embedding: vector(0.2) },
      { chunk_index: 1, chunk_text: 'needs embedding', chunk_source: 'compiled_truth' },
    ]);

    recording = true;
    const result = await runEmbedCore(engine, { stale: true });
    recording = false;

    expect(result.embedded).toBe(1);
    expect(result.pages_processed).toBe(1);
    expect(embedBatchCalls).toEqual([['needs embedding']]);

    // The core egress guarantee: nothing read back carried a vector.
    expect(rowsCarryingEmbeddings(recorded)).toBe(0);
    expect(recorded.some(q => /SELECT\s+p\.\*/i.test(q.sql))).toBe(false);
    // The untouched page's slug never appears in any query parameter.
    const touchedSlugs = recorded.flatMap(q => (q.params ?? []).filter(p => typeof p === 'string'));
    expect(touchedSlugs).not.toContain('fresh/a');

    const mixed = await engine.getChunksWithEmbeddings('mixed/b');
    expect(mixed.length).toBe(2);
    expect(mixed[0].embedding![0]).toBeCloseTo(0.2, 5); // preserved via COALESCE
    expect(mixed[1].embedding![0]).toBeCloseTo(0.25, 5); // newly embedded
    expect(mixed[1].embedded_at).not.toBeNull();

    const fresh = await engine.getChunksWithEmbeddings('fresh/a');
    expect(fresh[0].embedding![0]).toBeCloseTo(0.1, 5);

    expect(await engine.countStaleChunks()).toBe(0);
  });

  test('chunk whose text changed (embedding NULLed, embedded_at kept) is detected as stale', async () => {
    await seedPage('edited/c', [
      { chunk_index: 0, chunk_text: 'original text', chunk_source: 'compiled_truth', embedding: vector(0.4) },
    ]);
    // Re-chunk with new text and no embedding: the upsert NULLs the vector but
    // COALESCE keeps the old embedded_at. A `!embedded_at` filter misses this.
    await engine.upsertChunks('edited/c', [
      { chunk_index: 0, chunk_text: 'edited text', chunk_source: 'compiled_truth' },
    ]);
    const [before] = await engine.getChunks('edited/c');
    expect(before.embedded_at).not.toBeNull();

    expect(await engine.countStaleChunks()).toBe(1);

    const result = await runEmbedCore(engine, { stale: true });
    expect(result.embedded).toBe(1);
    expect(embedBatchCalls).toEqual([['edited text']]);
    expect(await engine.countStaleChunks()).toBe(0);
  });

  test('--stale --dry-run reads stale metadata only and writes nothing', async () => {
    await seedPage('mixed/d', [
      { chunk_index: 0, chunk_text: 'done', chunk_source: 'compiled_truth', embedding: vector(0.5) },
      { chunk_index: 1, chunk_text: 'todo', chunk_source: 'compiled_truth' },
    ]);

    recording = true;
    const result = await runEmbedCore(engine, { stale: true, dryRun: true });
    recording = false;

    expect(result.would_embed).toBe(1);
    expect(result.embedded).toBe(0);
    expect(embedBatchCalls.length).toBe(0);
    expect(rowsCarryingEmbeddings(recorded)).toBe(0);
    expect(recorded.some(q => /^\s*(INSERT|UPDATE|DELETE)/i.test(q.sql))).toBe(false);
    expect(await engine.countStaleChunks()).toBe(1);
  });
});

describe('PGLiteEngine stale-chunk primitives', () => {
  test('listStaleChunks returns only stale rows, with metadata and without the embedding column', async () => {
    await seedPage('p/one', [
      { chunk_index: 0, chunk_text: 'embedded', chunk_source: 'compiled_truth', embedding: vector(0.1) },
      { chunk_index: 1, chunk_text: 'stale one', chunk_source: 'timeline', token_count: 3 },
    ]);
    await seedPage('p/two', [
      { chunk_index: 0, chunk_text: 'stale two', chunk_source: 'compiled_truth' },
    ]);

    expect(await engine.countStaleChunks()).toBe(2);

    const stale = await engine.listStaleChunks();
    expect(stale.map(r => [r.slug, r.chunk_index])).toEqual([['p/one', 1], ['p/two', 0]]);
    expect(stale[0]).toMatchObject({ chunk_text: 'stale one', chunk_source: 'timeline', token_count: 3 });
    for (const row of stale) expect('embedding' in row).toBe(false);
  });

  test('getChunks does not transfer the embedding column', async () => {
    await seedPage('p/three', [
      { chunk_index: 0, chunk_text: 'embedded', chunk_source: 'compiled_truth', embedding: vector(0.7) },
    ]);

    recording = true;
    const chunks = await engine.getChunks('p/three');
    recording = false;

    expect(chunks.length).toBe(1);
    expect(chunks[0].embedded_at).not.toBeNull();
    expect(chunks[0].embedding).toBeNull();
    expect(recorded.length).toBe(1);
    expect('embedding' in recorded[0].rows[0]).toBe(false);
  });
});
