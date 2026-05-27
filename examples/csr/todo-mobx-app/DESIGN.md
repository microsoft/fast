# Todo MobX App — Design Overview

This document explains how the example integrates **MobX** with **`@microsoft/fast-element`**, and why the integration needs no custom abstractions on top of either library.

For a user-facing intro and run instructions, see [README.md](./README.md).

---

## Table of contents

1. [The two reactivity systems](#the-two-reactivity-systems)
2. [The integration pattern: one `autorun` per component](#the-integration-pattern-one-autorun-per-component)
3. [Lifecycle and ordering](#lifecycle-and-ordering)
4. [State layer (`src/state/`)](#state-layer-srcstate)
5. [Persistence (`autorun` → `localStorage`)](#persistence-autorun--localstorage)
6. [Component composition](#component-composition)
7. [User input → MobX writeback](#user-input--mobx-writeback)
8. [Known gotchas](#known-gotchas)
9. [Package layout](#package-layout)

---

## The two reactivity systems

FAST and MobX both track property reads to invalidate dependents when state changes, but they do so independently:

| | FAST (`@microsoft/fast-element`) | MobX |
|---|---|---|
| What gets observed | `@attr`, `@observable`, array mutations through FAST's `arrays.ts` patch, and any access wrapped in `Observable.track(source, name)` | Properties touched while a `reaction`, `autorun`, or `computed` is running |
| Subscriber primitive | `ExpressionNotifier` (an internal "watcher" stack — see [`observation/observable.ts`](../../../packages/fast-element/src/observation/observable.ts)) | `Reaction` / `ComputedValue` |
| How a change re-renders | `Observable.notify(source, name)` → bound `ExpressionNotifier`s fire `handleChange` → enqueues an `Updates` task | The reaction's effect function runs synchronously |

There is no direct interop. If a FAST template binding reads a MobX-observable, MobX does not know to notify FAST. If a MobX `reaction` reads a FAST `@observable`, FAST does not know to notify MobX.

This example wires **one direction** for rendering: MobX → FAST. FAST stays the source of truth for DOM updates; MobX stays the source of truth for application state. User input is propagated FAST → MobX through explicit `${prop}Changed` callbacks (see [User input → MobX writeback](#user-input--mobx-writeback)).

---

## The integration pattern: one `autorun` per component

Every component that reads MobX state follows the same three-line pattern.

1. Declare the slices of MobX state the component renders as FAST `@observable` fields, with default initial values.
2. In `connectedCallback`, install a single `autorun(() => { … })` that reassigns those fields from the MobX store.
3. In `disconnectedCallback`, call the disposer returned by `autorun`.

```typescript
import { FASTElement, observable } from "@microsoft/fast-element";
import { autorun } from "mobx";
import { type Todo, type TodoListFilter, todoStore } from "./state/index.js";

export class TodoApp extends FASTElement {
    @observable public items: readonly Todo[] = [];
    @observable public activeFilter: TodoListFilter = "all";

    private _disposer?: () => void;

    public connectedCallback(): void {
        this._disposer = autorun(() => {
            this.items = todoStore.filtered.map(t => ({
                id: t.id,
                description: t.description,
                done: t.done,
            }));
            this.activeFilter = todoStore.activeFilter;
        });
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this._disposer?.();
        this._disposer = undefined;
    }
}
```

### Why this works

- MobX's `autorun` runs the body immediately, registers a subscription on every MobX-observable that was read, and re-runs the body whenever any of those observables changes ([docs](https://mobx.js.org/reactions.html#autorun)).
- Each re-run assigns a fresh value to a FAST `@observable` field. FAST's `@observable` setter compares with `Object.is`, and on a change calls `Observable.notify(this, name)`, which fans out to every bound `ExpressionNotifier` and enqueues a DOM update via `Updates.enqueue`.
- The `.map(...)` in the items mirror does two things at once: it produces a fresh array reference (so FAST always observes the assignment, even when the underlying MobX array reference is stable, e.g. when `activeFilter === "all"`), **and** it reads `t.id`, `t.description`, and `t.done` on every item, making the autorun a subscriber to each of those observables.

### Why no custom decorator

The previous iteration of this example shipped two custom decorators that wrapped getters with `Observable.track` and installed one MobX `reaction` per decorated getter. They were removed because they did not buy anything that this two-line pattern does not already provide:

| Concern | Custom decorators | Inline `autorun` |
|---|---|---|
| Boilerplate per component | One `@mobxObservableProperty` per getter | A `connectedCallback`/`disconnectedCallback` pair |
| New API surface to learn | 2 decorators with their own contract | None — stock APIs from both libraries |
| Bridge code in the repo | ~180 lines | 0 lines |

The inline pattern is functionally equivalent for this app, and is easier for readers who already know both libraries because there is no novel mechanism to understand.

---

## Lifecycle and ordering

`autorun` is called **before** `super.connectedCallback()`. This matters because:

- `autorun` runs its body synchronously the first time. The body assigns FAST `@observable` fields. At that point no template has bound to those fields yet, so no `Observable.notify` fans out — the assignments simply update the stored values.
- `super.connectedCallback()` then runs, FAST's controller creates and activates the view, and each binding evaluates against the now-correct field values. The first paint has no flicker.

On disconnect the order is reversed: `super.disconnectedCallback()` runs first (the view tears down), then the disposer runs (the MobX subscription is released). No reaction outlives the element.

---

## State layer (`src/state/`)

`TodoStore` (in [`todo-store.ts`](./src/state/todo-store.ts)) is a plain class made reactive with `makeAutoObservable(this)`. That call automatically annotates:

- Class fields (`todos`, `activeFilter`) as `observable`.
- `get` accessors (`filtered`, `activeCount`, `completedCount`, `total`, `allCompleted`) as `computed` (cached while observed; recomputed only when their MobX dependencies change).
- Regular methods (`add`, `remove`, `removeById`, `toggle`, `toggleById`, `toggleAll`, `clearCompleted`, `setFilter`, `hydrate`) as `action` (so mutations are batched).

The id-based variants (`toggleById`, `removeById`) exist for direct use from template handlers, where the bound iteration item is a plain snapshot rather than the live MobX observable. They look up the real todo by id and mutate it through the same path as their non-`ById` counterparts.

`hydrate(snapshot)` accepts both an array of todos (legacy shape) and `{ todos, activeFilter }`. It validates entries before assigning so corrupted `localStorage` payloads cannot poison the store.

The module exports a singleton `todoStore` — components import it directly rather than using DI / Context, which mirrors the typical MobX usage from React. (The plain `todo-app` example in this monorepo uses FAST `Context` instead; either pattern works.)

---

## Persistence (`autorun` → `localStorage`)

[`persistence.ts`](./src/state/persistence.ts) exports `connectStoreToStorage(store, key)` which:

1. Reads `key` from `localStorage` on call, parses, and hands the payload to `store.hydrate(...)`. Wrapped in `try/catch` for environments without storage (SSR, private mode).
2. Returns the disposer from `autorun(() => localStorage.setItem(key, JSON.stringify({ todos: store.todos, activeFilter: store.activeFilter })))`.

The same `autorun` primitive that powers the UI-side integration also powers persistence — there is nothing FAST-specific in this file, and the store would work the same way in a React app.

---

## Component composition

The app collapses to two custom elements, matching the [`csr/todo-app`](../todo-app) reference layout exactly:

| Component | Mirrored from store | Actions dispatched |
|---|---|---|
| `<todo-app>` | `items` (plain snapshots of `todoStore.filtered`), `activeFilter` | `todoStore.toggleById`, `todoStore.removeById`, `todoStore.setFilter` (via `activeFilterChanged`) |
| `<todo-form>` | local FAST `@observable description` (UI-only state) | `todoStore.add` |

The form's input value is intentionally a FAST `@observable`, not MobX state — it is transient UI state local to that element. The integration deliberately does not span that boundary.

---

## User input → MobX writeback

User-driven UI changes (filter selection, toggle, delete, add) propagate FAST → MobX through three mechanisms:

- **Two-way binding + `${prop}Changed`**: the `<select>` element uses `:value=${twoWay(x => x.activeFilter)}`. When the user picks a new option, FAST writes back to `x.activeFilter`, which fires `activeFilterChanged`. That callback forwards the new value to `todoStore.setFilter(next)`, gated by an equality check so the autorun's own store-driven assignment cannot reenter.
- **Per-item event handlers**: the checkbox's `@change` and the delete button's `@click` call `todoStore.toggleById(x.id)` and `todoStore.removeById(x.id)` directly. The bound iteration item `x` is a plain snapshot, so the handlers look the real Todo up by id.
- **Form submission**: `<todo-form>` keeps its draft in a FAST `@observable` and calls `todoStore.add(value)` on submit.

In every case, the MobX action is the writer; the autorun above is the only reader.

---

## Known gotchas

- **`useDefineForClassFields: false`** — required by MobX 6's `makeAutoObservable` so class-field initializers run as constructor assignments rather than `Object.defineProperty` declarations. The example's `tsconfig.json` sets this explicitly.
- **`skipLibCheck: true`** — set because MobX 6's `ObservableMap` lib types lag the `Map` definitions in TypeScript's `esnext` lib (missing `getOrInsert` / `getOrInsertComputed`). This affects type-checking only, not runtime.
- **One-direction `autorun`** — the `autorun` moves MobX changes into FAST. The reverse (FAST `@observable` → MobX `reaction`) is **not** wired. User input writes back via explicit `${prop}Changed` callbacks and event handlers instead.
- **Initial-value defaults** — `@observable` fields are declared with default values (`[]`, `"all"`, `""`) so the templates have valid bindings even before `autorun` first runs. Because `autorun` calls into MobX synchronously before `super.connectedCallback()`, the template's first evaluation always sees the real values, not the defaults.
- **Plain-data snapshots for items** — `<todo-app>` exposes `items` as plain `{id, description, done}` copies rather than the live MobX observables. This keeps the FAST/MobX boundary explicit, makes the autorun depend on each rendered field, and ensures a fresh array reference on every store change.

---

## Package layout

```
examples/csr/todo-mobx-app/
├── DESIGN.md                       ← this file
├── README.md                       ← developer-facing intro
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── design-system.d.ts          ← module shim for the tokens stylesheet import
    ├── exports.ts
    ├── main.ts
    ├── state/
    │   ├── index.ts
    │   ├── persistence.ts          ← autorun → localStorage
    │   └── todo-store.ts           ← MobX store
    ├── todo-app.{ts,template.ts,styles.ts}
    └── todo-form.{ts,template.ts,styles.ts}
```

Implementation entry points worth reading first:

1. [`src/todo-app.ts`](./src/todo-app.ts) — the end-to-end example of the autorun bridge pattern, including the writeback path for the filter.
2. [`src/todo-form.ts`](./src/todo-form.ts) — the UI-local FAST state plus MobX action dispatch.
3. [`src/state/todo-store.ts`](./src/state/todo-store.ts) — the MobX model.
