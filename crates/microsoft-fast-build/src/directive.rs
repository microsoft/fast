use crate::json::JsonValue;
use crate::context::resolve_value;
use crate::expression::evaluate;
use crate::content::html_escape;
use crate::config::{RenderConfig, AttributeNameStrategy};
use crate::attribute::{
    find_str, find_directive, extract_directive_expr, extract_directive_content,
    find_single_brace, skip_single_brace_expr, find_tag_end, read_tag_name,
    parse_element_attributes, find_custom_element,
    count_tag_attribute_bindings, resolve_attribute_bindings_in_tag, strip_client_only_attrs,
    data_attr_to_dataset_key, kebab_to_camel,
};
use crate::attribute_lookup::{aria_attr_to_property_key, html_attr_to_property_key};
use crate::error::{RenderError, template_context};
use crate::node::render_node;
use crate::locator::Locator;
use crate::hydration::HydrationScope;

/// A template directive found at a given byte position.
pub enum Directive {
    TripleBrace(usize),
    DoubleBrace(usize),
    When(usize),
    Repeat(usize),
    CustomElement(usize),
}

impl Directive {
    pub fn position(&self) -> usize {
        match self {
            Directive::TripleBrace(p) | Directive::DoubleBrace(p)
            | Directive::When(p) | Directive::Repeat(p)
            | Directive::CustomElement(p) => *p,
        }
    }
}

/// Find the earliest directive in `template` starting from `from`.
/// Single-brace expressions (`{…}`) are skipped so their `}` characters cannot
/// accidentally terminate a `{{…}}` binding search.
/// If `locator` is Some, also detects `CustomElement` directives for known elements.
pub fn next_directive(template: &str, from: usize, locator: Option<&Locator>) -> Option<Directive> {
    let mut pos = from;
    loop {
        let triple = find_str(template, "{{{", pos).map(Directive::TripleBrace);
        // Suppress `{{` when it coincides with the start of a `{{{`
        let double = find_str(template, "{{", pos).and_then(|d| {
            let shadowed = triple.as_ref().map(|t| t.position() == d).unwrap_or(false);
            if shadowed { None } else { Some(Directive::DoubleBrace(d)) }
        });
        let when   = find_directive(template, "<f-when",   pos).map(Directive::When);
        let repeat = find_directive(template, "<f-repeat", pos).map(Directive::Repeat);
        let custom = locator.and_then(|loc| {
            find_custom_element(template, pos, loc).map(Directive::CustomElement)
        });

        let all_refs = [triple.as_ref(), double.as_ref(), when.as_ref(), repeat.as_ref(), custom.as_ref()];
        let earliest_pos = all_refs.into_iter().flatten().map(|d| d.position()).min();

        // If a single { precedes the earliest binding, skip past it so its `}`
        // cannot be misread as the closing `}}` of a double-brace binding.
        if let (Some(single), Some(earliest)) = (find_single_brace(template, pos), earliest_pos) {
            if single < earliest {
                pos = skip_single_brace_expr(template, single);
                continue;
            }
        }

        return [triple, double, when, repeat, custom]
            .into_iter()
            .flatten()
            .min_by_key(|d| d.position());
    }
}

/// Render an `<f-when>` directive.
pub fn render_when(
    template: &str,
    at: usize,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
    locator: Option<&Locator>,
    hydration: Option<&mut HydrationScope>,
    config: &RenderConfig,
) -> Result<(String, usize), RenderError> {
    let (inner, after) = extract_directive_content(template, at, "f-when")
        .ok_or_else(|| RenderError::UnclosedDirective {
            tag: "f-when".to_string(),
            context: template_context(template, at),
        })?;
    let expr = extract_directive_expr(template, at)
        .ok_or_else(|| RenderError::MissingValueAttribute {
            tag: "f-when".to_string(),
            context: template_context(template, at),
        })?;

    let output = if let Some(hy) = hydration {
        let idx = hy.next_binding();
        let name = format!("when-{}", idx);
        let start = hy.start_marker(idx, &name);
        let end = hy.end_marker(idx, &name);
        let inner_content = if evaluate(&expr, root, loop_vars) {
            let mut child_scope = hy.child(idx);
            render_node(&inner, root, loop_vars, locator, Some(&mut child_scope), false, config)?
        } else {
            String::new()
        };
        format!("{}{}{}", start, inner_content, end)
    } else {
        if evaluate(&expr, root, loop_vars) {
            render_node(&inner, root, loop_vars, locator, None, false, config)?
        } else {
            String::new()
        }
    };

    Ok((output, after))
}

/// Render an `<f-repeat>` directive.
pub fn render_repeat(
    template: &str,
    at: usize,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
    locator: Option<&Locator>,
    hydration: Option<&mut HydrationScope>,
    config: &RenderConfig,
) -> Result<(String, usize), RenderError> {
    let (inner, after) = extract_directive_content(template, at, "f-repeat")
        .ok_or_else(|| RenderError::UnclosedDirective {
            tag: "f-repeat".to_string(),
            context: template_context(template, at),
        })?;
    let expr = extract_directive_expr(template, at)
        .ok_or_else(|| RenderError::MissingValueAttribute {
            tag: "f-repeat".to_string(),
            context: template_context(template, at),
        })?;
    let (var_name, list_expr) = parse_repeat_expr(&expr)
        .ok_or_else(|| RenderError::InvalidRepeatExpression {
            expr: expr.clone(),
            context: template_context(template, at),
        })?;
    match resolve_value(&list_expr, root, loop_vars) {
        None => {
            let output = render_repeat_items(&inner, &[], &var_name, root, loop_vars, locator, hydration, config)?;
            Ok((output, after))
        }
        Some(JsonValue::Array(items)) => {
            let output = render_repeat_items(&inner, &items, &var_name, root, loop_vars, locator, hydration, config)?;
            Ok((output, after))
        }
        Some(_) => Err(RenderError::NotAnArray {
            binding: list_expr,
            context: template_context(template, at),
        }),
    }
}

fn render_repeat_items(
    inner: &str,
    items: &[JsonValue],
    var_name: &str,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
    locator: Option<&Locator>,
    hydration: Option<&mut HydrationScope>,
    config: &RenderConfig,
) -> Result<String, RenderError> {
    match hydration {
        Some(hy) => {
            let outer_idx = hy.next_binding();
            let outer_name = format!("repeat-{}", outer_idx);
            let outer_start = hy.start_marker(outer_idx, &outer_name);
            let outer_end = hy.end_marker(outer_idx, &outer_name);
            let mut parts: Vec<String> = Vec::with_capacity(items.len());
            for (i, item) in items.iter().enumerate() {
                let new_vars = build_loop_vars(loop_vars, var_name, item, i);
                let mut item_scope = HydrationScope::new();
                let rendered = render_node(inner, root, &new_vars, locator, Some(&mut item_scope), false, config)?;
                parts.push(format!(
                    "<!--fe-repeat$$start$${}$$fe-repeat-->{}<!--fe-repeat$$end$${}$$fe-repeat-->",
                    i, rendered, i
                ));
            }
            Ok(format!("{}{}{}", outer_start, parts.concat(), outer_end))
        }
        None => items.iter().enumerate()
            .map(|(i, item)| {
                let new_vars = build_loop_vars(loop_vars, var_name, item, i);
                render_node(inner, root, &new_vars, locator, None, false, config)
            })
            .collect::<Result<String, _>>(),
    }
}

fn build_loop_vars(
    loop_vars: &[(String, JsonValue)],
    var_name: &str,
    item: &JsonValue,
    index: usize,
) -> Vec<(String, JsonValue)> {
    let mut new_vars = loop_vars.to_vec();
    new_vars.push((var_name.to_string(), item.clone()));
    new_vars.push(("$index".to_string(), JsonValue::Number(index as f64)));
    new_vars
}

/// Parse `"item in list"` into `("item", "list")`.
fn parse_repeat_expr(expr: &str) -> Option<(String, String)> {
    let parts: Vec<&str> = expr.trim().splitn(3, ' ').collect();
    if parts.len() == 3 && parts[1] == "in" && !parts[0].is_empty() && !parts[2].is_empty() {
        Some((parts[0].to_string(), parts[2].to_string()))
    } else {
        None
    }
}

/// Render a custom element by expanding its shadow DOM template.
///
/// Output format:
///   `<original-open-tag>
///    <template shadowrootmode="open" shadowroot="open">{rendered}</template>
///    {children}</{tag-name}>`
///
/// For self-closing elements (`<my-button />`), the element is emitted as non-self-closing.
/// When `parent_hydration` is Some, attribute bindings on the element tag are counted
/// and `data-fe-c-{start}-{count}` is added to the opening tag.
pub fn render_custom_element(
    template: &str,
    at: usize,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
    locator: &Locator,
    parent_hydration: Option<&mut HydrationScope>,
    is_entry: bool,
    config: &RenderConfig,
) -> Result<(String, usize), RenderError> {
    // Find the end of the opening tag.
    let tag_end = find_tag_end(template, at).ok_or_else(|| RenderError::UnclosedDirective {
        tag: "custom element".to_string(),
        context: template_context(template, at),
    })?;

    let tag_name = read_tag_name(template, at).unwrap_or_default();
    let open_tag_content = &template[at..tag_end];

    // Detect self-closing (`/>` possibly preceded by whitespace).
    let before_gt = open_tag_content[..open_tag_content.len() - 1].trim_end();
    let is_self_closing = before_gt.ends_with('/');

    // Build the non-self-closing base (no trailing > yet).
    let open_tag_base = if is_self_closing {
        before_gt[..before_gt.len() - 1].trim_end().to_string()
    } else {
        open_tag_content[..open_tag_content.len() - 1].to_string()
    };

    // Build the child state used to render this element's shadow template.
    //
    // The child state always starts with the current root state as a base so
    // all unbound state keys (e.g. `text`, `error`, `showProgress`) propagate
    // through to every descendant custom element automatically. Per-element
    // attributes (e.g. `planet="earth"`, boolean `show`) are then overlaid on
    // top, overriding root state for any overlapping key.
    //
    // When the element has no state-relevant attributes, we skip cloning the
    // root state entirely and pass it through by reference.
    //
    // Attribute processing rules:
    //   - `@event`, `?bool`, `f-ref`, `f-slotted`, `f-children` → skipped entirely
    //   - `:prop="{{expr}}"` → resolved and added to state under `prop`; not rendered
    //   - `data-kebab-name` → grouped under `dataset.camelName` (MDN dataset convention)
    //   - `aria-*` → camelCase property name via lookup table (ARIA reflection)
    //   - HTML attrs with mismatched property names → camelCase via lookup table
    //   - Anything else → lowercased key (or camelCase when `attribute_name_strategy` is `CamelCase`)
    fn build_attr_state(
        attrs: &[(String, Option<String>)],
        root: &JsonValue,
        loop_vars: &[(String, JsonValue)],
        base: std::collections::HashMap<String, JsonValue>,
        strategy: AttributeNameStrategy,
    ) -> JsonValue {
        let mut state_map = base;
        for (attr_name, value) in attrs {
            if attr_name.starts_with('@')
                || attr_name.starts_with('?')
                || attr_name.eq_ignore_ascii_case("f-ref")
                || attr_name.eq_ignore_ascii_case("f-slotted")
                || attr_name.eq_ignore_ascii_case("f-children")
            {
                continue;
            }
            if let Some(prop_name) = attr_name.strip_prefix(':') {
                let json_val = attribute_to_json_value(value.as_ref(), root, loop_vars);
                let key = prop_name.to_lowercase();
                state_map.insert(key, json_val);
                continue;
            }
            let json_val = attribute_to_json_value(value.as_ref(), root, loop_vars);
            let lowered = attr_name.to_lowercase();
            if let Some(path) = data_attr_to_dataset_key(&lowered) {
                if let Some((group, prop)) = path.split_once('.') {
                    let group_val = state_map
                        .entry(group.to_string())
                        .or_insert_with(|| JsonValue::Object(std::collections::HashMap::new()));
                    if let JsonValue::Object(ref mut map) = group_val {
                        map.insert(prop.to_string(), json_val);
                    }
                }
            } else if let Some(key) = aria_attr_to_property_key(&lowered) {
                state_map.insert(key.to_string(), json_val);
            } else if let Some(key) = html_attr_to_property_key(&lowered) {
                state_map.insert(key.to_string(), json_val);
            } else if strategy == AttributeNameStrategy::CamelCase && lowered.contains('-') {
                state_map.insert(kebab_to_camel(&lowered), json_val);
            } else {
                state_map.insert(lowered, json_val);
            }
        }
        JsonValue::Object(state_map)
    }

    /// Returns true if any parsed attribute would contribute to child state.
    fn has_state_relevant_attrs(attrs: &[(String, Option<String>)]) -> bool {
        attrs.iter().any(|(name, _)| {
            !name.starts_with('@')
                && !name.starts_with('?')
                && !name.eq_ignore_ascii_case("f-ref")
                && !name.eq_ignore_ascii_case("f-slotted")
                && !name.eq_ignore_ascii_case("f-children")
        })
    }

    // Parse attributes once, then decide whether cloning is necessary.
    // When the element has no state-relevant attributes, skip the HashMap
    // clone and reuse `root` directly — avoids O(state-size) work per element
    // in deep custom-element trees.
    let attrs = parse_element_attributes(open_tag_content);
    let child_root_owned;
    let child_root: &JsonValue = if has_state_relevant_attrs(&attrs) {
        let base = if let JsonValue::Object(ref root_map) = root {
            root_map.clone()
        } else {
            std::collections::HashMap::new()
        };
        child_root_owned = build_attr_state(&attrs, root, loop_vars, base, config.attribute_name_strategy);
        &child_root_owned
    } else {
        root
    };

    // Render the shadow DOM template with a fresh hydration scope.
    let mut shadow_scope = HydrationScope::new();
    let element_template = locator.get_template(&tag_name).unwrap_or_default();
    let rendered = render_node(element_template, child_root, &[], Some(locator), Some(&mut shadow_scope), false, config)?;

    // Build the final opening tag, resolving {{expr}} attrs and injecting hydration attrs.
    let element_open = build_element_open_tag(&open_tag_base, open_tag_content, root, loop_vars, parent_hydration, is_entry);

    // Extract the light DOM children (for non-self-closing elements).
    let (children, after) = if is_self_closing {
        (String::new(), tag_end)
    } else {
        extract_directive_content(template, at, &tag_name)
            .ok_or_else(|| RenderError::UnclosedDirective {
                tag: tag_name.clone(),
                context: template_context(template, at),
            })?
    };

    let output = format!(
        "{}<template shadowrootmode=\"open\" shadowroot=\"open\">{}</template>{}</{}>",
        element_open, rendered, children, tag_name
    );

    Ok((output, after))
}

fn attribute_to_json_value(value: Option<&String>, root: &JsonValue, loop_vars: &[(String, JsonValue)]) -> JsonValue {
    let v = match value {
        None => return JsonValue::Bool(true), // boolean attribute (no value)
        Some(s) => s,
    };
    if v.starts_with("{{") && v.ends_with("}}") {
        let binding = v[2..v.len() - 2].trim();
        return resolve_value(binding, root, loop_vars).unwrap_or(JsonValue::Null);
    }
    // Try parsing JSON array or object literals passed as attribute values.
    // Trim whitespace and check matching delimiters before invoking the parser.
    let trimmed = v.trim();
    let looks_like_json_literal =
        (trimmed.starts_with('[') && trimmed.ends_with(']'))
            || (trimmed.starts_with('{') && trimmed.ends_with('}'));
    if looks_like_json_literal {
        if let Ok(parsed) = crate::json::parse(trimmed) {
            return parsed;
        }
    }
    JsonValue::String(v.clone())
}

fn build_element_open_tag(
    open_tag_base: &str,
    open_tag_content: &str,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
    parent_hydration: Option<&mut HydrationScope>,
    is_entry: bool,
) -> String {
    if is_entry {
        // Entry-level root custom element opening tags resolve bindings from root state.
        // Resolve {{binding}} attributes: keep primitives (string/number/bool) with
        // their resolved value, strip non-primitives (array/object/null) since they
        // cannot be meaningfully represented as an HTML attribute value.
        // Static attributes (no binding) are passed through unchanged.
        // No data-fe-c marker is needed — root elements have no parent hydration scope.
        return build_entry_element_open_tag(open_tag_base, root, loop_vars);
    }
    let (db, sb) = count_tag_attribute_bindings(open_tag_content);
    let total_attr = db + sb;
    if total_attr == 0 {
        return format!("{}>", strip_client_only_attrs(open_tag_base));
    }
    let resolved = resolve_attribute_bindings_in_tag(open_tag_base, root, loop_vars);
    let stripped = strip_client_only_attrs(&resolved);
    match parent_hydration {
        Some(hy) => {
            let start_idx = hy.binding_idx;
            hy.binding_idx += total_attr;
            format!("{} data-fe-c-{}-{}>", stripped, start_idx, total_attr)
        }
        None => format!("{}>", stripped),
    }
}

/// Build the opening tag for an entry-level root custom element.
///
/// - Client-only attributes (`@event`, `:prop`, `f-ref`, `f-slotted`, `f-children`) are
///   stripped first via `strip_client_only_attrs` to avoid duplicating the filter list.
/// - `{{binding}}` attribute values are then resolved from root state:
///   - `?attr="{{expr}}"` boolean bindings: evaluate `expr` as a boolean; emit the bare
///     attribute name (without `?`) when truthy, omit it when falsy.
///   - Primitives (`String`, `Number`, `Bool`) → rendered with the resolved value (HTML-escaped).
///   - Non-primitives (`Array`, `Object`, `Null`) → stripped.
/// - Static attributes (no binding syntax) are passed through unchanged.
fn build_entry_element_open_tag(
    open_tag_base: &str,
    root: &JsonValue,
    loop_vars: &[(String, JsonValue)],
) -> String {
    let stripped_base = strip_client_only_attrs(open_tag_base);
    let tag_name = match read_tag_name(&stripped_base, 0) {
        Some(name) => name,
        None => return format!("{}>", stripped_base),
    };

    let mut out = format!("<{}", tag_name);
    for (name, value) in parse_element_attributes(&stripped_base) {
        match value {
            None => {
                out.push(' ');
                out.push_str(&name);
            }
            Some(ref v) if v.trim().starts_with("{{") && v.trim().ends_with("}}") && v.trim().len() > 4 => {
                let binding = v.trim()[2..v.trim().len() - 2].trim();
                if name.starts_with('?') {
                    // ?attr="{{expr}}" — boolean binding: emit bare attr name when truthy
                    if evaluate(binding, root, loop_vars) {
                        out.push(' ');
                        out.push_str(&name[1..]);
                    }
                } else {
                    let resolved = resolve_value(binding, root, loop_vars).unwrap_or(JsonValue::Null);
                    match resolved {
                        JsonValue::String(s) => out.push_str(&format!(" {}=\"{}\"", name, html_escape(&s))),
                        JsonValue::Number(n) => out.push_str(&format!(" {}=\"{}\"", name, n)),
                        JsonValue::Bool(b) => out.push_str(&format!(" {}=\"{}\"", name, b)),
                        _ => {} // Array, Object, Null — strip
                    }
                }
            }
            Some(v) => {
                out.push_str(&format!(" {}=\"{}\"", name, v));
            }
        }
    }
    out.push('>');
    out
}
