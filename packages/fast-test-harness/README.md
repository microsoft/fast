# FAST Test Harness

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The `fast-test-harness` package is a Playwright testing harness for FAST Element web components with CSR and SSR support.

## Requirements

- Node.js 22.18 or later
- Playwright 1.56 or later

## Installation

To install `fast-test-harness` using `npm`:

```shell
npm install --save-dev @microsoft/fast-test-harness
```

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

## Automatic HTML/CSS source generation (opt-in)

The existing TypeScript-first workflow remains the default. Extracting HTML/CSS
from compiled templates with `generateFTemplates`, `generateStylesheets`,
`generateWebuiTemplates`, or their CLI commands is deprecated but still supported.

To author HTML/CSS instead, install the optional converter peer:

```shell
npm install --save-dev @microsoft/fast-build
```

Configure the harness's Vite config, and continue starting the harness normally:

```js
// test/vite.config.mjs
import { createHarnessConfig } from "@microsoft/fast-test-harness/vite.config.mjs";

export default createHarnessConfig({
    components: [
        {
            tagName: "my-button",
            template: "../src/button/button.html",
            stylesheet: "../src/button/button.css",
            clientModule: "../src/button/button.ts",
            className: "MyButton",
            generated: "../src/button/generated/",
        },
    ],
});
```

Pass `--config test/vite.config.mjs` if the config is not discovered automatically.
Paths are relative to the Vite config file, not the shell's working directory.
Without a config file, programmatically created Vite configurations resolve paths
relative to Vite's root. `components` is always an array, including for one component.
Each component identifies its tag name, exact HTML input, client module, named
class export, and `generated` output directory. `stylesheet`
is optional. No glob patterns or class discovery are used; unlisted HTML/CSS
files are ignored. All input paths are relative to the config file, not to
`generated`. Output directories must not contain any configured input file.

For example, `src/button/button.html`:

```html
<f-template name="my-button">
    <template><button>{{label}}</button></template>
</f-template>
```

and `src/button/button.css`:

```css
:host { display: inline-block; }
```

produce `src/button/generated/my-button.template.ts` and
`src/button/generated/my-button.styles.ts`, exporting `template` and `styles`.
Register the component using those modules:

```ts
// src/button/button.ts
import { FASTElement } from "@microsoft/fast-element/fast-element.js";
import { template } from "./generated/my-button.template.js";
import { styles } from "./generated/my-button.styles.js";

export class MyButton extends FASTElement {
    label = "Click me";
}

await MyButton.define({ name: "my-button", template, styles });
```

Import your source definition modules from the test entry point, rather than a
previously compiled copy. The harness generates TypeScript before serving modules,
including on a clean checkout, then watches the configured HTML/CSS inputs.
Vite transpiles TypeScript edits automatically. Pages reload, SSR entry modules
are invalidated, and previously requested SSR fixtures regenerate on navigation;
no separate generation or compilation script
is needed while the harness runs. Vite does not perform TypeScript type checking.

The generated directory can be gitignored. Each component produces
`<tagName>.template.ts` and, when a stylesheet is configured, `<tagName>.styles.ts`.
Components may share a generated directory; their output filenames must be unique.
Generated modules have explicit FAST types and ownership headers. The harness
refuses to overwrite unowned files and only deletes its own stale generated files.
Conversion errors identify the source file, block stale modules, and recover when
the source is corrected. Missing configured files are errors too; remove a
component or its optional stylesheet from the config to remove the corresponding
owned output within a still-configured generated directory. Directories no longer
referenced by any component are left untouched. Config changes restart Vite and
regenerate the remaining outputs.

Conversion uses FAST Build's `fast-v3-ts` syntax: each HTML input must contain
exactly one supported `<f-template>` definition, not an arbitrary HTML document.
Generated styles are inline FAST styles; asset URLs must resolve from the test
page, as with handwritten FAST tagged templates. This conversion uses WASM and
does not require the native SSR addon.

### Template binding types

`clientModule` and `className` identify the named class export used to type each
generated template:

```js
// test/vite.config.mjs
import { createHarnessConfig } from "@microsoft/fast-test-harness/vite.config.mjs";

export default createHarnessConfig({
    components: [
        {
            tagName: "m-fast-card",
            template: "../src/components/card/card.html",
            stylesheet: "../src/components/card/card.css",
            clientModule: "../src/components/card/card.ts",
            className: "FastCard",
            generated: "../src/components/card/generated/",
        },
    ],
});
```

This produces `src/components/card/generated/m-fast-card.template.ts` and
`src/components/card/generated/m-fast-card.styles.ts`. The template imports `FastCard` using
`import type`, with a relative specifier computed from the generated module to
the configured client module. TypeScript extensions are rewritten for emitted
module imports: `.ts`/`.tsx` become `.js`, `.mts` becomes `.mjs`, and `.cts`
becomes `.cjs`.

The generated module uses `html<FastCard>` and `ElementViewTemplate<FastCard>`,
so your normal TypeScript check can catch misspelled binding properties and
missing class exports. Include the generated files in that check. Vite still
does not type-check. The type-only import does not evaluate the client module
or register the element; keep registration in your source entry points.
`tagName` names the outputs; the HTML must declare the intended `<f-template>`
name, and SSR registration remains separately configured.

### Multiple packages

List components from multiple packages to generate modules within each TypeScript root
while serving all packages with one harness:

```js
export default createHarnessConfig({
    components: [
        {
            tagName: "my-button",
            template: "../packages/button/src/button.html",
            stylesheet: "../packages/button/src/button.css",
            clientModule: "../packages/button/src/button.ts",
            className: "MyButton",
            generated: "../packages/button/src/generated/",
        },
        {
            tagName: "my-card",
            template: "../packages/card/src/card.html",
            clientModule: "../packages/card/src/card.ts",
            className: "MyCard",
            generated: "../packages/card/src/generated/",
        },
    ],
});
```

Components sharing a canonical output directory are generated together, including
paths referring to the same directory through symlinks. Duplicate outputs and
nested output directories are rejected.
No output directory may contain any component's input files. Outputs alongside
source files in a dedicated subdirectory are supported and excluded from watch feedback.
All components share one generation queue; conversion and ownership checks across
the complete batch finish before any generated file is replaced.

### Authored-source SSR

SSR still needs a configured `entry-server.ts` and native addon. For
`createSSRRenderer` without a consumer `dist` tree, use explicit `components`
registrations and expose authored files through each component package's exports:

```json
{
    "exports": {
        "./template.html": "./src/button/button.html",
        "./styles.css": "./src/button/button.css"
    }
}
```

Use `declarativeTemplate()` for SSR client registration, as in the SSR setup below.
The renderer reads those authored exports for declarative shadow DOM and
hydration; HTML/CSS edits refresh the fixture without a separate build.
The monolithic `packageName` mode still discovers `*.template.html` files under
its configured `distDir` (default `dist/esm`). Source generation does not change
that discovery rule or extract a separate build-artifact tree.

Omit `components`, or set it to `[]`, to keep the default workflow. Non-array values,
including a single component object or `false`, are rejected.

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
| -------- | ------ | --------- | ------------- |
| `base` | `string` | `"/"` | Base path for the test page and SSR endpoint |
| `tagName` | `string` | `""` | Custom element tag name |
| `innerHTML` | `string` | `""` | Default inner HTML |
| `waitFor` | `string[]` | `[]` | Additional elements to wait for before testing |
| `ssr` | `boolean` | `false` | Use SSR mode (or set `PLAYWRIGHT_TEST_SSR=true`) |

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

**`entry-client.ts`** imports the harness SSR entry (which enables hydration) and registers components. Component definition modules should use `template: declarativeTemplate()`; this automatically defines FAST's internal `<f-template>` publisher.

```ts
import "@microsoft/fast-test-harness/ssr/entry-client.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";

import { MyButton, definition } from "../../src/button/index.js";

MyButton.define({
    name: definition.name,
    template: declarativeTemplate(),
});
```

**`entry-server.ts`** exports a `render()` function that the server calls for each `setTemplate()` request. It returns three strings that get injected into `ssr.html`:

```ts
export async function render(queryObj: Record<string, string>): Promise<{
    template: string;    // <f-template> HTML → <!--templates-->
    fixture: string;     // rendered element HTML → <!--fixture-->
    preloadLinks: string; // <link> tags → <!--stylespreload-->
}>;
```

Use `createSSRRenderer` from the harness to build the `render()` function. It scans for component build artifacts (f-templates, stylesheets) and uses the `@microsoft/fast-build` AOT fixture compiler to produce declarative shadow DOM on each request.

**Multi-component package** (all components in one package):

```ts
import { createSSRRenderer } from "@microsoft/fast-test-harness/ssr/render.js";

const { render } = createSSRRenderer({
    nativeAddonPath: "/absolute/deployment/path/fast-build.node",
    packageName: "@my-scope/web-components",
    tagPrefix: "my",
});

export { render };
```

**Per-component packages** (each component is a separate npm package):

```ts
import { createSSRRenderer } from "@microsoft/fast-test-harness/ssr/render.js";

const { render } = createSSRRenderer({
    nativeAddonPath: "/absolute/deployment/path/fast-build.node",
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

One server can host several test directories at separate paths. Set the matching
`base` fixture option for each test group.

```ts
await startServer(process.cwd(), process.cwd(), "./vite.config.ts", {
    routes: [
        { base: "/button/", root: "./packages/button/test" },
        { base: "/dialog/", root: "./packages/dialog/test" },
    ],
});

test.use({ base: "/button/", tagName: "my-button" });
```

| Parameter | Default | Description |
| --------- | ------- | ----------- |
| `cwd` | `process.cwd()` | Static file serving root |
| `root` | `<cwd>/test` | Vite root (contains `index.html`, `ssr.html`) |
| `configFile` | Vite auto-discovery | Vite config path |
| `options.port` | `3278` | Server port |
| `options.base` | `/` | Base URL path |
| `options.debug` | `false` | Write SSR fixtures to `temp/` for inspection |
| `options.routes` | Single route from `root` and `base` | Test roots keyed by URL base path |

### CLI flags

```
fast-test-harness [command] [options]

Commands:
  serve                    Start the test harness dev server (default)
  generate-templates       Extract compiled templates (deprecated)
  generate-stylesheets     Extract compiled ElementStyles (deprecated)
  generate-webui-templates Extract compiled DSD templates (deprecated)

Serve options:
  -p, --port <number>    Server port (default: 3278)
  -b, --base <path>      Base URL path (default: /)
  -r, --root <path>      Vite root directory (default: <cwd>/test)
  -c, --config <path>    Vite config file path (default: Vite auto-discovery)
  -d, --debug            Write SSR fixtures to temp/ for inspection
  -v, --version          Show version number
  -h, --help             Show help message
```

CLI flags take precedence over environment variables.

`generate-templates` preserves browser-valid `<template>` wrappers and strips
static wrappers even when the opening or closing tag includes ASCII whitespace
before `>`.

| Environment variable | Default | Description |
| -------------------- | ------- | ----------- |
| `PORT` | `3278` | Server port (overridden by `--port`) |
| `BASE` | `/` | Base URL path (overridden by `--base`) |
| `FAST_DEBUG` | — | Set `"true"` to enable debug mode (overridden by `--debug`) |
| `PLAYWRIGHT_TEST_SSR` | — | Set `"true"` for SSR mode |

## SSR renderer

**`createSSRRenderer(options)`** scans for component build artifacts and returns
`{ render }`, whose asynchronous `render(queryObj)` returns `Promise<RenderResult>`.
It uses the build-time WASM parser/compiler and the required native Node addon to produce
declarative shadow DOM, including wrapper tags whose opening or closing `>` is
preceded by ASCII whitespace. The server awaits rendering and also accepts
synchronous custom renderers.

Provide `nativeAddonPath` or `FAST_NATIVE_ADDON` for SSR. Source-build and deploy
the addon explicitly; no binary is downloaded automatically. Missing native
hosting and fixture compilation/rendering failures propagate.

| Option | Type | Description |
| -------- | ------ | ------------- |
| `nativeAddonPath` | `string?` | Source-built Node addon path; defaults to `FAST_NATIVE_ADDON`. |
| `tagPrefix` | `string` | Tag name prefix for custom elements (e.g., `"fluent"`, `"contoso"`) |
| `packageName` | `string?` | Monolithic package name — scans subdirectories for component artifacts. Mutually exclusive with `components`. |
| `components` | `ComponentRegistration[]?` | Explicit list of per-component packages. Mutually exclusive with `packageName`. |
| `distDir` | `string?` | Artifact directory relative to the package root (default: `"dist/esm"`). Only used with `packageName`. |
| `themeStylesheet` | `string?` | URL or package specifier for a global theme stylesheet. |

## Exports

| Specifier | Contents |
| ----------- | ---------- |
| `@microsoft/fast-test-harness` | `test`, `expect`, `CSRFixture`, `SSRFixture`, `toHaveCustomState`, `installDomShim`, `createSSRRenderer` |
| `@microsoft/fast-test-harness/build/*.js` | `installDomShim`, `generateStylesheets`, `generateFTemplates`, `generateWebuiTemplates`, `definitionAsyncResolver`, `shadowOptionsToAttributes`, `ShadowOptionsResolver` |
| `@microsoft/fast-test-harness/fixtures/*.js` | `CSRFixture`, `SSRFixture`, `toHaveCustomState`, extended `test` and `expect` |
| `@microsoft/fast-test-harness/ssr/render.js` | `createSSRRenderer`, `renderTemplate`, `buildEntryHtml`, `buildState` |
| `@microsoft/fast-test-harness/ssr/entry-client.js` | Enables FAST Element hydration for SSR pages |
| `@microsoft/fast-test-harness/server.mjs` | `startServer` |
| `@microsoft/fast-test-harness/playwright.config.mjs` | Shared Playwright configuration |
| `@microsoft/fast-test-harness/vite.config.mjs` | Default shared Vite configuration; `createHarnessConfig`, `HarnessConfig`, `SourceComponent` |
| `@microsoft/fast-test-harness/public/*` | Static assets (base CSS) |

SSR fixture generation compiles dynamically authored test HTML as development
tooling. Production SSR compiles native artifacts during the application build.
The rendering result is asynchronous; use `await render(queryObj)`.
