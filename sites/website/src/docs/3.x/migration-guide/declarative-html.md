---
id: migration-guide-declarative-html
title: Declarative HTML Migration
layout: 3x
eleventyNavigation:
  key: migration-guide-declarative-html3x
  parent: migration-guide3x
  title: Declarative HTML
navigationOptions:
  activeKey: migration-guide-declarative-html3x
keywords:
  - migrate
  - migration
  - declarative
  - fast-html
  - f-template
---

{% raw %}

# Declarative HTML migration

Use this path if your v2 application used `@microsoft/fast-html`,
`<f-template>`, `RenderableFASTElement`, `TemplateElement`, declarative
`attributeMap` or `observerMap` options, or declarative event handlers. Complete
the [core migration](/docs/3.x/migration-guide/) first. If the declarative
templates were also server-rendered or hydrated, complete the
[Hydration and SSR migration](/docs/3.x/migration-guide/hydration/) as well.

## What changed

The `@microsoft/fast-html` package has been removed. Declarative HTML now ships
from focused `@microsoft/fast-element` path exports and integrates with normal
`FASTElement.define()` calls.

Key migration points:

1. Import declarative APIs from `@microsoft/fast-element` path exports.
2. Replace `RenderableFASTElement(...).defineAsync()` with subclass `define()`.
3. Replace public `TemplateElement` setup with `template: declarativeTemplate()`.
4. Replace `TemplateElement.options()` with define extensions.
5. Replace `prepare()` with standard element lifecycle code.
6. Update declarative event handlers to use `$e` instead of bare `e`.

## Update imports

Import declarative HTML APIs from FAST Element path exports instead of
`@microsoft/fast-html`.

```ts
// Before
import { TemplateElement } from "@microsoft/fast-html";
import { deepMerge } from "@microsoft/fast-html/utilities.js";

// After
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { deepMerge } from "@microsoft/fast-element/declarative-utilities.js";
```

Map helpers are define extensions with their own path exports.

```ts
import { attributeMap } from "@microsoft/fast-element/attribute-map.js";
import { observerMap } from "@microsoft/fast-element/observer-map.js";
```

Keep importing core FAST Element APIs from the root package export.

| API | Import path |
|---|---|
| `FASTElement`, `FAST`, `ElementController`, definition/controller types | `@microsoft/fast-element` |
| `attr`, `AttributeDefinition`, converters, `ValueConverter` | `@microsoft/fast-element` |
| `Observable`, `observable`, `volatile`, `Updates` | `@microsoft/fast-element` |
| `html`, `css`, `ViewTemplate`, `HTMLView` | `@microsoft/fast-element` |
| `Schema`, `schemaRegistry`, schema types | `@microsoft/fast-element` |
| `Binding`, `oneWay`, `oneTime`, `listener` | `@microsoft/fast-element` |
| `DOM`, `DOMAspect`, `DOMPolicy` | `@microsoft/fast-element` |
| `children`, `elements`, `ref`, `repeat`, `slotted`, `when` | `@microsoft/fast-element` |

## Replace `RenderableFASTElement`

The `RenderableFASTElement` mixin has been removed. Components extend
`FASTElement` and call `define()` directly.

```ts
// Before
import { RenderableFASTElement } from "@microsoft/fast-html";

RenderableFASTElement(MyComponent).defineAsync({
    name: "my-component",
    templateOptions: "defer-and-hydrate",
});
```

```ts
// After
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";

await MyComponent.define({
    name: "my-component",
    template: declarativeTemplate(),
});
```

`declarativeTemplate()` is the waiting behavior. It resolves the matching
`<f-template>` before `define()` completes. If prerendered content exists in the
DOM, call `enableHydration()` before elements connect to hydrate it.

## Replace public `TemplateElement` setup

The `<f-template>` implementation is now internal and is defined automatically
when an element uses `template: declarativeTemplate()`.

| Removed | Replacement |
|---|---|
| `TemplateElement` public export | `declarativeTemplate()` |
| `TemplateElement.define({ name: "f-template" })` | No manual definition needed. |
| `TemplateElement.config(callbacks)` | `enableHydration().whenHydrated(tagName)` for tag-specific hydration waits and `enableHydration().whenHydrated()` for the active hydration batch. |
| `TemplateElement.options(...)` | `attributeMap()` and `observerMap()` define extensions. |
| `AttributeMap` / `ObserverMap` class exports from the old declarative public surface | `attributeMap()` / `observerMap()` helpers and config types. |

```ts
// Before
import { TemplateElement } from "@microsoft/fast-html";

TemplateElement.define({ name: "f-template" });
TemplateElement.options({
    "my-element": {
        attributeMap: true,
        observerMap: true,
    },
});

MyElement.define({ name: "my-element" });
```

```ts
// After
import { attributeMap } from "@microsoft/fast-element/attribute-map.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";
import { observerMap } from "@microsoft/fast-element/observer-map.js";

await MyElement.define(
    {
        name: "my-element",
        template: declarativeTemplate(),
    },
    [attributeMap(), observerMap()],
);
```

`FASTElementDefinition.schema` is optional. Declarative templates assign it
automatically during template resolution. Non-declarative users can provide a
manual schema on the definition, or pass one directly to `observerMap({
schema })`.

```ts
import { Schema } from "@microsoft/fast-element";
import { observerMap } from "@microsoft/fast-element/observer-map.js";

const schema = new Schema("my-element");

await MyElement.define({ name: "my-element" }, [observerMap({ schema })]);
```

## Remove `TemplateOptions`

`TemplateOptions`, `PartialFASTElementDefinition.templateOptions`, and
`FASTElementDefinition.templateOptions` have been removed. Remove
`templateOptions` from element definitions and use
`template: declarativeTemplate()` when declarative markup should supply the
template.

```ts
// Before
await MyElement.define({
    name: "my-element",
    templateOptions: "defer-and-hydrate",
});

// After
await MyElement.define({
    name: "my-element",
    template: declarativeTemplate(),
});
```

Elements can still be defined before a template is attached. A later
`FASTElementDefinition.template` update notifies connected elements so they can
render or hydrate with the new template.

## Update declarative attribute mapping

Declarative attribute mapping now defaults to `"camelCase"` instead of `"none"`.
With the default strategy, `{{firstName}}` maps to the `firstName` property and
the `first-name` HTML attribute. If your v2 templates relied on literal
attribute names, configure both the client and server to use `"none"`.

```ts
import { attributeMap } from "@microsoft/fast-element/attribute-map.js";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";

await MyElement.define(
    {
        name: "my-element",
        template: declarativeTemplate(),
    },
    [attributeMap({ "attribute-name-strategy": "none" })],
);
```

If server-rendered HTML is generated with `@microsoft/fast-build`, pass the same
strategy to the CLI:

```bash
fast build --attribute-name-strategy=none
```

## Update declarative event handlers

Declarative event handlers now reserve only `$e` for the DOM event and `$c` for
the execution context. Bare `e` is no longer treated as the event object.

```html
<!-- Before -->
<button @click="{handleClick(e)}"></button>

<!-- After -->
<button @click="{handleClick($e)}"></button>
```

If you used `TemplateParser.hasDeprecatedEventSyntax` in custom tooling, remove
that check as part of the migration.

## Replace `prepare()` lifecycle logic

The `prepare()` hook from `@microsoft/fast-html` is no longer available. Move
initialization logic to `connectedCallback()` or an application-owned async
method that is called from `connectedCallback()`.

```ts
// Before
class MyComponent extends FASTElement {
    async prepare() {
        this.data = await fetchData();
    }
}
```

```ts
// After
class MyComponent extends FASTElement {
    connectedCallback() {
        super.connectedCallback();
        this.loadData();
    }

    async loadData() {
        this.data = await fetchData();
    }
}
```

If `prepare()` previously guarded duplicate client fetches after SSR, use
`this.$fastController.isPrerendered` and `this.$fastController.isHydrated` to
decide whether client initialization should run.

## Verify `<f-template>` loading order

A declarative FASTElement component requires a JavaScript class definition with
`template: declarativeTemplate()` and an `<f-template>` whose `name` matches the
custom element tag name.

```html
<f-template name="my-counter">
    <template>
        <p>Count: {{count}}</p>
        <button @click="{increment()}">+1</button>
    </template>
</f-template>
```

```ts
import { attr, FASTElement } from "@microsoft/fast-element";
import { declarativeTemplate } from "@microsoft/fast-element/declarative.js";

class MyCounter extends FASTElement {
    @attr count: number = 0;
}

await MyCounter.define({
    name: "my-counter",
    template: declarativeTemplate(),
});
```

Template-first and definition-first loading both work, but the custom element
definition does not finish until the matching template is available. A common
pattern is to include `<f-template>` elements directly in the HTML page before
the script module loads.

## Migration checklist

1. Replace `@microsoft/fast-html` imports with
   `@microsoft/fast-element/declarative.js` and
   `@microsoft/fast-element/declarative-utilities.js`.
2. Replace `RenderableFASTElement(...).defineAsync()` with subclass `define()`.
3. Remove manual `TemplateElement.define()` calls.
4. Replace `TemplateElement.options()` with define extensions passed as the
   second argument to `define()`.
5. Remove `templateOptions`; use `template: declarativeTemplate()` when
   declarative markup supplies the template.
6. Configure `attributeMap({ "attribute-name-strategy": "none" })` only if you
   need v2 literal attribute-name behavior, and align the server renderer option.
7. Replace bare `e` in event handlers with `$e`.
8. Move `prepare()` logic to standard element lifecycle code.
9. If declarative output is server-rendered, complete the
   [Hydration and SSR migration](/docs/3.x/migration-guide/hydration/).

{% endraw %}
