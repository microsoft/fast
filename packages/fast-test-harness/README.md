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

**`entry-client.ts`** registers components for DSD hydration using `defineAsync`:

```ts
import { TemplateElement } from "@microsoft/fast-html";
TemplateElement.define({ name: "f-template" });

// Load all define-async modules
const modules = import.meta.glob("../../src/*/define-async.{ts,js,mts,mjs}");
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

Use `createSSRRenderer` from the harness to build the `render()` function. It scans for component build artifacts (f-templates, stylesheets) and uses the `@microsoft/fast-build` WASM renderer to produce declarative shadow DOM on each request.

**Multi-component package** (all components in one package):

```ts
import { createSSRRenderer } from "@microsoft/fast-test-harness/ssr/render.js";

const { render } = createSSRRenderer({
    packageName: "@my-scope/web-components",
    tagPrefix: "my",
});

export { render };
```

**Per-component packages** (each component is a separate npm package):

```ts
import { createSSRRenderer } from "@microsoft/fast-test-harness/ssr/render.js";

const { render } = createSSRRenderer({
    tagPrefix: "my",
    components: [
        { name: "button", packageName: "@my-scope/button" },
        { name: "checkbox", packageName: "@my-scope/checkbox" },
    ],
});

export { render };
```

## Server

The package includes a Node.js HTTP server with Vite middleware that handles both CSR page serving and SSR fixture generation. Run it directly or let Playwright manage it via `webServer`:

```ts
// playwright.config.ts
export default defineConfig({
    webServer: {
        command: "fast-test-harness",
        port: 3278,
        reuseExistingServer: true,
    },
});
```

For custom setup, import `startServer`:

```ts
import { startServer } from "@microsoft/fast-test-harness/server.mjs";
await startServer(process.cwd(), "./test", "./test/vite.config.ts", {
    port: 4000,
    debug: true,
});
```

| Parameter | Default | Description |
| --------- | ------- | ----------- |
| `cwd` | `process.cwd()` | Static file serving root |
| `root` | `<cwd>/test` | Vite root (contains `index.html`, `ssr.html`) |
| `configFile` | `<root>/vite.config.ts` | Vite config path |
| `options.port` | `3278` | Server port |
| `options.base` | `/` | Base URL path |
| `options.debug` | `false` | Write SSR fixtures to `temp/` for inspection |

### CLI flags

```
fast-test-harness [options]

  -p, --port <number>    Server port (default: 3278)
  -b, --base <path>      Base URL path (default: /)
  -r, --root <path>      Vite root directory (default: <cwd>/test)
  -c, --config <path>    Vite config file path (default: <root>/vite.config.ts)
  -d, --debug            Write SSR fixtures to temp/ for inspection
  -h, --help             Show help message
```

CLI flags take precedence over environment variables.

| Environment variable | Default | Description |
| -------------------- | ------- | ----------- |
| `PORT` | `3278` | Server port (overridden by `--port`) |
| `BASE` | `/` | Base URL path (overridden by `--base`) |
| `FAST_DEBUG` | — | Set `"true"` to enable debug mode (overridden by `--debug`) |
| `PLAYWRIGHT_TEST_SSR` | — | Set `"true"` for SSR mode |

## SSR renderer

**`createSSRRenderer(options)`** scans for component build artifacts and returns a `{ render }` object compatible with the server's `entry-server.ts` contract. It uses the `@microsoft/fast-build` WASM module to render f-templates into declarative shadow DOM.

| Option | Type | Description |
|--------|------|-------------|
| `tagPrefix` | `string` | Tag name prefix for custom elements (e.g., `"fluent"`, `"mai"`) |
| `packageName` | `string?` | Monolithic package name — scans subdirectories for component artifacts. Mutually exclusive with `components`. |
| `components` | `ComponentRegistration[]?` | Explicit list of per-component packages. Mutually exclusive with `packageName`. |
| `distDir` | `string?` | Artifact directory relative to the package root (default: `"dist/esm"`). Only used with `packageName`. |
| `themeStylesheet` | `string?` | URL or package specifier for a global theme stylesheet. |

## Exports

| Specifier | Contents |
|-----------|----------|
| `@microsoft/fast-test-harness` | `test`, `expect`, `CSRFixture`, `SSRFixture`, `createSSRRenderer` |
| `@microsoft/fast-test-harness/server.mjs` | `startServer` |
| `@microsoft/fast-test-harness/ssr/render.js` | `createSSRRenderer`, `ComponentRegistration`, `RenderResult`, `SSRRendererOptions` |
| `@microsoft/fast-test-harness/public/*` | Static assets (base CSS) |
