# MobX Todo App (FAST)

A small Todo app that uses **[MobX](https://mobx.js.org/)** as its state library and **[`@microsoft/fast-element`](../../packages/fast-element)** for its Web Components. It is the MobX counterpart to [`examples/todo-app`](../todo-app), and it shows how to bridge MobX's reactivity into FAST's template binding system with two small decorators — `@mobxObserver` and `@mobxObservableProperty`.

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

## What the app demonstrates

| Feature | Where to look |
|---|---|
| `makeAutoObservable` store with `@observable`, `@computed`, `@action` slots inferred for you | [`src/state/todo-store.ts`](./src/state/todo-store.ts) |
| `autorun` persisting to `localStorage` and hydrating on load | [`src/state/persistence.ts`](./src/state/persistence.ts) |
| `reaction` bridging MobX changes into a `FASTElement`'s template binding system | [`src/mobx-integration/mobx-observer.ts`](./src/mobx-integration/mobx-observer.ts) |
| `@mobxObserver` class decorator (wraps lifecycle, manages disposers) | [`src/mobx-integration/mobx-observer.ts`](./src/mobx-integration/mobx-observer.ts) |
| `@mobxObservableProperty` getter decorator (registers a getter for tracking + reaction setup) | [`src/mobx-integration/mobx-observer.ts`](./src/mobx-integration/mobx-observer.ts) |
| Component composition with MobX-derived computeds | every `src/todo-*.ts` |
| Filtered list view backed by a MobX computed | [`src/todo-list.ts`](./src/todo-list.ts), [`src/state/todo-store.ts`](./src/state/todo-store.ts) |
| Aggregate stats (active count, completed count, all-completed) | [`src/todo-stats.ts`](./src/todo-stats.ts) |
| Toggle-all and clear-completed actions | [`src/todo-stats.ts`](./src/todo-stats.ts), [`src/state/todo-store.ts`](./src/state/todo-store.ts) |

## The problem the bridge solves

FAST and MobX both have their own reactivity systems, and neither knows about the other. Without help, every FASTElement getter that depends on MobX state has to call `Observable.track` (so FAST subscribes) and run a `reaction` (so MobX notifies FAST when its inputs change). That repeats the same five-line dance per property:

```typescript
export class HeaderButton extends FASTElement {
    get isActive(): boolean {
        // Manually subscribe the FAST template binding to this property.
        Observable.track(this, "isActive");
        return !!this.paneId && isDrawerPaneVisible(this.paneId);
    }

    #disposers: (() => void)[] = [];

    connectedCallback(): void {
        super.connectedCallback();
        this.#disposers.push(
            reaction(
                () => this.isActive,
                () => Observable.notify(this, "isActive"),
            ),
        );
    }

    disconnectedCallback(): void {
        for (const dispose of this.#disposers) dispose();
    }
}
```

The decorators in this example collapse all of that to:

```typescript
@mobxObserver
export class HeaderButton extends FASTElement {
    @mobxObservableProperty
    get isActive(): boolean {
        return !!this.paneId && isDrawerPaneVisible(this.paneId);
    }
}
```

See [DESIGN.md](./DESIGN.md) for a step-by-step walkthrough of how the bridge works internally.

## Project layout

```
examples/todo-mobx-app/
├── index.html                     # mounts <todo-app>
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md                      # this file
├── DESIGN.md                      # how the bridge works
└── src/
    ├── exports.ts                 # barrel for tooling
    ├── main.ts                    # entry — wires storage + defines <todo-app>
    ├── mobx-integration/          # the bridge
    │   ├── index.ts
    │   └── mobx-observer.ts
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

## License

MIT — see the [monorepo root](../../LICENSE).
