# Design — microsoft-fast-build

This document explains how the crate works internally: the data flow, the key data structures, and the design decisions behind each module.

---

## High-level overview

The crate takes a **FAST declarative HTML template** (a string) and an optional **JSON state object** and produces static HTML. Public no-state entry points treat omitted state exactly like an empty object (`{}`). Rendering happens in a single recursive pass — no AST is built, no DOM is constructed. The template string is scanned byte-by-byte, literal regions are copied verbatim, and directives / bindings are resolved and replaced.

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
| `lib.rs` | Public API surface — render functions, `pub use` re-exports, and config types |
| `renderer.rs` | Thin entry points converting the public API into `render_node` calls |
| `node.rs` | The main rendering loop — scans for directives, handles attribute bindings in hydration mode |
| `directive.rs` | `Directive` enum, `next_directive` scanner, and all directive renderers |
| `content.rs` | `{{expr}}` and `{{{expr}}}` binding renderers, `html_escape` |
| `attribute.rs` | Low-level HTML/attribute string parsing utilities + hydration attribute helpers; `strip_client_only_attrs` (shadow-DOM tags and nested element opening tags) |
| `attribute_lookup.rs` | Static lookup tables mapping ARIA and HTML attribute names to their DOM property names |
| `config.rs` | `RenderConfig` struct and `AttributeNameStrategy` enum — rendering configuration options |
| `context.rs` | State value resolution: dot-path access, loop-variable scoping |
| `expression.rs` | Boolean expression evaluator for `<f-when value="{{…}}">` |
| `hydration.rs` | `HydrationScope` — binding index tracking and named marker generation per template scope |
| `json.rs` | Hand-rolled JSON parser producing `JsonValue` |
| `locator.rs` | `Locator` struct — maps element names to template strings; glob scanner; `<f-template>` parser |
| `error.rs` | `RenderError` enum with `Display` impl and helpers |
| `wasm.rs` | WASM bindings (`#[cfg(target_arch = "wasm32")]`) — exposes `render`, `render_with_templates`, `render_entry_with_templates`, and `parse_f_templates` to JavaScript |

---

## The rendering loop — `node.rs`

`render_node` is the core of the crate. It is called recursively for nested directives and custom element templates. Its signature:

```
fn render_node(template, root, loop_vars, locator, hydration: Option<&mut HydrationScope>, is_entry: bool, config: &RenderConfig) → Result<String>
```

The `is_entry` flag distinguishes two rendering contexts for **opening-tag attribute handling**:

- **`is_entry: true`** — the template is the top-level entry HTML. Custom elements found at this level (root custom elements) have their opening-tag `{{binding}}` attributes resolved to primitive values (stripping non-primitives). No `data-fe-c` marker is added.
- **`is_entry: false`** — the template is a shadow template, a directive body, or a repeat item. Custom elements found here have their `{{binding}}` attributes resolved and a `data-fe-c` compact marker injected when inside a parent hydration scope.

**Child state** is built the same way regardless of `is_entry`: the current root state is always used as a base, with per-element attributes overlaid on top. This ensures all unbound state keys propagate through to every descendant custom element automatically.

`renderer::render_entry_with_locator` sets `is_entry: true`; `renderer::render_with_locator` sets `is_entry: false`. All recursive calls from `render_when`, `render_repeat_items`, and `render_custom_element` (for shadow templates) always use `is_entry: false`.

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

FAST uses single-brace expressions (`{handler()}`) for client-side-only bindings (event handlers, attribute directives). In most rendering contexts these pass through the server renderer **unchanged** — `next_directive` skips over them so their `}` characters do not accidentally close a `{{binding}}`.

The problem is that a single-brace expression may contain `}}` inside it (e.g. `{handler({key: val})}`) which would be misread as the closing delimiter of a `{{binding}}`.

`next_directive` handles this with a loop:

1. Find the earliest single `{` that is **not** the start of `{{` or `{{{`.
2. Find the earliest binding/directive position.
3. If the single `{` comes before any binding, skip past the entire single-brace expression (respecting nesting and quoted strings) and repeat.
4. Only return a directive when there is no single `{` preceding it.

The skip logic lives in `attribute::find_single_brace` and `attribute::skip_single_brace_expr`. `skip_single_brace_expr` tracks brace depth and skips quoted strings so inner `}` characters are not mistakenly treated as closing braces.

### Attribute directive stripping in Declarative Shadow DOM

Attribute directives — `f-ref="{expr}"`, `f-slotted="{expr}"`, `f-children="{expr}"` — use single-brace syntax and are **client-side only**. When rendering a custom element's shadow DOM template (where hydration is always active), `attribute::strip_client_only_attrs` removes these attributes from the output HTML, exactly as it removes `@event` and `:property` bindings. The `data-fe-c` compact binding count still includes them so the FAST runtime allocates the correct binding slots.

---

## Content bindings — `content.rs`

Both binders share the same structure: find the opening delimiter, find the closing delimiter, trim and validate the expression, resolve it from state, and return the rendered value plus the new cursor position.

### `render_double_brace` (`{{expr}}`)
- Resolves the expression via `context::resolve_value`.
- Passes the result through `html_escape` before appending.
- HTML escapes: `&`, `<`, `>`, `"`, `'`.

### `render_triple_brace` (`{{{expr}}}`)
- Same resolution, but skips HTML escaping — used for injecting raw HTML.

Both return `RenderError::EmptyBinding` for blank expressions and `RenderError::UnclosedBinding`/`UnclosedUnescapedBinding` if no closing delimiter is found. If the expression does not resolve in state, the content binding renders an empty string.

---

## State resolution — `context.rs`

`resolve_value(expr, root, loop_vars)` resolves an expression string to an `Option<JsonValue>`.

**Resolution order:**
1. Scan `loop_vars` in reverse (innermost scope first). If the expression matches a variable name exactly, return its value.
2. If the expression is `varname.prop.path`, and `varname` matches a loop variable, apply `get_nested_property` to the loop variable's value with the remaining path.
3. Fall back to `get_nested_property(root, expr)`.

`get_nested_property` walks a dot-separated path through `JsonValue::Object` and `JsonValue::Array` nodes. Numeric path segments (e.g. `list.0`) are used as array indices. The implementation traverses the tree via references and only clones the final leaf value — no intermediate sub-trees are cloned. The one exception is the synthesised `length` value for arrays, which is returned early as an owned `JsonValue::Number` only when `length` is the final segment (for example, `items.length`). Additional segments after `length` do not resolve and return `None` (for example, `items.length.foo`).

Callers decide how to handle unresolved values:
- Content bindings (`{{expr}}` / `{{{expr}}}`) render an empty string.
- HTML attribute bindings omit the entire attribute.
- `<f-repeat>` treats a missing list binding as an empty array and renders zero iterations; present non-array values return `RenderError::NotAnArray`.
- `<f-when>` evaluates a missing binding as falsy.

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
3. Resolves the list expression. Missing values are treated as an empty array. Present non-array values return `RenderError::NotAnArray`.
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
4. **Build child state** — the child state always starts with the **current root state** as a base, then per-element HTML attributes are resolved and overlaid on top (attribute-derived values take precedence). This ensures all unbound state keys propagate through to every descendant custom element automatically — a child element can reference any state key from its ancestors without requiring explicit attribute bindings. As an optimisation, when the element has no state-relevant attributes (only `@event`, `?bool`, or directive attributes), the root state is passed through by reference without cloning.
   - Attributes starting with `@` (event handlers) or named `f-ref`, `f-slotted`, `f-children` (attribute directives) are **skipped** — all are resolved entirely by the FAST client runtime and have no meaning in server-side rendering state.
   - Attributes starting with `:` (property bindings) are **stripped from rendered HTML** but their resolved value **is added to the child state** under the lowercased property name (without the `:` prefix). This lets structured data (arrays, objects) be passed to the SSR template without appearing as a visible HTML attribute.
   - **HTML attribute keys are lowercased** — HTML attribute names are case-insensitive and browsers always store them lowercase. `isEnabled` becomes `isenabled`; hyphens are preserved: `selected-user-id` stays `selected-user-id`. When the `attribute-name-strategy` is set to `"camelCase"`, dashed attribute names that are not handled by specialized lookup tables are converted to camelCase instead: `selected-user-id` becomes `selectedUserId`.
   - `data-*` attributes (e.g. `data-date-of-birth`) are **grouped under a nested `"dataset"` key** using the `attribute::data_attr_to_dataset_key` helper, which returns the full dot-notation path (`data-date-of-birth` → `"dataset.dateOfBirth"`). The caller splits on `.` and inserts into the nested map. This means `{{dataset.dateOfBirth}}` in the shadow template resolves via ordinary dot-notation.
   - `aria-*` attributes (e.g. `aria-disabled`) are **converted to their camelCase ARIA property name** using the `attribute_lookup::aria_attr_to_property_key` lookup table (`aria-disabled` → `ariaDisabled`, `aria-valuenow` → `ariaValueNow`). This follows the [ARIA reflection](https://developer.mozilla.org/en-US/docs/Web/API/Element#instance_properties_included_from_aria) convention on `Element`. A static lookup table is used instead of algorithmic conversion because ARIA attribute names do not place dashes at word boundaries (e.g. `aria-valuenow`, not `aria-value-now`). Templates reference the camelCase form: `{{ariaDisabled}}`.
   - HTML attributes whose property name differs from the attribute name (e.g. `tabindex` → `tabIndex`, `readonly` → `readOnly`) are **converted to their camelCase DOM property name** using the `attribute_lookup::html_attr_to_property_key` lookup table. Attributes whose names already match (e.g. `disabled`, `title`) are not in the table and pass through as-is.
   - No value (boolean attribute) → `Bool(true)`
   - `"{{binding}}"` → resolve from parent state (can be any `JsonValue` type, including arrays and objects); if the binding is missing, the child-state value becomes `JsonValue::Null`, which displays as empty content
   - Value starting with `[` or `{` → parsed as a JSON array or object literal (e.g. `items='["a","b","c"]'` or `config='{"key":"val"}'`). If parsing fails the value falls back to `String`.
   - Anything else → `String` (plain literal values like `count="42"` are strings; use `count="{{count}}"` to resolve from parent state as a number)
5. **Render the shadow template** by calling `render_node` recursively with the child state as root and a **fresh `HydrationScope`** (always active). The `Locator` is threaded through so nested custom elements are expanded too.
6. **Extract light DOM children** via `extract_directive_content` (reuses the same nesting-aware scanner as directives).
7. **Build the outer opening tag** via `build_element_open_tag`, which handles attribute resolution and optionally injects hydration markers. The behaviour differs by context:
   - **Root custom elements** (`is_entry: true`): handled by `build_entry_element_open_tag`. `{{binding}}` attribute values are resolved from the root state:
     - **Primitives** (`String`, `Number`, `Bool`) — rendered with the resolved value (HTML-escaped). e.g. `text="{{message}}"` → `text="Hello world"`.
     - **Non-primitives** (`Array`, `Object`, `Null`) and missing values — stripped. Arrays and objects cannot be meaningfully represented as HTML attribute values; the state is available directly in the element's template via state propagation. Because of this, same-name non-primitive bindings like `list="{{list}}"` are redundant in entry HTML and can be omitted — state propagation provides the value automatically.
     - **Static attributes** (no binding syntax, e.g. `id="main"`) — passed through unchanged.
     - **Client-only attrs** (`@event`, `:prop`, attribute directives) — stripped as usual.
     - No `data-fe-c` marker is added — root elements at entry level have no parent hydration scope.
   - **Nested custom elements** (`is_entry: false`): `strip_client_only_attrs` removes client-only attrs after binding resolution. If the element carries `{{expr}}` or `{expr}` attribute bindings and is inside a parent hydration scope, those bindings are counted and `data-fe-c-{start}-{count}` is injected.
8. **Strip client-only binding attributes** (`@attr` event bindings, `:attr` property bindings, and `f-ref`/`f-slotted`/`f-children` attribute directives) from all tags inside the rendered shadow template. `:attr` bindings contribute to child state in step 4 but are still removed from the rendered HTML — they are resolved by the FAST client runtime. The `data-fe-c` binding count is preserved — these bindings are still counted so the FAST client runtime allocates the correct number of binding slots.
9. **Emit Declarative Shadow DOM** with hydration attributes:
   ```html
   <my-button label="Hi">
     <template shadowrootmode="open" shadowroot="open">[shadow DOM]</template>
     [light DOM children]
   </my-button>
   ```
   When a nested element has attribute bindings (`{{expr}}` or `{expr}` values) and is being rendered inside another element's shadow (i.e., `parent_hydration` is `Some`), those bindings are counted, `data-fe-c-{start}-{count}` is added to the element's opening tag, and the binding indices are allocated from the parent scope.

Note: `is_entry` controls only opening-tag attribute handling. Child state is always built using the current root state as a base with per-element attributes overlaid on top, regardless of the `is_entry` flag.

If a custom element has no matching template, it is left in place by `next_directive` (which only returns `CustomElement` for tags in the locator).

---

## Configuration — `config.rs`

The `RenderConfig` struct holds configuration options that affect rendering behaviour. It is threaded through the rendering pipeline from the public API entry points down to `render_node` and the directive renderers.

### `attribute-name-strategy`

Controls how HTML attribute names are mapped to state property names when building child state for custom elements. Two strategies are available:

| Strategy | Behaviour | Example |
|----------|-----------|---------|
| `"camelCase"` (default) | Dashed attribute names are converted to camelCase. | `foo-bar` → `fooBar` → `{{fooBar}}` |
| `"none"` | Attribute names are lowercased as-is. Dashes are preserved. | `foo-bar` → `foo-bar` → `{{foo-bar}}` |

The `camelCase` strategy only applies to attributes that are **not** already handled by a specialized conversion:

- `data-*` attributes always use the `dataset.*` grouping with camelCase (MDN convention), regardless of the strategy.
- `aria-*` attributes always use the ARIA reflection lookup table (e.g. `aria-valuenow` → `ariaValueNow`), regardless of the strategy.
- HTML global attributes with known property name differences (e.g. `tabindex` → `tabIndex`) always use the lookup table, regardless of the strategy.
- `:prop` property bindings are always lowercased, regardless of the strategy.

This means the strategy only affects "plain" custom element attributes like `selected-user-id`, `show-details`, or `foo-bar`.

### API

All render functions accept `config: Option<&RenderConfig>` as their last parameter. Pass `None` for defaults, or `Some(&config)` for custom configuration:

- `render(template, state, config)`
- `render_without_state(template, config)`
- `render_template(template, state_str, config)`
- `render_template_without_state(template, config)`
- `render_with_locator(template, state, locator, config)`
- `render_with_locator_without_state(template, locator, config)`
- `render_template_with_locator(template, state_str, locator, config)`
- `render_template_with_locator_without_state(template, locator, config)`
- `render_entry_with_locator(template, state, locator, config)`
- `render_entry_with_locator_without_state(template, locator, config)`
- `render_entry_template_with_locator(template, state_str, locator, config)`
- `render_entry_template_with_locator_without_state(template, locator, config)`

The `*_without_state` APIs render with an empty object root state. In WASM, the state parameter is optional for `render`, `render_with_templates`, and `render_entry_with_templates`; omitted state also uses an empty object. The template-rendering WASM exports accept an `attribute_name_strategy` string parameter (`""`, `"none"`, or `"camelCase"`):

- `render_with_templates(entry, templates_json, state?, attribute_name_strategy?)`
- `render_entry_with_templates(entry, templates_json, state?, attribute_name_strategy?)`

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
   - `attr="{{expr}}"` — **value binding**: `expr` is resolved to a string and HTML-escaped. If `expr` is missing, the entire attribute is omitted, though the hydration binding count still includes it.
   - `attr="{expr}"` — **single-brace binding**: left unchanged (client-side only).
4. `inject_compact_marker` inserts `data-fe-c-{start}-{count}` before the closing `>` of the tag.

This atomic tag processing ensures that the `{{expr}}` attribute values are never seen as content directives by the main loop — `pos` advances past the entire tag before the directive scanner runs again.

### Dataset bindings — `attribute::data_attr_to_dataset_key`

FAST elements follow the [MDN `HTMLElement.dataset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) convention: a camelCase property (e.g. `dateOfBirth`) corresponds to a kebab-case `data-*` HTML attribute (e.g. `data-date-of-birth`).

When building child state for a custom element (step 4 of `render_custom_element`), any attribute whose name starts with `data-` is routed into a nested `"dataset"` object rather than a top-level key:

```
data-date-of-birth="1990-01-01"  →  state["dataset"]["dateOfBirth"] = "1990-01-01"
```

`attribute::data_attr_to_dataset_key` returns the full dot-notation path: `"data-date-of-birth"` → `"dataset.dateOfBirth"`. The caller in `render_custom_element` splits on the first `.` (`"dataset"` / `"dateOfBirth"`) and inserts the value into the nested `"dataset"` map. Shadow templates can then use `{{dataset.dateOfBirth}}` which resolves via ordinary dot-notation (`state["dataset"]["dateOfBirth"]`).

The `dataset.` portion of the binding expression is nothing special to `resolve_value` — it is plain two-level dot-notation that traverses the nested `"dataset"` object built by the attribute mapper.

### ARIA attribute bindings — `attribute_lookup::aria_attr_to_property_key`

ARIA attributes follow the [Element ARIA reflection](https://developer.mozilla.org/en-US/docs/Web/API/Element#instance_properties_included_from_aria) convention: a camelCase property (e.g. `ariaDisabled`) corresponds to an `aria-*` HTML attribute (e.g. `aria-disabled`).

When building child state for a custom element (step 4 of `render_custom_element`), any attribute whose name matches a known ARIA attribute is converted to its camelCase property name and stored as a top-level state key:

```
aria-disabled="true"    →  state["ariaDisabled"] = "true"
aria-valuenow="50"      →  state["ariaValueNow"] = "50"
```

`attribute_lookup::aria_attr_to_property_key` uses a static lookup table (a `match` block) rather than algorithmic conversion. This is necessary because ARIA attribute names do not use dashes at word boundaries — for example, `aria-valuenow` (not `aria-value-now`) maps to `ariaValueNow`. The lookup table covers all ARIA attributes defined in the [WAI-ARIA specification](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes). Unrecognised `aria-*` attributes fall through to the default lowercased-key path.

### HTML attribute-to-property mappings — `attribute_lookup::html_attr_to_property_key`

Some HTML attributes have DOM property names that differ from their attribute names (e.g. `tabindex` → `tabIndex`, `readonly` → `readOnly`, `contenteditable` → `contentEditable`).

When building child state for a custom element (step 4 of `render_custom_element`), any attribute whose lowercased name matches the lookup table is stored under its camelCase property name instead:

```
tabindex="0"             →  state["tabIndex"] = "0"
readonly="true"          →  state["readOnly"] = "true"
contenteditable="true"   →  state["contentEditable"] = "true"
```

`attribute_lookup::html_attr_to_property_key` uses the same static lookup table approach as the ARIA table. Only attributes where the property name differs from the attribute name are included — attributes like `disabled`, `title`, and `hidden` whose names match exactly are not in the table and pass through as-is.

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
2. Recursively walk that directory collecting all `.html` files (`walk_html_files`). The walk is bounded to a maximum depth of 50 directories (`MAX_DIR_DEPTH`) and skips symlinks to prevent infinite loops from symlink cycles.
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

`wasm.rs` is compiled only for the `wasm32-unknown-unknown` target (`#[cfg(target_arch = "wasm32")]`). It exposes four functions to JavaScript via `wasm-bindgen`:

| Export | Signature | Description |
|--------|-----------|-------------|
| `render` | `(entry: &str, state?: string) → String` | Render a template with no custom elements; omitted state is `{}` |
| `render_with_templates` | `(entry: &str, templates_json: &str, state?: string, attribute_name_strategy?: string) → String` | Render a template with a pre-built `{name: content}` templates map using non-entry semantics; omitted state is `{}` |
| `render_entry_with_templates` | `(entry: &str, templates_json: &str, state?: string, attribute_name_strategy?: string) → String` | Render top-level entry HTML with a pre-built `{name: content}` templates map; omitted state is `{}` |
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

Accepts `templates_json` as a JSON object string mapping element names to raw template strings (the inner content already extracted from `<template>`). Constructs a `Locator::from_templates` map and calls `render_template_with_locator` when state is provided, or the no-state equivalent when it is omitted. This preserves the original non-entry semantics for existing JS consumers.

### `render_entry_with_templates`

Accepts the same arguments as `render_with_templates`, but calls `render_entry_template_with_locator` when state is provided, or the no-state equivalent when it is omitted. Root-level custom elements therefore receive entry opening-tag handling, matching CLI entry rendering.

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

`parse_string` handles `\"`, `\\`, `\/`, `\b`, `\f`, `\n`, `\r`, `\t`, and `\uXXXX` Unicode escapes. Non-ASCII literal characters (e.g. emoji, accented letters) are decoded as multi-byte UTF-8 sequences — the full byte sequence for each code point is consumed before advancing, avoiding the corruption that would result from casting individual bytes to `char`.

`parse_number` handles integer and decimal forms. All numbers are stored as `f64`. This matches JavaScript `number` semantics but means integers larger than 2^53 lose precision. For typical template state (IDs, counts, display values) this is not a concern; very large integers should be passed as strings.

`JsonValue::to_display_string` converts a value to its display form: integers are formatted without a decimal point (via `as i64`), arrays display as `[Array]`, objects as `[Object]`.

`JsonValue::is_truthy` mirrors JavaScript's truthiness rules:

| Value | Truthy? | Notes |
|---|---|---|
| `null` | ✗ | |
| `false` | ✗ | |
| `0` (number) | ✗ | |
| `NaN` (number) | ✗ | `NaN` is falsy in JavaScript |
| `""` (empty string) | ✗ | |
| `true` | ✓ | |
| Non-zero number | ✓ | |
| Non-empty string | ✓ | |
| Array (any) | ✓ | `[]` is truthy in JavaScript, even when empty |
| Object (any) | ✓ | `{}` is truthy in JavaScript, even when empty |

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

**Automatic state propagation.** Every custom element — whether at the entry level or deeply nested — receives the current root state as a base for its child state. Per-element HTML attributes are overlaid on top, overriding any matching keys. This means unbound state keys automatically propagate through the entire element tree without requiring explicit attribute bindings on every intermediate element. For example, a `{{text}}` binding in a grandchild element resolves from the same state as the root element, unless an ancestor explicitly overrides `text` via an attribute.

**`Option<&Locator>` threading.** The locator is an optional parameter on all internal functions. Passing `None` disables custom element expansion entirely, preserving backward compatibility for callers that use `render` / `render_template`.

**`Option<&mut HydrationScope>` threading.** The hydration context is an optional mutable parameter on `render_node` and all directive renderers. Passing `None` disables all hydration marker emission and keeps non-custom-element rendering identical to the pre-hydration behaviour. The public API always passes `None` at the top level; hydration is only activated inside `render_custom_element`.

**Named hydration markers.** Marker names are derived from the binding context: content bindings use `<expr>-<idx>` (e.g. `title-0`, `item.name-2`), f-when uses `when-<idx>`, and f-repeat uses `repeat-<idx>`. This makes markers human-readable and self-describing without a shared ID counter. `HydrationScope` needs only `binding_idx` — no `Rc`, no `scope_id`, no `ScopeGen`. The scheme differs from the FAST HTML package which uses random alphanumeric UUIDs, but the structure is equivalent.

**Atomic tag processing for attribute bindings.** When a plain HTML opening tag in the literal region contains `{{expr}}` attribute values, those values are resolved and `data-fe-c` is injected into the tag as a whole before `next_directive` ever sees them. This prevents the `{{expr}}` inside attributes from being mistaken for content bindings. The cost is that `next_directive` is called once extra per tag iteration, but tags are short and rare enough that this has no meaningful performance impact.

**`Result` throughout.** All render functions return `Result<_, RenderError>`. Errors propagate via `?` for malformed templates, invalid JSON, invalid repeat expressions, and invalid directive state. Missing optional values are handled by binding context: content bindings render empty output, attribute bindings omit the attribute, `<f-when>` treats the value as falsy, and `<f-repeat>` treats a missing list binding as an empty array while still erroring when a present value is not an array.

**Left-to-right, first-match scanning.** Directives are found by searching for their literal opening strings. The earliest position wins. This is O(n×d) where n is the template length and d is the number of directive types — acceptable for the template sizes this crate targets.
