---
id: form-associated
title: Form-Associated Custom Elements
layout: 3x
eleventyNavigation:
  key: form-associated3x
  parent: advanced3x
  title: Form-Associated Custom Elements
navigationOptions:
  activeKey: form-associated3x
description: Participate in HTML forms from a FASTElement using ElementInternals.
keywords:
  - form
  - form-associated
  - ElementInternals
  - attachInternals
  - setFormValue
  - validation
---

# Form-Associated Custom Elements

A form-associated custom element participates in an HTML `<form>` the way a native `<input>` does: it contributes a value to `FormData`, it is reset by `form.reset()`, it can be disabled by an ancestor `<fieldset>`, and it can block submission with a validation message.

## There is no `FormAssociated` mixin

If you have found an older page — or an AI answer — recommending this, it will not compile:

```ts
// Does NOT exist. `@microsoft/fast-foundation` was removed.
import { FormAssociated } from "@microsoft/fast-foundation";

class MyField extends FormAssociated(FASTElement) {}
```

FAST no longer ships a form-association mixin. Browsers now provide the capability natively through [`ElementInternals`](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals), and `FASTElement` extends `HTMLElement`, so you use the platform API directly. There is nothing FAST-specific to import.

## The recipe

```ts
import { attr, FASTElement } from "@microsoft/fast-element";

export class MyField extends FASTElement {
    static formAssociated = true;

    // Must be declared BEFORE any @attr/observable field whose changed
    // callback touches it. See "Declare #internals first" below.
    #internals: ElementInternals = this.attachInternals();

    @attr value: string = "";

    valueChanged(prev: string, next: string) {
        this.#internals.setFormValue(next ?? "");
    }
}
```

```html
<form>
  <my-field name="email"></my-field>
</form>
```

That is the whole thing. Three details are load-bearing:

**`static formAssociated = true`.** Without it `attachInternals()` still succeeds, so nothing looks wrong until the first `setFormValue()` call throws `NotSupportedError`.

**A private `#internals` field, declared first.** Ordering is not stylistic here — getting it wrong kills the element, and "fixing" that with an `?.` guard just trades the crash for a silently empty form field. See the next section.

**A `name` attribute on the element.** Without one it contributes nothing to `FormData`, silently.

:::tip
Prefer `#internals` over a public `internals` property. On every `connect()` the element controller runs `captureBoundObservables()`, which walks `Object.getOwnPropertyNames(element)` and, for each own property, searches the whole prototype chain for a matching accessor. A public `internals` field never has one, so the search runs to the end of the chain and finds nothing — one wasted full-prototype-chain walk, per connect, forever, including every item in a `repeat` and every recycled view. A `#private` field is not an own property at all, so it costs nothing. If callers genuinely need access, expose a `get internals()` accessor rather than a public field; a prototype accessor is not an own property either.
:::

## Declare `#internals` first

This is the mistake that will cost you an afternoon, and the "obvious" defence against it — an `?.` guard — does not actually fix it.

FAST's supported TypeScript configuration sets `useDefineForClassFields: false` (this is [required when you use decorators](/docs/3.x/getting-started/quick-start/)). Under those semantics a class field initializer *assigns through* the accessor rather than defining a new property, so `value = ""` compiles to `this.value = ""` inside the constructor — which fires `valueChanged` **during construction**, in field-declaration order.

So if `#internals` is declared *after* `value`, the first `valueChanged` runs before `#internals` has been assigned:

```ts
export class Broken extends FASTElement {
    static formAssociated = true;

    @attr value: string = "hello";

    valueChanged(prev: string, next: string) {
        this.#internals.setFormValue(next ?? ""); // #internals is not set yet
    }

    #internals: ElementInternals = this.attachInternals(); // too late
}
```

This element is **dead** — not degraded. `AttributeDefinition.setValue()` invokes your changed callback with no `try`/`catch`, so the error escapes the constructor and the custom-element upgrade fails. The element never connects, never renders its template, and contributes nothing to `FormData`. You get an uncaught error in the console:

```
Uncaught TypeError: Cannot read properties of undefined (reading 'setFormValue')
```

(On a `target` below `ES2022`, where `#private` compiles down to a `WeakMap`, the same mistake reads `Cannot read private member from an object whose class did not declare it` instead. Same outcome.)

Move `#internals` above the observable fields and the problem disappears at the root: by the time any changed callback can fire, `#internals` holds a real `ElementInternals`. No guard and no `connectedCallback` re-sync are needed — the initial value reaches `FormData` on its own, whether it comes from the field default, from a `value` attribute in markup, or from an element you create and append at runtime.

### An `?.` guard is not a fix

Reaching for `this.#internals?.setFormValue(...)` changes the *symptom* rather than the cause, and which symptom you get depends on your `target`:

| `target` | `#internals` compiles to | `?.` guard, `#internals` declared last |
| --- | --- | --- |
| `ES2022` and above | a native `#private` field | The element **survives**. TypeScript keeps the `#internals;` declaration in the class body, so the field is installed as `undefined` before the constructor body runs, and `?.` short-circuits. But the initial `setFormValue()` never happens: the element renders, looks fine, and is **silently absent from `FormData`** — much harder to spot than a crash. |
| `ES2021` and below | a `WeakMap` (`__classPrivateFieldGet`) | The element still **dies**. Reading a private field that has not been installed yet *throws* inside the helper, before the optional chain is ever evaluated: `Uncaught TypeError: Cannot read private member from an object whose class did not declare it`. |

:::warning
Declaration order is the fix under every `target`. The guard is not: at best it converts a loud crash into silent data loss. Reserve `?.` for the case where `#internals` is *genuinely* optional — see [Browser support](#browser-support) below.
:::

:::note
Under ES2022 `[[Define]]` semantics (`useDefineForClassFields: true` — not supported with FAST's decorators) the field is *defined* rather than *set*, so `valueChanged` does not fire in the constructor at all; `captureBoundObservables()` / `bindObservables()` replay it during `connect()`, by which time `#internals` exists either way. Declaring `#internals` first is correct under all of these, so just always do it.
:::

If you override `connectedCallback` for other reasons, remember to call `super.connectedCallback()` — it is what drives `$fastController.connect()`, and omitting it leaves the element unbound and unrendered.

## You must set a `name` attribute

An element with no `name` contributes **nothing** to `FormData`, no matter how many times you call `setFormValue()`. There is no warning; the key is simply absent.

```html
<form>
  <my-field name="email"></my-field>  <!-- submitted as "email" -->
  <my-field></my-field>               <!-- submitted as nothing at all -->
</form>
```

## Browser support

`attachInternals()` in a field initializer runs at **construction**, so on an engine without it the class cannot be constructed at all — the failure is not a missing feature, it is a dead element. Safari only shipped form-associated `ElementInternals` in 16.4.

```ts
const supportsElementInternals =
    "attachInternals" in HTMLElement.prototype &&
    "setFormValue" in (globalThis.ElementInternals?.prototype ?? {});
```

If you must support older engines, attach conditionally and degrade rather than calling `attachInternals()` unconditionally:

```ts
export class MyField extends FASTElement {
    static formAssociated = true;

    // Still declared BEFORE any observable field, so it is assigned before the
    // callback below can run — but it may legitimately hold no value.
    #internals?: ElementInternals = supportsElementInternals
        ? this.attachInternals()
        : undefined;

    @attr value: string = "";

    valueChanged(prev: string, next: string) {
        // `?.` is correct HERE: the field is assigned, the value may be undefined.
        this.#internals?.setFormValue(next ?? "");
    }
}
```

This is the one place the `?.` guard earns its keep: it guards a value that is genuinely optional, on a field that is still declared first. It is not a substitute for declaration order — an element that reaches `valueChanged` before `#internals` is assigned is broken whether or not you guard it.

## Form lifecycle callbacks

The platform calls these on your element when `static formAssociated = true`.

```ts
export class MyField extends FASTElement {
    static formAssociated = true;

    #internals: ElementInternals = this.attachInternals();

    @attr value: string = "";
    @attr({ mode: "boolean" }) disabled: boolean = false;

    formResetCallback() {
        // Reset your own property too — setFormValue() alone does not do it.
        this.value = "";
        this.#internals.setFormValue("");
    }

    formDisabledCallback(disabled: boolean) {
        // Also fires when an ancestor <fieldset> is disabled, not just this element.
        this.disabled = disabled;
    }

    // `state` is narrowed to `string` because this element's value is a string.
    // The platform signature is `File | string | FormData` — see the note below.
    formStateRestoreCallback(state: string, mode: "restore" | "autocomplete") {
        this.value = state;
    }
}
```

:::warning
`formStateRestoreCallback` fires on bfcache restore and autofill — **not** on an ordinary page load. Do not put first-render logic in it; it will not run.
:::

:::note
The platform passes `state` as `File | string | FormData` — whatever you handed to `setFormValue()`. The signature above narrows it to `string` because this element only ever sets a string. If your element can call `setFormValue()` with a `File` or a `FormData` (or you pass a separate state value as `setFormValue()`'s second argument), type `state` as the full union and narrow it yourself; TypeScript cannot check this callback for you, because custom-element form callbacks are not part of `lib.dom`.
:::

## Validation

```ts
invalidate() {
    this.#internals.setValidity(
        { valueMissing: true },
        "Please fill in this field.",
        this.anchor, // required, or the message never surfaces to the user
    );
}

clear() {
    this.#internals.setValidity({}); // valid again
}
```

An invalid element blocks `form.checkValidity()` and submission. The custom message only appears if you pass an **anchor** element for the browser to point the bubble at.

## Checkbox-shaped controls

For a control that should disappear from the submission when it is off, pass `null` — not `undefined`, and not `""`.

```ts
checkedChanged() {
    // null removes the entry from FormData entirely; "" submits an empty value.
    this.#internals.setFormValue(this.checked ? this.value ?? "on" : null);
}
```

## Prerendering and hydration

FAST 3.x has a [prerender-and-hydrate story](/docs/3.x/declarative-templates/server-rendering/) (see `examples/ssr/webui-todo-app`, which prerenders with `@microsoft/webui` via `--plugin=fast`, and the `defer-hydration` attribute in `@microsoft/fast-element/hydration.js`).

The `webui` FAST plugin prerenders from your **declarative HTML templates** and state — it does not evaluate or construct your element classes in Node — so a form-associated element with `attachInternals()` in a field initializer prerenders without trouble. The class is only ever constructed in the browser, during hydration.

:::note
The general caution still applies to any pipeline that *does* construct element classes outside a real DOM: because `attachInternals()` in a field initializer runs at construction, such a build will throw and brick the class entirely — not merely lose form association. In that case, attach lazily rather than in a field initializer.
:::

## `connect()` can run more than once

`connect()` runs again every time the element is removed from the DOM and re-inserted — a `repeat` reordering its items, a `when` toggling a branch, or the element being moved between containers. Your `connectedCallback` override runs again on each of those, so keep it idempotent.

`ElementController` also re-connects the element if the definition's `template` is reassigned after registration: it rebuilds the controller and re-renders the view. That path calls `$fastController.connect()` directly rather than going through the element, so it does **not** re-invoke your `connectedCallback`.

Neither path re-fires `valueChanged`. A changed callback is replayed during `connect()` only for a property that was set on the *instance* before it upgraded: `captureBoundObservables()` collects own properties that shadow a prototype accessor, and `bindObservables()` assigns them back through the accessor exactly once. Under FAST's supported `useDefineForClassFields: false`, `value` never becomes an own property — the assignment goes straight through the `@attr` accessor to its `_value` backing store — so there is nothing to replay on a later connect.

What *does* call `valueChanged` over and over is ordinary use: every property or attribute set, including a `repeat` binding a recycled element to fresh data. `setFormValue()` is idempotent, so the recipe above is safe, but keep any logic you add to `valueChanged` idempotent too. In particular, do not `$emit()` a change event from `valueChanged` without a guard, or you will emit one on every rebind.

## `define()` is asynchronous

`FASTElement.define()` returns a `Promise`. Composition is async, and a promise-like template is awaited before the element is registered. Code that constructs the element immediately after calling `define()` will get an un-upgraded element with no `#internals`:

```ts
// `define()` resolves with the class, once the element is actually registered.
await MyField.define({ name: "my-field" });

document.body.appendChild(document.createElement("my-field"));
```

## Subclassing

`attachInternals()` throws `NotSupportedError` if it is called twice on the same element. If you subclass a form-associated element, do not redeclare the internals field — inherit it. Using a `#private` field helps here: it is not visible to subclasses, so it is harder to shadow by accident.
