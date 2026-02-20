# TypeScript Patterns for FAST

Use this guide when working on TypeScript changes in the FAST monorepo — authoring Web Components with `@microsoft/fast-element`, writing templates and styles, working with the observable/reactive system, DI container, SSR, routing, or declarative HTML packages.

# Required context first

Before suggesting or applying changes, read and use:

1. The root `tsconfig.json` (base compiler options for the monorepo).
2. The target package's `tsconfig.json` under `packages/<package>/` (per-package overrides).
3. The target package's `package.json` for scripts, exports map, and entry points.
4. The root `.eslintrc.js` (linting rules and naming conventions).
5. The root `.prettierrc` (formatting: 90 print width, 4 spaces, double quotes, trailing commas `es5`).

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

# TypeScript patterns in this repo

## Web Component authoring (fast-element)

```typescript
import { FASTElement, customElement, html, css, attr, observable } from "@microsoft/fast-element";

@customElement({
    name: "my-component",
    template: html<MyComponent>`<div>${x => x.message}</div>`,
    styles: css`
        :host {
            display: block;
        }
    `,
})
class MyComponent extends FASTElement {
    @attr message: string = "";
    @observable count: number = 0;

    countChanged(oldValue: number, newValue: number): void {
        // Reactive callback — called automatically when count changes
    }
}
```

## Key conventions

- **Templates**: Use `html` tagged template literal with arrow-function bindings (`x => x.prop`).
- **Styles**: Use `css` tagged template literal with `:host` for component root.
- **Attributes**: Use `@attr` for reflected HTML attributes (string by default; use `mode` for boolean).
- **Observables**: Use `@observable` for reactive properties; implement `propertyChanged()` callbacks.
- **DI**: Use the built-in DI container (`DI.createContainer()`, `@inject()` pattern) from `./di.js`.
- **State**: Use the built-in reactive state module from `./state.js`.
- **API visibility**: Use JSDoc tags `@public`, `@internal`, `@alpha`, `@beta` — enforced by api-extractor.

# Repository-specific commands

Prefer these commands for this repository. Always run from the monorepo root.

## Building

- `npm ci` — clean install all dependencies
- `npm run build` — build all workspaces
- `npm run build -w @microsoft/fast-element` — build a single package
- `npm run build -w @microsoft/fast-ssr` — build SSR package
- `npm run build -w @microsoft/fast-html` — build HTML package

## Testing

- `npm run test` — run all tests across all packages
- `npm run test -w @microsoft/fast-element` — test a single package (ESLint + Karma + API Extractor + Playwright)
- `npm run test -w @microsoft/fast-ssr` — test SSR package
- `npm run test -w @microsoft/fast-html` — test HTML package (includes ast-grep rule tests)

## Formatting & Linting

- `npm run format:check` — check Prettier formatting (CI gate)
- `npm run format` — auto-fix Prettier formatting
- `npx eslint packages/<package>/src/**/*.ts` — lint a specific package

## Change management

- `npm run change` — generate a beachball change file (required for `packages/*` changes)
- `npm run checkchange` — verify change files exist (CI gate)

If command cost is high, run the narrowest command that validates the touched package first, then broaden as needed.

# Testing conventions

| Pattern | Runner | Use case |
|---|---|---|
| `*.spec.ts` | Karma + Mocha + Chai | Browser-based unit tests |
| `*.pw.spec.ts` | Playwright | Integration/E2E tests (requires `npm run test-server`) |

- Co-locate test files next to source files.
- Karma tests run in headless Chrome/Firefox via Webpack.
- Playwright tests run against a Vite dev server (port 5173).
- Use `chai` assertions (`expect`, `assert`) in unit tests.
- Use `chai-spies` for function spying.

# Module and export conventions

- All packages use the `exports` map in `package.json` for sub-entry-points (e.g., `@microsoft/fast-element/state.js`).
- Export types separately: `export type { MyInterface } from "./types.js"`.
- Internal modules should NOT be exported from the package index.
