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

## Opt-in intentionally red reproduction

[`issues/stale-async-connection-work/`](./issues/stale-async-connection-work/)
demonstrates consumer misuse of `$fastController.isConnected` as an async
lifetime guard. It is not a newly guaranteed FAST-core bug and is excluded from
the default Todo suite. A single FASTElement is reused across detach/reattach;
manually resolving request 2 before request 1 lets the old result overwrite the
current one even though the controller is connected.

From the monorepo root, after installing dependencies:

```bash
npx playwright install chromium firefox webkit
npm run build:tsc -w @microsoft/fast-element
npx tsc -p examples/test/issues/stale-async-connection-work/tsconfig.json
npm exec -w @microsoft/fast-examples-e2e -- playwright test --config=issues/stale-async-connection-work/playwright.config.ts
```

Expected outcome: **3 failing stale-overwrite assertions and 6 passing controls**
(one red test and two controls per browser), with exit code 1. Each red assertion
expects `Current connection result` but receives `Old connection result`.
The standalone config uses Chromium, Firefox, and WebKit, one worker, zero retries,
and port `5195`; Playwright starts and stops Vite automatically.

For manual reproduction, serve the explicit fixture root:

```bash
npx vite examples/test/issues/stale-async-connection-work --host 127.0.0.1 --port 5195 --strictPort
```

Open `http://127.0.0.1:5195`, mount, detach, mount the same element again, resolve
request 2, then resolve request 1. The value incorrectly changes from current to
old. Same-connection completion and resolving while disconnected work correctly.
This motivates an opt-in connection-lifetime guard, such as proposed
`ConnectionGuard` in draft FAST #7817 (not present on this main baseline); the
fixture deliberately includes no fix. Rejecting/cancelling stale work is distinct
from resource cleanup on disconnect or waiting for content readiness.
