---
name: contexia-agent-pulso-diario
version: 1.0.0
description: |
  Reference/routing skill for Contexia's PULSO DIARIO agent — Estado operativo/fiscal diario: resumen automatizado de alertas, vencimientos, caja, señales.
  This does NOT invoke the agent directly (that goes through the separate
  contexia-agents MCP server). It exists so GBrain's resolver can answer
  "where does PULSO DIARIO live?" with an accurate, canonical reference.
triggers:
  - "pulso diario"
  - "dónde está pulso diario"
  - "where is pulso diario"
tools: []
mutating: false
generated_from: AGENTES.md
canonical_source: antigravity-app/AGENTES.md (agent 2)
---

# PULSO DIARIO

**Flux Analysis Agent**

## Reference

- **Endpoint**: `GET /api/v1/pulso`
- **Tipo**: Flux Analysis Agent — Genera narrativas explicativas de variaciones
- **Función canónica**: Estado operativo/fiscal diario: resumen automatizado de alertas, vencimientos, caja, señales
- **HITL required**: No (❌ NO — Solo lectura; Entidad A revisa, no aprueba)
- **Invocation**: via the `contexia-agents` MCP server (separate from GBrain's own MCP server —
  actions vs. knowledge, per design decision 5 of `adopt-gbrain-second-brain`)

## Contract

This is a **reference-only** skill. It does not call `GET /api/v1/pulso` itself. It supplements
GBrain's resolver so a query like "where does PULSO DIARIO live?" or "does PULSO DIARIO need
human approval?" resolves correctly, without duplicating or overriding `AGENTES.md`, which
remains the canonical source (regenerate this file if `AGENTES.md` changes — see
`scripts/generate_gbrain_skills.py` in `antigravity-app`).
