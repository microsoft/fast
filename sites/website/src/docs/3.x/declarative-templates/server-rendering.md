---
id: declarative-server-rendering
title: Server-Side Rendering
layout: 3x
eleventyNavigation:
  key: declarative-server-rendering3x
  parent: declarative-templates3x
  title: Server-Side Rendering
navigationOptions:
  activeKey: declarative-server-rendering3x
description: Learn how to render declarative FAST templates on the server and hydrate them on the client.
keywords:
  - server-side rendering
  - SSR
  - hydration
  - fast-build
  - declarative shadow DOM
  - prerendering
---

{% raw %}

# Server-Side Rendering

One of the core benefits of FAST's declarative HTML templates is stack-agnostic server-side rendering. Because `<f-template>` markup is standard HTML with binding expressions — not JavaScript — any server technology can render the initial page without running the FAST Element client runtime.

The FAST Element client runtime remains browser-only. Servers emit HTML and
hydration markers; the browser `Window` parses Declarative Shadow DOM, defines
custom elements, runs `enableHydration()`, and processes reactive updates with
browser scheduling APIs such as `requestAnimationFrame`.

## The Rendering Contract

A server-side renderer must produce HTML that follows these conventions so the client-side FAST runtime can hydrate it:

1. **Declarative Shadow DOM** — Custom element content is rendered inside a `<template shadowrootmode="open">` element, which the browser expands into a shadow root.
2. **Hydration markers** — Attribute bindings are annotated with `data-fe="N"` attributes on elements (where `N` is the count of attribute bindings on that element). Content bindings are wrapped in `<!--fe:b-->VALUE<!--fe:/b-->` comment markers.
3. **State resolution** — Binding expressions like `{{title}}` are resolved to their initial values from a state object.

**Example:** Given this template and state:

```html
<f-template name="greeting-card">
    <template>
        <h2>{{title}}</h2>
        <button ?disabled="{{!isActive}}" @click="{handleClick($e)}">
            {{buttonLabel}}
        </button>
    </template>
</f-template>
```

```json
{ "title": "Hello", "isActive": true, "buttonLabel": "Click me" }
```

A server renderer produces:

```html
<greeting-card title="Hello" is-active button-label="Click me">
    <template shadowrootmode="open">
        <h2><!--fe:b-->Hello<!--fe:/b--></h2>
        <button data-fe="2">
            <!--fe:b-->Click me<!--fe:/b-->
        </button>
    </template>
</greeting-card>
```

Note that `data-fe="2"` appears on the `<button>` because it has two attribute bindings: the boolean `?disabled` binding and the `@click` event binding. Content bindings (`{{title}}` and `{{buttonLabel}}`) use comment markers instead. Event bindings and attribute directives are client-only — the server strips them but allocates binding slots for hydration.

When the page loads, the FAST declarative runtime finds these markers and attaches reactive bindings to the existing DOM nodes instead of re-rendering.

## Hydration Flow

The end-to-end flow from server to interactive page follows these steps:

1. **Server renders** — The renderer resolves `{{bindings}}` against the state, injects Declarative Shadow DOM `<template>` elements, and adds hydration markers.
2. **Browser loads HTML** — The browser parses the page. Declarative Shadow DOM `<template>` elements are automatically expanded into shadow roots.
3. **JavaScript loads** — Component classes are defined with `template: declarativeTemplate()`, which waits for matching `<f-template>` elements and resolves the template.
4. **Template resolution** — `declarativeTemplate()` coordinates with the `<f-template>` elements to parse the declarative markup and supply the compiled template to each element definition.
5. **Hydration** — If `enableHydration()` was called before FAST elements connect, FAST detects the pre-rendered shadow DOM, maps existing DOM nodes to binding slots using hydration markers, and re-establishes reactive observations. Without `enableHydration()`, the element renders client-side instead. By default, hydration no-ops after the initial hydration batch completes; set `stopHydration: StopHydration.never` for pages that stream Declarative Shadow DOM later. Await `enableHydration().whenHydrated()` when application code needs to wait for the active hydration batch. In `StopHydration.never` mode, that promise intentionally remains pending because there is no global completion point.
6. **Interactive** — The page is fully interactive. Property changes trigger targeted DOM updates.

Hydration reuses the same SSR nodes. Ordinary sibling-bounded views use pointer
traversal and read native sequential markers directly, avoiding per-view DOM
Range/TreeWalker setup and factory-index arrays. Unusual view boundaries and
potentially mutating marker cleanup retain the live Range traversal. This is an
internal optimization: marker formats, registration order, readiness promises,
and update scheduling are unchanged, including opt-in `markers_v2`.

Call `enableHydration()` before FAST elements are registered with the platform
to also enable pointer-only native `data-fe` cleanup when the registration-time
proof shows the marker unobserved and attribute methods are native. The
observation checks are excluded from client-only `FASTElement` bundles. Elements
registered earlier still hydrate correctly through conservative traversal, as
do unknown registrations, custom marker strategies, observed markers, customized
built-ins, and overridden methods. Marker cleanup remains synchronous and
callback order is unchanged.

:::tip
The controller exposes two properties: `isPrerendered` resolves `true` when the element had a declarative shadow root at connect time, while `isHydrated` resolves `true` only when hydration actually ran successfully. Use these to detect how the element was rendered and when it is fully interactive.
:::

## State Propagation

When the server renders custom elements, attribute values on the host element become the initial state for template bindings inside the shadow DOM.

```html
<greeting-card title="Hello" message="Welcome"></greeting-card>
```

The `title` and `message` attributes become state properties that resolve `{{title}}` and `{{message}}` in the element's template.

### Nested Custom Elements

State flows from parent to child elements. Unbound state keys — values from the parent state that the parent template does not consume — propagate automatically to child custom elements.

```html
<!-- Parent state: { "theme": "dark", "username": "Jane" } -->
<app-header username="{{username}}">
    <!-- theme propagates to user-avatar even though
         app-header's template doesn't use it -->
    <template shadowrootmode="open">
        <user-avatar username="{{username}}"></user-avatar>
    </template>
</app-header>
```

### Special Attribute Handling

The renderer applies special rules for certain HTML attributes:

| Attribute pattern | State property | Example |
|---|---|---|
| `data-*` | `dataset.*` (camelCase) | `data-user-id` → `dataset.userId` |
| `aria-*` | camelCase ARIA property | `aria-label` → `ariaLabel` |
| Boolean (`?attr`) | Truthy/falsy evaluation | `?disabled="{{isOff}}"` → present or absent |

## Composing Component Styles

Build tools can call `compose_f_template_styles_with_options` from
`@microsoft/fast-build/wasm/microsoft_fast_build.js` with either
`{ kind: "inline", css }` or `{ kind: "external", href }`. The result's `html`
contains a first-child style or stylesheet link, preserving authored content.
The caller owns public asset URLs and serving.

An inline `styleId` adds `data-fast-ssr-style` to identify a generated SSR
fallback. It is not a CSP nonce. For adopted stylesheets, use the original HTML
for client conversion and register CSS separately; a runtime integration must
successfully attach replacement styles and coordinate hydration before removing
only matching fallbacks. FAST Build does not perform this handoff. Keep fallbacks
when JavaScript is absent or attachment fails, and account for the different
cascade ordering of constructed stylesheets.

Retain the composition handle to map downstream binding spans and structured
errors back to authored HTML/CSS. Mapping is explicit; passing composed HTML
alone changes the source coordinate space. See the
[stylesheet composition and diagnostics contract](https://github.com/microsoft/fast/blob/main/packages/fast-build/README.md#stylesheet-delivery-composition)
for `map_span`, `map_location`, lifetime, and static-attribute restrictions.

## Host Attribute Propagation

Missing or null attribute bindings omit the attribute, rather than serializing
an empty value. Explicit empty strings stay present. This also applies to
bindings embedded in literal attribute values. Hydration counts still include
omitted attributes, so reactive updates can add them later. Use `?name` for
client/server truthy/falsy boolean bindings; JSON booleans on known HTML boolean
attributes also use presence on the server, while ARIA booleans stay textual.

Build-time plugins can use `render_shadow_root` from the
`@microsoft/fast-build/wasm/microsoft_fast_build.js` export to render a complete
DSD `<template>` with resolved component state and no throwaway host/light DOM.
`parse_f_templates` exposes versioned binding descriptions, including lexical
repeat scopes, authored expression spans, and explicit unknown state
types/optionality. Spans use half-open ranges in the complete original HTML input,
with zero-based UTF-16 offsets and one-based lines/UTF-16 columns; CRLF counts as
one line break. Bindings inside HTML comments remain unsupported. Persist the full
record to retain version checks; this metadata does not replace application
state declarations. See the
[FAST Build integration APIs](https://github.com/microsoft/fast/blob/main/packages/fast-build/README.md#apis-for-build-time-plugins)
and [migration guide](https://github.com/microsoft/fast/blob/main/packages/fast-build/docs/migration/plugin-integrations.md).

Failed build-time render, conversion, and composition calls throw JavaScript
`Error` objects with their existing `message`, a stable `code` (for example
`unclosed-binding` or `repeat-not-array`), and optional `line`, `column`, `length`,
and `templateName`. Lines/UTF-16 columns are one-based; highlight lengths count
UTF-16 units, and CRLF counts as one break. Entry/conversion locations refer to
authored input, even after preprocessing. A separately supplied component error
instead names its definition and locates that definition's supplied `content`;
do not attribute that location to the entry file. Non-HTML errors omit coordinates.
Both WASM modules export a `FastBuildError` TypeScript interface. See the
[structured-error contract and code lists](https://github.com/microsoft/fast/blob/main/packages/fast-build/README.md#structured-errors).
Binding metadata discovery remains permissive rather than introducing new parse failures.

For authored slot inspection, import the additive `extract_template_slots` export
from `@microsoft/fast-build/wasm/microsoft_fast_build.js`:

```js
import { extract_template_slots } from "@microsoft/fast-build/wasm/microsoft_fast_build.js";

const slots = JSON.parse(extract_template_slots(originalHtml, "greeting-card"));
// [{ name: "title", line: 3, column: 9 }, { name: "", line: 4, column: 9 }]
```

Pass the complete original source before CSS composition or other transformations.
Each declaration has a decoded authored `name` (`""` for the default slot) and
one-based line/UTF-16 column at its opening `<`; duplicates remain in source order.
Discovery uses real HTML elements and namespaces, not slot-like text in comments
or raw-text contexts. It inspects ordinary nested templates and FAST conditional/
repeat bodies once, without state evaluation, but excludes nested component
definitions and templates marked as separate shadow roots. Selection must identify
one named definition and one direct HTML template child; invalid or ambiguous
selection throws `FastBuildError`, while a valid slot-free component returns `[]`.
The generated WASM declarations expose `TemplateSlot`. See the
[slot discovery contract](https://github.com/microsoft/fast/blob/main/packages/fast-build/README.md#authored-slot-declarations)
for namespace, nested-template, parsing, and error details. Rendering and binding
metadata remain unchanged.

Attributes declared on the inner `<template>` element of an `<f-template>` definition are propagated onto the rendered host element's opening tag. This lets a component's declarative template pre-declare host-level attributes — such as `tabindex`, `role`, `aria-*`, or `class` — without requiring the page author to repeat them on every usage.

```html
<f-template name="primary-button">
    <template tabindex="0" role="button" class="primary">
        <slot></slot>
    </template>
</f-template>
```

```html
<!-- Author writes: -->
<primary-button>Click me</primary-button>
```

```html
<!-- Server renders: -->
<primary-button tabindex="0" role="button" class="primary">
    <template shadowrootmode="open">
        <slot></slot>
    </template>
</primary-button>
```

### Supported binding forms

Three forms on the source `<template>` are propagated to the host:

| Form | Behavior on host |
|---|---|
| `name="value"` (static) | Emitted verbatim. |
| `name="{{expression}}"` (dynamic) | Resolved against the same state used to render the shadow root. Primitive values are emitted as-is; `null`, `undefined`, arrays, and objects are stripped. |
| `?name="{{expression}}"` (boolean) | Evaluated as a boolean. The bare `name` is emitted when truthy and omitted when falsy. |

### Client-only attributes are skipped

Attributes intended for the client-side runtime never appear on the rendered host element:

- `@event` — event listener bindings
- `:property` — property bindings
- `f-ref` — element references
- `f-slotted` — slotted content directives
- `f-children` — child node directives

These continue to be handled exclusively by the hydration runtime.

### Author attributes win on conflict

When the page author already supplies an attribute on the host element, that value is preserved and the template's value is ignored. Dedupe is performed on the lowercased attribute name, and `?name="{{expression}}"` is deduped against the bare `name`.

```html
<f-template name="primary-button">
    <template tabindex="0" class="primary">
        <slot></slot>
    </template>
</f-template>

<!-- Author overrides tabindex; class is propagated. -->
<primary-button tabindex="-1">Click me</primary-button>
```

```html
<!-- Server renders: -->
<primary-button tabindex="-1" class="primary">…</primary-button>
```

### Available in `@microsoft/fast-build`

The propagation is implemented by the build-time renderer in `@microsoft/fast-build`. Author-provided host attributes always win, so existing templates that did not previously rely on template-level host attributes continue to render unchanged.

## Using `@microsoft/fast-build`

The `@microsoft/fast-build` package renders declarative FAST syntax for integration with existing backends, powered by a WebAssembly core. It implements the rendering contract described above.

:::note
[`@microsoft/webui`](https://github.com/microsoft/webui) is a highly performant backend alternative that can render FASTElement using the `fast_v3` plugin.
:::

### Installation

```shell
npm install --save @microsoft/fast-build
```

### CLI Usage

The `fast build` command renders an entry HTML file with a JSON state file:

```shell
fast build --entry=index.html --state=state.json --output=output.html --templates="./components/**/*.html"
```

| Option | Default | Description |
|---|---|---|
| `--entry` | `index.html` | Entry HTML template to render |
| `--state` | `state.json` | JSON file containing the initial state |
| `--output` | `output.html` | Where to write the rendered HTML |
| `--templates` | _(none)_ | Glob pattern(s) for `<f-template>` HTML files |
| `--attribute-name-strategy` | `camelCase` | How to map attribute names to properties |
| `--config` | `fast-build.config.json` | Path to a configuration file |

### Example

**`entry.html`:**

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>My App</title></head>
<body>
    <greeting-card title="{{title}}" message="{{message}}"></greeting-card>
    <script type="module" src="./main.ts"></script>
</body>
</html>
```

**`state.json`:**

```json
{
    "title": "Hello FAST",
    "message": "Server-rendered with WebAssembly"
}
```

**`templates.html`:**

```html
<f-template name="greeting-card">
    <template>
        <h2>{{title}}</h2>
        <p>{{message}}</p>
    </template>
</f-template>
```

Run the build:

```shell
fast build \
    --entry=entry.html \
    --state=state.json \
    --output=index.html \
    --templates=templates.html
```

The output (`index.html`) contains the fully resolved HTML with Declarative Shadow DOM and hydration markers.

### Large build-time renders

FAST Build discovers opening tags and bindings in a forward scan, avoiding
repeated remaining-suffix searches when an entry contains many adjacent custom
elements or plain tags. This optimization preserves rendered bytes and both
the default hydration markers and the opt-in `markers_v2` format; existing
callers need no changes.

The WASM renderer is still synchronous. `--stream` writes precomputed chunks,
not incrementally generated output, so it does not unblock the Node event loop
or reduce time to the first chunk. Contributors can compare native and packaged
WASM workloads using the
[FAST Build benchmark guide](https://github.com/microsoft/fast/blob/main/crates/microsoft-fast-build/benchmark-baselines/README.md).

### Configuration File

Instead of passing every option on the command line, create a `fast-build.config.json`:

```json
{
    "entry": "entry.html",
    "state": "state.json",
    "output": "index.html",
    "templates": "./components/**/*.html"
}
```

The CLI automatically loads `fast-build.config.json` from the current directory when it exists. CLI arguments always take precedence over config file values. File paths in the config are resolved relative to the config file's directory.

### Attribute Name Strategy

The `--attribute-name-strategy` option controls how HTML attribute names on custom elements map to state property names:

| Strategy | Behavior | Example |
|---|---|---|
| `camelCase` (default) | Dashes converted to camelCase | `foo-bar` → `{{fooBar}}` |
| `none` | Dashes preserved | `foo-bar` → `{{foo-bar}}` |

```shell
fast build --attribute-name-strategy=none --templates="./components/**/*.html"
```

:::important
The attribute name strategy must match between the server-side build and the client-side `attributeMap` configuration. If the build uses `--attribute-name-strategy=none`, import `attributeMap` from `@microsoft/fast-element/attribute-map.js` and configure the client with `attributeMap({ "attribute-name-strategy": "none" })`. Existing declarative imports remain supported.
:::

## Troubleshooting Hydration

Hydration succeeds when the HTML produced by the server matches the template and
data that the client runtime sees during the element's first render. If hydration
does not run, FAST renders client-side. If hydration starts and detects a
recoverable mismatch — empty `render()` view boundaries, or a `repeat()` whose
SSR item count disagrees with the client array — it silently reconciles by
falling back to the client view or by creating/removing the affected items so
the page is correct after first paint. If the mismatch cannot be reconciled
(structural binding-target mismatch, malformed markers, modified DOM) FAST
throws either `HydrationBindingError` or `HydrationTargetElementError`. By
default the thrown error carries a one-line message pointing at the opt-in
`hydrationDebugger()`; install the debugger to get an "Expected … / Received …"
report with the SSR HTML snippet at the mismatch.

### Call `enableHydration()` before elements connect

Hydration is opt-in. Call `enableHydration()` before FAST elements are defined or
connected so the controller can install the hydration hook before the first
render.

```ts
import { enableHydration } from "@microsoft/fast-element/hydration.js";

enableHydration();
await import("./components.js");
```

If a prerendered element connects before `enableHydration()` runs, the existing
shadow root is treated as client-render fallback: `isPrerendered` resolves
`true`, `isHydrated` resolves `false`, and FAST replaces the prerendered content
with a client-rendered view. Calling `enableHydration()` later does not hydrate
elements that already completed their first render.

### Opt in to rich mismatch diagnostics with `hydrationDebugger()`

Pass `hydrationDebugger()` through `enableHydration` to swap the default
one-line "install hydrationDebugger" error message for a rich
"Expected / Received" formatter with the SSR HTML snippet, plus structured
`expected` and `received` fields on `HydrationBindingError` and
`HydrationTargetElementError`. The debugger module is tree-shaken out of
production hydration bundles unless you import it, so the rich diagnostic
helpers only land in builds that opt in.

```ts
import { enableHydration, hydrationDebugger } from "@microsoft/fast-element/hydration.js";

enableHydration({ debugger: hydrationDebugger() });
```

With the debugger installed, an unrecoverable mismatch produces output such as:

```
Hydration mismatch in <my-element>.
  Expected: <span> with content binding
  Received: <span>server</span>
```

Both errors also expose `error.expected` and `error.received` so devtools and
bug-report templates can read the structured description without parsing the
message string.

### Keep renderer and client versions in sync

The renderer and client both rely on the same depth-first binding order and the
same marker syntax. Use matching FAST Element v3 versions of
`@microsoft/fast-build` and `@microsoft/fast-element`, and deploy server and
client updates together. Version skew can produce errors such as
`HydrationTargetElementError` or `HydrationBindingError` because the client
expects a different set or order of binding targets than the server emitted.
Use `hydrationDebugger()` (above) to see exactly which binding the renderer and
client disagree on.

### Check hydration markers

FAST markers are intentionally data-free and sequential:

| Marker | Purpose |
|---|---|
| `data-fe="N"` | `N` attribute, boolean, property, event, or directive bindings target the element |
| `<!--fe:b-->...<!--fe:/b-->` | Content binding boundaries |
| `<!--fe:r-->...<!--fe:/r-->` | One repeated item |
| `<!--fe:e-->...<!--fe:/e-->` | Nested custom element boundary |

Do not minify or sanitize away FAST comments or `data-fe` attributes before the
client loads. A missing `fe:/b` marker, an invalid `data-fe` count, or a changed
DOM shape means the hydration walker cannot target the compiled bindings.

### `repeat()` reconciles repeat-count mismatches automatically

Repeated views are hydrated by pairing existing `fe:r` ranges with the client's
initial array items by index. `repeat()` does not require the SSR and client
counts to match for the first bind: it hydrates the overlapping prefix, calls
`template.create()` to fill in missing items past the SSR ranges, and removes
extra SSR ranges past the client item count.

Range discovery is a forward, balanced scan within that repeat's own content
boundary, so adjacent repeats cannot consume one another's ranges. Nested markers
are retained for child hydration, including empty items. Unmatched start or end
markers are malformed SSR and throw even when the client array is empty; they
are not treated as a recoverable item-count mismatch.

```html
<!-- one server-rendered repeat item -->
<!--fe:r--><li>One</li><!--fe:/r-->
```

```ts
// Client may start with more items than the server rendered.
items = ["One", "Two", "Three"];
```

The hydrated DOM ends with `<li>One</li><li>Two</li><li>Three</li>` — the SSR
item is reused, and the extra two items are created client-side. The mirror
case (server rendered more items than the client has) trims the orphan ranges.
After hydration, normal repeat updates can add, remove, or reorder items.

If a non-recoverable repeat-marker problem occurs (missing `fe:r` / `fe:/r`,
unbalanced depth), hydration still throws a structured error pointing at the
offending marker.

### Resolve declarative templates before upgrade

`declarativeTemplate()` waits for one connected `<f-template>` whose `name`
matches the element definition. Template-first and definition-first loading both
work, but custom element registration completes only after the matching template
is available.

```html
<f-template name="user-card">
    <template><p>{{name}}</p></template>
</f-template>
```

```ts
class UserCard extends FASTElement {}

UserCard.define({
    name: "user-card",
    template: declarativeTemplate(),
});
```

If the `<f-template>` is inserted late, renamed, or reconnected later, the define
promise waits until it can publish the template. Keep the prerendered DOM
unchanged while waiting, and avoid duplicate connected `<f-template>` elements
with the same name.

### Understand recovery, fallback, and hydration errors

FAST uses the client-render path when no prerendered shadow root is present,
hydration was not enabled in time, or the template is not hydratable. In this
path the controller clears stale prerendered content before rendering the client
view.

When hydration is enabled and a prerendered element connects, FAST may:

- **Hydrate cleanly** — SSR and client agree; the existing DOM is bound in
  place.
- **Recover silently** — a `render()` directive's SSR view boundary is empty,
  or a `repeat()` directive's SSR item count disagrees with the client array.
  FAST creates / removes the affected views so the final DOM matches the
  client template. No console output is emitted; observe the post-hydration
  DOM (or `isHydrated`) to confirm.
- **Throw a hydration error** — for unrecoverable mismatches: a binding
  factory's target node is missing from the SSR DOM, an attribute binding
  count overflows, or a marker is malformed. Install `hydrationDebugger()`
  (above) to see what the runtime expected and what the SSR DOM produced.

Common causes of unrecoverable errors:

- The server and client templates are not identical.
- FAST markers were removed or corrupted (minifier, sanitizer, intermediate
  HTML processor).
- Script or third-party code modified the shadow DOM before hydration.

### Inspect `isPrerendered` and `isHydrated`

Use the controller promises to distinguish SSR, hydration, and fallback in
diagnostics or tests.

```ts
const controller = element.$fastController;
const [isPrerendered, isHydrated] = await Promise.all([
    controller.isPrerendered,
    controller.isHydrated,
]);

if (isPrerendered && !isHydrated) {
    console.warn("Prerendered content fell back to client rendering.");
}
```

`isPrerendered` resolves `true` when the element had a declarative shadow root at
connect time. `isHydrated` resolves `true` only when FAST successfully reused the
existing DOM.

## Writing Components for SSR

When designing components for server-side rendering, keep these guidelines in mind:

- **Minimize JavaScript-dependent styling.** Prefer CSS-based state (`:host` attributes, CSS custom properties) over `elementInternals` state for initial styles, since the server cannot run JavaScript.
- **Use `@attr` for initial state.** Attributes are visible to the server and can be rendered into the initial HTML. Observable properties set in `connectedCallback` are not available during server rendering.
- **Keep templates self-contained.** Templates should produce meaningful content from attribute values alone without requiring imperative setup.
- **Test both paths.** Verify that components work correctly with both client-side rendering (no pre-rendered content) and server-side rendering (hydration path).

{% endraw %}
