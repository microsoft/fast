# microsoft-fast-build

A server-side renderer for [FAST](https://www.fast.design/) declarative HTML templates, written in pure Rust with no external dependencies.

It takes FAST declarative HTML template syntax and a JSON state object, resolves bindings, evaluates conditionals, iterates repeats, and renders custom elements — producing static HTML ready to be served.

## Adding as a Dependency

```toml
[dependencies]
microsoft-fast-build = { path = "../path/to/crates/microsoft-fast-build" }
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

Single-brace expressions (`{expr}`) are FAST client-side-only bindings (event handlers, attribute directives). They are **never** interpreted by the server renderer and pass through verbatim.

```html
<!-- Passes through unchanged -->
<button @click="{handleClick()}">{{label}}</button>
<slot f-slotted="{slottedNodes}"></slot>
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

Inside `<f-repeat>`, `{{item}}` resolves to the current loop variable. Other bindings fall back to the root state (e.g. `{{title}}` above).

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
| `count="42"` | `{"count": 42}` |
| `foo="{{bar}}"` | `{"foo": <value of bar from parent state>}` |

The last form is a **property binding with renaming**: `foo="{{bar}}"` resolves `bar` from the _parent_ state and passes it into the child template under the key `foo`.

### Output Format

The renderer wraps the rendered template in Declarative Shadow DOM:

```html
<!-- Input -->
<my-button label="Submit">light DOM</my-button>

<!-- Output -->
<my-button label="Submit">
  <template shadowrootmode="open">
    <button>Submit</button>
  </template>
  light DOM
</my-button>
```

Custom elements that have no matching template in the locator are passed through verbatim.

---

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
| `DuplicateTemplate` | Two template files resolve to the same element name |
| `TemplateReadError` | A matched template file could not be read |
| `JsonParse` | Invalid JSON passed to `render_template` |

Every error message includes a description of the problem and a snippet of the template near the error site to aid debugging:

```
missing state: '{{title}}' has no matching key in the provided state — template: "…<h1>{{title}}</h1>…"
unclosed binding '{{name': no closing '}}' found to end the expression — template: "Hello {{name"
duplicate template: element '<my-button>' is defined in multiple files: ./a/my-button.html, ./b/my-button.html
```
