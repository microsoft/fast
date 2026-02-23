# Instructions for FAST

## General

- **Explicit instruction only**: Do not take any action unless explicitly instructed. Wait for clear direction before making changes, running commands, or modifying files.

## Repository Overview

FAST (`@microsoft/fast`) is a Microsoft open-source monorepo for building W3C-standards-compliant Web Components. The core package is `@microsoft/fast-element` — a lightweight, performant Web Component authoring library. Additional packages provide routing and declarative HTML support.

## Packages

| Package | Status | Purpose |
|---|---|---|
| `@microsoft/fast-element` | Stable (v2) | Core Web Component library |
| `@microsoft/fast-html` | Alpha | Declarative HTML parser |
| `@microsoft/fast-router` | Alpha | Web Component router |

## Key Rules

- **Build from root**: Always run commands from the monorepo root using workspace flags (e.g., `npm run build -w @microsoft/fast-element`).
- **Change files**: Any `packages/*` change requires a beachball change file — run `npm run change`.
- **TypeScript**: See [`.github/skills/typescript/SKILL.md`](.github/skills/typescript/SKILL.md) for TypeScript constraints, patterns, commands, and testing conventions.
- **Contributing**: See [`.github/skills/contributing/SKILL.md`](.github/skills/contributing/SKILL.md) for pull request guidelines, change file generation, and documentation updates.

## Acceptance Checklist

Before finishing any change, run these commands from the monorepo root and confirm they pass:

- [ ] `npm run build` — all packages build successfully
- [ ] `npm run test` — all tests pass
- [ ] `npm run format:check` — Prettier formatting is correct
- [ ] `npm run checkchange` — beachball change files exist for any `packages/*` changes
