# Portfolio — Persistent Cline Rules

These rules apply to every task in this portfolio project. Follow them unless the user explicitly overrides them.

## Before implementing

- Read `docs/portfolio-blueprint.md` before implementing any feature. It is the source of truth.
- Confirm the task is narrowly scoped. If a request bundles multiple unrelated features, do only the one requested and note the rest.

## While working

- Inspect the relevant files before editing them. Understand existing conventions (structure, naming, styling approach) and match them.
- Make the smallest change that satisfies the request. No unrelated refactors.
- Do not add, update, or remove dependencies without an explicit reason and a separate review. Never run `npm audit fix --force`.
- Mark missing content (copy, facts, metrics, links, images, fonts) as **TBD** in code/comments or your report. Never invent facts, metrics, achievements, or skill percentages.

## After implementing

- Stop after completing the requested task. Do not start new work or add unrequested features.
- Run the appropriate checks: at minimum `npm run lint` and `npm run build` for anything that affects application code.
- Report: the files you changed, the checks you ran and their results, and any unresolved issues or TBDs.
