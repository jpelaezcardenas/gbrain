---
name: contexia-agent-content-idea-generator
version: 1.0.0
description: |
  Reference/routing skill for Contexia's Content Idea Generator agent — Content Brainstormer (LLM-guided) + Draft Generator.
  This does NOT invoke the agent directly (that goes through the separate
  contexia-agents MCP server). It exists so GBrain's resolver can answer
  "where does Content Idea Generator live?" with an accurate, canonical reference.
triggers:
  - "content idea generator"
  - "dónde está content idea generator"
  - "where is content idea generator"
tools: []
mutating: false
generated_from: AGENTES.md
canonical_source: antigravity-app/AGENTES.md (agent 6a)
---

# Content Idea Generator

**Ideas → Drafts**

## Reference

- **Endpoint**: `GET /api/v1/social-ops/ideas` + `POST /ideas/{id}/generate-draft`
- **Tipo**: Content Brainstormer (LLM-guided) + Draft Generator
- **Función canónica**: N/A
- **HITL required**: Yes (✅ SÍ — Entidad A aprueba publicación)
- **Invocation**: via the `contexia-agents` MCP server (separate from GBrain's own MCP server —
  actions vs. knowledge, per design decision 5 of `adopt-gbrain-second-brain`)

## Contract

This is a **reference-only** skill. It does not call `GET /api/v1/social-ops/ideas` + `POST /ideas/{id}/generate-draft` itself. It supplements
GBrain's resolver so a query like "where does Content Idea Generator live?" or "does Content Idea Generator need
human approval?" resolves correctly, without duplicating or overriding `AGENTES.md`, which
remains the canonical source (regenerate this file if `AGENTES.md` changes — see
`scripts/generate_gbrain_skills.py` in `antigravity-app`).
