---
name: contexia-agent-metrics-analyzer
version: 1.0.0
description: |
  Reference/routing skill for Contexia's Metrics Analyzer agent — Flux Analysis (para marketing, no finanzas).
  This does NOT invoke the agent directly (that goes through the separate
  contexia-agents MCP server). It exists so GBrain's resolver can answer
  "where does Metrics Analyzer live?" with an accurate, canonical reference.
triggers:
  - "metrics analyzer"
  - "dónde está metrics analyzer"
  - "where is metrics analyzer"
tools: []
mutating: false
generated_from: AGENTES.md
canonical_source: antigravity-app/AGENTES.md (agent 6d)
---

# Metrics Analyzer

**Pipeline Health**

## Reference

- **Endpoint**: `GET /api/v1/social-ops/metrics`
- **Tipo**: Flux Analysis (para marketing, no finanzas)
- **Función canónica**: N/A
- **HITL required**: No (❌ NO — Solo lectura)
- **Invocation**: via the `contexia-agents` MCP server (separate from GBrain's own MCP server —
  actions vs. knowledge, per design decision 5 of `adopt-gbrain-second-brain`)

## Contract

This is a **reference-only** skill. It does not call `GET /api/v1/social-ops/metrics` itself. It supplements
GBrain's resolver so a query like "where does Metrics Analyzer live?" or "does Metrics Analyzer need
human approval?" resolves correctly, without duplicating or overriding `AGENTES.md`, which
remains the canonical source (regenerate this file if `AGENTES.md` changes — see
`scripts/generate_gbrain_skills.py` in `antigravity-app`).
