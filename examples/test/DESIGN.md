# `@microsoft/fast-examples-e2e` — design

End-to-end Playwright tests that exercise the example todo apps in
[`examples/`](..) as black-box web applications. The same spec file runs
against every app, asserting that the unified UI and functionality behave
identically regardless of implementation (vanilla FAST, FAST + MobX, or SSR
via `@microsoft/webui` + `@microsoft/fast-element/declarative.js`).

If you only need a quickstart, see [`README.md`](./README.md).

## Goals

- Provide one shared spec that runs against every example todo app so any
  user-visible regression — in either the UI or in supporting libraries
  (`@microsoft/fast-element`, `@microsoft/webui`) — is
  caught in CI.
- Treat each app as a black box: tests never import app source, never poke
  internal state, and never reach into framework internals.
- Hide DOM differences between apps behind a small per-project **adapter**
  layer so spec files remain identical across projects.
- Run in CI as a separate step from package unit tests so the failure
  signal is clean (a red E2E run almost always points at the example apps or
  shared user-facing surface, not at unit-test churn).

## Non-goals

- This workspace does not ship a published npm package — it is `private: true`
  and only consumed by `npm run test:e2e` from the repo root.
- This workspace is not a place to put package-level unit tests. Those belong
  next to the source in `packages/*/src/**/*.pw.spec.ts` (Playwright) or
  `packages/*/src/**/*.spec.ts` (Node). Tests here are integration / E2E
  scenarios against the example apps.
- Adapters do not abstract over framework concepts. They only abstract over
  DOM shape (selectors, shadow-root nesting) for the operations the suite
  needs.

## Architecture

```text
examples/test/
├── playwright.config.ts          // 1 testDir, 3 projects, 3 webServer entries
├── support/
│   ├── fixtures.ts               // injects per-project adapter into tests
│   ├── global-setup.ts           // resets SSR app's state.json before the run
│   ├── global-teardown.ts        // restores SSR app's state.json after the run
│   └── adapters/
│       ├── types.ts              // TodoAppAdapter interface
│       ├── csr.ts                // shared adapter for csr/todo-app + csr/todo-mobx-app
│       ├── ssr-webui-todo.ts     // adapter for ssr/webui-todo-app
│       └── index.ts              // getAdapter(projectName) factory
└── tests/
    └── todo.pw.spec.ts           // shared suite
```

### Projects

`playwright.config.ts` defines one Playwright `project` per app:

| Project          | Base URL                | App                                       |
|------------------|-------------------------|-------------------------------------------|
| `csr-todo`       | `http://localhost:9000` | `examples/csr/todo-app`                   |
| `csr-todo-mobx`  | `http://localhost:9001` | `examples/csr/todo-mobx-app`              |
| `ssr-webui-todo` | `http://localhost:8081` | `examples/ssr/webui-todo-app`             |

Each project gets a matching `webServer` entry so Playwright starts and
stops the dev server automatically. Workers are forced to `1` so the SSR
app's shared `state.json` is never contended.

The SSR `webui-todo-app` is started with `npm run start:e2e` (not `npm
start`) which omits `webui serve`'s `--watch` flag. With `--watch` enabled
the dev server opens a livereload SSE channel and reloads the page every
time the app mutates its in-memory state — fine for local dev, fatal for
deterministic E2E.

### Adapters

`TodoAppAdapter` (`support/adapters/types.ts`) is the contract every adapter
implements. It exposes only what the suite uses — `goto`, `waitForReady`,
`addTodo`, `descriptions`, `isDoneByDescription`, `toggleByDescription`,
`deleteByDescription`, `setFilter`, `isAddDisabled`, `getCounts`. Spec files
take the adapter via the `adapter` fixture and never reference app-specific
selectors.

Both CSR apps share `createCsrAdapter()` because their unified UI exposes
the same selectors. The SSR app gets its own adapter because items are
rendered through a nested `<todo-item>` shadow root.

When adding an operation to the suite:

1. Add it to `TodoAppAdapter` in `types.ts`.
2. Implement it in every adapter — keep selectors minimal and scope queries
   to the relevant app root.
3. Use the operation from the spec; never reach around it.

### Spec naming

Spec files use the `*.pw.spec.ts` suffix so Playwright's `testMatch` picks
them up. This leaves the `*.spec.ts` suffix free for Node-based tests should
we ever add them — the same convention `fast-element` already uses.

### CI

`npm run test:e2e` runs as a separate step in
[`ci-validate-pr.yml`](../../.github/workflows/ci-validate-pr.yml) after the
unit-test step, gated on `npx playwright install --with-deps` which is
already invoked earlier in the pipeline. CI sets `CI=1`, which enables
Playwright's `forbidOnly`, single retry, and GitHub reporter.

## Adding a new app to the suite

1. Add a `webServer` entry and matching `project` in `playwright.config.ts`
   using a unique port and baseURL.
2. Create an adapter in `support/adapters/<name>.ts` implementing
   `TodoAppAdapter`. Reuse `createCsrAdapter()` if the app's DOM matches
   the CSR projects.
3. Register it in `support/adapters/index.ts`.
4. Run `npm run test:e2e -w @microsoft/fast-examples-e2e -- --project=<name>`.

No changes to `tests/todo.pw.spec.ts` should be required for a new app — if
something does require a spec change, prefer extending the adapter
interface so the suite stays uniform.

## Adding a new test

Put generic, cross-app scenarios in `tests/todo.pw.spec.ts`. Use the
`adapter` fixture for every interaction. If a test needs an operation not on
`TodoAppAdapter`, add it to the interface and implement it in every adapter
(see [Adapters](#adapters)). A spec that uses raw selectors against the page
should be treated as a bug — push the selector into the adapter instead.

For app-specific tests that don't generalize, add a co-located
`*.pw.spec.ts` next to the source in the app's package, not here.
