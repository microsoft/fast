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

## Preserve template binding checks

Map root-relative HTML paths to element types when you want your normal TypeScript
check to validate generated bindings:

```js
sourceGeneration: {
    root: "../src",
    outDir: "../generated",
    templateTypes: {
        "button.html": {
            typeSource: "MyButton",
            typeSourceImport: "../src/button.js",
        },
    },
}
```

Keys use forward slashes. `typeSource` is an identifier or dotted type name.
`typeSourceImport` is optional and emits an `import type`; relative imports resolve
from the **generated module**. The output uses `html<MyButton>` and
`ElementViewTemplate<MyButton>`. Include generated modules in your TypeScript
check. Without a mapping, the template source type defaults to `any`; Vite itself
does not type-check.

## Generate for multiple packages

`sourceGeneration` also accepts a nonempty array. Keep generated files within each
package's compiler root while sharing one harness server:

```js
export default createHarnessConfig({
    sourceGeneration: [
        { root: "../packages/button/src", outDir: "../packages/button/src/generated" },
        { root: "../packages/card/src", outDir: "../packages/card/src/generated" },
    ],
});
```

Each mapping has independent globs and type mappings. Output directories must not
overlap, including through nesting or symlinks, and must not contain any source
root. Output inside a source root is supported and excluded from generation.
Conversions and ownership checks finish across all mappings before files are
replaced.

## Use authored sources for SSR

SSR still requires native hosting and an `entry-server.ts`. With
`createSSRRenderer`, use explicit `components` registrations and point component
package exports `./template.html` and `./styles.css` at the authored files.
Register SSR client components with `declarativeTemplate()`. This path supports
native rendering, hydration, and HTML/CSS edits without a consumer `dist` tree.
Monolithic `packageName` discovery still uses its configured `distDir` and
`*.template.html` naming convention; source generation does not build that tree.
Inline generated styles use the test page's base URL, as handwritten FAST tagged
templates do.

See the [package README](https://github.com/microsoft/fast/tree/main/packages/fast-test-harness)
for fixture APIs, component registration examples, SSR setup, and server options.
Omit `sourceGeneration` or set it to `false` to retain the default workflow.
