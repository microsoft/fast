# FAST Test Harness

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The `fast-test-harness` package is a Playwright testing harness for FAST Element web components with CSR and SSR support.

## Installation

To install `fast-test-harness` using `npm`:

```shell
npm install --save-dev @microsoft/fast-test-harness
```

## Writing tests

Import `test` and `expect` from the harness. Configure the component tag name with `test.use()`, then call `fastPage.setTemplate()` in each test to render it.

```ts
import { expect, test } from "@microsoft/fast-test-harness";

test.describe("Button", () => {
    test.use({ tagName: "my-button", innerHTML: "Click me" });

    test("should render", async ({ fastPage }) => {
        await fastPage.setTemplate();
        await expect(fastPage.element).toBeVisible();
    });

    test("should accept attributes", async ({ fastPage }) => {
        await fastPage.setTemplate({
            attributes: { appearance: "primary", disabled: true },
        });
        await expect(fastPage.element).toHaveAttribute("appearance", "primary");
    });

    test("should work inside a form", async ({ fastPage }) => {
        await fastPage.setTemplate(`
            <form>
                <my-button type="submit">Submit</my-button>
            </form>
        `);
        await expect(fastPage.element).toBeVisible();
    });
});
```

Use `updateTemplate()` to modify attributes or innerHTML after the initial render without navigating away from the page:

```ts
await fastPage.setTemplate();
await fastPage.updateTemplate(fastPage.element, { attributes: { disabled: true } });
```

The `toHaveCustomState` assertion checks `ElementInternals` custom states:

```ts
await expect(element).toHaveCustomState("checked");
```

## Fixture options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tagName` | `string` | `""` | Custom element tag name |
| `innerHTML` | `string` | `""` | Default inner HTML |
| `waitFor` | `string[]` | `[]` | Additional elements to wait for before testing |
| `ssr` | `boolean` | `false` | Use SSR mode (or set `PLAYWRIGHT_TEST_SSR=true`) |

## Test directory setup

The harness serves a Vite dev server from a `test/` directory in your project. CSR and SSR modes use different entry points from the same directory.

```
test/
├── index.html              # CSR: loads main.ts
├── ssr.html                # SSR: template with comment placeholders
├── vite.config.ts          # Vite config (shared by both modes)
└── src/
    ├── main.ts             # CSR: registers components, applies theme
    ├── entry-client.ts     # SSR: registers components for hydration
    └── entry-server.ts     # SSR: exports render() for fixture generation
```

### CSR files

**`index.html`** loads a script that registers your components:

```html
<!doctype html>
<html lang="en">
    <head><meta charset="UTF-8" /></head>
    <body>
        <script type="module" src="/src/main.ts"></script>
    </body>
</html>
```

**`main.ts`** registers components and applies global config. The body starts empty; `setTemplate()` injects HTML per test.

```ts
import "./define-all.js";
import { setTheme } from "./theme.js";
setTheme(lightTheme);
```

### SSR files

**`ssr.html`** contains comment placeholders the server fills in per request:

```html
<!doctype html>
<html lang="en">
    <head>
        <title><!--fixturetitle--></title>
        <!--stylespreload-->
    </head>
    <body>
        <!--fixture-->
        <!--templates-->
        <script type="module" src="/src/entry-client.ts"></script>
    </body>
</html>
```

**`entry-client.ts`** enables hydration and registers components. Component
definition modules should use `template: declarativeTemplate()`; this
automatically defines FAST's internal `<f-template>` publisher, so there is no
manual `TemplateElement.define()` step.

```ts
import { enableHydration } from "@microsoft/fast-element/hydration.js";

enableHydration();

// Load all define-async modules
const modules = import.meta.glob("../../src/*/define-async.{ts,js}");
Promise.all(Object.values(modules).map(m => m()));
```

**`entry-server.ts`** exports a `render()` function that the server calls for each `setTemplate()` request. It returns three strings that get injected into `ssr.html`:

```ts
export function render(queryObj: Record<string, string>): {
    template: string;    // <f-template> HTML → <!--templates-->
    fixture: string;     // rendered element HTML → <!--fixture-->
    preloadLinks: string; // <link> tags → <!--stylespreload-->
};
```

Each component needs three build artifacts for SSR: an `<f-template>` (`.template.html`), a DSD template (`.template-dsd.html`), and optionally a stylesheet (`.styles.css`). Use `renderFixture` and `renderTemplate` from the harness to assemble the output:

```ts
import { readAsset, resolveAssetUrl } from "@microsoft/fast-test-harness/ssr/assets.js";
import { renderFixture, renderTemplate } from "@microsoft/fast-test-harness/ssr/render.js";

const fTemplate = readAsset("@my-scope/button/template.html");
const dsd = readAsset("@my-scope/button/template-dsd.html");
const styles = resolveAssetUrl("@my-scope/button/styles.css");

export function render(queryObj: Record<string, string> = {}) {
    return {
        template: renderTemplate(fTemplate, styles),
        fixture: renderFixture(queryObj, dsd, styles),
        preloadLinks: "",
    };
}
```

## Server

The package includes an Express + Vite server that handles both CSR page serving and SSR fixture generation. Run it directly or let Playwright manage it via `webServer`:

```ts
// playwright.config.ts
export default defineConfig({
    webServer: {
        command: "fast-test-harness",
        port: 5173,
        reuseExistingServer: true,
    },
});
```

For custom setup, import `startServer`:

```ts
import { startServer } from "@microsoft/fast-test-harness/server.mjs";
await startServer(process.cwd(), "./test", "./test/vite.config.ts");
```

| Parameter | Default | Description |
|-----------|---------|-------------|
| `cwd` | `process.cwd()` | Static file serving root |
| `root` | `<cwd>/test` | Vite root (contains `index.html`, `ssr.html`) |
| `configFile` | `<root>/vite.config.ts` | Vite config path |

| Environment variable | Default | Description |
|---------------------|---------|-------------|
| `PORT` | `5173` | Server port |
| `BASE` | `/` | Base URL path |
| `PLAYWRIGHT_TEST_SSR` | — | Set `"true"` for SSR mode |

## Rendering utilities

**`renderFixture(queryObj, dsdTemplate?, styles?, templateData?, childTemplates?)`** builds the fixture element HTML. Injects the DSD template inside the element when provided. `childTemplates` is a `Record<tagName, dsdHtml>` that injects DSD into nested custom elements found in the innerHTML or raw HTML.

**`renderTemplate(rawTemplate, styles)`** replaces `{{styles}}` in an f-template HTML string with a `<link>` tag for the given stylesheet URL.

**`readAsset(specifier)`** reads a file as UTF-8 from a package export path or filesystem path using `import.meta.resolve`.

**`resolveAssetUrl(specifier, root?)`** resolves a specifier to a server-relative URL path for use in `<link>` tags.

## Exports

| Specifier | Contents |
|-----------|----------|
| `@microsoft/fast-test-harness` | `test`, `expect`, `CSRFixture`, `SSRFixture`, `readAsset`, `resolveAssetUrl`, `renderFixture`, `renderTemplate` |
| `@microsoft/fast-test-harness/server.mjs` | `startServer`, `app` |
| `@microsoft/fast-test-harness/ssr/render.js` | `renderFixture`, `renderTemplate`, `renderPreloadLinks` |
| `@microsoft/fast-test-harness/ssr/assets.js` | `readAsset`, `resolveAssetUrl` |
| `@microsoft/fast-test-harness/public/*` | Static assets (base CSS) |
