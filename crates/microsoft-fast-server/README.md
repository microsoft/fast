# microsoft-fast-server

A server-side renderer for [FAST](https://www.fast.design/) declarative HTML templates, written in pure Rust with no external dependencies.

## Adding as a Dependency

In your `Cargo.toml`:

```toml
[dependencies]
microsoft-fast-server = { path = "../path/to/crates/microsoft-fast-server" }
```

## Usage

### Render with a JSON string

```rust
use microsoft_fast_server::render_template;

let html = render_template(
    "<h1>{{title}}</h1>",
    r#"{"title": "Hello, World!"}"#,
).unwrap();
// html == "<h1>Hello, World!</h1>"
```

### Render with a parsed `JsonValue`

```rust
use microsoft_fast_server::{render, JsonValue};
use std::collections::HashMap;

let mut map = HashMap::new();
map.insert("name".to_string(), JsonValue::String("Alice".to_string()));
let state = JsonValue::Object(map);

let html = render("<p>{{name}}</p>", &state);
// html == "<p>Alice</p>"
```

## Template Syntax

| Syntax | Description |
|--------|-------------|
| `{{expr}}` | HTML-escaped value from state |
| `{{{expr}}}` | Raw (unescaped) value from state |
| `<f-when value="{{expr}}">...</f-when>` | Conditionally render content |
| `<f-repeat value="{{item in list}}">...</f-repeat>` | Iterate over array |

### f-when Expressions

```html
<f-when value="{{isAdmin}}">Admin panel</f-when>
<f-when value="{{!isGuest}}">Member content</f-when>
<f-when value="{{status == 'active'}}">Active</f-when>
<f-when value="{{count > 0}}">Has items</f-when>
<f-when value="{{a || b}}">Either</f-when>
<f-when value="{{a && b}}">Both</f-when>
```

### f-repeat

```html
<f-repeat value="{{item in items}}">
  <li>{{item.name}}</li>
</f-repeat>
```

Inside a repeat, `{{item}}` is the loop variable. Other bindings fall back to root state.

### Array Index Access

```html
{{list.0.name}}  <!-- state.list[0].name -->
```
