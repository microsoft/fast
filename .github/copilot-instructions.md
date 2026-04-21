---
name: FAST Instructions
description: This file describes the general instructions for working with the FAST monorepo, including repository structure, code style, tooling, and contribution guidelines.
applyTo: '**/*'
---

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
| `@microsoft/fast-build` | Prerelease | Declarative HTML server side renderer |

### Other packages

| Package | Status | Purpose |
|---|---|---|
| `sites/website` | Private (not published as a package) | Documentation website source |
| `sites/benchmarks` | Private (not published as a package) | Benchmarking utilities |

### Example projects

- `examples/todo-app/` — A simple To-Do app demonstrating FAST usage patterns.

## Skills

These contain domain-specific guidance. Read when performing related tasks:

- [TypeScript](./skills/typescript/SKILL.md) — compiler constraints, import/export conventions, decorator usage, testing patterns.
- [Shipping](./skills/shipping/SKILL.md) — pull request format, change file generation, documentation updates.
- [Pull Request](./skills/fast-pull-request/SKILL.md) — generate a pull request description from the branch diff.
- [Bug Report](./skills/fast-bug-report/SKILL.md) — generate a bug report issue from conversation context.
- [Feature Request](./skills/fast-feature-request/SKILL.md) — generate a feature request issue from conversation context.
- [Testing](./skills/testing/SKILL.md) — running tests locally and in CI, writing Playwright fixture tests.

## Commands

Run all commands from the monorepo root. Use workspace flags to target a single package.

| Task | Command |
|---|---|
| Install | `npm ci` |
| Build all | `npm run build` |
| Build one package | `npm run build -w @microsoft/fast-element` |
| Test all | `npm run test` |
| Test one package | `npm run test -w @microsoft/fast-element` |
| Test Chromium only | `npm run test:chromium` |
| Build/test changed only | `lage build --since origin/main` |
| Test changed only | `lage test:node test:chromium --since origin/main` |
| Lint | `npm run lint` |
| Lint fix | `npm run lint:fix` |
| Format check | `npm run format:check` |
| Format fix | `npm run format` |
| Check (lint + format + imports) | `npm run biome:check` |
| Check fix | `npm run biome:fix` |
| CI check (read-only) | `npm run biome:ci` |
| Generate change file | `npm run change` |
| Check change files | `npm run checkchange` |
| API docs | `npm run doc -w @microsoft/fast-element` |

Build and test commands use [Lage](https://microsoft.github.io/lage/) for dependency-aware task execution. Lage respects the package dependency graph and can run incrementally with `--since <ref>` to only build/test changed packages and their dependents. The CI pipelines use `--since` for pull requests to skip unchanged packages.

All `lint`, `biome:check`, `biome:fix`, and `biome:ci` commands use `biome-changed`, which runs biome only on files with uncommitted git changes. The `format:check` and `format` commands use biome's own `--changed` flag to compare against the default branch.

## Project Structure

```
packages/<package>/
  src/                    # Source code
    index.ts              # Main barrel (re-exports)
    <feature>/            # Feature directories
      <feature>.ts        # Implementation
      <feature>.pw.spec.ts # Co-located Playwright test
  test/                   # Test harness (Vite dev server, fixtures)
  dist/                   # Build output (ESM + declarations)
  docs/                   # API reports (api-extractor)
  DESIGN.md               # Code documentation for the package or crate
  README.md               # README for published package use
```

- Source files use **kebab-case**: `element-controller.ts`, `update-queue.ts`.
- Test files use `*.pw.spec.ts` suffix, co-located next to the source they test.

## Code Style

### Formatting & Linting (Biome)

- 90-character print width, 4-space indent, double quotes, trailing commas.
- Single-arg arrow functions omit parens: `x => x + 1`.
- Import ordering enforced via `organizeImports`.
- No `I` prefix on interfaces.
- `any` is permitted (`noExplicitAny: off`).
- Config: [`biome.jsonc`](../biome.jsonc).

### Naming Conventions

| Element | Convention | Examples |
|---|---|---|
| Classes | PascalCase | `ElementController`, `FASTElementDefinition` |
| Interfaces/Types | PascalCase, no `I` prefix | `Accessor`, `Disposable`, `Expression` |
| Methods/functions | camelCase | `getValue()`, `handleChange()` |
| Constants | PascalCase frozen objects or camelCase | `SourceLifetime`, `emptyArray` |
| Private fields | `_` prefix | `_template`, `_shadowRootOptions` |
| Files | kebab-case | `element-controller.ts`, `observer-map.ts` |
| Change callbacks | `${prop}Changed` | `childChanged()`, `templateChanged()` |

### TypeScript

Key constraints (details in [TypeScript skill](./skills/typescript/SKILL.md)):

- ESM only (`"type": "module"`) — imports use `.js` extensions.
- `import type { ... }` required for type-only imports (`verbatimModuleSyntax`).
- Named exports only — no default exports.
- Legacy decorators enabled (`experimentalDecorators: true`).
- `strictNullChecks` and `noImplicitAny` enabled.

## Tooling

| Tool | Purpose |
|---|---|
| npm workspaces | Package management |
| Lage | Task runner — dependency-aware builds and incremental testing |
| TypeScript | Compilation |
| Rollup | Bundling (`fast-element` only) |
| Playwright | Testing |
| Vite | Test dev server |
| api-extractor | API documentation + `.d.ts` rollup |
| beachball | Change files, versioning, publishing |
| Biome | Formatting + Linting |
| lefthook | Pre-commit hooks (runs `biome:check` and `checkchange` on staged files) |
| Rust | Rendering Declarative templates (`fast-build` package and `microsoft-fast-build` crate only) |

## Acceptance Checklist

Before finishing any change, run these commands from the monorepo root and confirm they pass:

- [ ] `npm run build` — all packages build successfully
- [ ] `npm run test` — all tests pass
- [ ] `npm run biome:check` — Biome linting and formatting pass
- [ ] `npm run checkchange` — beachball change files exist for any `packages/*` changes
