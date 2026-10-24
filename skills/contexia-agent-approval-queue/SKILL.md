---
name: contexia-agent-approval-queue
version: 1.0.0
description: |
  Reference/routing skill for Contexia's Approval Queue agent — Gate HITL obligatorio: nada outbound se ejecuta sin aprobación explícita.
  This does NOT invoke the agent directly (that goes through the separate
  contexia-agents MCP server). It exists so GBrain's resolver can answer
  "where does Approval Queue live?" with an accurate, canonical reference.
triggers:
  - "approval queue"
  - "dónde está approval queue"
  - "where is approval queue"
tools: []
mutating: false
generated_from: AGENTES.md
canonical_source: antigravity-app/AGENTES.md (agent 9)
---

# Approval Queue

**Central Gate**

## Reference

- **Endpoint**: `GET /api/v1/approval-queue` + `POST /approvals/{id}/approve\|reject`
- **Tipo**: Task Management + Human-in-the-Loop Gate
- **Función canónica**: Gate HITL obligatorio: nada outbound se ejecuta sin aprobación explícita
- **HITL required**: Yes (✅ SÍ — Obligatorio)
- **Invocation**: via the `contexia-agents` MCP server (separate from GBrain's own MCP server —
  actions vs. knowledge, per design decision 5 of `adopt-gbrain-second-brain`)

## Contract

This is a **reference-only** skill. It does not call `GET /api/v1/approval-queue` + `POST /approvals/{id}/approve\|reject` itself. It supplements
GBrain's resolver so a query like "where does Approval Queue live?" or "does Approval Queue need
human approval?" resolves correctly, without duplicating or overriding `AGENTES.md`, which
remains the canonical source (regenerate this file if `AGENTES.md` changes — see
`scripts/generate_gbrain_skills.py` in `antigravity-app`).
