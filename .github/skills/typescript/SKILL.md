# TypeScript Patterns for FAST

Use this guide when working on TypeScript changes in the FAST monorepo — authoring Web Components with `@microsoft/fast-element`, writing templates and styles, working with the observable/reactive system, DI container, routing, or declarative HTML packages.

# Required context first

Before suggesting or applying changes, read and use:

1. The root `tsconfig.json` (base compiler options for the monorepo).
2. The target package's `tsconfig.json` under `packages/<package>/` (per-package overrides).

Treat these constraints as mandatory unless the user explicitly asks to change them:

- All packages use `"type": "module"` (ESM only).
- Source imports must use `.js` extensions (e.g., `import { html } from "./template.js"`), even when referencing `.ts` files.
- Legacy/stage-1 decorators are enabled (`experimentalDecorators: true`).
- `strictNullChecks` and `noImplicitAny` are enabled at the root level.
- `verbatimModuleSyntax` is enabled in packages — use `import type { ... }` for type-only imports.
- Named exports only; no default exports.
- Interfaces must NOT use the `I` prefix (enforced by ESLint naming convention).
- Maximum line length is 140 characters (ESLint `max-len` rule).
- Import order is enforced (`import/order` + `sort-imports`).

# Testing conventions

| Pattern | Runner | Use case |
|---|---|---|
| `*.pw.spec.ts` | Playwright | Integration/E2E tests (requires `npm run test-server`) |

- Co-locate test files next to source files.
- Playwright tests run against a Vite dev server (port 5173).

# Module and export conventions

- All packages use the `exports` map in `package.json` for sub-entry-points (e.g., `@microsoft/fast-element/state.js`).
- Export types separately: `export type { MyInterface } from "./types.js"`.
- Internal modules should NOT be exported from the package index.
