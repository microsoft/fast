# MobX Todo App (FAST)

A small Todo app that uses **[MobX](https://mobx.js.org/)** as its state library and **[`@microsoft/fast-element`](../../packages/fast-element)** for its Web Components. It is the MobX counterpart to [`examples/todo-app`](../todo-app).

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

The output is written to `examples/todo-mobx-app/www/`.

## The pattern, in one component

`<todo-stats>` reads several MobX-derived numbers from the shared store and renders them. It declares matching FAST `@observable` fields, and a single `autorun` mirrors store values into those fields:

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

That is the entire integration. The template binds to `${x => x.activeCount}` (etc.) exactly as it would for any other FAST element.

### Why this works

- `autorun` runs immediately, then re-runs whenever any MobX-observable it read changes.
- Each re-run reassigns a FAST `@observable` field, which fires FAST's own change notification, which patches the bound DOM.
- Calling `autorun` *before* `super.connectedCallback()` ensures the mirror fields have correct values before the template binds, avoiding any initial flicker.
- The disposer returned by `autorun` is stored on the element and released on disconnect, so reactions never outlive the element.

## What the app demonstrates

| Feature | Where to look |
|---|---|
| `makeAutoObservable` store with observables, computeds, and actions inferred automatically | [`src/state/todo-store.ts`](./src/state/todo-store.ts) |
| `autorun` persisting to `localStorage` and hydrating on load | [`src/state/persistence.ts`](./src/state/persistence.ts) |
| `autorun` bridging MobX → FAST in every component | every `src/todo-*.ts` |
| Recycle-safe per-item reactivity via FAST's `${prop}Changed` callback | [`src/todo-item.ts`](./src/todo-item.ts) |
| Filtered list view backed by a MobX computed | [`src/todo-list.ts`](./src/todo-list.ts) |
| Aggregate stats (active count, completed count, all-completed) | [`src/todo-stats.ts`](./src/todo-stats.ts) |
| Toggle-all and clear-completed actions | [`src/todo-stats.ts`](./src/todo-stats.ts), [`src/state/todo-store.ts`](./src/state/todo-store.ts) |

## Project layout

```
examples/todo-mobx-app/
├── index.html                     # mounts <todo-app>
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md                      # this file
├── DESIGN.md                      # why the autorun pattern, lifecycle details
└── src/
    ├── exports.ts                 # barrel for tooling
    ├── main.ts                    # entry — wires storage + defines <todo-app>
    ├── state/                     # MobX layer (framework-agnostic)
    │   ├── index.ts
    │   ├── persistence.ts
    │   └── todo-store.ts
    ├── todo-app.{ts,template.ts,styles.ts}
    ├── todo-form.{ts,template.ts,styles.ts}
    ├── todo-list.{ts,template.ts,styles.ts}
    ├── todo-item.{ts,template.ts,styles.ts}
    ├── todo-filter.{ts,template.ts,styles.ts}
    └── todo-stats.{ts,template.ts,styles.ts}
```

See [DESIGN.md](./DESIGN.md) for an explanation of why this pattern is sufficient (and why the `<todo-item>` component has one extra hook for FAST's `repeat` view recycling).

## License

MIT — see the [monorepo root](../../LICENSE).
