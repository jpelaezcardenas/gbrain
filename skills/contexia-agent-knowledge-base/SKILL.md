---
name: contexia-agent-knowledge-base
version: 1.0.0
description: |
  Reference/routing skill for Contexia's Knowledge Base agent — Base de conocimiento persistente: decisiones históricas + soluciones + políticas.
  This does NOT invoke the agent directly (that goes through the separate
  contexia-agents MCP server). It exists so GBrain's resolver can answer
  "where does Knowledge Base live?" with an accurate, canonical reference.
triggers:
  - "knowledge base"
  - "dónde está knowledge base"
  - "where is knowledge base"
tools: []
mutating: false
generated_from: AGENTES.md
canonical_source: antigravity-app/AGENTES.md (agent 7)
---

# Knowledge Base

**RAG + pgvector**

## Reference

- **Endpoint**: `GET /api/v1/kb` + RPC `match_knowledge_chunks()`
- **Tipo**: Retrieval-Augmented Generation (RAG)
- **Función canónica**: Base de conocimiento persistente: decisiones históricas + soluciones + políticas
- **HITL required**: Yes (⚠️ PARCIAL — Usa decisiones aprobadas; para nuevas excepciones, requiere HITL)
- **Invocation**: via the `contexia-agents` MCP server (separate from GBrain's own MCP server —
  actions vs. knowledge, per design decision 5 of `adopt-gbrain-second-brain`)

## Contract

This is a **reference-only** skill. It does not call `GET /api/v1/kb` + RPC `match_knowledge_chunks()` itself. It supplements
GBrain's resolver so a query like "where does Knowledge Base live?" or "does Knowledge Base need
human approval?" resolves correctly, without duplicating or overriding `AGENTES.md`, which
remains the canonical source (regenerate this file if `AGENTES.md` changes — see
`scripts/generate_gbrain_skills.py` in `antigravity-app`).
