---
name: contexia-agent-lead-reply-drafter
version: 1.0.0
description: |
  Reference/routing skill for Contexia's Lead Reply Drafter agent — Conversational Reply Generator.
  This does NOT invoke the agent directly (that goes through the separate
  contexia-agents MCP server). It exists so GBrain's resolver can answer
  "where does Lead Reply Drafter live?" with an accurate, canonical reference.
triggers:
  - "lead reply drafter"
  - "dónde está lead reply drafter"
  - "where is lead reply drafter"
tools: []
mutating: false
generated_from: AGENTES.md
canonical_source: antigravity-app/AGENTES.md (agent 6b)
---

# Lead Reply Drafter

**CRM**

## Reference

- **Endpoint**: `POST /api/v1/social-ops/leads/reply-draft`
- **Tipo**: Conversational Reply Generator
- **Función canónica**: N/A
- **HITL required**: Yes (✅ SÍ — Sales rep aprueba antes de enviar)
- **Invocation**: via the `contexia-agents` MCP server (separate from GBrain's own MCP server —
  actions vs. knowledge, per design decision 5 of `adopt-gbrain-second-brain`)

## Contract

This is a **reference-only** skill. It does not call `POST /api/v1/social-ops/leads/reply-draft` itself. It supplements
GBrain's resolver so a query like "where does Lead Reply Drafter live?" or "does Lead Reply Drafter need
human approval?" resolves correctly, without duplicating or overriding `AGENTES.md`, which
remains the canonical source (regenerate this file if `AGENTES.md` changes — see
`scripts/generate_gbrain_skills.py` in `antigravity-app`).
