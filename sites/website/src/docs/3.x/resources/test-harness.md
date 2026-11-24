---
id: test-harness
title: Test Harness
layout: 3x
eleventyNavigation:
  key: test-harness3x
  parent: resources3x
  title: Test Harness
navigationOptions:
  activeKey: test-harness3x
description: Configure automatic HTML and CSS source generation when testing FAST components with the FAST Test Harness.
keywords:
  - testing
  - test harness
---

`@microsoft/fast-test-harness` provides Playwright fixtures for client-rendered and
server-rendered FAST components. Its existing TypeScript-first configuration is
the default. The compiled-template extraction APIs and commands are deprecated
but remain supported.

## Author HTML and CSS

Install the harness and its optional conversion peer:

```shell
npm install --save-dev @microsoft/fast-test-harness @microsoft/fast-build
```

Opt into automatic source generation in the Vite config used by the harness:

```js
// test/vite.config.mjs
import { createHarnessConfig } from "@microsoft/fast-test-harness/vite.config.mjs";

export default createHarnessConfig({
    sourceGeneration: {
        root: "../src",
        outDir: "../generated",
        templates: "**/*.html",
        stylesheets: "**/*.css",
    },
});
```

Paths resolve relative to the Vite config. Both directories are required. Glob
options accept a string, string array, or `false`; they default to all HTML/CSS
under the source root. The output directory must not contain the source root.

An HTML source must contain exactly one supported FAST `<f-template>` definition:

```html
<f-template name="my-button">
    <template><button>{{label}}</button></template>
</f-template>
```

`src/button.html` becomes `generated/button.template.ts`, exporting `template`.
`src/button.css` becomes `generated/button.styles.ts`, exporting `styles`.
Subdirectories are preserved. Import the generated modules using `.js` extensions
in your component definition and import source definitions from the test entry
point so Vite can transpile them.

Start the harness normally, selecting the config with
`fast-test-harness --config test/vite.config.mjs` when needed. It generates files
before module loading, including on clean checkouts. HTML/CSS additions, edits,
and deletions and TypeScript edits are handled automatically while it runs.
Pages reload, and existing SSR fixture URLs regenerate from their saved inputs.
No separate generation or compilation script is needed. Vite does not type-check
TypeScript.

The generated directory may be gitignored. The harness refuses to overwrite
unowned files and only cleans its own stale output. Conversion errors identify the
source and recover when corrected. Conversion uses FAST Build's `fast-v3-ts` WASM
converter, not the native SSR addon.

SSR still requires the renderer's configured HTML/CSS inputs and native hosting.
This option does not extract a separate build-artifact tree. Inline styles use the
test page's base URL, as handwritten FAST tagged templates do.

See the [package README](https://github.com/microsoft/fast/tree/main/packages/fast-test-harness)
for fixture APIs, component registration examples, SSR setup, and server options.
Omit `sourceGeneration` or set it to `false` to retain the default workflow.
