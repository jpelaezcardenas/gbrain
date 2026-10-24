---
name: contexia-agent-maestro-orchestrator
version: 1.0.0
description: |
  Reference/routing skill for Contexia's Maestro Orchestrator agent — Delega a 5+ subagentes en paralelo, sintetiza resultados.
  This does NOT invoke the agent directly (that goes through the separate
  contexia-agents MCP server). It exists so GBrain's resolver can answer
  "where does Maestro Orchestrator live?" with an accurate, canonical reference.
triggers:
  - "maestro orchestrator"
  - "dónde está maestro orchestrator"
  - "where is maestro orchestrator"
tools: []
mutating: false
generated_from: AGENTES.md
canonical_source: antigravity-app/AGENTES.md (agent 8)
---

# Maestro Orchestrator

**Swarm Coordinator**

## Reference

- **Endpoint**: `POST /hermes/swarm/invoke` o `hermes orchestrator-maestro <action>`
- **Tipo**: Meta-agent (coordina otros 8 agentes)
- **Función canónica**: Delega a 5+ subagentes en paralelo, sintetiza resultados
- **HITL required**: No (❌ NO — Solo orquestación (HITL ocurre en Approval Queue))
- **Invocation**: via the `contexia-agents` MCP server (separate from GBrain's own MCP server —
  actions vs. knowledge, per design decision 5 of `adopt-gbrain-second-brain`)

## Contract

This is a **reference-only** skill. It does not call `POST /hermes/swarm/invoke` o `hermes orchestrator-maestro <action>` itself. It supplements
GBrain's resolver so a query like "where does Maestro Orchestrator live?" or "does Maestro Orchestrator need
human approval?" resolves correctly, without duplicating or overriding `AGENTES.md`, which
remains the canonical source (regenerate this file if `AGENTES.md` changes — see
`scripts/generate_gbrain_skills.py` in `antigravity-app`).
