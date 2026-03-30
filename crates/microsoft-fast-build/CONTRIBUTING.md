# Contributing to microsoft-fast-build

## Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) (stable toolchain, 1.65+)
- Cargo (included with Rust)

## Setup

```bash
git clone https://github.com/microsoft/fast
cd fast/crates/microsoft-fast-build
```

## Running Tests

```bash
cargo test
```

This runs both unit tests (embedded in each source module) and integration tests (in `tests/`). The integration tests include filesystem-based tests that read from `tests/fixtures/`.

### Integration test files

| File | What it covers |
|------|---------------|
| `tests/bindings.rs` | `{{}}` and `{{{}}}` content bindings |
| `tests/f_when.rs` | `<f-when>` expressions, chained operators |
| `tests/f_repeat.rs` | `<f-repeat>` iteration |
| `tests/nested_directives.rs` | Mixed/nested `<f-when>` + `<f-repeat>` |
| `tests/single_brace.rs` | Single-brace passthrough |
| `tests/errors.rs` | All `RenderError` variants |
| `tests/custom_elements.rs` | Custom elements and `Locator` |
| `tests/common/mod.rs` | Shared helpers (`ok`, `err`, `make_locator`, `empty_root`) |

## Building

```bash
cargo build
```

## Source File Overview

| File | Purpose |
|------|---------|
| `src/lib.rs` | Public API: `render_template`, `render`, `render_with_locator`, `render_template_with_locator` |
| `src/json.rs` | `JsonValue` enum and hand-rolled JSON string parser |
| `src/context.rs` | Value resolution: `resolve_value`, `get_nested_property` |
| `src/expression.rs` | f-when expression evaluator (`\|\|`, `&&`, comparisons, `!`) |
| `src/attribute.rs` | Tag/attribute parsing: `find_str`, `find_directive`, `find_tag_end`, `extract_directive_expr`, `extract_directive_content`, `find_custom_element`, `parse_element_attributes` |
| `src/content.rs` | `{{}}` and `{{{}}}` binding renderers, `html_escape` |
| `src/directive.rs` | `Directive` enum, `next_directive`, `render_when`, `render_repeat`, `render_custom_element` |
| `src/node.rs` | `render_node` — core template traversal loop |
| `src/renderer.rs` | Thin entry points that call `render_node` |
| `src/locator.rs` | `Locator` — maps element names to template content; glob-based filesystem scanner |
| `src/error.rs` | `RenderError` enum with all variants and `Display` implementation |
| `tests/` | Integration tests split by feature area (see above) |
| `tests/fixtures/` | HTML template files used by integration tests |
