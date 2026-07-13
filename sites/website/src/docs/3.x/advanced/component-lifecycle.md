---
id: component-lifecycle
title: Component Lifecycle
layout: 3x
eleventyNavigation:
  key: component-lifecycle3x
  parent: advanced3x
  title: Component Lifecycle
navigationOptions:
  activeKey: component-lifecycle3x
description: How a FASTElement is constructed, upgraded and connected, when attribute changed callbacks fire, and what is safe to touch at each point.
keywords:
  - lifecycle
  - connectedCallback
  - attributeChangedCallback
  - attr
  - changed handler
  - hydration
---

# Component Lifecycle

The [`FASTElement`](../../getting-started/fast-element/) page lists the lifecycle callbacks. This page is about the parts that surprise people: how many times a `@attr` changed callback runs before your component is even connected, what its `oldValue` actually is, and what is safe to touch at each stage.

## Prerequisite: `useDefineForClassFields`

Everything on this page assumes the compiler settings from the [Quick Start](../../getting-started/quick-start/). In particular `useDefineForClassFields` must be `false`. FAST's property decorators install accessors on the prototype and rely on field-assignment semantics; with `useDefineForClassFields: true` a class field defines an *own* property that shadows the accessor, and a default value ends up clobbering the value that came from the tag.

## Two callbacks, two contracts

An element that declares `@attr foo` has two different callbacks in play, and they do not agree on `oldValue`.

```ts
export class MyElement extends FASTElement {
  @attr foo?: string;

  // The native custom element callback. `oldValue` is `null` on the first call.
  // Values are raw attribute strings.
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  // FAST's changed callback for `foo`. The first `oldValue` is `undefined`.
  // Values have already been through the converter.
  fooChanged(oldValue: string | undefined, newValue: string) {}
}
```

For a *single* mutation on a *single* element — say the parser reading `<my-element foo="tag">` — the native callback receives `("foo", null, "tag")` while `fooChanged` receives `(undefined, "tag")`.

They differ because they read different things. FAST forwards only the *new* value to the attribute definition; the definition then re-derives `oldValue` by reading the property's backing field, which starts out `undefined` because nothing has written it yet. The native callback's `null` never reaches your changed callback.

:::important
`if (oldValue !== null)` does **not** guard the first call of a changed callback. The first `oldValue` is `undefined`. Use `if (oldValue !== undefined)`, or better, do not guard on `oldValue` at all — write a changed callback that is correct for every value it can receive.
:::

### When `null` *can* show up

`null` is never the *first* `oldValue`, but whether it appears later depends entirely on the attribute's mode and converter:

| Mode | `removeAttribute()` gives your changed callback |
| --- | --- |
| `reflect` / `fromView`, no converter | `(previousValue, null)` — `null` is real |
| `mode: "boolean"` | `(true, false)` — the platform's `null` is mapped to `false` before it reaches you; you never see `null` |
| custom converter | whatever your `fromView` returns for `null` |

So a `null` check is not merely useless — it is wrong in two different directions depending on the mode you chose.

## How many times does my changed callback run?

There are three points at which FAST can push a value through a `@attr` accessor, and therefore three points at which your changed callback can fire before you have done anything:

1. **Construction** — a default value assigned in the constructor (or as a class field, which compiles to the same assignment) goes *through* the accessor.
2. **Upgrade / parse** — the attribute present on the tag arrives via the native `attributeChangedCallback`.
3. **Connect** — `connectedCallback` replays properties that were set on the element *before* it was upgraded, and synchronizes late-registered attributes.

Which combination applies depends on where the value comes from:

| Setup | Calls | Sequence |
| --- | --- | --- |
| No default, attribute absent | 0 | — |
| Default value only | 1 | `(undefined, default)` at construction |
| Attribute on the tag only | 1 | `(undefined, tagValue)` at upgrade |
| Default value **and** attribute on the tag | 2 | `(undefined, default)`, then `(default, tagValue)` — **the tag wins** |
| Attribute on the tag **and** property set before upgrade | 2 | `(undefined, tagValue)`, then `(tagValue, propValue)` — **the property wins**, and it reflects back over the attribute |
| Default **and** attribute **and** pre-upgrade property | 3 | all of the above, in that order |

A few consequences worth spelling out:

- A falsy default is not a silent one. `bool = false` on a `mode: "boolean"` attribute still fires `(undefined, false)`, because `undefined !== false`. If the tag also carries the attribute you get `(undefined, false)` and then `(false, true)`.
- `foo = undefined` fires **zero** times: the accessor compares old and new and both are `undefined`.
- An empty string attribute is not an absent one. `<my-element foo="">` fires `(undefined, "")`.
- For a field you only want to *type*, prefer `declare foo: string;`. A bare `foo: string;` may or may not emit `this.foo = void 0` depending on your compiler, and with a converter that phantom assignment becomes a visible call.

:::note
On a `reflect`-mode attribute, a default value **writes an attribute onto the host** — asynchronously, on the next update tick. Immediately after `document.createElement()` the attribute is still absent; it appears after `await Updates.next()`. Any assertion about attribute state has to await an update first.
:::

## What is ready, and when

**In the constructor.** The constructor body always runs to completion before `connectedCallback`. It cannot be interrupted by connection. What *can* surprise you is:

- The `shadowRoot` exists but is **empty**. The template has not been rendered into it yet.
- Asynchronous work started in the constructor will settle *after* `connectedCallback`, not before it.
- The native `this.isConnected` is not a reliable "am I being constructed?" signal, and its value in the constructor depends on *how the element was created* — not on whether the markup was in the document:

| Creation path | `this.isConnected` in the constructor |
| --- | --- |
| Detached `document.createElement()` | `false` |
| The document parser reaches `<my-element>` and the definition is **already registered** | `false` — the parser constructs the element as it *creates* it, before inserting it |
| An element already in the tree is upgraded by a later `define()` — a late definition, or markup written with `innerHTML` | `true` — the constructor runs as an upgrade reaction, and the element is already in the tree |

The middle row is the one that catches people: an element parsed straight into a connected document reports `isConnected === false` in its constructor whenever its definition was registered eagerly. And in *no* case does `isConnected` tell you that the view exists — the shadow root is still empty.

**In `connectedCallback`, after `super.connectedCallback()`.** For a client-side-rendered element the template has been rendered, styles are applied, and the view is bound. If server-side rendering is in play, see [Hydration](#hydration-and-ssr) below — use `$fastController.isHydrated` rather than assuming.

**In a changed callback.** Assume nothing. It can run at construction time, when the shadow root is empty and the view does not exist.

The controller's own `this.$fastController.isConnected` — *not* the native `this.isConnected` — is the flag that tracks the view: it is `true` only from the end of `connect()`, once the template has been rendered and bound. But be precise about what that buys you, because it is a smaller guarantee than it looks:

**Every one of the initialization firings counted earlier happens while `$fastController.isConnected` is `false`.** The default value and the tag attribute both arrive before `connect()` runs at all, and the pre-upgrade property is replayed while the controller is still *connecting*. FAST does not re-invoke the callback afterwards. So a changed callback that returns early on that guard **drops** the initial value — it does not defer it.

The guard is therefore only half a pattern. The other half is applying the current value in `connectedCallback`:

```ts
export class MyElement extends FASTElement {
  @attr foo?: string;

  connectedCallback() {
    super.connectedCallback();

    // The initialization firings were all dropped by the guard below, so the
    // value the element booted with has to be applied here.
    this.applyFoo();
  }

  fooChanged(oldValue: string | undefined, newValue: string) {
    // Not "wait until connected" - the callback will not run again for this
    // value. Dropped here, applied in connectedCallback above.
    if (!this.$fastController.isConnected) {
      return;
    }

    this.applyFoo();
  }

  private applyFoo() {
    // Safe to read the rendered view here.
  }
}
```

The practical rule: **do not touch shadow DOM content from a changed callback** unless you write both halves. The simpler option is usually to not need them: let the changed callback update only state that your template already binds to, and let the view refresh itself.

## Hydration and SSR

When hydration is enabled and an element arrives with prerendered shadow DOM, FAST binds the existing markup rather than re-rendering it. During that window it deliberately suppresses attribute work: the controller's attribute changed callback is swapped for a no-op, and attribute *bindings* on the view are skipped. Attribute mutations that happen while the prerendered view is being bound therefore do **not** re-enter your changed callback.

Two promises on the controller are the supported way to wait for readiness:

- `this.$fastController.isPrerendered` — resolves `true` if the element had an existing shadow root at connect time.
- `this.$fastController.isHydrated` — resolves `true` once prerendered content has actually been hydrated, `false` for a client-side render.

```ts
export class MyElement extends FASTElement {
  async connectedCallback() {
    super.connectedCallback();

    // Settles for a client-side render and for a hydrated SSR render alike, so
    // this cannot hang, and the view is bound once it settles. It only *resolves
    // true* for hydrated prerendered content - a client-side render resolves
    // `false`. Await it for the timing; do not branch on it expecting `true`.
    await this.$fastController.isHydrated;
  }
}
```

The legacy `defer-hydration` attribute is **not** part of this lifecycle. FAST no longer reads it: nothing in the framework gates connection or hydration on it. The string is still exported as `deferHydrationAttribute` (`@beta`) from `@microsoft/fast-element/hydration.js` for application code that still drives its own deferral (viewport-based hydration, for example), but new server-rendered markup should omit the attribute — see the [hydration migration guide](../../migration-guide/hydration/).

## Do not throw from a changed callback

An exception thrown out of a changed callback is worse than it looks, and how it fails depends on how the value was set:

- **Property path** (`element.foo = "x"`): the exception propagates out of the setter to your call site. You will see it.
- **Attribute path** (`element.setAttribute("foo", "x")`, the parser, upgrade): the exception does **not** reach the caller. It is swallowed by the custom element reaction queue and surfaces only on `window.onerror`.

In both cases the backing field has *already* been written, and the notification to observers is skipped. Every binding and subscriber on that property is left permanently stale — on the attribute path, with no exception at the call site to tell you. Catch inside the changed callback and handle the failure there.

## A note on cost

`connectedCallback` already walks every own property of the element and searches the prototype chain for a matching accessor, so that properties set before upgrade can be replayed through the accessor. That is the mechanism that rescues a pre-upgrade property, and it is the cost that any further "fix the initialization contract in the framework" proposal would be adding to. The contract described on this page is the one to code against, not one to work around.

## Out of scope

Whether an observed property *should* skip its changed callback on the very first assignment is a live design question, and this page deliberately does not answer it. It documents what FAST does today — and `attributes.pw.spec.ts` pins that behavior, so changing it is an explicit, breaking decision rather than an accident.
