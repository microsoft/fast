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
7. [Per-item reactivity and `repeat` recycling](#per-item-reactivity-and-repeat-recycling)
8. [Known gotchas](#known-gotchas)
9. [Package layout](#package-layout)

---

## The two reactivity systems

FAST and MobX both track property reads to invalidate dependents when state changes, but they do so independently:

| | FAST (`@microsoft/fast-element`) | MobX |
|---|---|---|
| What gets observed | `@attr`, `@observable`, array mutations through FAST's `arrays.ts` patch, and any access wrapped in `Observable.track(source, name)` | Properties touched while a `reaction`, `autorun`, or `computed` is running |
| Subscriber primitive | `ExpressionNotifier` (an internal "watcher" stack — see [`observation/observable.ts`](../../packages/fast-element/src/observation/observable.ts)) | `Reaction` / `ComputedValue` |
| How a change re-renders | `Observable.notify(source, name)` → bound `ExpressionNotifier`s fire `handleChange` → enqueues an `Updates` task | The reaction's effect function runs synchronously |

There is no direct interop. If a FAST template binding reads a MobX-observable, MobX does not know to notify FAST. If a MobX `reaction` reads a FAST `@observable`, FAST does not know to notify MobX.

This example wires **one direction**: MobX → FAST. FAST stays the source of truth for DOM updates; MobX stays the source of truth for application state.

---

## The integration pattern: one `autorun` per component

Every component follows the same three-line pattern.

1. Declare the slices of MobX state the component renders as FAST `@observable` fields, with default initial values.
2. In `connectedCallback`, install a single `autorun(() => { … })` that reassigns those fields from the MobX store.
3. In `disconnectedCallback`, call the disposer returned by `autorun`.

```typescript
import { FASTElement, observable } from "@microsoft/fast-element";
import { autorun } from "mobx";
import { todoStore } from "./state/index.js";

export class TodoStats extends FASTElement {
    @observable public activeCount: number = 0;
    @observable public completedCount: number = 0;
    @observable public allCompleted: boolean = false;
    @observable public hasCompleted: boolean = false;

    private _disposer?: () => void;

    public connectedCallback(): void {
        this._disposer = autorun(() => {
            this.activeCount = todoStore.activeCount;
            this.completedCount = todoStore.completedCount;
            this.allCompleted = todoStore.allCompleted;
            this.hasCompleted = todoStore.completedCount > 0;
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
- Because MobX's computed values cache (so do array slices like `filter`, in the sense that the *array reference* changes only when the contents change), the assignment is a true no-op when nothing changed downstream — no spurious DOM updates.

### Why no custom decorator

The previous iteration of this example shipped two custom decorators that wrapped getters with `Observable.track` and installed one MobX `reaction` per decorated getter. They were removed because they did not buy anything that this two-line pattern does not already provide:

| Concern | Custom decorators | Inline `autorun` |
|---|---|---|
| Boilerplate per component | One `@mobxObservableProperty` per getter | A `connectedCallback`/`disconnectedCallback` pair |
| New API surface to learn | 2 decorators with their own contract | None — stock APIs from both libraries |
| Bridge code in the repo | ~180 lines | 0 lines |
| Re-renders triggered per change | Per property | Per component (still gated by FAST per-binding diffing) |
| Recycle-safe by default | No — required `recycle: false` | Yes (see below) |

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
- Regular methods (`add`, `remove`, `toggle`, `toggleAll`, `clearCompleted`, `setFilter`, `hydrate`) as `action` (so mutations are batched).

Because the array is deeply observable, the plain `{ id, description, done }` objects inserted by `add()` are wrapped as observable objects when they enter the array. That is what lets `<todo-item>` track `this.todo.done` and `this.todo.description` reactively.

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

Every component imports the singleton `todoStore` directly. None of them accept the store via property — props are only used for transient parent-to-child data (the `todo` property on `<todo-item>`).

| Component | Mirrored from store | Actions dispatched |
|---|---|---|
| `<todo-app>` | `total`, `hasTodos` | (renders sub-components) |
| `<todo-form>` | local FAST `@observable description` (UI-only state) | `todoStore.add` |
| `<todo-filter>` | `activeFilter` | `todoStore.setFilter` |
| `<todo-list>` | `items` (proxies `todoStore.filtered`) | (renders `<todo-item>`s) |
| `<todo-item>` | `done`, `description` (per-item — see next section) | `todoStore.toggle`, `todoStore.remove` |
| `<todo-stats>` | `activeCount`, `completedCount`, `allCompleted`, `hasCompleted` | `todoStore.toggleAll`, `todoStore.clearCompleted` |

The form's input value is intentionally a FAST `@observable`, not MobX state — it is transient UI state local to that element. The integration deliberately does not span that boundary.

---

## Per-item reactivity and `repeat` recycling

`<todo-item>` is unique because it does not pull its data from the global store directly — it reads it through a `todo` property bound from `<todo-list>`'s `repeat` directive. FAST's `repeat` may **recycle** child views by default: when an item is removed mid-list, the existing `<todo-item>` view at that position is re-bound to a different Todo rather than torn down and recreated.

That recycling is fine for our pattern, *because we hook FAST's `${prop}Changed` callback to rebuild the `autorun` against the new Todo*. The full lifecycle handling looks like:

```typescript
export class TodoItem extends FASTElement {
    @observable public todo!: Todo;
    @observable public done: boolean = false;
    @observable public description: string = "";

    private _disposer?: () => void;
    private _connected: boolean = false;

    public connectedCallback(): void {
        this._connected = true;
        this.startReaction();
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this._connected = false;
        this.stopReaction();
    }

    public todoChanged(): void {
        if (this._connected) {
            this.startReaction();
        }
    }

    private startReaction(): void {
        this.stopReaction();
        if (this.todo === undefined) return;
        this._disposer = autorun(() => {
            const todo = this.todo;
            this.done = todo.done;
            this.description = todo.description;
        });
    }

    private stopReaction(): void {
        this._disposer?.();
        this._disposer = undefined;
    }
}
```

The `_connected` flag is there because FAST's `@observable` setters can fire *before* `connectedCallback` runs (the parent assigns the property as it constructs the child view, then inserts the child into the DOM). The flag prevents `todoChanged` from installing a reaction on an element that is not yet attached — which would otherwise leak if the element were never inserted.

This is the only component where the pattern needs an extra wrinkle on top of the standard `connect/disconnect` pair, and the wrinkle is a stock FAST mechanism (`${prop}Changed`) — not custom infrastructure.

---

## Known gotchas

- **`useDefineForClassFields: false`** — required by MobX 6's `makeAutoObservable` so class-field initializers run as constructor assignments rather than `Object.defineProperty` declarations. The example's `tsconfig.json` sets this explicitly.
- **`skipLibCheck: true`** — set because MobX 6's `ObservableMap` lib types lag the `Map` definitions in TypeScript's `esnext` lib (missing `getOrInsert` / `getOrInsertComputed`). This affects type-checking only, not runtime.
- **One-direction integration** — the `autorun` moves MobX changes into FAST. The reverse (FAST `@observable` → MobX `reaction`) is **not** wired. UI-local FAST state (e.g. the form draft) stays out of the MobX store on purpose; nothing in the MobX layer needs to observe it.
- **Initial-value defaults** — `@observable` fields are declared with default values (`0`, `false`, `""`, `[]`) so the templates have valid bindings even before `autorun` first runs. Because `autorun` calls into MobX synchronously before `super.connectedCallback()`, the template's first evaluation always sees the real values, not the defaults.

---

## Package layout

```
examples/todo-mobx-app/
├── DESIGN.md                       ← this file
├── README.md                       ← developer-facing intro
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── exports.ts
    ├── main.ts
    ├── state/
    │   ├── index.ts
    │   ├── persistence.ts          ← autorun → localStorage
    │   └── todo-store.ts           ← MobX store
    ├── todo-app.{ts,template.ts,styles.ts}
    ├── todo-form.{ts,template.ts,styles.ts}
    ├── todo-list.{ts,template.ts,styles.ts}
    ├── todo-item.{ts,template.ts,styles.ts}
    ├── todo-filter.{ts,template.ts,styles.ts}
    └── todo-stats.{ts,template.ts,styles.ts}
```

Implementation entry points worth reading first:

1. [`src/todo-stats.ts`](./src/todo-stats.ts) — the cleanest end-to-end example of the pattern.
2. [`src/todo-item.ts`](./src/todo-item.ts) — the per-item variant with the `todoChanged` hook.
3. [`src/state/todo-store.ts`](./src/state/todo-store.ts) — the MobX model.
