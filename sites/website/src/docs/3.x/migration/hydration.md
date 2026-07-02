---
id: migration-hydration
title: Hydration and SSR Migration
layout: 3x
eleventyNavigation:
  key: migration-hydration3x
  parent: migration3x
  title: Hydration and SSR
  order: 2
navigationOptions:
  activeKey: migration-hydration3x
keywords:
  - migrate
  - migration
  - hydration
  - SSR
  - fast-ssr
---

# Hydration and SSR migration

Use this add-on path after the core migration if your v2 application
server-rendered FAST components, used `@microsoft/fast-ssr`, emitted FAST
hydration markers, imported hydration side-effect helpers, or inspected
hydration controller APIs. Complete the
[core migration](/docs/3.x/migration/core/) first, then update the SSR and
hydration pipeline so the server output and browser runtime agree.

## What changed

FAST Element 3.x keeps the client runtime browser-only and makes hydration
explicit. The server can still emit HTML and Declarative Shadow DOM, but the
browser `Window` defines custom elements, runs `enableHydration()`, and attaches
bindings to the existing DOM.

Key migration points:

1. Hydration is opt-in with `enableHydration()`.
2. `HydratableElementController` and hydration side-effect imports are removed.
3. `needs-hydration` and `defer-hydration` are no longer required in rendered
   markup.
4. Hydration callbacks are replaced by hydration promises.
5. SSR hydration marker syntax changed; server and client FAST versions must
   match.

## Install hydration explicitly

The `HydratableElementController` class has been removed. Its functionality is
now built into `ElementController` through automatic prerendered content
detection. When a component connects with an existing shadow root from SSR or
Declarative Shadow DOM, FAST can hydrate the existing DOM if hydration was
enabled before the element connects.

```ts
// Before
import { HydratableElementController } from "@microsoft/fast-element";

HydratableElementController.install();
```

```ts
// After
import { enableHydration } from "@microsoft/fast-element/hydration.js";

enableHydration();
```

Remove these side-effect imports:

| Removed import | Replacement |
|---|---|
| `@microsoft/fast-element/install-element-hydration.js` | No side-effect import. Call `enableHydration()` before FAST elements connect. |
| `@microsoft/fast-element/install-hydration.js` | No side-effect import. Call `enableHydration()` before FAST elements connect. |
| `@microsoft/fast-element/install-hydratable-view-templates.js` | No side-effect import. `enableHydration()` installs hydratable template support. |

Call `enableHydration()` before defining or connecting FAST elements.

```ts
import { enableHydration } from "@microsoft/fast-element/hydration.js";

const hydration = enableHydration();
await import("./components.js");
await hydration.whenHydrated();
```

If a prerendered element connects before `enableHydration()` runs, the existing
shadow root is treated as client-render fallback: `isPrerendered` resolves
`true`, `isHydrated` resolves `false`, and FAST replaces the prerendered content
with a client-rendered view. Calling `enableHydration()` later does not hydrate
elements that already completed their first render.

## Remove legacy hydration attributes

`needs-hydration` and `defer-hydration` are no longer needed in server-rendered
markup. Existing shadow root detection determines whether the element was
prerendered.

```html
<!-- Before -->
<my-component defer-hydration needs-hydration text="Hello">
    <template shadowrootmode="open">...</template>
</my-component>
```

```html
<!-- After -->
<my-component text="Hello">
    <template shadowrootmode="open">...</template>
</my-component>
```

The root `deferHydrationAttribute` export has also moved. Most applications can
remove `defer-hydration` entirely. If compatibility code still needs the legacy
attribute string, import it from the hydration path export.

```ts
import { deferHydrationAttribute } from "@microsoft/fast-element/hydration.js";
```

## Replace hydration callbacks with promises

`HydrationControllerCallbacks` has been replaced by the controller returned from
`enableHydration()`.

```ts
// Before
import { HydratableElementController } from "@microsoft/fast-element";

HydratableElementController.config({
    /* hydration callbacks */
});
```

```ts
// After
import { enableHydration } from "@microsoft/fast-element/hydration.js";

const hydration = enableHydration();
await hydration.whenHydrated();
```

Use `hydration.whenHydrated("my-element")` when application code needs to wait
for hydration work associated with a specific tag name. Use
`hydration.whenHydrated()` for the active global hydration batch. When
`stopHydration: StopHydration.never` is configured, the global promise
intentionally remains pending because hydration never reaches a global
completion point.

## Use the split prerender and hydration state

The `isPrerendered` property on `ElementController` and `ViewController` now
resolves `true` when the element had Declarative Shadow DOM at connect time,
regardless of whether hydration ran. The `isHydrated` property resolves `true`
only when hydration actually ran successfully.

```ts
async connectedCallback() {
    super.connectedCallback();

    const prerendered = await this.$fastController.isPrerendered;
    const hydrated = await this.$fastController.isHydrated;

    if (prerendered && !hydrated) {
        // The element had SSR content but hydration was not enabled in time.
    }
}
```

Replace `element.$fastController instanceof HydratableElementController` checks
with the `isPrerendered` and `isHydrated` promises.

## Update SSR output markers

The SSR hydration markers have been simplified from verbose, index-embedded
comments to compact sequential markers. This is a breaking change to the SSR
output format. SSR and client versions must match.

| Old format | New format |
|---|---|
| `fe-b$$start$$<index>$$<scopeId>$$fe-b` | `fe:b` |
| `fe-b$$end$$<index>$$<scopeId>$$fe-b` | `fe:/b` |
| `fe-repeat$$start$$<itemIndex>$$fe-repeat` | `fe:r` |
| `fe-repeat$$end$$<itemIndex>$$fe-repeat` | `fe:/r` |
| `fe-eb$$start$$<elementId>$$fe-eb` | `fe:e` |
| `fe-eb$$end$$<elementId>$$fe-eb` | `fe:/e` |
| `data-fe-b="0 1 2"` / `data-fe-b-0` / `data-fe-c-0-3` | `data-fe="N"` |

The `HydrationMarkup` API methods have also changed.

| Removed or changed API | Replacement |
|---|---|
| `HydrationMarkup.contentBindingStartMarker(index, scopeId)` | `HydrationMarkup.contentBindingStartMarker()` |
| `HydrationMarkup.contentBindingEndMarker(index, scopeId)` | `HydrationMarkup.contentBindingEndMarker()` |
| `HydrationMarkup.parseAttributeBinding(element)` | `HydrationMarkup.parseAttributeBindingCount(element)` |
| `HydrationMarkup.parseRepeatStartMarker(data)` | `HydrationMarkup.isRepeatViewStartMarker(data)` |
| `HydrationMarkup.parseRepeatEndMarker(data)` | `HydrationMarkup.isRepeatViewEndMarker(data)` |
| `HydrationMarkup.parseElementBoundaryStartMarker(content)` | `HydrationMarkup.isElementBoundaryStartMarker(node)` |
| `HydrationMarkup.parseElementBoundaryEndMarker(content)` | `HydrationMarkup.isElementBoundaryEndMarker(node)` |

If you used `@microsoft/fast-ssr` or custom SSR tooling, update the renderer to emit the
new marker format before loading the v3 client. If you use `@microsoft/fast-build`,
upgrade it with `@microsoft/fast-element` and rebuild the output.

## Keep renderer and client versions in sync

Hydration succeeds when the HTML produced by the server matches the template and
data that the client runtime sees during the element's first render. The
renderer and client both rely on the same depth-first binding order and marker
syntax. Deploy server-rendered output and client bundles together so old marker
output is not hydrated by the v3 client, and the v3 marker output is not loaded
with an older client.

Do not minify or sanitize away FAST comments or `data-fe` attributes before the
client loads. A missing `fe:/b` marker, an invalid `data-fe` count, or a changed
DOM shape means the hydration walker cannot target the compiled bindings.

## Troubleshooting hydration

If hydration does not run, FAST renders client-side. If hydration starts and
detects a recoverable mismatch, such as empty `render()` view boundaries or a
`repeat()` whose SSR item count disagrees with the client array, it reconciles by
falling back to the client view or by creating/removing the affected items. If
the mismatch cannot be reconciled, FAST throws either `HydrationBindingError` or
`HydrationTargetElementError`.

Pass `hydrationDebugger()` through `enableHydration()` to replace the default
one-line mismatch message with an "Expected / Received" report and structured
`expected` and `received` fields.

```ts
import {
    enableHydration,
    hydrationDebugger,
} from "@microsoft/fast-element/hydration.js";

enableHydration({ debugger: hydrationDebugger() });
```

With the debugger installed, an unrecoverable mismatch produces output such as:

```text
Hydration mismatch in <my-element>.
  Expected: <span> with content binding
  Received: <span>server</span>
```

## Hydration exports added in 3.x

| Export | Package | Description |
|---|---|---|
| `enableHydration()` | `@microsoft/fast-element/hydration.js` | Enables hydration support for FAST elements. |
| `deferHydrationAttribute` | `@microsoft/fast-element/hydration.js` | Legacy `defer-hydration` attribute string for compatibility code. |
| `HydrationTracker` | `@microsoft/fast-element/hydration.js` | Standalone hydration lifecycle tracker class. |
| `HydrationOptions` | `@microsoft/fast-element/hydration.js` | Type for hydration configuration options. |

## Migration checklist

1. Remove `HydratableElementController.install()` and
   `HydratableElementController.config()` usage.
2. Remove hydration side-effect imports.
3. Call `enableHydration()` before FAST elements connect.
4. Replace hydration callbacks with `whenHydrated()` waits.
5. Replace prerender checks with `isPrerendered` and `isHydrated`.
6. Remove `needs-hydration` and `defer-hydration` from SSR markup unless
   compatibility code still explicitly needs the legacy attribute string.
7. Update `@microsoft/fast-ssr`, `@microsoft/fast-build`, or custom SSR output to the v3
   hydration marker format.
8. Deploy matching renderer and client versions.
