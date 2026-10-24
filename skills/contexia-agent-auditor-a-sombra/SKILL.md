---
name: contexia-agent-auditor-a-sombra
version: 1.0.0
description: |
  Reference/routing skill for Contexia's AUDITORÍA SOMBRA agent — Revisión técnica automatizada: emite reportes PDF de hallazgos contables/fiscales.
  This does NOT invoke the agent directly (that goes through the separate
  contexia-agents MCP server). It exists so GBrain's resolver can answer
  "where does AUDITORÍA SOMBRA live?" with an accurate, canonical reference.
triggers:
  - "auditoría sombra"
  - "dónde está auditoría sombra"
  - "where is auditoría sombra"
tools: []
mutating: false
generated_from: AGENTES.md
canonical_source: antigravity-app/AGENTES.md (agent 4)
---

# AUDITORÍA SOMBRA

**Continuous Audit Agent**

## Reference

- **Endpoint**: `POST /api/v1/wizard/auditoria-sombra`
- **Tipo**: Continuous Audit (no reemplaza revisoría fiscal legal)
- **Función canónica**: Revisión técnica automatizada: emite reportes PDF de hallazgos contables/fiscales
- **HITL required**: Yes (✅ SÍ — Entidad A revisa, valida, firma como revisor fiscal (o declara que no firma))
- **Invocation**: via the `contexia-agents` MCP server (separate from GBrain's own MCP server —
  actions vs. knowledge, per design decision 5 of `adopt-gbrain-second-brain`)

## Contract

This is a **reference-only** skill. It does not call `POST /api/v1/wizard/auditoria-sombra` itself. It supplements
GBrain's resolver so a query like "where does AUDITORÍA SOMBRA live?" or "does AUDITORÍA SOMBRA need
human approval?" resolves correctly, without duplicating or overriding `AGENTES.md`, which
remains the canonical source (regenerate this file if `AGENTES.md` changes — see
`scripts/generate_gbrain_skills.py` in `antigravity-app`).
