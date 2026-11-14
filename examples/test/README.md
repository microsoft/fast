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

## Opt-in pending-template issue reproduction

```bash
npm run build:tsc -w @microsoft/fast-element
npm exec -w @microsoft/fast-examples-e2e -- playwright test --config=issues/host-behaviors-lost-on-template-resolution/playwright.config.ts
```

The fixture registers two components with constructor-added host behaviors. One
definition has its template before registration; the other receives its template
after connection through the public `FASTElementDefinition.template` property.
This undefined-to-defined transition is also covered by the framework's existing
controller tests.

Resolving the pending template replaces the controller without retaining the
constructor's host behaviors. The control's disconnect/reconnect callbacks run,
but the pending component's cleanup callback is missing and its reconnect callback
never runs again. The counters on the page record actual behavior callbacks.

The cleanup and reconnect assertions intentionally fail in Chromium, Firefox, and
WebKit. This is a reproduction, not a library fix or a deferred-hydration API.
The standalone configuration uses port 5199 and is excluded from the default
Todo E2E suite.

## CI

The `test:e2e` script is run as a separate step in [`.github/workflows/ci-validate-pr.yml`](../../.github/workflows/ci-validate-pr.yml) after unit tests, gated on the same `npx playwright install --with-deps` invocation that already runs there.
