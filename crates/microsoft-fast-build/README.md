# microsoft-fast-build

A server-side renderer for [FAST](https://www.fast.design/) declarative HTML templates, written in Rust. Rendering uses a lightweight scanner; authored slot analysis uses a standards-based HTML parser.

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

### Render simulated stream chunks

Streaming APIs return precomputed HTML chunks in memory. Joining the chunks
matches the equivalent non-streamed render, while chunk boundaries are chosen
around content bindings and custom elements. Stream rendering uses the same
top-level preprocessing as normal rendering, including automatic escaping of
FAST-like syntax inside `<code>` elements.

```rust
use microsoft_fast_build::{render_template, render_template_stream};

let chunks = render_template_stream(
    "<p>{{message}}</p>",
    r#"{"message": "Hello"}"#,
    None,
)?;

let html = render_template(
    "<p>{{message}}</p>",
    r#"{"message": "Hello"}"#,
    None,
)?;

assert_eq!(chunks, vec!["<p>", "Hello", "</p>"]);
assert_eq!(chunks.join(""), html);
```

Custom element streaming uses the `*_stream_with_locator` and
`render_entry_*_stream_with_locator` APIs. For entry HTML, a custom element's
opening tag chunk includes the complete Declarative Shadow DOM template; light
DOM content follows in later chunks. Template host attributes declared on the
inner `<template>` element are merged onto the streamed host opening tag with
the same author-wins and client-only-attribute filtering rules as normal
rendering.

---

## Plugin integration APIs

`render_shadow_root_with_locator(element_name, state, locator, config)` renders
only the complete Declarative Shadow DOM `<template>` fragment. Its JSON-state
counterpart is `render_shadow_root_template_with_locator(element_name,
state: Option<&str>, locator, config)`. Pass resolved **component state**;
these APIs do not synthesize a host, overlay host attributes, emit template-host
attributes, or render caller-owned light DOM. Nested components, code-sample
escaping, and fresh v3/v2 hydration scopes use the whole-host rendering path.
Unknown template names and invalid JSON state return explicit errors.

```rust
use microsoft_fast_build::{
    parse_f_templates, render_shadow_root_template_with_locator, Locator,
};

let definitions = parse_f_templates(
    r#"<f-template name="my-card"><template>{{title}}</template></f-template>"#,
);
let locator = Locator::from_metadata(definitions)?;
let fragment = render_shadow_root_template_with_locator(
    "my-card", Some(r#"{"title":"Hello"}"#), &locator, None,
)?;
```

`parse_f_templates` is also a public native API. It returns `Vec<FTemplate>`
with `format_version`, `bindings`, name/content, and host/shadow-root attributes.
`BindingMetadata` records direct names, expressions, syntax kinds, lexical
paths, and nested `BindingScope { variable, iterable }` frames. Application
types and required/optional declarations remain unknown (`None`); repeat
collections alone have a known array requirement. Metadata describes syntax,
not a state schema or a full validation certificate. Code samples are excluded.
`Locator::from_metadata` validates names, duplicates, and the format version.
Legacy content/tuple constructors remain supported.

Each `BindingMetadata` also has a `span: SourceSpan` containing `start` and `end`
`SourcePosition` records. Positions refer to the complete original input to
`parse_f_templates`, including document prefixes and whitespace removed from the
returned content. `offset` is zero-based UTF-16, **not a Rust byte index**; `line`
and `column` are one-based, with columns measured in UTF-16 code units. Tabs count
as one column and non-BMP characters as two. CRLF is one line break and two offset
units; lone CR and LF each start a new line.

Spans are half-open and cover trimmed expressions without braces. Repeat spans
cover the iterable, matching the existing expression metadata; lexical scopes are
unchanged. Attribute entities retain their authored spelling. Code-sample
preprocessing does not shift later spans. Bindings and FAST directive markup
inside HTML comments remain unsupported.

The WASM exports are `parse_f_templates(html)` (JSON metadata array) and
`render_shadow_root(elementName, templatesJson, state?, attributeNameStrategy?,
markers_v2?)`. Generated declarations include `FTemplateMetadata`,
`TemplateBinding`, `TemplateBindingScope`, `TemplateSourceSpan`, and
`TemplateSourcePosition`. Each generated record has
`formatVersion: 1`; render exports reject unsupported or malformed explicit
versions, while still accepting unversioned maps and string-valued definitions.

### Authored slot declarations

```rust
use microsoft_fast_build::extract_template_slots;

let source = "<f-template name=\"my-card\">\n    <template>\n        <slot name=\"title\"></slot>\n        <slot></slot>\n    </template>\n</f-template>";
let slots = extract_template_slots(source, "my-card")?;
assert_eq!(slots[0].name, "title");
assert_eq!((slots[0].line, slots[0].column), (3, 9));
assert_eq!(slots[1].name, "");
```

The native API returns `Result<Vec<TemplateSlot>, RenderError>`; the WASM export
`extract_template_slots(html, templateName)` returns the same array as JSON.
`TemplateSlot` contains `name`, `line`, and `column`; the generated TypeScript
declarations expose the same interface.

Names are HTML-entity-decoded authored values, not evaluated bindings. Default
slots have the empty name `""`. Declarations retain source order and duplicates.
One-based lines/UTF-16 columns identify the opening `<` in the complete original
HTML argument. Tabs count as one code unit, non-BMP characters as two, and CRLF
as one line break (lone CR/LF also break). Extract from original source before
style composition, code escaping, or rendering; transformed input cannot recover
original-file coordinates.

Selection requires a nonempty, case-sensitive decoded definition name, exactly
one matching HTML `<f-template>`, and exactly one direct HTML `<template>` child.
The HTML tree builder supplies namespace handling, entity decoding, raw-text
contexts, and normal HTML error recovery without executing scripts. Scripting
is enabled for parsing `noscript` as raw text. Comments, escaped markup, and
slot-like text in attributes, scripts, styles, or RCDATA are not declarations.
Only HTML slots count, including those at SVG/MathML HTML integration points.

Nested ordinary templates and conditional/repeated bodies are inspected once
per authored declaration without state evaluation. Nested component definitions
and templates carrying `shadowrootmode` or legacy `shadowroot` are separate
authored scopes and are excluded, as are siblings and publisher markup outside
the selected inner template. Declarative shadow roots are not attached.

A valid component with no slots returns an empty vector. Failures use
`invalid-template-metadata` (empty selector/duplicate matching definitions),
`missing-template`, `missing-inner-template`, or `multiple-inner-templates`.
Located failures include the selected name and authored definition/second
conflicting opening tag. Rendering, `parse_f_templates`, binding metadata, and
format version 1 remain unchanged.

### Nullable and boolean attributes

Missing or explicit `null` bindings omit the entire attribute, including when
embedded in a literal value such as `href="/prefix/{{value}}"`. An explicit
empty string remains `href=""`. Boolean JSON values bound to known HTML boolean
attributes use presence/absence; ordinary attributes such as `aria-hidden`
still serialize booleans as `"true"`/`"false"`. `?name="{{expr}}"` remains the
recommended truthy/falsy form for matching browser-side FAST behavior.
Omitted bindings still reserve hydration slots. An author binding that resolves
to absence overrides template-host defaults rather than reintroducing them.
See the [migration guide](../../packages/fast-build/docs/migration/plugin-integrations.md)
for intentional changes from earlier output.

## Template Syntax

Bindings and FAST directive markup inside HTML comments are unsupported.
Commenting out bound markup does not reliably disable its bindings and can cause
rendering errors or client hydration mismatches. Remove unused bound markup
instead, and keep explanatory comments free of binding syntax and FAST directive
tags.

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
If the list binding or dot path is missing, `<f-repeat>` treats it as an empty array and renders zero iterations. Present non-array values still return `RenderError::NotAnArray`.

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

If an `<f-template>` element is missing a `name` attribute, a warning is emitted to stderr and the template is ignored. The parser follows browser tag boundaries for the `<f-template>` and inner `<template>` wrappers, including ASCII whitespace before `>` in opening and closing tags.

Any `shadowroot*` attributes on `<f-template>` are copied to the rendered Declarative Shadow DOM `<template>`. The renderer normalizes `shadowrootmode` and legacy `shadowroot` for compatibility: when neither has a non-empty value, it emits `shadowrootmode="open" shadowroot="open"`; when exactly one has a non-empty value, that value is mirrored to the other; when both have explicit non-empty values, both are preserved as authored, even if they conflict.

### Composing CSS into an `<f-template>` — `compose_f_template_styles`

`compose_f_template_styles` inserts a `<style>` element as the first child of an `<f-template>` definition's inner `<template>`, entirely in memory:

```rust
use microsoft_fast_build::compose_f_template_styles;

let template_html = r#"
    <f-template name="my-button">
        <template>
            <button>{{label}}</button>
        </template>
    </f-template>
"#;

let composed = compose_f_template_styles(
    template_html,
    ":host { display: inline-block; }",
)?;
// composed now has <style>:host { display: inline-block; }</style> as the
// first child of the inner <template>, with every other byte preserved.
```

This has no filesystem requirement — `template_html` and `css` can come from any source (a build pipeline, a bundler plugin, generated CSS). The result is ordinary `<f-template>` source: write it to a file for `Locator::from_patterns` to discover, or pass it to `locator::parse_f_templates` directly.

Validation:

- `template_html` must contain exactly one `<f-template>` element, and that element must contain exactly one inner `<template>` element, or the call returns an error (`MissingFTemplate`, `MultipleFTemplates`, `MissingInnerTemplate`, `MultipleInnerTemplates`).
- `css` must not contain a case-insensitive `</style` raw-text terminator sequence (e.g. `</style>`, `</STYLE >`, `</style/`) — this would prematurely close the inserted `<style>` element. Content like `content: "</stylesheet>"` is not affected, since `style` must be followed by whitespace, `/`, `>`, or end of string to count as a terminator.

The WASM build exposes the same function as `compose_f_template_styles(templateHtml, css)`, throwing a JS error on any validation failure.

#### Delivery options and original-source mapping

Use the options API when selecting stylesheet delivery or retaining diagnostics:

```rust
use microsoft_fast_build::{compose_f_template_styles_with_options, Stylesheet};

let composed = compose_f_template_styles_with_options(
    template_html,
    Stylesheet::Inline {
        css: ":host { display: block; }",
        style_id: Some("my-button-styles-v1"),
    },
)?;
let external = compose_f_template_styles_with_options(
    template_html,
    Stylesheet::External { href: "/assets/my-button.css" },
)?;
```

`ComposedTemplate::html()` borrows the composed definition. `map_span(start, end)` accepts
half-open UTF-16 offsets in that complete document. `map_location(location, false)`
accepts full-document diagnostics; `true` selects this definition's trimmed inner
content, as used by locator/shadow-root errors. Check the error's template name
before mapping; another definition needs its own map. Results identify `Html`,
`Css`, or `Generated`; only authored sources have a `SourceSpan`. Invalid ranges
and ranges crossing sources return `InvalidComposition`.

The WASM options API accepts a typed JavaScript object and returns a
`ComposedTemplate` handle with `html`, `source_map` (JSON), `map_span`, and
`map_location` (both returning JSON). Call `free()` when finished. See the
[npm integration contract](../../packages/fast-build/README.md#stylesheet-delivery-composition)
for examples and mapping fields.

Inline identities emit `data-fast-ssr-style`. URLs and identities are escaped,
nonblank static strings without control characters or braces. The marker names
caller-owned replacement CSS and may be shared across instances; it is not a CSP
nonce. Generated markup is always first, and existing styles stay untouched.
The composer does not fetch URLs, build assets, adopt stylesheets, or remove
fallbacks. A runtime may remove only matching fallbacks after successful
replacement attachment, coordinated with hydration. Constructed and ordinary
stylesheets do not have equivalent cascade ordering.

CSS bodies remain raw text during parsing, rendering (including streaming),
binding discovery, and conversion. Unsafe CSS diagnostics expose CSS coordinates
and `source_kind() == Some("css")` (`sourceKind: "css"` in WASM). Original HTML
coordinates require retaining and using the composition map; passing `.html`
alone does not remap downstream diagnostics automatically.

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

- `shadowrootmode="open"` — the standard declarative shadow DOM mode emitted by default.
- `shadowroot="open"` — legacy declarative shadow DOM attribute for broader browser compatibility.
- `shadowroot*` attributes declared on the source `<f-template>` are forwarded to the output `<template>`; `shadowrootmode` and `shadowroot` default to `open` when neither has a non-empty value, mirror when exactly one has a non-empty value, and are preserved as authored when both have explicit non-empty values.

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
    .with_attribute_name_strategy(AttributeNameStrategy::CamelCase)
    .with_markers_v2(true);

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
    "camelCase", // or "none"
    false,       // optional stream flag
    true         // optional markers_v2 flag
);

const chunksJson = render_entry_with_templates(
    entry,
    templatesJson,
    stateJson,
    "camelCase",
    true,
    true
);
```

Use `render_with_templates` for the original non-entry template-rendering semantics; use `render_entry_with_templates` for top-level entry HTML rendering. Passing `true` as the optional fifth argument switches `render_entry_with_templates` to stream mode and returns a JSON array string of HTML chunks; omitted or `false` returns normal HTML. Passing `true` as the optional sixth `markers_v2` argument emits FAST Element 2.x indexed hydration markers.

Passing `"none"` or `""` as the strategy uses the default behaviour.

---

## Hydration Markers

When a custom element's shadow template is rendered, the renderer emits **hydration markers** so the FAST client runtime can efficiently locate and patch DOM nodes without a full diff.

FAST Element 3.x data-free markers are emitted by default. Set
`RenderConfig::with_markers_v2(true)` in Rust, or pass the `markers_v2` WASM/CLI
option, to emit FAST Element 2.x indexed markers for a client configured with
`enableHydration({ markers: markers_v2 })`.

### Content binding markers

Each `{{expr}}` or `{{{expr}}}` text binding is wrapped in data-free HTML comment markers:

```html
<!--fe:b-->Hello world<!--fe:/b-->
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
<!--fe:b-->
  [inner content, or empty if condition is false]
<!--fe:/b-->

<!-- f-repeat with 2 items -->
<!--fe:b-->
<!--fe:r-->
  [item 0 — binding index reset to 0 per item]
<!--fe:/r-->
<!--fe:r-->
  [item 1 — binding index reset to 0 per item]
<!--fe:/r-->
<!--fe:/b-->
```


## Error Handling

Render functions return `Result<_, RenderError>` (HTML or stream chunks).
`RenderError` exposes `code()`, `location() -> Option<ErrorLocation>`, and
`template_name()`. `ErrorLocation` has one-based `line` and UTF-16 `column`, plus
a UTF-16 `length`. Match `error.kind()` to inspect variants through source-location
wrappers. WASM failures are JavaScript `Error` instances with these details as
properties, not plain strings. See the [source-coordinate contract and migration
notes](../../packages/fast-build/README.md#structured-errors).

| Variant | Code | Triggered by |
|---|---|---|
| `InvalidTemplateMetadata` | `invalid-template-metadata` | Unsupported version, missing name, or duplicate metadata name |
| `UnknownTemplate` | `missing-template` | Shadow-root render requests an unknown definition |
| `UnclosedBinding` | `unclosed-binding` | `{{` with no closing `}}` |
| `UnclosedUnescapedBinding` | `unclosed-unescaped-binding` | `{{{` with no closing `}}}` |
| `EmptyBinding` | `empty-binding` | Blank binding expression |
| `MissingState` | `missing-state` | Required directive state is absent; missing repeat lists still render zero iterations |
| `UnclosedDirective` | `unclosed-directive` | Directive/custom element with no matching close tag |
| `MissingValueAttribute` | `missing-value-attribute` | Directive missing a valid `value="{{…}}"` |
| `InvalidRepeatExpression` | `invalid-repeat-expression` | Repeat value not in `item in list` format |
| `NotAnArray` | `repeat-not-array` | Repeat binding resolves to a non-array |
| `DuplicateTemplate` | `duplicate-template` | Multiple files define the same name |
| `TemplateReadError` | `template-read-error` | A matched template file could not be read |
| `JsonParse` | `invalid-state-json` | Invalid JSON state |
| `MissingFTemplate` | `missing-f-template` | Composition input has no outer wrapper |
| `MultipleFTemplates` | `multiple-f-templates` | Composition input has multiple outer wrappers |
| `MissingInnerTemplate` | `missing-inner-template` | Composition input has no inner template |
| `MultipleInnerTemplates` | `multiple-inner-templates` | Composition input has multiple inner templates |
| `UnsafeStyleContent` | `unsafe-style-content` | Separately supplied CSS contains a `</style` terminator |
| `InvalidComposition` | `invalid-composition` | Invalid stylesheet options or source mapping range |

`Located` preserves its underlying variant's code/message. WASM template-map JSON
and attribute-record validation also use `invalid-template-metadata`; an invalid
WASM attribute-name strategy uses `invalid-attribute-name-strategy`. These failures
do not acquire HTML coordinates.

Messages retain the existing explanation and include a snippet when available:

```
type error: '{{items}}' must resolve to a JSON array for use in <f-repeat> — template: "…<f-repeat value=\"{{item in items}}\">…"
unclosed binding '{{name': no closing '}}' found to end the expression — template: "Hello {{name"
duplicate template: element '<my-button>' is defined in multiple files: ./a/my-button.html, ./b/my-button.html
```

---

## Numeric Precision

The hand-rolled JSON parser stores all numbers as `f64`. This means integers larger than 2^53 (9,007,199,254,740,992) lose precision, as is the case with standard JavaScript `number` values. For typical use cases (IDs, counts, display values) this is not a concern. If your state contains very large integers, represent them as strings and bind with `{{expr}}` accordingly.

## Renderer performance

Tag and binding discovery uses a forward event scan rather than repeated
remaining-suffix searches for each directive kind. Adjacent custom elements
and plain tags no longer incur those quadratic searches. Rendered HTML,
attribute handling, default markers, and `markers_v2` remain compatible.
Templates still render recursively; this is not a compiled-template or lazy
streaming API. Stream functions continue to return fully materialized chunks.

From a FAST repository checkout, run the native benchmarks and parity tests:

```sh
cargo bench --manifest-path crates/microsoft-fast-build/Cargo.toml --bench render
cargo test --manifest-path crates/microsoft-fast-build/Cargo.toml
```

Criterion separates parsed-state rendering, state parsing plus rendering, and
locator construction. Shared fixtures cover 1k/5k/20k instances and
50/200/1,000 definitions with payload sizes 1/20 in both marker modes.
See [performance baselines](benchmark-baselines/README.md) for the packaged
WASM runner, golden hashes, scaling checks, RSS measurement, and limitations.

The guide also records post-scanner repeat/state-overlay and many-definition
profiles, with bounded workload commands and symbolized native CPU sampling
through Criterion's `--profile-time` mode. Those measurements identify child-state
copying as the next repeat/overlay target; they do not claim that memory or
allocation targets have been met.

For native allocation baselines, use the opt-in development example or the
fresh-process matrix runner from the repository root:

```sh
node crates/microsoft-fast-build/benches/profile-allocations.mjs --output=/tmp/fast-allocations.json
cargo run --manifest-path crates/microsoft-fast-build/Cargo.toml --release --features allocation-profiling --example profile-allocations -- --case=repeat_custom_elements --count=250 --mode=v3 --phase=render
```

The feature does not instrument the library or shipped WASM. Reports count
only allocations on the measuring thread within the selected phase, excluding
prepared inputs and report generation. See the baseline guide for controls,
output retention, reallocation semantics, and test commands.
