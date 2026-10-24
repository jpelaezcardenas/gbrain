---
name: contexia-agent-radar-predictivo
version: 1.0.0
description: |
  Reference/routing skill for Contexia's RADAR PREDICTIVO agent — Análisis predictivo: anticipa riesgos fiscales, de negocio, cashflow stress.
  This does NOT invoke the agent directly (that goes through the separate
  contexia-agents MCP server). It exists so GBrain's resolver can answer
  "where does RADAR PREDICTIVO live?" with an accurate, canonical reference.
triggers:
  - "radar predictivo"
  - "dónde está radar predictivo"
  - "where is radar predictivo"
tools: []
mutating: false
generated_from: AGENTES.md
canonical_source: antigravity-app/AGENTES.md (agent 3)
---

# RADAR PREDICTIVO

**Pattern Recognition + Forecasting**

## Reference

- **Endpoint**: `GET /api/v1/radar`
- **Tipo**: Predictive Risk Analysis + Pattern Recognition
- **Función canónica**: Análisis predictivo: anticipa riesgos fiscales, de negocio, cashflow stress
- **HITL required**: Yes (⚠️ PARCIAL — Hermes muestra alertas; si riesgo crítico, Entidad A decide acción)
- **Invocation**: via the `contexia-agents` MCP server (separate from GBrain's own MCP server —
  actions vs. knowledge, per design decision 5 of `adopt-gbrain-second-brain`)

## Contract

This is a **reference-only** skill. It does not call `GET /api/v1/radar` itself. It supplements
GBrain's resolver so a query like "where does RADAR PREDICTIVO live?" or "does RADAR PREDICTIVO need
human approval?" resolves correctly, without duplicating or overriding `AGENTES.md`, which
remains the canonical source (regenerate this file if `AGENTES.md` changes — see
`scripts/generate_gbrain_skills.py` in `antigravity-app`).
