# MobX Todo App (FAST)

A small Todo app that uses **[MobX](https://mobx.js.org/)** as its state library and **[`@microsoft/fast-element`](../../../packages/fast-element)** for its Web Components. It is the MobX counterpart to [`examples/csr/todo-app`](../todo-app), and the two render an identical UI — the same `<h1>FAST Todos</h1>`, `<todo-form>` (input + "Add Todo"), `<select>` filter (All / Active / Completed), and `<ul class="todo-list">` of rows with a checkbox, description, and `×` button. Like every example app it consumes the shared [`@microsoft/fast-examples-design-system`](../../design-system) tokens for styling.

The example shows that you do **not** need a custom decorator or any bridge code to integrate MobX with `@microsoft/fast-element` — a single `autorun` per component, set up in `connectedCallback` and disposed in `disconnectedCallback`, is all that is needed.

## Running

```bash
# from the monorepo root
npm ci
npm run build -w @microsoft/fast-element
npm start -w @microsoft/fast-todo-mobx-app-example
```

The Vite dev server runs at <http://localhost:9001>.

To produce a production build:

```bash
npm run build -w @microsoft/fast-todo-mobx-app-example
```

The output is written to `examples/csr/todo-mobx-app/www/`.

## The pattern, in one component

`<todo-app>` mirrors the slices of MobX state it renders into FAST `@observable` fields with a single `autorun` set up in `connectedCallback`. The template binds to those plain FAST observables as usual.

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

    public activeFilterChanged(
        _prev: TodoListFilter | undefined,
        next: TodoListFilter | undefined,
    ): void {
        if (next !== undefined && next !== todoStore.activeFilter) {
            todoStore.setFilter(next);
        }
    }
}
```

That is the entire integration. The template binds `${x => x.items}`, `${x => x.activeFilter}`, etc. exactly as it would for any other FAST element.

### Why this works

- `autorun` runs immediately, then re-runs whenever any MobX-observable it read changes.
- Each re-run reassigns FAST `@observable` fields, which fires FAST's own change notification, which patches the bound DOM.
- The `.map(...)` copies each todo into a plain `{id, description, done}` object — that simultaneously creates a fresh array reference on every run (so FAST always sees the assignment) and ensures the autorun depends on every observable field it serializes.
- Calling `autorun` *before* `super.connectedCallback()` ensures the mirror fields have correct values before the template binds, avoiding any initial flicker.
- The disposer returned by `autorun` is stored on the element and released on disconnect, so reactions never outlive the element.

The `<select>` element uses a `twoWay` binding to `activeFilter`. `activeFilterChanged` propagates user changes back to the MobX store (gated by an equality check, so the autorun's store-driven assignment never loops).

## What the app demonstrates

| Feature | Where to look |
|---|---|
| `makeAutoObservable` store with observables, computeds, and actions inferred automatically | [`src/state/todo-store.ts`](./src/state/todo-store.ts) |
| `autorun` persisting to `localStorage` and hydrating on load | [`src/state/persistence.ts`](./src/state/persistence.ts) |
| `autorun` bridging MobX → FAST in a component | [`src/todo-app.ts`](./src/todo-app.ts) |
| UI-local FAST `@observable` for the input draft (deliberately not in the MobX store) | [`src/todo-form.ts`](./src/todo-form.ts) |
| Filtered list view backed by a MobX computed | [`src/state/todo-store.ts`](./src/state/todo-store.ts) (`get filtered`) |
| Two-way binding from a `<select>` back into the MobX store | [`src/todo-app.template.ts`](./src/todo-app.template.ts), [`src/todo-app.ts`](./src/todo-app.ts) (`activeFilterChanged`) |
| Styling exclusively via the shared design-system tokens | [`src/*.styles.ts`](./src), [`index.html`](./index.html), [`src/main.ts`](./src/main.ts) |

## Project layout

```
examples/csr/todo-mobx-app/
├── index.html                     # mounts <todo-app>, sets data-theme="light"
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md                      # this file
├── DESIGN.md                      # why the autorun pattern, lifecycle details
└── src/
    ├── design-system.d.ts         # module shim for the tokens stylesheet import
    ├── exports.ts                 # barrel for tooling
    ├── main.ts                    # entry — imports tokens.css, wires storage, defines <todo-app>
    ├── state/                     # MobX layer (framework-agnostic)
    │   ├── index.ts
    │   ├── persistence.ts
    │   └── todo-store.ts
    ├── todo-app.{ts,template.ts,styles.ts}
    └── todo-form.{ts,template.ts,styles.ts}
```

See [DESIGN.md](./DESIGN.md) for an explanation of why this pattern is sufficient.

## License

MIT — see the [monorepo root](../../../LICENSE).
