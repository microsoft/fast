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

In non-hydration rendering they pass through verbatim. When rendering **Declarative Shadow DOM** (inside a custom element's shadow template), client-side attribute directives — `f-ref`, `f-slotted`, `f-children` — are **stripped** from the HTML output, just like `@event` and `:property` bindings. The `data-fe` binding count still includes them so the FAST runtime can allocate the correct number of binding slots.

```html
<!-- Template source -->
<slot f-slotted="{slottedNodes}"></slot>
<video f-ref="{video}"></video>
<ul f-children="{listItems}"></ul>

<!-- Rendered output inside a shadow template — directive attributes are stripped -->
<slot data-fe="1"></slot>
<video data-fe="1"></video>
<ul data-fe="1"></ul>
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
<input type="checkbox" disabled data-fe="1">

<!-- Rendered — activeGroup !== currentGroup -->
<input type="button" data-fe="1">
```

The `data-fe` marker is still emitted so the FAST client runtime knows to reconnect the binding during hydration.

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
<div data-date-of-birth="1990-01-01" data-fe="1"></div>
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

### ARIA Attribute Bindings — `ariaPropertyName`

ARIA attributes follow the [Element ARIA reflection](https://developer.mozilla.org/en-US/docs/Web/API/Element#instance_properties_included_from_aria) convention: camelCase property names (e.g. `ariaDisabled`) correspond to `aria-*` HTML attributes (e.g. `aria-disabled`).

#### Passing `aria-*` attributes to custom elements

When a custom element receives `aria-*` attributes, the renderer converts them to their camelCase property name and stores them as top-level state keys using a static lookup table:

```html
<!-- Entry HTML -->
<test-el aria-label="Close dialog" aria-disabled="true"></test-el>

<!-- Shadow template of test-el -->
<button aria-label="{{ariaLabel}}" aria-disabled="{{ariaDisabled}}">×</button>
```

The shadow template receives child state `{"ariaLabel": "Close dialog", "ariaDisabled": "true"}`.

A lookup table is used instead of algorithmic conversion because ARIA attribute names do not place dashes at word boundaries — for example, `aria-valuenow` (not `aria-value-now`) maps to `ariaValueNow`.

### HTML Attribute-to-Property Mappings

Some HTML attributes have DOM property names that differ from their attribute names (e.g. `tabindex` → `tabIndex`, `readonly` → `readOnly`). When a custom element receives these attributes, the renderer converts them to their camelCase property name:

```html
<!-- Entry HTML -->
<test-el tabindex="0" readonly="true"></test-el>

<!-- Shadow template of test-el -->
<input tabindex="{{tabIndex}}" readonly="{{readOnly}}">
```

The shadow template receives child state `{"tabIndex": "0", "readOnly": "true"}`.

Only attributes where the property name differs are in the lookup table. Attributes like `disabled`, `title`, and `hidden` whose attribute and property names are identical pass through as-is.

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

When `value` is a bare reference (e.g. `{{items}}`), the value is coerced to a boolean using JavaScript semantics. Because the input state is JSON, users cannot provide `undefined` directly; however, missing state properties or unresolved paths behave like JavaScript `undefined` and are treated as falsy.

| Type | Falsy | Truthy |
|---|---|---|
| `null` | always | — |
| `boolean` | `false` | `true` |
| `number` | `0`, `NaN` | any other |
| `string` | `""` | any non-empty |
| `array` | — | always (even `[]`) |
| `object` | — | always (even `{}`) |

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

### Property Access, Array Indexing, and `.length`

Dot-notation, numeric indices, and the special `.length` property on arrays are all supported:

```html
{{user.address.city}}
{{list.0.name}}
{{items.length}}
```

`{{items.length}}` resolves to the number of elements in the array. It can be used in both content bindings and `<f-when>` expressions:

```html
<f-when value="{{items.length > 0}}">
  <p>{{items.length}} items found</p>
</f-when>
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

> **Note:** `Locator::from_patterns` walks the filesystem recursively up to 50 directory levels deep and skips symlinks. Symlinked directories are never followed, guarding against cycles in the directory tree.

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

### Rendering entry HTML (root custom elements)

When rendering the top-level **entry HTML** of a page, use `render_entry_with_locator` or `render_entry_template_with_locator`. Custom elements found at this level are treated as **root elements** — their opening-tag `{{binding}}` attributes are resolved (primitives kept, non-primitives stripped) rather than forwarded verbatim.

All custom elements (root and nested) receive the full root state merged with their HTML attribute-derived state. Attribute-derived values take precedence over root state for overlapping keys. This gives every element access to the complete state tree without requiring explicit attribute bindings.

```rust
use microsoft_fast_build::{render_entry_with_locator, render_entry_template_with_locator, Locator};

let locator = Locator::from_patterns(&["./components/**/*.html"])?;

// Root custom elements (my-header, my-app) receive the full root state merged with
// any per-element attributes. Their templates can reference any key in the state JSON directly.
let html = render_entry_template_with_locator(
    r#"{{heading}}<my-header></my-header><my-app planet="earth"></my-app>"#,
    r#"{"heading": "Hello", "user": "Alice", "items": [{"name": "Item 1"}]}"#,
    &locator,
)?;
// my-header's template can use {{user}}, {{heading}}, etc. directly.
// my-app's template can use {{items}}, {{planet}}, etc. directly.
```

### State Propagation

All custom elements — whether at the entry level or deeply nested — receive the current root state as a base for their child state. Per-element HTML attributes are overlaid on top, with attribute-derived values taking precedence over any matching root state keys.

This means unbound state keys automatically propagate through the entire element tree. A child element can reference any state key from its ancestors without requiring explicit attribute bindings on every intermediate element:

```html
<!-- state.json: {"text": "Hello world"} -->

<!-- my-el's template -->
<f-template name="my-el">
    <template>
        {{text}}
        <my-child-el></my-child-el>
    </template>
</f-template>

<!-- my-child-el's template — {{text}} resolves automatically from propagated state -->
<f-template name="my-child-el">
    <template>
        {{text}}
    </template>
</f-template>
```

Both `my-el` and `my-child-el` render "Hello world" — the state propagates through the element tree without any explicit bindings.

#### Attribute handling on root elements

Root custom elements (rendered via `render_entry_*`) have their opening-tag `{{binding}}` attributes resolved in the rendered HTML output:

- **Primitive bindings** (`string`, `number`, `boolean`) — resolved and rendered with the resolved value. e.g. `text="{{message}}"` → `text="Hello world"`.
- **Non-primitive bindings** (`array`, `object`, `null`) — stripped from the HTML output (the state is still available in the element's template via state propagation).
- **Static attributes** (no binding syntax) — passed through unchanged.

| Context | Child state source | `{{binding}}` attrs in rendered HTML |
|---|---|---|
| Root element in entry HTML (via `render_entry_*`) | Root state merged with element's own attrs | Resolved — primitives kept, non-primitives stripped |
| Nested element inside a shadow template | Parent state merged with element's own attrs | Rendered (resolved) |
| Element inside `f-repeat` or `f-when` (at any level) | Parent state merged with element's own attrs | Rendered (resolved) |

```html
<!-- Entry HTML — my-parent gets root state + its own attrs; label="Hello" rendered, list stripped -->
<my-parent label="{{title}}" list="{{items}}" planet="earth"></my-parent>

<!-- my-parent's template — my-child inherits parent state + gets its own attrs overlaid -->
<my-child label="{{heading}}" :items="{{items}}"></my-child>
```

### Attribute → State Mapping

Attributes on a custom element become the state passed to its template:

| Attribute form | State entry |
|---|---|
| `disabled` (boolean, no value) | `{"disabled": true}` |
| `label="Click me"` | `{"label": "Click me"}` |
| `count="42"` | `{"count": "42"}` |
| `items="{{items}}"` | `{"items": <value of items from parent state>}` (array, object, or any type) |
| `:items="{{items}}"` | `{"items": <value of items from parent state>}` — same as above but **not rendered as an HTML attribute** |
| `foo="{{bar}}"` | `{"foo": <value of bar from parent state>}` |
| `selected-user-id="42"` | `{"selected-user-id": "42"}` (or `{"selectedUserId": "42"}` with `camelCase` strategy) |
| `isEnabled="{{isEnabled}}"` | `{"isenabled": <resolved value>}` |
| `data-date-of-birth="1990-01-01"` | `{"dataset": {"dateOfBirth": "1990-01-01"}}` |
| `data-date-of-birth="{{dob}}"` | `{"dataset": {"dateOfBirth": <value of dob from parent state>}}` |
| `aria-disabled="true"` | `{"ariaDisabled": "true"}` |
| `aria-label="{{label}}"` | `{"ariaLabel": <value of label from parent state>}` |
| `tabindex="0"` | `{"tabIndex": "0"}` |
| `readonly="true"` | `{"readOnly": "true"}` |
| `contenteditable="true"` | `{"contentEditable": "true"}` |
| `:myProp="{{expr}}"` | `{"myprop": <resolved value>}` — **not rendered as an HTML attribute** |
| `@click="{handler()}"` | *(skipped — client-side only)* |
| `f-ref="{video}"` | *(skipped — client-side only)* |
| `f-slotted="{nodes}"` | *(skipped — client-side only)* |
| `f-children="{items}"` | *(skipped — client-side only)* |

**HTML attribute keys are lowercased** — HTML attribute names are case-insensitive and browsers always store them lowercase. `isEnabled` becomes `isenabled`; hyphens are preserved so `selected-user-id` stays `selected-user-id`. Templates must reference the lowercase form. When the `attribute-name-strategy` configuration is set to `"camelCase"`, dashed attribute names that are not handled by specialized lookup tables (`data-*`, `aria-*`, HTML global attributes) are converted to camelCase instead: `selected-user-id` becomes `selectedUserId`, matching `{{selectedUserId}}` in the template. See the [Configuration](#configuration) section for details.

**Attribute value coercion** — attribute values are resolved in this order:
- No value (boolean attribute) → `true`
- `"{{binding}}"` → resolved from parent state (any type: string, number, boolean, array, or object)
- Value starting with `[` or `{` → parsed as a JSON array or object literal (e.g. `items='["a","b","c"]'`)
- Anything else → `String` (e.g. `count="42"` yields `{"count": "42"}`; use `count="{{count}}"` to get a number)

**Use `:prop="{{binding}}"` to pass arrays and objects from state without polluting HTML attributes** — the `:` prefix causes the attribute to be stripped from the rendered HTML while still forwarding the resolved value (which can be an array or object) into the child element's rendering state. Alternatively, JSON array or object literals can be inlined directly as attribute values (e.g. `items='["a","b","c"]'`), which is useful when the data is static and does not come from parent state.

**`data-*` attributes** are always grouped under a nested `"dataset"` key. `data_attr_to_dataset_key` returns the full dot-notation path (e.g. `"dataset.dateOfBirth"`), which is split on `.` when building the nested state, making `{{dataset.X}}` bindings work naturally in shadow templates.

**`aria-*` attributes** are converted to their camelCase ARIA property name (e.g. `aria-disabled` → `ariaDisabled`, `aria-valuenow` → `ariaValueNow`) using a static lookup table, following the [Element ARIA reflection](https://developer.mozilla.org/en-US/docs/Web/API/Element#instance_properties_included_from_aria) convention. Unrecognised `aria-*` attributes fall through to the default lowercased-key path.

**HTML attributes with mismatched property names** (e.g. `tabindex` → `tabIndex`, `readonly` → `readOnly`, `contenteditable` → `contentEditable`) are converted to their camelCase DOM property name using a static lookup table. Only attributes where the property name differs are included — attributes like `disabled`, `title`, and `hidden` pass through as-is.

**`@event` bindings and `f-ref`/`f-slotted`/`f-children` directives are skipped entirely** — not added to child state and removed from rendered HTML. They are resolved purely by the FAST client runtime. The `data-fe` binding count still includes them so the FAST runtime allocates the correct number of binding slots.

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

## Configuration

The `RenderConfig` struct provides configuration options that control rendering behaviour. Pass `Some(&config)` to any render function, or `None` for defaults.

### `attribute-name-strategy`

Controls how HTML attribute names are mapped to state property names when building child state for custom elements.

| Strategy | Behaviour | Example |
|---|---|---|
| `"none"` (default) | Attribute names are lowercased as-is. Dashes preserved. | `foo-bar` → `{{foo-bar}}` |
| `"camelCase"` | Dashed attribute names are converted to camelCase. | `foo-bar` → `{{fooBar}}` |

The `camelCase` strategy only applies to "plain" attributes. It does **not** affect:
- `data-*` attributes (always use `dataset.*` grouping)
- `aria-*` attributes (always use ARIA reflection lookup)
- HTML global attributes with known property names (e.g. `tabindex` → `tabIndex`)
- `:prop` property bindings (always lowercased)

#### Rust API

```rust
use microsoft_fast_build::{RenderConfig, AttributeNameStrategy, render_template_with_locator};

let config = RenderConfig::new()
    .with_attribute_name_strategy(AttributeNameStrategy::CamelCase);

let result = render_template_with_locator(
    r#"<my-el foo-bar="hello"></my-el>"#,
    r#"{}"#,
    &locator,
    Some(&config),
)?;
// In my-el's template, use {{fooBar}} instead of {{foo-bar}}
```

#### WASM / JavaScript API

```javascript
const html = render_entry_with_templates(
    entry,
    templatesJson,
    stateJson,
    "camelCase"  // or "none"
);
```

Passing `"none"` or `""` as the strategy uses the default behaviour.

---

## Hydration Markers

When a custom element's shadow template is rendered, the renderer emits **hydration markers** so the FAST client runtime can efficiently locate and patch DOM nodes without a full diff.

### Content binding markers

Each `{{expr}}` or `{{{expr}}}` text binding is wrapped in data-free HTML comment markers:

```html
<!--f:b-->Hello world<!--f:/b-->
```

Markers carry no binding index or expression name. They are matched by string equality and paired using balanced depth counting.

### Attribute binding markers

Elements with `{{expr}}` attribute values, `?attr="{{expr}}"` boolean bindings, or `{expr}` single-brace event/directive bindings receive a `data-fe="N"` marker attribute where `N` is the binding count. Client-only attributes (`@event`, `:property`, `f-ref`, `f-slotted`, `f-children`) are **stripped** from the HTML output but still counted in the marker:

```html
<!-- Template: <input type="{{type}}" disabled> -->
<input type="checkbox" disabled data-fe="1">

<!-- Template: <input ?disabled="{{!isEnabled}}"> — isEnabled: false → disabled rendered -->
<input disabled data-fe="1">

<!-- Template: <input ?disabled="{{show}}"> — show: false → attribute omitted -->
<input data-fe="1">

<!-- Template: <button @click="{handleClick()}">Label</button> — @click stripped -->
<button data-fe="1">Label</button>

<!-- Template: <slot f-slotted="{nodes}"></slot> — f-slotted stripped -->
<slot data-fe="1"></slot>

<!-- Template: <video f-ref="{vid}" class="{{cls}}"> — f-ref stripped, 2 bindings -->
<video class="my-video" data-fe="2">
```

`data-fe="N"` — `N` is the total number of attribute bindings on the element.

### Scope boundaries

Each custom element shadow, `<f-when>` body, and `<f-repeat>` item template gets its own scope with the binding index reset to 0. Scopes don't carry numeric IDs — markers are data-free and paired by balanced depth counting.

### Directive markers

```html
<!-- f-when -->
<!--f:b-->
  [inner content, or empty if condition is false]
<!--f:/b-->

<!-- f-repeat with 2 items -->
<!--f:b-->
<!--f:r-->
  [item 0 — binding index reset to 0 per item]
<!--f:/r-->
<!--f:r-->
  [item 1 — binding index reset to 0 per item]
<!--f:/r-->
<!--f:/b-->
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

---

## Numeric Precision

The hand-rolled JSON parser stores all numbers as `f64`. This means integers larger than 2^53 (9,007,199,254,740,992) lose precision, as is the case with standard JavaScript `number` values. For typical use cases (IDs, counts, display values) this is not a concern. If your state contains very large integers, represent them as strings and bind with `{{expr}}` accordingly.
