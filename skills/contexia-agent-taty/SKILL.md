---
name: contexia-agent-taty
version: 1.0.0
description: |
  Reference/routing skill for Contexia's TATY agent — Operador 24/7: fiscal conversacional, soporte Telegram, onboarding, comandos Social Ops.
  This does NOT invoke the agent directly (that goes through the separate
  contexia-agents MCP server). It exists so GBrain's resolver can answer
  "where does TATY live?" with an accurate, canonical reference.
triggers:
  - "taty"
  - "dónde está taty"
  - "where is taty"
tools: []
mutating: false
generated_from: AGENTES.md
canonical_source: antigravity-app/AGENTES.md (agent 5)
---

# TATY

**Conversational Operator + Telegram 24/7**

## Reference

- **Endpoint**: `POST /api/v1/agents` (role: `"taty"`) + Telegram webhook`
- **Tipo**: Conversational + Zero-UI Command Parser
- **Función canónica**: Operador 24/7: fiscal conversacional, soporte Telegram, onboarding, comandos Social Ops
- **HITL required**: Yes (✅ SÍ — Si comando sensible, Taty lo dirige a Approval Queue)
- **Invocation**: via the `contexia-agents` MCP server (separate from GBrain's own MCP server —
  actions vs. knowledge, per design decision 5 of `adopt-gbrain-second-brain`)

## Contract

This is a **reference-only** skill. It does not call `POST /api/v1/agents` (role: `"taty"`) + Telegram webhook` itself. It supplements
GBrain's resolver so a query like "where does TATY live?" or "does TATY need
human approval?" resolves correctly, without duplicating or overriding `AGENTES.md`, which
remains the canonical source (regenerate this file if `AGENTES.md` changes — see
`scripts/generate_gbrain_skills.py` in `antigravity-app`).
