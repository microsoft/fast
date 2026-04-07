# microsoft-fast-build

A server-side renderer for [FAST](https://www.fast.design/) declarative HTML templates, written in pure Rust with no external dependencies.

It takes FAST declarative HTML template syntax and a JSON state object, resolves bindings, evaluates conditionals, iterates repeats, and renders custom elements — producing static HTML ready to be served.

## Installation

Add the crate to your `Cargo.toml`:

```toml
[dependencies]
microsoft-fast-build = "0.1"
```

Or use `cargo add`:

```sh
cargo add microsoft-fast-build
```

## Usage

### Render with a JSON string

```rust
use microsoft_fast_build::render_template;

let html = render_template(
    "<h1>{{title}}</h1>",
    r#"{"title": "Hello, World!"}"#,
)?;
// html == "<h1>Hello, World!</h1>"
```

### Render with a parsed `JsonValue`

```rust
use microsoft_fast_build::{render, JsonValue};
use std::collections::HashMap;

let mut map = HashMap::new();
map.insert("name".to_string(), JsonValue::String("Alice".to_string()));
let state = JsonValue::Object(map);

let html = render("<p>{{name}}</p>", &state)?;
// html == "<p>Alice</p>"
```

Both functions return `Result<String, RenderError>`. See [Error Handling](#error-handling).

---

## Template Syntax

### Content Bindings

| Syntax | Description |
|--------|-------------|
| `{{expr}}` | HTML-escaped value from state |
| `{{{expr}}}` | Raw (unescaped) HTML value from state |

```html
<h1>{{title}}</h1>
<div>{{{richContent}}}</div>
```

### Single-Brace Passthrough

Single-brace expressions (`{expr}`) are FAST client-side-only bindings (event handlers, attribute directives). They are **never** interpreted by the server renderer.

In non-hydration rendering they pass through verbatim. When rendering **Declarative Shadow DOM** (inside a custom element's shadow template), client-side attribute directives — `f-ref`, `f-slotted`, `f-children` — are **stripped** from the HTML output, just like `@event` and `:property` bindings. The `data-fe-c` binding count still includes them so the FAST runtime can allocate the correct number of binding slots.

```html
<!-- Inside a shadow template — f-slotted, f-ref, f-children are stripped -->
<slot f-slotted="{slottedNodes}"></slot>
<video f-ref="{video}"></video>
<ul f-children="{listItems}"></ul>
```

### Boolean Attribute Bindings — `?attr`

The `?attr="{{expr}}"` syntax is a FAST convention for conditionally rendering a boolean HTML attribute. The renderer evaluates `expr` against the element's state:

- **truthy** → the bare attribute name is emitted (e.g. `disabled`)
- **falsy** → the attribute is omitted entirely

```html
<!-- Template -->
<input type="checkbox" ?disabled="{{!isEnabled}}">
<input ?disabled="{{activeGroup == currentGroup}}" type="button">

<!-- Rendered — isEnabled: false (so !isEnabled is true) -->
<input type="checkbox" disabled data-fe-c-0-1>

<!-- Rendered — activeGroup !== currentGroup -->
<input type="button" data-fe-c-0-1>
```

The `data-fe-c` compact marker is still emitted so the FAST client runtime knows to reconnect the binding during hydration.

### Dataset Attribute Bindings — `dataset.propertyName`

FAST elements follow the [MDN `HTMLElement.dataset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) convention: camelCase property names (e.g. `dateOfBirth`) correspond to kebab-case `data-*` HTML attributes (e.g. `data-date-of-birth`).

#### Passing `data-*` attributes to custom elements

When a custom element receives `data-*` attributes, the renderer groups them under a nested `"dataset"` key in the child state so that `{{dataset.X}}` bindings in the shadow template resolve naturally:

```html
<!-- Entry HTML -->
<test-el data-date-of-birth="{{dob}}"></test-el>

<!-- Shadow template of test-el -->
<div data-date-of-birth="{{dataset.dateOfBirth}}"></div>
```

With parent state `{"dob": "1990-01-01"}`, the shadow template receives child state `{"dataset": {"dateOfBirth": "1990-01-01"}}` and renders:

```html
<div data-date-of-birth="1990-01-01" data-fe-c-0-1></div>
```

The `data-*` → `dataset.*` mapping uses the same camelCase conversion as the browser: `data-date-of-birth` → `dataset.dateOfBirth`.

#### Using `{{dataset.X}}` bindings

`{{dataset.X}}` is ordinary dot-notation: it reads `state["dataset"]["X"]`. The `dataset` key must be present in state, either from a `data-*` attribute on the enclosing custom element or from a state object you supply directly:

```html
<!-- Works when state = {"dataset": {"name": "Alice"}} -->
<span>{{dataset.name}}</span>

<!-- Works in f-when -->
<f-when value="{{dataset.active}}">Active</f-when>
```

### Conditional Rendering — `<f-when>`

```html
<f-when value="{{isAdmin}}">Admin panel</f-when>
<f-when value="{{!isGuest}}">Member content</f-when>
<f-when value="{{status == 'active'}}">Active</f-when>
<f-when value="{{count > 0}}">Has items</f-when>
<f-when value="{{a || b}}">Either</f-when>
<f-when value="{{a && b}}">Both</f-when>
```

Supported operators: `==`, `!=`, `>=`, `>`, `<=`, `<`, `||`, `&&`, `!`

Operators can be chained — `&&` binds tighter than `||`, matching standard precedence:

```html
<f-when value="{{isAdmin && !isGuest && status == 'active'}}">Admin</f-when>
<f-when value="{{a || b || c}}">Any of the above</f-when>
<f-when value="{{isPublished || isAdmin && canPreview}}">Visible</f-when>
```

Right-hand operands can be string literals (`'foo'`), boolean literals (`true`/`false`), number literals (`42`), or other state references.

### Array Iteration — `<f-repeat>`

```html
<ul>
  <f-repeat value="{{item in items}}">
    <li>{{item.name}} — {{title}}</li>
  </f-repeat>
</ul>
```

Inside `<f-repeat>`, `{{item}}` resolves to the current loop variable and `{{$index}}` resolves to the 0-based iteration index. Other bindings fall back to the root state (e.g. `{{title}}` above).

```html
<f-repeat value="{{row in rows}}">
  <tr data-index="{{$index}}">
    <td>{{row.name}}</td>
  </tr>
</f-repeat>
```

### Nesting

`<f-when>` and `<f-repeat>` can be nested arbitrarily:

```html
<f-when value="{{show}}">
  <f-repeat value="{{row in rows}}">
    <f-repeat value="{{cell in row.cells}}">
      <span>{{cell}}</span>
    </f-repeat>
  </f-repeat>
</f-when>
```

### Property Access and Array Indexing

Dot-notation and numeric indices are both supported:

```html
{{user.address.city}}
{{list.0.name}}
```

---

## Custom Elements

When given a `Locator`, the renderer detects custom elements (any tag whose name contains a hyphen, excluding `f-when`/`f-repeat`) and renders their corresponding HTML template files.

### Setting up a Locator

```rust
use microsoft_fast_build::Locator;

// From glob patterns — scans the filesystem
let locator = Locator::from_patterns(&[
    "./components/**/*.html",
    "./templates/*.html",
])?;

// Or build manually (useful in tests)
let mut locator = Locator::from_templates(std::collections::HashMap::new());
locator.add_template("my-button", "<button>{{label}}</button>");
```

Glob patterns support `*` (any characters within one path segment), `**` (any number of segments), and `?` (any single character).

### HTML File Format

Template HTML files must wrap their content in an `<f-template>` element with a `name` attribute identifying the custom element, and an inner `<template>` element containing the template markup:

```html
<f-template name="my-button">
    <template>
        <button>{{label}}</button>
    </template>
</f-template>
```

A single file may contain multiple templates:

```html
<f-template name="my-header">
    <template>
        <header><h1>{{title}}</h1></header>
    </template>
</f-template>
<f-template name="my-footer">
    <template>
        <footer>{{copyright}}</footer>
    </template>
</f-template>
```

If an `<f-template>` element is missing a `name` attribute, a warning is emitted to stderr and the template is ignored.

### Rendering with a Locator

```rust
use microsoft_fast_build::{render_with_locator, render_template_with_locator, Locator};

let locator = Locator::from_patterns(&["./components/**/*.html"])?;

let html = render_template_with_locator(
    r#"<my-button label="Submit"></my-button>"#,
    r#"{"disabled": false}"#,
    &locator,
)?;
```

### Attribute → State Mapping

Attributes on a custom element become the state passed to its template:

| Attribute form | State entry |
|---|---|
| `disabled` (boolean, no value) | `{"disabled": true}` |
| `label="Click me"` | `{"label": "Click me"}` |
| `count="42"` | `{"count": "42"}` |
| `foo="{{bar}}"` | `{"foo": <value of bar from parent state>}` |
| `selected-user-id="42"` | `{"selected-user-id": "42"}` |
| `isEnabled="{{isEnabled}}"` | `{"isenabled": <resolved value>}` |
| `data-date-of-birth="1990-01-01"` | `{"dataset": {"dateOfBirth": "1990-01-01"}}` |
| `data-date-of-birth="{{dob}}"` | `{"dataset": {"dateOfBirth": <value of dob from parent state>}}` |
| `:myProp="{{expr}}"` | *(skipped — client-side only)* |
| `@click="{handler()}"` | *(skipped — client-side only)* |
| `f-ref="{video}"` | *(skipped — client-side only)* |
| `f-slotted="{nodes}"` | *(skipped — client-side only)* |
| `f-children="{items}"` | *(skipped — client-side only)* |

**HTML attribute keys are lowercased** — HTML attribute names are case-insensitive and browsers always store them lowercase. `isEnabled` becomes `isenabled`; hyphens are preserved so `selected-user-id` stays `selected-user-id`. Templates must reference the lowercase form.

**Attribute values are always strings** — except for boolean attributes (no value), which become `true`. Booleans and numbers must be passed via `{{binding}}` expressions so the resolved value from parent state (which can be any type) is used.

**`data-*` attributes** are always grouped under a nested `"dataset"` key. `data_attr_to_dataset_key` returns the full dot-notation path (e.g. `"dataset.dateOfBirth"`), which is split on `.` when building the nested state, making `{{dataset.X}}` bindings work naturally in shadow templates.

**Client-only bindings stripped from HTML and skipped from state**: `@attr` event bindings, `:attr` property bindings, and `f-ref`/`f-slotted`/`f-children` attribute directives are removed from the rendered HTML output and are not added to the child element's rendering scope — they are resolved entirely by the FAST client runtime. The `data-fe-c` binding count still includes them so the FAST runtime allocates the correct number of binding slots.

### Output Format

The renderer wraps the rendered template in Declarative Shadow DOM and adds the hydration attributes required by the FAST client runtime:

```html
<!-- Input -->
<my-button label="Submit">light DOM</my-button>

<!-- Output -->
<my-button label="Submit">
  <template shadowrootmode="open" shadowroot="open">
    <button>Submit</button>
  </template>
  light DOM
</my-button>
```

- `shadowroot="open"` — legacy declarative shadow DOM attribute for broader browser compatibility.

Custom elements that have no matching template in the locator are passed through verbatim.

---

## Hydration Markers

When a custom element's shadow template is rendered, the renderer emits **hydration markers** so the FAST client runtime can efficiently locate and patch DOM nodes without a full diff.

### Content binding markers

Each `{{expr}}` or `{{{expr}}}` text binding is wrapped in HTML comments:

```html
<!--fe-b$$start$$0$$title-0$$fe-b-->Hello world<!--fe-b$$end$$0$$title-0$$fe-b-->
```

The `0` is the **binding index** (increments per binding within the current template scope) and `title-0` is the **marker name** — formed as `<expression>-<binding index>`. This makes markers human-readable and unique within a scope.

### Attribute binding markers (compact format)

Elements with `{{expr}}` attribute values, `?attr="{{expr}}"` boolean bindings, or `{expr}` single-brace event/directive bindings receive a compact marker attribute. Client-only attributes (`@event`, `:property`, `f-ref`, `f-slotted`, `f-children`) are **stripped** from the HTML output but still counted in the marker:

```html
<!-- Template: <input type="{{type}}" disabled> -->
<input type="checkbox" disabled data-fe-c-0-1>

<!-- Template: <input ?disabled="{{!isEnabled}}"> — isEnabled: false → disabled rendered -->
<input disabled data-fe-c-0-1>

<!-- Template: <input ?disabled="{{show}}"> — show: false → attribute omitted -->
<input data-fe-c-0-1>

<!-- Template: <button @click="{handleClick()}">Label</button> — @click stripped -->
<button data-fe-c-0-1>Label</button>

<!-- Template: <slot f-slotted="{nodes}"></slot> — f-slotted stripped -->
<slot data-fe-c-0-1></slot>

<!-- Template: <video f-ref="{vid}" class="{{cls}}"> — f-ref stripped, 2 bindings -->
<video class="my-video" data-fe-c-0-2>
```

`data-fe-c-{startIndex}-{count}` — `startIndex` is the binding index of the first attribute binding on the element; `count` is the total number of attribute bindings.

### Scope boundaries

Each custom element shadow, `<f-when>` body, and `<f-repeat>` item template gets its own scope with the binding index reset to 0. Scopes don't carry numeric IDs — marker names are self-describing.

### Directive markers

```html
<!-- f-when at binding index 0 -->
<!--fe-b$$start$$0$$when-0$$fe-b-->
  [inner content, or empty if condition is false]
<!--fe-b$$end$$0$$when-0$$fe-b-->

<!-- f-repeat at binding index 0, 2 items -->
<!--fe-b$$start$$0$$repeat-0$$fe-b-->
<!--fe-repeat$$start$$0$$fe-repeat-->
  [item 0 — each binding named by its expression, e.g. item-0]
<!--fe-repeat$$end$$0$$fe-repeat-->
<!--fe-repeat$$start$$1$$fe-repeat-->
  [item 1 — binding index reset to 0 per item]
<!--fe-repeat$$end$$1$$fe-repeat-->
<!--fe-b$$end$$0$$repeat-0$$fe-b-->
```


## Error Handling

All render functions return `Result<String, RenderError>`. `RenderError` is an enum:

| Variant | Triggered by |
|---|---|
| `UnclosedBinding` | `{{` with no closing `}}` |
| `UnclosedUnescapedBinding` | `{{{` with no closing `}}}` |
| `EmptyBinding` | `{{}}` — blank expression |
| `MissingState` | `{{key}}` where `key` is absent from state |
| `UnclosedDirective` | `<f-when>` / `<f-repeat>` with no matching close tag |
| `MissingValueAttribute` | Directive missing `value="{{…}}"` attribute |
| `InvalidRepeatExpression` | Repeat value not in `item in list` format |
| `NotAnArray` | `<f-repeat>` binding resolves to a non-array value |
| `DuplicateTemplate` | Two or more files contain an `<f-template>` with the same name attribute |
| `TemplateReadError` | A matched template file could not be read |
| `JsonParse` | Invalid JSON passed to `render_template` |

Every error message includes a description of the problem and a snippet of the template near the error site to aid debugging:

```
missing state: '{{title}}' has no matching key in the provided state — template: "…<h1>{{title}}</h1>…"
unclosed binding '{{name': no closing '}}' found to end the expression — template: "Hello {{name"
duplicate template: element '<my-button>' is defined in multiple files: ./a/my-button.html, ./b/my-button.html
```
