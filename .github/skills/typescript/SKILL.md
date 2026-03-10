---
description: Use this guide when working on TypeScript changes in the FAST monorepo — authoring Web Components, writing templates and styles, working with the observable/reactive system, DI container, routing, or declarative HTML packages.
name: typescript
---

# TypeScript Patterns for FAST

Use this guide when working on TypeScript changes in the FAST monorepo.

## Key references

Read these files for additional context when needed:

- [`tsconfig.json`](../../../tsconfig.json) — root compiler options (base for all packages).
- [`packages/fast-element/tsconfig.json`](../../../packages/fast-element/tsconfig.json) — fast-element overrides (ESNext modules, bundler resolution).
- [`packages/fast-html/tsconfig.json`](../../../packages/fast-html/tsconfig.json) — fast-html overrides (NodeNext modules, strict mode).
- [`packages/fast-router/tsconfig.json`](../../../packages/fast-router/tsconfig.json) — fast-router overrides (NodeNext modules).
- [`.eslintrc.js`](../../../.eslintrc.js) — ESLint rules (import ordering, naming conventions).
- [`.prettierrc`](../../../.prettierrc) — Prettier formatting rules.

# Compiler constraints

These are mandatory unless the user explicitly asks to change them:

- All packages use `"type": "module"` (ESM only).
- Source imports must use `.js` extensions, even when the source is `.ts`:
  ```ts
  import { FAST } from "../platform.js";
  import { Observable } from "./observable.js";
  ```
- `verbatimModuleSyntax` is enabled — use `import type` for type-only imports:
  ```ts
  import type { Notifier, Subscriber } from "./notifier.js";
  ```
- Legacy/stage-1 decorators are enabled (`experimentalDecorators: true`).
- `strictNullChecks` is enabled at the root level.
- Named exports only — no default exports.

# Package-specific compiler differences

Each package overrides the root `tsconfig.json`. Be aware of these differences:

| Package | `module` | `moduleResolution` | `noImplicitAny` | `strict` |
|---|---|---|---|---|
| `fast-element` | ESNext | bundler | off | — |
| `fast-html` | NodeNext | NodeNext | — | true |
| `fast-router` | NodeNext | NodeNext | off | — |

# Import and export patterns

## Import ordering

ESLint enforces import order (`import/order` + `sort-imports`). Follow the pattern used throughout the codebase:

```ts
// External packages first
import { expect, test } from "@playwright/test";

// Then relative imports, with type-only imports using `import type`
import { isFunction, isString, Message } from "../interfaces.js";
import { FAST, makeSerializationNoop } from "../platform.js";
import type { Notifier, Subscriber } from "./notifier.js";
import { PropertyChangeNotifier, SubscriberSet } from "./notifier.js";
```

## Barrel exports (index.ts)

Package entry points re-export from feature modules, organized by section with comments. Types are exported separately:

```ts
// Observation
export {
    Observable,
    observable,
    volatile,
    type Accessor,
    type Expression,
} from "./observation/observable.js";
```

## Sub-entry-points

All packages use the `exports` map in `package.json` for sub-entry-points:
```ts
import { composedParent } from "@microsoft/fast-element/utilities.js";
```

Internal modules should NOT be exported from the package index.

# Testing

## Test file conventions

| Suffix | Usage |
|---|---|
| `*.pw.spec.ts` | All test files (co-located next to source) |

Tests use Playwright Test with `test.describe()` / `test()` structure. **Do not use** `describe` / `it` from other frameworks.

## Two test patterns

### Direct-import tests (preferred when possible)

Import source modules directly and test without a browser page:

```ts
import { expect, test } from "@playwright/test";
import { Model } from "../testing/models.js";
import { Observable } from "./observable.js";

test.describe("The Observable", () => {
    test("can get a notifier for an object", () => {
        const instance = new Model();
        const notifier = Observable.getNotifier(instance);
        expect(notifier).toBeInstanceOf(PropertyChangeNotifier);
    });
});
```

### Browser-evaluated tests (when DOM APIs are needed)

Use `page.goto("/")` + `page.evaluate()` to run code in the Vite test server. Import from `"/main.js"` with a `@ts-expect-error` comment:

```ts
test("should work in the browser", async ({ page }) => {
    await page.goto("/");

    const result = await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const { FASTElement, html, uniqueElementName } = await import("/main.js");
        // ... test logic using DOM APIs ...
        return someValue;
    });

    expect(result).toBe(expected);
});
```

## Test harness

The test harness at
[`packages/<package>/test/main.ts`](../../../packages/fast-element/test/main.ts)
re-exports source modules for in-browser tests. When adding new exports to the source,
also add them to `test/main.ts` if they need to be available in browser-evaluated tests.

## Running tests

```bash
# Run all tests for one package
npm run test -w @microsoft/fast-element

# Run the Vite test server separately (for debugging)
npm run test-server -w @microsoft/fast-element
```

Playwright config is at each package root
([`playwright.config.ts`](../../../packages/fast-element/playwright.config.ts)). Tests run
across Chromium, Firefox, and WebKit with 3 retries.

# Web Component patterns

## File organization

The following structures are merely conventions, not strict requirements. Most FAST-based
component libraries follow a similar pattern of separating the element class, template,
and styles into individual files. This promotes modularity and maintainability, but the
exact structure can be adapted as needed for specific implementations or preferences.

Separate the element class, template, and styles into individual files:

```
my-element.ts            # Element class
my-element.template.ts   # Template
my-element.styles.ts     # Styles
my-element.pw.spec.ts    # Playwright Tests
```

Some implementations may have additional modules:

```
my-element.options.ts      # Optional configuration or utilities related to the element (typically attribute values and their types)
my-element.definition.ts   # Element class + compose (no define)
define.ts                  # Calls .define() to register the element (side-effect only import)
```

Elements with compatible Declarative HTML definitions may also have:

```
my-element.template.html  # HTML template for declarative definition
my-element.styles.css     # CSS styles for declarative definition
define-async.ts           # Calls .defineAsync() for deferred registration (side-effect only import)
```

## Custom element definition

Elements extend `FASTElement`. Use `.define()` to register — **not** the `@customElement` decorator:

```ts
import { FASTElement } from "@microsoft/fast-element";
import { styles } from "./my-element.styles.js";
import { template } from "./my-element.template.js";

export class MyElement extends FASTElement {
    @observable items: string[] = [];
}

MyElement.define({
    name: "my-element",
    template,
    styles,
});
```

### Deferred registration with `.compose()`

Use `.compose()` when you need to separate definition from registration — for example, to set up context or control startup timing:

```ts
// my-element.ts — compose but don't define yet
export const myElement = MyElement.compose({
    name: "my-element",
    template,
    styles,
});

// main.ts — define when ready
myElement.define();
```

## Templates (`html` tagged template)

Templates use the `html` tagged template literal, typed to the element class:

```ts
import { html, repeat, when } from "@microsoft/fast-element";
import type { MyElement } from "./my-element.js";

export const template = html<MyElement>`
    <h1>${x => x.title}</h1>
    <ul>
        ${repeat(
            x => x.items,
            html<string>`
                <li>${x => x}</li>
            `
        )}
    </ul>
`;
```

### Binding syntax

| Syntax | Purpose | Example |
|---|---|---|
| `${x => x.prop}` | Content/attribute binding | `${x => x.name}` |
| `@event` | Event listener | `@click=${x => x.handleClick()}` |
| `@event` with context | Event + parent access | `@click=${(x, c) => c.parent.remove(x)}` |
| `:property` | Property binding (set DOM property) | `:value=${twoWay(x => x.description)}` |
| `?attr` | Boolean attribute | `?disabled=${x => !x.isValid}` |

### Two-way bindings

Import `twoWay` from the sub-entry-point:

```ts
import { twoWay } from "@microsoft/fast-element/binding/two-way.js";

const template = html<MyForm>`
    <input :value=${twoWay(x => x.description, "input")} />
`;
```

This can also be achieved with the Observable API and event listeners, which is more
common in FAST-based libraries since it doesn't require importing from a sub-entry-point.

### Conditional rendering

```ts
${when(x => x.show, html<MyElement>`<p>Visible</p>`)}
```

## Styles (`css` tagged template)

Styles use the `css` tagged template literal. Use `:host` for the element itself:

```ts
import { css } from "@microsoft/fast-element";

export const styles = css`
    :host {
        display: block;
        padding: 16px;
    }

    .description {
        margin: 0 8px;
    }
`;
```

In standard FAST elements, styles are provided as a property on the component's definition:

```ts
MyElement.define({
    name: "my-element",
    template,
    styles,
});
```

For declarative HTML definitions, styles are provided as a separate CSS file and are part
of the component's template. A link to the stylesheet should be present in both the initial
template and the FAST f-template:

```html
<my-element>
  <template shadowrootmode="open">
    <link rel="stylesheet" href="./my-element.styles.css">
    <!-- template content -->
  </template>
</my-element>

<f-template name="my-element">
  <template>
      <link rel="stylesheet" href="./my-element.styles.css">
      <!-- template content -->
  </template>
</f-template>
```

## Attributes (`@attr` decorator)

The `@attr` decorator maps HTML attributes to element properties:

```ts
import { attr, FASTElement, nullableNumberConverter } from "@microsoft/fast-element";

class MyElement extends FASTElement {
    @attr label?: string;

    @attr({ converter: nullableNumberConverter })
    count?: number;

    @attr({ mode: "boolean" })
    active?: boolean;

    labelChanged(prev: string | undefined, next: string | undefined) {
        // Convention: ${propertyName}Changed callback
    }
}
```

`@attr` can also be applied as a function on prototypes:

```ts
attr(MyElement.prototype, "value");
```

# Observable/reactive patterns

## `@observable` decorator

Creates reactive properties with automatic change tracking:

```ts
import { observable } from "@microsoft/fast-element";

class MyElement extends FASTElement {
    @observable show = true;
    @observable private _todos: Todo[] = [];

    showChanged(prev: boolean | undefined, next: boolean | undefined) {
        // Convention: ${propertyName}Changed callback
    }
}
```

Can also be applied as a function:

```ts
observable(MyElement.prototype, "items");
```

## `@volatile` decorator

Use on getters whose observable dependencies change between invocations:

```ts
import { volatile } from "@microsoft/fast-element";

class TodoList {
    @observable activeFilter: "all" | "active" | "completed" = "all";
    @observable private _todos: Todo[] = [];

    @volatile
    get filtered(): readonly Todo[] {
        switch (this.activeFilter) {
            case "active":
                return this._todos.filter(x => !x.done);
            case "completed":
                return this._todos.filter(x => x.done);
            default:
                return this._todos;
        }
    }
}
```

## `reactive()` for plain objects

Make plain objects observable so that property changes are tracked in templates:

```ts
import { reactive } from "@microsoft/fast-element/state.js";

const todo = reactive({ description: "Buy milk", done: false });
```

## Manual notification

Notify the observable system when indirect mutations occur (e.g., array splicing):

```ts
import { Observable } from "@microsoft/fast-element";

this._todos.splice(index, 1);
Observable.notify(this, "_todos");
```

## Subscriber pattern

```ts
const notifier = Observable.getNotifier(instance);
notifier.subscribe(
    {
        handleChange() {
            // React to changes
        },
    },
    "propertyName"
);
```
