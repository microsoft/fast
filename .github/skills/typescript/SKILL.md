---
description: Use this guide when working on TypeScript changes in the FAST monorepo — authoring Web Components, writing templates and styles, working with the observable/reactive system, and testing.
name: typescript
---

# TypeScript Patterns for FAST

## Modules

`fast-element` enables `verbatimModuleSyntax`, so type-only imports must use `import type`
or the inline `type` qualifier:

```ts
import type { Notifier, Subscriber } from "./notifier.js";
import { type Constructable, isFunction } from "../interfaces.js";
```

Sub-entry-points expose focused APIs through the `exports` map:

```ts
import { twoWay } from "@microsoft/fast-element/two-way.js";
import { reactive } from "@microsoft/fast-element/state.js";
import { composedParent } from "@microsoft/fast-element/utilities.js";
```

The barrel `index.ts` explicitly lists every re-export grouped by subsystem — no
`export *` statements.

## Custom elements

Elements extend `FASTElement`. Do **not** use the `@customElement` decorator.

Use `define()` for registration. `define()` returns a `Promise` that resolves
immediately when a template is provided:

```ts
export class MyElement extends FASTElement {
    @observable items: string[] = [];
}

await MyElement.define({
    name: "my-element",
    template,
    styles,
});
```

Use `compose()` when registration should be deferred — downstream libraries like Fluent
Web Components use this pattern with a design-system registry. `compose()` returns a
`Promise<FASTElementDefinition>` that always resolves immediately:

```ts
// my-element.definition.ts
export const definition = await MyElement.compose({
    name: "my-element",
    template,
    styles,
});

// define.ts (side-effect import)
definition.define();
```

## Templates

Templates use the `html` tagged template literal typed to the element class:

```ts
import { html } from "@microsoft/fast-element/html.js";
import { repeat } from "@microsoft/fast-element/repeat.js";
import { when } from "@microsoft/fast-element/when.js";
import type { MyElement } from "./my-element.js";

export const template = html<MyElement>`
    <h1>${x => x.title}</h1>
    ${when(x => x.showList, html<MyElement>`
        <ul>
            ${repeat(
                x => x.items,
                html<string>`<li>${x => x}</li>`
            )}
        </ul>
    `)}
`;
```

### Binding syntax

| Prefix | Purpose | Example |
|---|---|---|
| `${x => ...}` | Content or attribute | `${x => x.name}` |
| `@event` | Event listener | `@click=${x => x.handleClick()}` |
| `@event` | Event with context | `@click=${(x, c) => c.parent.remove(x)}` |
| `:prop` | DOM property | `:value=${twoWay(x => x.description)}` |
| `?attr` | Boolean attribute | `?disabled=${x => !x.isValid}` |

Two-way bindings require a sub-entry-point import:

```ts
import { twoWay } from "@microsoft/fast-element/two-way.js";
```

### Partial HTML

Use `html.partial()` to inject pre-built HTML strings into a template without creating
a full `ViewTemplate`:

```ts
html<MyElement>`
    <div>${html.partial("<span>static markup</span>")}</div>
`;
```

## Styles

Styles use the `css` tagged template literal. They attach through the element definition's
`styles` property:

```ts
import { css } from "@microsoft/fast-element/css.js";

export const styles = css`
    :host {
        display: block;
        padding: 16px;
    }
`;
```

For declarative HTML definitions, styles live in a separate `.styles.css` file linked from
both the initial shadow root template and the `<f-template>`:

```html
<f-template name="my-element">
    <template>
        <link rel="stylesheet" href="./my-element.styles.css">
    </template>
</f-template>
```

`css.partial()` works the same way as `html.partial()` — injecting raw CSS strings.

## Reactivity

`@attr` maps HTML attributes to properties. `@observable` creates reactive properties
tracked by templates. `@volatile` marks getters whose dependencies change between calls:

```ts
import { FASTElement } from "@microsoft/fast-element";
import { attr, nullableNumberConverter } from "@microsoft/fast-element/attr.js";
import { Observable, observable } from "@microsoft/fast-element/observable.js";
import { volatile } from "@microsoft/fast-element/volatile.js";

class MyElement extends FASTElement {
    @attr label?: string;
    @attr({ mode: "boolean" }) active?: boolean;
    @attr({ converter: nullableNumberConverter }) count?: number;

    @observable private _items: string[] = [];

    // Convention: ${propertyName}Changed
    labelChanged(prev: string | undefined, next: string | undefined) {}

    @volatile
    get sortedItems(): readonly string[] {
        return [...this._items].sort();
    }
}
```

Notify the system after in-place mutations that it cannot detect automatically:

```ts
this._items.splice(index, 1);
Observable.notify(this, "_items");
```

Make plain objects observable via the state sub-entry-point:

```ts
import { reactive } from "@microsoft/fast-element/state.js";
const todo = reactive({ description: "Buy milk", done: false });
```

## Testing

Tests use Playwright Test (`*.pw.spec.ts`) and combine two patterns within the same file.

### Direct-import tests

For logic that does not need browser APIs — the test callback takes no parameters:

```ts
import { expect, test } from "@playwright/test";
import { Observable } from "./observable.js";

test.describe("Observable", () => {
    test("can get a notifier", () => {
        const notifier = Observable.getNotifier(new Model());
        expect(notifier).toBeInstanceOf(PropertyChangeNotifier);
    });
});
```

### Browser-evaluated tests

For tests requiring DOM APIs, navigate to the Vite dev server and import via
`"/main.js"`. The `@ts-expect-error` comment is required because TypeScript cannot
resolve the URL-based import:

```ts
test("renders element", async ({ page }) => {
    await page.goto("/");

    const result = await page.evaluate(async () => {
        // @ts-expect-error: Client module.
        const { FASTElement, html, uniqueElementName } = await import("/main.js");
        // ... test logic ...
        return someSerializableValue;
    });

    expect(result).toBe(expected);
});
```

Only serializable values can cross the `page.evaluate` boundary — run `expect()`
assertions outside it on the returned data.

The test harness at `packages/<package>/test/main.ts` re-exports source modules for
browser tests. When adding new package exports, add them there too.

## TypeScript idioms

### Const-type merging for enumerations

Frozen const objects paired with a type extracted from their values replace TypeScript
`enum`:

```ts
export const SourceLifetime = {
    default: undefined,
    couple: 1,
} as const;

export type SourceLifetime =
    (typeof SourceLifetime)[keyof typeof SourceLifetime];
```

### Interface-const merging

`FASTElement` is both an interface (instance shape) and a const (constructor). Static
methods use `typeof` to carry overloaded signatures:

```ts
export const FASTElement: {
    new (): FASTElement;
    define: typeof define;
    compose: typeof compose;
} = Object.assign(createFASTElement(HTMLElement), { define, compose });
```

### Tagged template intersection types

`html` and `css` are typed as intersections of a tagged template function and a
`.partial()` method:

```ts
type HTMLTemplateTag = (<TSource, TParent>(
    strings: TemplateStringsArray,
    ...values: TemplateValue<TSource, TParent>[]
) => ViewTemplate<TSource, TParent>) & {
    partial(html: string): InlineTemplateDirective;
};
```
