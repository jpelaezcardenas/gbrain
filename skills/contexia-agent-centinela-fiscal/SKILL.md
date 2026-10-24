---
name: contexia-agent-centinela-fiscal
version: 1.0.0
description: |
  Reference/routing skill for Contexia's CENTINELA FISCAL agent — Monitorea DIAN, vencimientos, discrepancias contables en tiempo real.
  This does NOT invoke the agent directly (that goes through the separate
  contexia-agents MCP server). It exists so GBrain's resolver can answer
  "where does CENTINELA FISCAL live?" with an accurate, canonical reference.
triggers:
  - "centinela fiscal"
  - "dónde está centinela fiscal"
  - "where is centinela fiscal"
tools: []
mutating: false
generated_from: AGENTES.md
canonical_source: antigravity-app/AGENTES.md (agent 1)
---

# CENTINELA FISCAL

**Transaction Patrol + Resolution Agents**

## Reference

- **Endpoint**: `GET/POST /api/v1/centinela`
- **Tipo**: Transaction Patrol (auditoría continua) + Resolution (generador de drafts)
- **Función canónica**: Monitorea DIAN, vencimientos, discrepancias contables en tiempo real
- **HITL required**: Yes (✅ SÍ — Entidad A aprueba/rechaza ajustes contables)
- **Invocation**: via the `contexia-agents` MCP server (separate from GBrain's own MCP server —
  actions vs. knowledge, per design decision 5 of `adopt-gbrain-second-brain`)

## Contract

This is a **reference-only** skill. It does not call `GET/POST /api/v1/centinela` itself. It supplements
GBrain's resolver so a query like "where does CENTINELA FISCAL live?" or "does CENTINELA FISCAL need
human approval?" resolves correctly, without duplicating or overriding `AGENTES.md`, which
remains the canonical source (regenerate this file if `AGENTES.md` changes — see
`scripts/generate_gbrain_skills.py` in `antigravity-app`).
