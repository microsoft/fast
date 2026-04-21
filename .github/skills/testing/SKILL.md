---
name: testing
description: Use this skill when running or writing tests in the FAST monorepo — local test execution, CI workflows, Playwright fixtures, and WebUI integration testing.
---

# Testing Patterns for FAST

Use this guide when running or writing tests in the FAST monorepo. FAST uses [Playwright](https://playwright.dev/) for integration testing with a [Vite](https://vitejs.dev/) dev server.

## Running tests

### Locally

#### First-time setup

After cloning and installing dependencies (`npm ci`), install Playwright browsers:

```bash
npx playwright install --with-deps
```

#### Commands

All commands are run from the **monorepo root**. Use `-w` to target a specific package.

| Task | Command |
|---|---|
| Run all tests (all browsers) | `npm run test` |
| Run all tests (Chromium only) | `npm run test:chromium` |
| Test a single package (all browsers) | `npm run test -w @microsoft/fast-html` |
| Test a single package (Chromium only) | `npm run test:chromium -w @microsoft/fast-html` |
| Test changed packages only | `npx lage test:node test:chromium --since origin/main` |

#### Interactive / debug workflows

For `@microsoft/fast-html`, these additional scripts are available:

| Task | Command |
|---|---|
| Playwright UI mode | `npm run test:ui -w @microsoft/fast-html` |
| Start Vite dev server only | `npm run test-server -w @microsoft/fast-html` |
| Dev mode (watch + server) | `npm run dev -w @microsoft/fast-html` |
| Rebuild fixtures | `npm run build:fixtures -w @microsoft/fast-html` |
| Build fixtures with webui | `npm run build:fixtures:webui -w @microsoft/fast-html` |
| Run webui integration tests | `npm run test:webui-integration -w @microsoft/fast-html` |

**Playwright UI mode** (`test:ui`) starts a visual test runner where you can select and debug individual tests, view traces, and inspect DOM snapshots.

**Dev mode** (`dev`) runs the TypeScript compiler in watch mode alongside the Vite dev server, so changes are reflected immediately in the browser.

### Through GitHub Actions

The repository uses several CI workflows to validate changes.

#### PR validation (ci-validate-pr.yml)

Runs on every pull request targeting `main`, `releases/*`, or `features/*` branches. Tests run on **Ubuntu with Chromium only** for fast feedback.

Key steps:
- Checks for change files (`npm run checkchange`)
- Biome lint/format check
- Builds affected packages (incremental with `--since`)
- Runs `test:node` and `test:chromium` for affected packages

#### Cross-platform validation (ci-validate-platforms.yml)

Runs on pushes to `main`, PRs targeting `main`, and on a weekly schedule. Tests run on **Ubuntu, Windows, and macOS** with **Chromium, Firefox, and Safari**.

This ensures cross-platform and cross-browser compatibility.

#### WebUI integration testing (ci-webui-integration.yml)

A dedicated workflow for validating FAST's integration with `@microsoft/webui`. This workflow runs on:

- **Manual dispatch** (`workflow_dispatch`)
- **Pushes to `webui/*` branches**

> **Note:** This workflow does _not_ run on regular pull requests. It is scoped to `webui/*` branches to test integration changes in isolation before they land on `main`.

The workflow builds all packages, installs Playwright Chromium, and runs:

```bash
npm run test:webui-integration -w @microsoft/fast-html
```

This builds each fixture with `webui build --plugin=fast`, renders the protocol with the fixture's `state.json`, and runs the same Playwright specs against the webui-rendered output.

To trigger WebUI integration tests for your changes:

1. Create a branch with the `webui/` prefix (e.g., `webui/my-integration-change`).
2. Push the branch — the workflow runs automatically.
3. Alternatively, trigger the workflow manually from the Actions tab using `workflow_dispatch`.

#### Azure Pipelines (azure-pipelines-ci.yml)

The repository also has an Azure DevOps pipeline that runs on PRs to `main`. This pipeline runs in a 1ES-managed environment and includes SDL compliance checks in addition to building and testing.

## Writing tests

FAST tests are [Playwright](https://playwright.dev/) integration tests that run against fixture pages served by Vite.

### Test file conventions

- Test files use the `*.spec.ts` suffix (specifically `*.pw.spec.ts` for package `src/` tests).
- Fixture tests live inside their fixture directory: `test/fixtures/<category>/<feature>/<feature>.spec.ts`.
- Source-level tests are co-located next to the code they test: `src/<feature>/<feature>.pw.spec.ts`.

### Writing fixture tests for fast-html

Fixture tests for `@microsoft/fast-html` are the primary way to verify declarative template features. Each fixture is a self-contained test case with its own HTML, state, templates, and component definitions.

For a complete guide on creating fixtures — including how to write `entry.html`, `state.json`, `templates.html`, `main.ts`, and spec files — see:

📄 **[Writing Fixtures](../../../packages/fast-html/test/fixtures/WRITING_FIXTURES.md)**

### Quick example

```typescript
import { expect, test } from "@playwright/test";

test.describe("my-feature", async () => {
    test("renders correctly", async ({ page }) => {
        await page.goto("/fixtures/bindings/my-feature/");

        const element = page.locator("my-element");
        await expect(element).toHaveText("Hello");
    });
});
```
