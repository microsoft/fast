# FAST Examples — End-to-End Tests

Playwright end-to-end tests that exercise the three Todo example apps in this monorepo as black-box web applications. The same test suite runs against each app, asserting that the unified UI and functionality behave identically regardless of implementation.

| App | Project name | Dev server |
|---|---|---|
| [`examples/csr/todo-app`](../csr/todo-app) | `csr-todo` | `vite` on port `9000` |
| [`examples/csr/todo-mobx-app`](../csr/todo-mobx-app) | `csr-todo-mobx` | `vite` on port `9001` |
| [`examples/ssr/webui-todo-app`](../ssr/webui-todo-app) | `ssr-webui-todo` | `webui serve` on port `8081` |

Each project is configured in [`playwright.config.ts`](./playwright.config.ts) with its own `webServer` block — Playwright starts and stops them automatically.

## Running

From the monorepo root:

```bash
# install deps and browsers (once)
npm ci
npx playwright install --with-deps chromium

# build the example apps the tests depend on
npm run build -w @microsoft/fast-element
npm run build -w @microsoft/fast-todo-app-example
npm run build -w @microsoft/fast-todo-mobx-app-example
npm run build -w @microsoft/fast-webui-todo-app-example

# run all three suites
npm run test:e2e
```

To run a single app's suite:

```bash
npm run test:e2e -w @microsoft/fast-examples-e2e -- --project=csr-todo
npm run test:e2e -w @microsoft/fast-examples-e2e -- --project=csr-todo-mobx
npm run test:e2e -w @microsoft/fast-examples-e2e -- --project=ssr-webui-todo
```

## Layout

```
examples/test/
├── package.json
├── playwright.config.ts
├── DESIGN.md                    // design notes for contributors
├── support/
│   ├── fixtures.ts              // injects the per-project adapter
│   ├── global-setup.ts
│   ├── global-teardown.ts
│   └── adapters/
│       ├── index.ts             // resolves the adapter for a project
│       ├── types.ts             // TodoAppAdapter interface
│       ├── csr.ts               // shared adapter for both CSR apps
│       └── ssr-webui-todo.ts
└── tests/
    └── todo.pw.spec.ts          // shared suite, runs against every project
```

Adapters wrap the per-app DOM differences (e.g. SSR app uses a nested `<todo-item>` shadow root per row, while CSR apps render inline `<li>` content) behind a uniform interface (`addTodo`, `descriptions`, `toggleByDescription`, `deleteByDescription`, `setFilter`, `getCounts`, …). Test specs use that interface only — no app-specific selectors leak into the suite.

Spec files use the `*.pw.spec.ts` suffix so Playwright picks them up while leaving the `*.spec.ts` suffix free for future Node-based tests.

## CI

The `test:e2e` script is run as a separate step in [`.github/workflows/ci-validate-pr.yml`](../../.github/workflows/ci-validate-pr.yml) after unit tests, gated on the same `npx playwright install --with-deps` invocation that already runs there.

## Opt-in initialization ordering reproduction

[`issues/initialization-outside-pre-bind/`](./issues/initialization-outside-pre-bind/)
is a standalone, intentionally failing consumer-author ordering example, **not a
confirmed FAST-core bug**. It does not change the Todo suite or default discovery.
From the monorepo root, with dependencies and all three Playwright browsers installed:

```bash
npm run build:tsc -w @microsoft/fast-element
npx tsc -p examples/test/issues/initialization-outside-pre-bind/tsconfig.json
npm exec -w @microsoft/fast-examples-e2e -- playwright test --config=issues/initialization-outside-pre-bind/playwright.config.ts
```

Expected result: **6 failures and 3 passes** across Chromium, Firefox, and WebKit.
Each browser fails both unsafe variants with expected `Derived: SUPPLIED`, received
`Derived: DEFAULT`; the constructor-registered pre-bind `HostBehavior` control passes.
The standalone Vite server uses port **5193** and is owned/stopped by Playwright.

The page's button creates unknown connected hosts with public `input = "SUPPLIED"`
before registration. Deriving before `super.connectedCallback()` uses constructor
defaults before FAST replays the input, leaving the derived display wrong. Deriving
after it uses the restored input but is too late for the first binding; the live DOM
subsequently corrects through FAST's update queue. The control derives after replay
and before binding, using the existing `HostBehavior` phase.

Immutable browser-visible witnesses copy actual shadow DOM synchronously when the
parent view has finished binding, before late derivation. Tests assert those first
outputs, not eventual corrected DOM as a substitute. This is not a paint metric or
a guarantee about streamed/projected-content readiness.
