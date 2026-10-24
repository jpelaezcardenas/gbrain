---
name: contexia-agent-sales-closure-drafter
version: 1.0.0
description: |
  Reference/routing skill for Contexia's Sales Closure Drafter agent — Sales Strategy + Offer Generator.
  This does NOT invoke the agent directly (that goes through the separate
  contexia-agents MCP server). It exists so GBrain's resolver can answer
  "where does Sales Closure Drafter live?" with an accurate, canonical reference.
triggers:
  - "sales closure drafter"
  - "dónde está sales closure drafter"
  - "where is sales closure drafter"
tools: []
mutating: false
generated_from: AGENTES.md
canonical_source: antigravity-app/AGENTES.md (agent 6c)
---

# Sales Closure Drafter

**Pipeline**

## Reference

- **Endpoint**: `POST /api/v1/social-ops/leads/sales-draft`
- **Tipo**: Sales Strategy + Offer Generator
- **Función canónica**: N/A
- **HITL required**: Yes (✅ SÍ — Sales manager aprueba)
- **Invocation**: via the `contexia-agents` MCP server (separate from GBrain's own MCP server —
  actions vs. knowledge, per design decision 5 of `adopt-gbrain-second-brain`)

## Contract

This is a **reference-only** skill. It does not call `POST /api/v1/social-ops/leads/sales-draft` itself. It supplements
GBrain's resolver so a query like "where does Sales Closure Drafter live?" or "does Sales Closure Drafter need
human approval?" resolves correctly, without duplicating or overriding `AGENTES.md`, which
remains the canonical source (regenerate this file if `AGENTES.md` changes — see
`scripts/generate_gbrain_skills.py` in `antigravity-app`).
