# ViewTemplateConverter

`ViewTemplateConverter` is a format-agnostic class that converts structured
template descriptions into a FAST [`ViewTemplate`][viewtemplate]. All
input-specific logic lives in a **plugin**, making it straightforward to add
new input formats without touching the converter itself.

The package ships with a built-in **`json`** plugin that understands JSON
conforming to `src/view-template-schema.json`.

---

## Table of contents

- [Using ViewTemplateConverter with the json plugin](#using-viewtemplateconverter-with-the-json-plugin)
  - [Installation](#installation)
  - [Quick start](#quick-start)
  - [JSON template structure](#json-template-structure)
    - [Node types](#node-types)
    - [Attribute value types](#attribute-value-types)
  - [Examples](#examples)
- [Writing a custom plugin](#writing-a-custom-plugin)

---

## Using ViewTemplateConverter with the json plugin

### Installation

`ViewTemplateConverter` and `TemplateConverterPlugin` are exported from the
main package entry point. The `json` plugin is a separate export so that
tree-shakers can omit it when unused.

```ts
import { ViewTemplateConverter } from "@microsoft/fast-html";
import { json } from "@microsoft/fast-html/plugins/json.js";
import type { ViewTemplateJSON } from "@microsoft/fast-html/plugins/json.js";
```

### Quick start

```ts
import { ViewTemplateConverter } from "@microsoft/fast-html";
import { json } from "@microsoft/fast-html/plugins/json.js";

const template = new ViewTemplateConverter(json).create({
    nodes: [
        {
            type: "element",
            tagName: "span",
            children: [{ type: "binding", expression: "greeting" }],
        },
    ],
});
```

The `template` returned is a standard FAST `ViewTemplate` and can be used
wherever a `ViewTemplate` is accepted, including as the `template` property of
a `FASTElementDefinition`.

### JSON template structure

The input must be a `ViewTemplateJSON` object with a root `nodes` array.  The
full machine-readable specification is in `src/view-template-schema.json`.

#### Node types

| `type`           | Declarative equivalent                        | Description                                   |
|------------------|-----------------------------------------------|-----------------------------------------------|
| `"text"`         | Static text                                   | A literal string fragment.                    |
| `"binding"`      | `{{expression}}`                              | Binds a property path as text content.        |
| `"unescaped-html"` | `{{{expression}}}`                          | Injects raw HTML via `:innerHTML` on a `<div>`. |
| `"element"`      | `<tagName ...>`                               | Any HTML or custom element.                   |
| `"when"`         | `<f-when value="{{expression}}">`             | Conditional rendering.                        |
| `"repeat"`       | `<f-repeat value="{{item in list}}">`         | Repeat rendering over an array.               |

**`"text"`**

```json
{ "type": "text", "value": "Hello, world" }
```

**`"binding"`**

```json
{ "type": "binding", "expression": "greeting" }
```

Dot notation is supported (`"user.address.city"`).  
Inside a `repeat`, prefix with the loop variable (`"item.name"`).  
Use `"$c.parent.prop"` to access a host property from inside a `repeat`.

**`"unescaped-html"`**

```json
{ "type": "unescaped-html", "expression": "htmlContent" }
```

**`"element"`**

```json
{
    "type": "element",
    "tagName": "button",
    "attributes": {
        "class": { "type": "static", "value": "primary" },
        "click": { "type": "event", "handler": "handleClick" }
    },
    "children": [
        { "type": "text", "value": "Submit" }
    ]
}
```

**`"when"`**

```json
{
    "type": "when",
    "expression": "isVisible",
    "children": [
        { "type": "element", "tagName": "span", "children": [
            { "type": "text", "value": "Visible" }
        ]}
    ]
}
```

Supported `expression` forms: simple property (`"show"`), negation (`"!show"`),
comparison (`"count > 0"`, `"status == \"active\""`), logical chain (`"a && b"`, `"a || b"`),
context access (`"$c.parent.show"`).

**`"repeat"`**

```json
{
    "type": "repeat",
    "item": "item",
    "list": "items",
    "children": [
        { "type": "element", "tagName": "li", "children": [
            { "type": "binding", "expression": "item.label" }
        ]}
    ]
}
```

#### Attribute value types

Attribute values are configured via the `attributes` map on an `"element"` node.
The **key** is the attribute/event/property name; the **value** is one of the
types below.

| `type`       | Key convention           | Declarative equivalent                      |
|--------------|--------------------------|---------------------------------------------|
| `"static"`   | plain name               | `attr="literal"`                            |
| `"bound"`    | plain name               | `attr="{{expression}}"`                     |
| `"property"` | property name (no `:`  ) | `:prop="{{expression}}"`                    |
| `"boolean"`  | attr name (no `?`)       | `?attr="{{expression}}"`                    |
| `"event"`    | event name (no `@`)      | `@event="{handler(arg)}"`                   |
| `"ref"`      | `"f-ref"`                | `f-ref="{property}"`                        |
| `"slotted"`  | `"f-slotted"`            | `f-slotted="{property [filter elements()]}"`|
| `"children"` | `"f-children"`           | `f-children="{property}"`                   |

```json
"attributes": {
    "class":    { "type": "static",   "value": "card" },
    "title":    { "type": "bound",    "expression": "cardTitle" },
    "value":    { "type": "property", "expression": "inputValue" },
    "disabled": { "type": "boolean",  "expression": "isDisabled" },
    "click":    { "type": "event",    "handler": "handleClick", "argument": "e" },
    "f-ref":    { "type": "ref",      "property": "myElement" },
    "f-slotted":{ "type": "slotted",  "property": "slottedNodes",
                  "filter": { "type": "elements", "selectors": ["div", "p"] } },
    "f-children":{ "type": "children", "property": "childNodes" }
}
```

For `"event"`, the optional `argument` field controls what is passed to the handler:
- Omit or `""` → no argument: `handleClick()`
- `"e"` → DOM event: `handleClick(event)`
- Property name → that property's value: `handleClick(foo)`

### Examples

See `src/fixtures/json/` for JSON files covering each scenario:

| File                | Scenario                          |
|---------------------|-----------------------------------|
| `basic.json`        | Static slot                       |
| `binding.json`      | Content binding                   |
| `attr-reflect.json` | Multiple bindings in one element  |
| `event.json`        | Event handlers with arguments     |
| `when.json`         | Conditional rendering             |
| `repeat.json`       | Repeat over an array              |
| `dot-syntax.json`   | Nested property access            |
| `ref-slotted.json`  | `ref` and `slotted` directives    |
| `unescaped-html.json` | Raw HTML injection              |

---

## Writing a custom plugin

Implement the `TemplateConverterPlugin<TInput>` interface to support any input
format:

```ts
import {
    ViewTemplateConverter,
    type TemplateConverterPlugin,
    type TemplateConverterResult,
} from "@microsoft/fast-html";

interface MarkdownInput {
    source: string;
}

const markdown: TemplateConverterPlugin<MarkdownInput> = {
    convert({ source }: MarkdownInput): TemplateConverterResult {
        // Transform `source` into interleaved strings + FAST binding values.
        // This minimal example just renders static HTML.
        return { strings: [source], values: [] };
    },
};

const template = new ViewTemplateConverter(markdown).create({
    source: "<p>Hello, world</p>",
});
```

The `strings` and `values` arrays follow the same alternating convention as
tagged template literals:

```
strings[0]  values[0]  strings[1]  values[1]  strings[2]
```

- `strings` must have exactly one more element than `values`.
- Each value can be a binding function `(x, c) => any`, a FAST directive
  (`when(...)`, `repeat(...)`, `ref(...)`, etc.), or any other value accepted
  by `ViewTemplate.create`.

[viewtemplate]: https://www.fast.design/docs/fast-element/using-directives
