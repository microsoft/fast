# Design — microsoft-fast-build

This document explains how the crate works internally: the data flow, the key data structures, and the design decisions behind each module.

---

## High-level overview

The crate takes a **FAST declarative HTML template** (a string) and a **JSON state object** and produces static HTML. It does this in a single recursive pass — no AST is built, no DOM is constructed. The template string is scanned byte-by-byte, literal regions are copied verbatim, and directives / bindings are resolved and replaced.

```
render_template(template, state_str)
        │
        ▼
   json::parse(state_str)          ← hand-rolled JSON parser → JsonValue
        │
        ▼
  renderer::render(template, root) ─────────────────────────────────────┐
        │                                                                │
        ▼                                                                │
  node::render_node(template, root, loop_vars, locator, hydration?)     │
        │                                                                │
        ├─ [hydration mode] scan HTML opening tags for attr bindings     │
        │        └─ inject data-fe-c-{n}-{count} compact markers        │
        │                                                                │
        ├─ scan forward: next_directive()                                │
        │        │                                                       │
        │        ├─ TripleBrace  → content::render_triple_brace()       │
        │        ├─ DoubleBrace  → content::render_double_brace()       │
        │        ├─ When         → directive::render_when()  ───────────┘ (recurse)
        │        ├─ Repeat       → directive::render_repeat() ──────────┘ (recurse per item)
        │        └─ CustomElement→ directive::render_custom_element() ──┘ (recurse with fresh HydrationScope)
        │
        └─ Append literal prefix + resolved chunk → output string
```

---

## Module map

| Module | Role |
|--------|------|
| `lib.rs` | Public API surface — four `pub fn`s and three `pub use` re-exports |
| `renderer.rs` | Thin entry points converting the public API into `render_node` calls |
| `node.rs` | The main rendering loop — scans for directives, handles attribute bindings in hydration mode |
| `directive.rs` | `Directive` enum, `next_directive` scanner, and all directive renderers |
| `content.rs` | `{{expr}}` and `{{{expr}}}` binding renderers, `html_escape` |
| `attribute.rs` | Low-level HTML/attribute string parsing utilities + hydration attribute helpers |
| `context.rs` | State value resolution: dot-path access, loop-variable scoping |
| `expression.rs` | Boolean expression evaluator for `<f-when value="{{…}}">` |
| `hydration.rs` | `HydrationScope` — binding index tracking and named marker generation per template scope |
| `json.rs` | Hand-rolled JSON parser producing `JsonValue` |
| `locator.rs` | `Locator` struct — maps element names to template strings; glob scanner; `<f-template>` parser |
| `error.rs` | `RenderError` enum with `Display` impl and helpers |
| `wasm.rs` | WASM bindings (`#[cfg(target_arch = "wasm32")]`) — exposes `render`, `render_with_templates`, and `parse_f_templates` to JavaScript |

---

## The rendering loop — `node.rs`

`render_node` is the core of the crate. It is called recursively for nested directives and custom element templates. Its signature:

```
fn render_node(template, root, loop_vars, locator, hydration: Option<&mut HydrationScope>) → Result<String>
```

The loop works like a cursor:

1. **Hydration tag scan** (when `hydration` is `Some`): before each directive, scan for any plain HTML opening tags in the literal region that precede the directive position. For each such tag, detect `{{expr}}` and `{expr}` attribute bindings, allocate binding indices, resolve `{{expr}}` values, and inject a compact `data-fe-c-{start}-{count}` attribute. This step advances `pos` past each processed tag so those tags' `{{expr}}` bindings are not re-encountered as content directives.
2. Call `next_directive(template, pos, locator)` to find the earliest interesting position ahead.
3. If nothing is found, append `template[pos..]` to output and break.
4. Otherwise, append the literal text from `pos` up to the directive's start.
5. Dispatch the directive to the appropriate handler (returns `(chunk, next_pos)`). In hydration mode, content bindings (`{{expr}}`, `{{{expr}}}`) are wrapped in `<!--fe-b$$start$$N$$UUID$$fe-b-->VALUE<!--fe-b$$end$$...-->` markers.
6. Append `chunk` and advance `pos` to `next_pos`.
7. Repeat.

All handlers return `Result<(String, usize), RenderError>`. The `usize` is the byte position in the original template that the handler consumed up to — the cursor's next position.

---

## Finding the next directive — `directive::next_directive`

`next_directive` finds the **earliest** of five possible directives starting from a given position:

- `{{{` — triple-brace unescaped binding
- `{{` — double-brace escaped binding (shadowed if `{{{` starts at the same position)
- `<f-when` — conditional directive
- `<f-repeat` — repeat directive
- a custom element tag known to the `Locator`

It returns a `Directive` enum value carrying the byte position, or `None` if nothing is found.

### Single-brace passthrough

FAST uses single-brace expressions (`{handler()}`) for client-side-only bindings (event handlers, attribute directives). These must pass through the server renderer **unchanged**.

The problem is that a single-brace expression may contain `}}` inside it (e.g. `{handler({key: val})}`) which would be misread as the closing delimiter of a `{{binding}}`.

`next_directive` handles this with a loop:

1. Find the earliest single `{` that is **not** the start of `{{` or `{{{`.
2. Find the earliest binding/directive position.
3. If the single `{` comes before any binding, skip past the entire single-brace expression (respecting nesting and quoted strings) and repeat.
4. Only return a directive when there is no single `{` preceding it.

The skip logic lives in `attribute::find_single_brace` and `attribute::skip_single_brace_expr`. `skip_single_brace_expr` tracks brace depth and skips quoted strings so inner `}` characters are not mistakenly treated as closing braces.

---

## Content bindings — `content.rs`

Both binders share the same structure: find the opening delimiter, find the closing delimiter, trim and validate the expression, resolve it from state, and return the rendered value plus the new cursor position.

### `render_double_brace` (`{{expr}}`)
- Resolves the expression via `context::resolve_value`.
- Passes the result through `html_escape` before appending.
- HTML escapes: `&`, `<`, `>`, `"`, `'`.

### `render_triple_brace` (`{{{expr}}}`)
- Same resolution, but skips HTML escaping — used for injecting raw HTML.

Both return `RenderError::EmptyBinding` for blank expressions, `RenderError::UnclosedBinding`/`UnclosedUnescapedBinding` if no closing delimiter is found, and `RenderError::MissingState` if the expression does not resolve.

---

## State resolution — `context.rs`

`resolve_value(expr, root, loop_vars)` resolves an expression string to an `Option<JsonValue>`.

**Resolution order:**
1. Scan `loop_vars` in reverse (innermost scope first). If the expression matches a variable name exactly, return its value.
2. If the expression is `varname.prop.path`, and `varname` matches a loop variable, apply `get_nested_property` to the loop variable's value with the remaining path.
3. Fall back to `get_nested_property(root, expr)`.

`get_nested_property` walks a dot-separated path through `JsonValue::Object` and `JsonValue::Array` nodes. Numeric path segments (e.g. `list.0`) are used as array indices.

### Loop variable scoping

`loop_vars` is a `Vec<(String, JsonValue)>`. Each `<f-repeat>` iteration pushes one entry. Because `resolve_value` scans in reverse, the innermost repeat's variable shadows outer ones. Root state is always accessible for any key that is not shadowed.

---

## Conditional rendering — `<f-when>`

`render_when` in `directive.rs`:

1. Calls `attribute::extract_directive_content` to find the inner HTML and the position after `</f-when>`.
2. Calls `attribute::extract_directive_expr` to extract the expression from `value="{{…}}"`.
3. Calls `expression::evaluate(expr, root, loop_vars)`.
4. If true: recursively calls `render_node` on the inner HTML.
5. If false: returns an empty string.

---

## Expression evaluation — `expression.rs`

`evaluate(expr, root, loop_vars) → bool` uses a recursive descent strategy without building a parse tree.

**Precedence (lowest to highest):**
1. `||` — found first, splits into left/right and short-circuits.
2. `&&` — found second, splits into left/right and short-circuits.
3. Comparison: `>=`, `<=`, `==`, `!=`, `>`, `<` — matched in that order to avoid `>` matching `>=`.
4. Unary `!` — prefix negation.
5. Bare identifier — truthy check via `JsonValue::is_truthy`.

Because `||` is sought before `&&`, the recursive split on `||` runs first. Each sub-expression is then re-evaluated, where `&&` is split next. This means `&&` binds tighter than `||` — matching standard operator precedence. Chaining (`a && b && c`, `a || b || c`) works naturally through the same recursion.

**`find_binary_op`** does a simple left-to-right byte scan — the first occurrence of `||` or `&&` is the split point. This gives left-associativity.

**`find_comparison_op`** adds one guard: when matching single-char `<` or `>`, it checks that the next character is not `=` so it does not match the first character of `<=` / `>=`.

---

## Array iteration — `<f-repeat>`

`render_repeat` in `directive.rs`:

1. Extracts inner HTML and end position (same as `render_when`).
2. Parses `value="{{item in items}}"` with `parse_repeat_expr` — expects exactly three whitespace-separated tokens where the middle is `"in"`.
3. Resolves the list expression. Returns `RenderError::NotAnArray` if the value is not a `JsonValue::Array`.
4. For each item in the array, pushes `(var_name, item)` onto a new `loop_vars` vec and calls `render_node` on the inner template.
5. Uses `Iterator::collect::<Result<String, _>>()` to short-circuit on the first error in any iteration.

---

## Nested directives — `attribute::extract_directive_content`

To correctly find the closing `</f-when>` or `</f-repeat>` for a directive, `extract_directive_content` tracks nesting depth:

- Start at depth 1 (for the outer opening tag).
- Scan forward for the next opening tag of the same name **or** the next closing tag.
- An opening tag increments depth; a closing tag decrements it.
- Return when depth reaches 0.

This handles arbitrarily deep nesting of the same directive type.

---

## Custom elements — `directive.rs` + `attribute.rs`

A custom element is any opening tag whose name contains a hyphen, excluding `f-when` and `f-repeat` (`attribute::is_custom_element`). The renderer only acts on custom elements that have a matching template in the `Locator`.

### `render_custom_element`

1. **Locate the tag boundary** — `find_tag_end` finds the `>` that closes the opening tag, respecting quoted attribute values.
2. **Detect self-closing** — if the character before `>` (ignoring whitespace) is `/`, the element is self-closing. The output always uses non-self-closing form.
3. **Parse attributes** — `parse_element_attributes` walks the opening tag string and extracts `(name, Option<value>)` pairs.
4. **Build child state** from the attributes:
   - Attributes starting with `@` (event handlers) or `:` (property bindings) are **skipped** — both are resolved entirely by the FAST client runtime and have no meaning in server-side rendering state.
   - **HTML attribute keys are lowercased** — HTML attribute names are case-insensitive and browsers always store them lowercase. `isEnabled` becomes `isenabled`; hyphens are preserved: `selected-user-id` stays `selected-user-id`.
   - No value (boolean attribute) → `Bool(true)`
   - `"{{binding}}"` → resolve from parent state (can be any `JsonValue` type)
   - Anything else → `String` (attribute values are always strings; booleans and numbers must be passed via `{{binding}}` expressions)
5. **Render the shadow template** by calling `render_node` recursively with the child state as root and a **fresh `HydrationScope`** (always active). The `Locator` is threaded through so nested custom elements are expanded too.
6. **Extract light DOM children** via `extract_directive_content` (reuses the same nesting-aware scanner as directives).
7. **Strip client-only binding attributes** (`@attr` event bindings and `:attr` property bindings) from both the outer element's opening tag and from all tags inside the rendered shadow template. These are skipped in step 4 (not added to child state) and also removed from the rendered HTML — they are resolved entirely by the FAST client runtime. The `data-fe-c` binding count is preserved — these bindings are still counted so the FAST client runtime allocates the correct number of binding slots.
8. **Emit Declarative Shadow DOM** with hydration attributes:
   ```html
   <my-button label="Hi">
     <template shadowrootmode="open" shadowroot="open">[shadow DOM]</template>
     [light DOM children]
   </my-button>
   ```
   When the element itself has attribute bindings (`{{expr}}` or `{expr}` values) and is being rendered inside another element's shadow (i.e., `parent_hydration` is `Some`), those bindings are counted, `data-fe-c-{start}-{count}` is added to the element's opening tag, and the binding indices are allocated from the parent scope.

If a custom element has no matching template, it is left in place by `next_directive` (which only returns `CustomElement` for tags in the locator).

---

## Hydration markers — `hydration.rs`

When rendering a custom element's shadow DOM, the renderer tracks **binding indices** and emits **named markers** so the FAST client runtime can efficiently locate and patch DOM nodes during hydration.

### Scopes

A **template scope** is a `HydrationScope` that carries a single field:
- `binding_idx: usize` — the next binding index to allocate (increments for each binding in this scope)

Scope boundaries are:
| Context | Scope |
|---|---|
| Custom element shadow template | Fresh `HydrationScope` (binding_idx = 0) |
| `f-when` truthy body | Child scope via `hy.child()` (binding_idx reset to 0) |
| `f-repeat` item template | Fresh `HydrationScope` per item (binding_idx reset to 0) |

Scopes carry no numeric ID. Marker names are derived from the binding context (see below) and are therefore self-describing.

### Content binding markers

When `hydration` is `Some`, `render_node` wraps each `{{expr}}` / `{{{expr}}}` result:

```
<!--fe-b$$start$$N$$<expr>-N$$fe-b-->VALUE<!--fe-b$$end$$N$$<expr>-N$$fe-b-->
```

`N` is the current `binding_idx` from the scope; `<expr>` is the expression text (e.g. `title`, `item.name`, `$index`). So `{{title}}` at index 0 produces marker name `title-0`, and `{{item.name}}` at index 2 produces `item.name-2`.

### Attribute binding markers (compact format)

Plain HTML opening tags in the literal regions are scanned by `attribute::find_next_plain_html_tag` **before** `next_directive` processes them. For each tag that has `{{expr}}` (double-brace) or `{expr}` (single-brace) attribute values:

1. `count_tag_attribute_bindings` counts both types.
2. The current `binding_idx` is recorded as `start`, and advanced by the total count.
3. `resolve_attribute_bindings_in_tag` resolves each attribute binding:
   - `?attr="{{expr}}"` — **boolean binding**: `expr` is evaluated as a boolean. If truthy, the bare attribute name (without `?`) is emitted; if falsy, the attribute is omitted entirely. The `extract_bool_attr_prefix` helper detects this pattern by checking whether the output accumulated so far ends with `?name="`.
   - `attr="{{expr}}"` — **value binding**: `expr` is resolved to a string and HTML-escaped.
   - `attr="{expr}"` — **single-brace binding**: left unchanged (client-side only).
4. `inject_compact_marker` inserts `data-fe-c-{start}-{count}` before the closing `>` of the tag.

This atomic tag processing ensures that the `{{expr}}` attribute values are never seen as content directives by the main loop — `pos` advances past the entire tag before the directive scanner runs again.

### `f-when` markers

```
<!--fe-b$$start$$N$$when-N$$fe-b-->
[inner content in child scope, or empty if falsy]
<!--fe-b$$end$$N$$when-N$$fe-b-->
```

`N` is allocated from the outer (parent) scope's `binding_idx`. The marker name is `when-N`.

### `f-repeat` markers

```
<!--fe-b$$start$$N$$repeat-N$$fe-b-->
<!--fe-repeat$$start$$0$$fe-repeat-->
  [item 0 rendered with fresh binding_idx = 0]
<!--fe-repeat$$end$$0$$fe-repeat-->
<!--fe-repeat$$start$$1$$fe-repeat-->
  [item 1 rendered with fresh binding_idx = 0]
<!--fe-repeat$$end$$1$$fe-repeat-->
<!--fe-b$$end$$N$$repeat-N$$fe-b-->
```

The outer markers use `repeat-N` where `N` is the binding index in the parent scope. Each item gets its own fresh `HydrationScope`, so per-item content bindings are named after their expressions (e.g. `item-0`, `item.name-1`).

### `$index` in `f-repeat`

Each iteration pushes `("$index", JsonValue::Number(i as f64))` into `loop_vars`, making `{{$index}}` available in repeat templates in both hydration and non-hydration modes.

---

## The Locator — `locator.rs`

`Locator` is a `HashMap<String, String>` mapping element names to their template HTML strings.

### `from_patterns`

For each glob pattern:
1. Find the **static prefix directory** — the longest directory path before any wildcard character (`*`, `?`). This avoids walking the entire filesystem.
2. Recursively walk that directory collecting all `.html` files (`walk_html_files`).
3. Normalise path separators to `/` and strip a leading `./`, then test each file path against the glob pattern.
4. For each matching file, read its content and call `parse_f_templates` to extract all `<f-template>` elements.
5. The **element name** is the `name` attribute of each `<f-template>` element (e.g. `name="my-button"`). A single file may declare multiple templates.
6. `<f-template>` elements missing a `name` attribute emit a warning to stderr and are ignored.
7. If two `<f-template>` elements across different files share the same name → `RenderError::DuplicateTemplate`.

### `<f-template>` parsing (`parse_f_templates`, `extract_attr_value`, `extract_template_content`)

`parse_f_templates(html)` scans for `<f-template` occurrences using `str::find` in a loop. For each match:
- Verifies the character after `<f-template` is not alphanumeric or `-` to avoid matching `<f-templateX>`.
- Extracts the attribute string between `<f-template` and `>`.
- Calls `extract_attr_value(attrs, "name")` to get the name (supports both `"` and `'` quoting).
- Extracts the inner HTML between `>` and `</f-template>`.
- Calls `extract_template_content` on the inner HTML to get the content inside the `<template>` element.

Returns `Vec<(Option<String>, String)>` — pairs of (name, template content).

### Glob matching

Hand-rolled in `glob_match` → `match_segments` → `match_segment` → `match_chars`:

- Paths and patterns are split on `/` into segments.
- `**` is handled at the segment level: it can consume **zero or more** path segments by trying both "consume none" (advance pattern, keep path) and "consume one" (keep pattern, advance path) via backtracking.
- `*` is handled at the character level within a single segment: it tries matching 0 through N characters by iterating over all possible split points.
- `?` matches exactly one character.

---

## WASM bindings — `wasm.rs`

`wasm.rs` is compiled only for the `wasm32-unknown-unknown` target (`#[cfg(target_arch = "wasm32")]`). It exposes three functions to JavaScript via `wasm-bindgen`:

| Export | Signature | Description |
|--------|-----------|-------------|
| `render` | `(entry: &str, state: &str) → String` | Render a template with no custom elements |
| `render_with_templates` | `(entry: &str, templates_json: &str, state: &str) → String` | Render with a pre-built `{name: content}` templates map |
| `parse_f_templates` | `(html: &str) → String` | Parse `<f-template>` elements and return a JSON array |

### `parse_f_templates`

Calls `locator::parse_f_templates` (the same function used by `Locator::from_patterns`) and serialises the result to a JSON string:

```json
[
  {"name": "my-button", "content": "<button>{{label}}</button>"},
  {"name": null, "content": "<span>unnamed</span>"}
]
```

`name` is `null` when the `<f-template>` element has no `name` attribute. The `@microsoft/fast-build` CLI uses this export to parse HTML files without reimplementing the parsing logic in JavaScript.

### `render_with_templates`

Accepts `templates_json` as a JSON object string mapping element names to raw template strings (the inner content already extracted from `<template>`). Constructs a `Locator::from_templates` map and calls `render_template_with_locator`.

---

## JSON parsing — `json.rs`

A hand-rolled recursive-descent parser. No external crates.

`parse(input)` calls `parse_value` which dispatches on the first character:

| First char | Parser |
|---|---|
| `{` | `parse_object` |
| `[` | `parse_array` |
| `"` | `parse_string` |
| `t` / `f` | `true` / `false` literals |
| `n` | `null` |
| `-` / digit | `parse_number` |

`parse_string` handles `\"`, `\\`, `\/`, `\b`, `\f`, `\n`, `\r`, `\t`, and `\uXXXX` Unicode escapes.

`parse_number` handles integer and decimal forms.

`JsonValue::to_display_string` converts a value to its display form: integers are formatted without a decimal point (via `as i64`), arrays display as `[Array]`, objects as `[Object]`.

`JsonValue::is_truthy` mirrors JavaScript's truthiness rules: `null` and `false` are falsy, `0` and empty strings are falsy, everything else is truthy.

---

## Error handling — `error.rs`

`RenderError` is a non-exhaustive enum with 11 variants. Every variant carries at least one descriptive field. Every error message includes a **template context snippet** — a ±20-character window around the error site — to help developers pinpoint the problem.

`template_context(template, at)` takes care to:
- Walk backwards up to 20 bytes (to a UTF-8 character boundary) for pre-error context.
- Walk forwards up to 60 bytes for post-error context.
- Add `…` ellipsis markers when the snippet is not at the string boundaries.

`truncate(s, max)` truncates an expression to `max` characters with a trailing `…` to keep error messages readable.

---

## Design decisions

**No external dependencies.** The JSON parser, glob matcher, HTML scanner, and expression evaluator are all hand-rolled. This keeps the build fast, the compile graph shallow, and avoids supply-chain risk in a build tooling context.

**No intermediate representation.** The renderer operates directly on the source template string using byte indices. This avoids the memory allocation and complexity of building an AST or DOM tree.

**Recursive rendering via `render_node`.** Instead of special-casing nesting, `render_when`, `render_repeat`, and `render_custom_element` all call `render_node` recursively on their inner content. This means the full template feature set is available inside any directive or custom element at any depth.

**`Option<&Locator>` threading.** The locator is an optional parameter on all internal functions. Passing `None` disables custom element expansion entirely, preserving backward compatibility for callers that use `render` / `render_template`.

**`Option<&mut HydrationScope>` threading.** The hydration context is an optional mutable parameter on `render_node` and all directive renderers. Passing `None` disables all hydration marker emission and keeps non-custom-element rendering identical to the pre-hydration behaviour. The public API always passes `None` at the top level; hydration is only activated inside `render_custom_element`.

**Named hydration markers.** Marker names are derived from the binding context: content bindings use `<expr>-<idx>` (e.g. `title-0`, `item.name-2`), f-when uses `when-<idx>`, and f-repeat uses `repeat-<idx>`. This makes markers human-readable and self-describing without a shared ID counter. `HydrationScope` needs only `binding_idx` — no `Rc`, no `scope_id`, no `ScopeGen`. The scheme differs from the FAST HTML package which uses random alphanumeric UUIDs, but the structure is equivalent.

**Atomic tag processing for attribute bindings.** When a plain HTML opening tag in the literal region contains `{{expr}}` attribute values, those values are resolved and `data-fe-c` is injected into the tag as a whole before `next_directive` ever sees them. This prevents the `{{expr}}` inside attributes from being mistaken for content bindings. The cost is that `next_directive` is called once extra per tag iteration, but tags are short and rare enough that this has no meaningful performance impact.

**`Result` throughout.** All render functions return `Result<_, RenderError>`. Errors propagate via `?` without any silent failures. The one deliberate choice: missing state keys return `RenderError::MissingState` rather than an empty string, so template bugs surface early.

**Left-to-right, first-match scanning.** Directives are found by searching for their literal opening strings. The earliest position wins. This is O(n×d) where n is the template length and d is the number of directive types — acceptable for the template sizes this crate targets.
