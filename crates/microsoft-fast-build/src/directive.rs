use std::borrow::Cow;
use crate::json::JsonValue;
use crate::context::{resolve_value, ChildState, LoopVars, State};
use crate::expression::evaluate;
use crate::content::html_escape;
use crate::config::{RenderConfig, AttributeNameStrategy};
use crate::attribute::{
    skip_single_brace_expr, read_tag_name, read_tag_name_slice,
    parse_element_attributes, find_next_plain_html_tag, is_custom_element,
    resolve_attribute_bindings_in_tag, strip_client_only_attrs,
    data_attr_to_dataset_key, kebab_to_camel,
};
use crate::attribute_lookup::{aria_attr_to_property_key, html_attr_to_property_key};
use crate::error::{RenderError, template_context};
use crate::node::render_plan;
use crate::locator::Locator;
use crate::hydration::HydrationScope;
use crate::plan::{Body, Element, Repeat, When};

/// A template directive found at a given byte position.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
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

#[derive(Debug, PartialEq, Eq)]
pub(crate) enum RenderEvent {
    PlainTag(usize),
    Directive(Directive),
}

pub(crate) fn next_event(
    template: &str,
    from: usize,
    locator: Option<&Locator>,
) -> Option<RenderEvent> {
    let bytes = template.as_bytes();
    let mut pos = from;
    while pos < bytes.len() {
        match bytes[pos] {
            b'{' if bytes.get(pos + 1) == Some(&b'{') => {
                let directive = if bytes.get(pos + 2) == Some(&b'{') {
                    Directive::TripleBrace(pos)
                } else {
                    Directive::DoubleBrace(pos)
                };
                return Some(RenderEvent::Directive(directive));
            }

            b'{' => {
                let after = skip_single_brace_expr(template, pos);
                // The legacy plain-tag pass also sees tags inside client expressions.
                // Stop at one before resuming so attribute handling stays byte-compatible.
                if let Some(tag) = find_next_plain_html_tag(template, pos + 1, after, locator) {
                    return Some(RenderEvent::PlainTag(tag));
                }
                pos = after;
                continue;
            }
            b'<' => {
                for (tag, directive) in [
                    ("<f-when", Directive::When(pos)),
                    ("<f-repeat", Directive::Repeat(pos)),
                ] {
                    if template[pos..].starts_with(tag)
                        && matches!(
                            bytes.get(pos + tag.len()),
                            Some(b' ' | b'>' | b'\n' | b'\t' | b'\r'),
                        )
                    {
                        return Some(RenderEvent::Directive(directive));
                    }
                }
                if let Some(name) = read_tag_name_slice(template, pos) {
                    if is_custom_element(name)
                        && locator.map_or(false, |loc| loc.has_template(name))
                    {
                        return Some(RenderEvent::Directive(Directive::CustomElement(pos)));
                    }
                    if !matches!(bytes.get(pos + 1), Some(b'/' | b'!'))
                        && !name.starts_with("f-")
                    {
                        return Some(RenderEvent::PlainTag(pos));
                    }
                }
            }
            _ => {}
        }
        pos += 1;
    }
    None
}

#[cfg(test)]
#[path = "directive-scan-tests.rs"]
mod scan_tests;

/// Render an `<f-when>` directive.
pub fn render_when(
    template: &str,
    at: usize,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
    locator: Option<&Locator>,
    hydration: Option<&mut HydrationScope>,
    config: &RenderConfig,
    prepared: Option<&When>,
) -> Result<(String, usize), RenderError> {
    let owned;
    let prepared = match prepared {
        Some(prepared) => prepared,
        None => {
            owned = When::parse(template, at)?;
            &owned
        }
    };
    let inner_range = &prepared.body.range;
    let inner = &template[inner_range.clone()];
    let expr = &prepared.expression;

    let output = if let Some(hy) = hydration {
        let index = hy.next_binding();
        let start = hy.content_start_marker(index);
        let end = hy.content_end_marker(index);
        let inner_content = if evaluate(expr, root, loop_vars) {
            let mut child_scope = HydrationScope::new(config.markers_v2);
            render_plan(
                prepared.body.plan(template, locator), inner, root, loop_vars,
                locator, Some(&mut child_scope), false, config,
            ).map_err(|error| error.rebase(template, inner_range.start))?
        } else {
            String::new()
        };
        format!("{}{}{}", start, inner_content, end)
    } else {
        if evaluate(expr, root, loop_vars) {
            render_plan(
                prepared.body.plan(template, locator), inner, root, loop_vars,
                locator, None, false, config,
            ).map_err(|error| error.rebase(template, inner_range.start))?
        } else {
            String::new()
        }
    };

    Ok((output, prepared.after))
}

/// Render an `<f-repeat>` directive.
pub fn render_repeat(
    template: &str,
    at: usize,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
    locator: Option<&Locator>,
    hydration: Option<&mut HydrationScope>,
    config: &RenderConfig,
    prepared: Option<&Repeat>,
) -> Result<(String, usize), RenderError> {
    let owned;
    let prepared = match prepared {
        Some(prepared) => prepared,
        None => {
            owned = Repeat::parse(template, at)?;
            &owned
        }
    };
    let inner_range = &prepared.body.range;
    let var_name = &prepared.variable;
    let list_expr = &prepared.collection;
    let items = resolve_value(list_expr, root, loop_vars);
    match items.as_deref() {
        None => {
            let output = render_repeat_items(
                &prepared.body, template, &[], var_name, root, loop_vars,
                locator, hydration, config,
            ).map_err(|error| error.rebase(template, inner_range.start))?;
            Ok((output, prepared.after))
        }
        Some(JsonValue::Array(items)) => {
            let output = render_repeat_items(
                &prepared.body, template, items, var_name, root, loop_vars,
                locator, hydration, config,
            ).map_err(|error| error.rebase(template, inner_range.start))?;
            Ok((output, prepared.after))
        }
        Some(_) => Err(RenderError::NotAnArray {
            binding: list_expr.clone(),
            context: template_context(template, at),
        }),
    }
}

fn render_repeat_items(
    body: &Body,
    template: &str,
    items: &[JsonValue],
    var_name: &str,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
    locator: Option<&Locator>,
    hydration: Option<&mut HydrationScope>,
    config: &RenderConfig,
) -> Result<String, RenderError> {
    let inner = &template[body.range.clone()];
    match hydration {
        Some(hy) => {
            let binding_index = hy.next_binding();
            let outer_start = hy.content_start_marker(binding_index);
            let outer_end = hy.content_end_marker(binding_index);
            let mut parts: Vec<String> = Vec::with_capacity(items.len());
            for (i, item) in items.iter().enumerate() {
                let new_vars = build_loop_vars(loop_vars, var_name, item, i);
                let mut item_scope = HydrationScope::new(config.markers_v2);
                let rendered = render_plan(
                    body.plan(template, locator), inner, root, &new_vars, locator,
                    Some(&mut item_scope), false, config,
                )?;
                parts.push(format!(
                    "{}{}{}",
                    hy.repeat_start_marker(i),
                    rendered,
                    hy.repeat_end_marker(i)
                ));
            }
            Ok(format!("{}{}{}", outer_start, parts.concat(), outer_end))
        }
        None => items.iter().enumerate()
            .map(|(i, item)| {
                let new_vars = build_loop_vars(loop_vars, var_name, item, i);
                render_plan(
                    body.plan(template, locator), inner, root, &new_vars,
                    locator, None, false, config,
                )
            })
            .collect::<Result<String, _>>(),
    }
}

pub(crate) fn build_loop_vars<'a>(
    loop_vars: &'a LoopVars<'_>,
    var_name: &'a str,
    item: &'a JsonValue,
    index: usize,
) -> Vec<(&'a str, Cow<'a, JsonValue>)> {
    let mut new_vars = Vec::with_capacity(loop_vars.len() + 2);
    new_vars.extend(
        loop_vars.iter().map(|(name, value)| (*name, Cow::Borrowed(value.as_ref()))),
    );
    new_vars.push((var_name, Cow::Borrowed(item)));
    new_vars.push(("$index", Cow::Owned(JsonValue::Number(index as f64))));
    new_vars
}

/// Parse `"item in list"` into `("item", "list")`.
pub(crate) fn parse_repeat_expr(expr: &str) -> Option<(String, String)> {
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
///    <template {shadowroot-attrs}>{rendered}</template>
///    {children}</{tag-name}>`
///
/// For self-closing elements (`<my-button />`), the element is emitted as non-self-closing.
/// When `parent_hydration` is Some, attribute bindings on the element tag are counted
/// and `data-fe="N"` is added to the opening tag.
pub fn render_custom_element(
    template: &str,
    at: usize,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
    locator: &Locator,
    mut parent_hydration: Option<&mut HydrationScope>,
    is_entry: bool,
    config: &RenderConfig,
    prepared: Option<&Element>,
) -> Result<(String, usize), RenderError> {
    let owned;
    let prepared = match prepared {
        Some(prepared) => prepared,
        None => {
            owned = Element::parse(template, at)?;
            &owned
        }
    };
    let tag_end = prepared.tag_end;
    let tag_name = &prepared.name;
    let open_tag_base = &prepared.base;

    let attrs = &prepared.attrs;
    let child_root_owned = build_custom_element_child_root(
        attrs,
        root,
        loop_vars,
        config.attribute_name_strategy,
    );
    let child_root: &dyn State = match child_root_owned.as_ref() {
        Some(state) => state,
        None => root,
    };

    // Render the shadow DOM template with a fresh hydration scope.
    let rendered = render_shadow_content(tag_name, child_root, locator, config)?;
    let shadowroot_attributes = locator.shadowroot_markup(tag_name);

    // Build the final opening tag, resolving {{expr}} attrs and injecting hydration attrs.
    let element_open = build_element_open_tag(
        open_tag_base,
        root,
        loop_vars,
        parent_hydration.as_mut().map(|h| &mut **h),
        is_entry,
        prepared.binding_count,
    );

    // Merge attributes declared on the template's inner `<template>` element
    // onto the rendered host opening tag. Author attributes on the host element
    // always win on conflicts; client-only template attrs (`@`, `:`, `f-ref`,
    // `f-slotted`, `f-children`) are skipped; `{{expr}}` / `?name="{{expr}}"`
    // bindings resolve against `child_root` (the same state used for the shadow
    // template).
    let element_open = merge_template_host_attrs(
        element_open,
        locator.get_host_attributes(tag_name),
        child_root,
        attrs,
    );

    // Missing light-DOM closes are diagnosed after shadow rendering, as before.
    let children = prepared.children.as_ref().ok_or_else(|| RenderError::UnclosedDirective {
        tag: tag_name.clone(),
        context: template_context(template, at),
    })?;

    let rendered_children = if children.range.is_empty() {
        String::new()
    } else {
        render_plan(
            children.plan(template, Some(locator)),
            &template[children.range.clone()],
            root,
            loop_vars,
            Some(locator),
            parent_hydration.as_mut().map(|h| &mut **h),
            false,
            config,
        ).map_err(|error| error.rebase(template, tag_end))?
    };

    let output = format!(
        "{}<template{}>{}</template>{}</{}>",
        element_open, shadowroot_attributes, rendered, rendered_children, tag_name
    );

    Ok((output, prepared.after))
}

pub(crate) fn render_shadow_content(
    element_name: &str,
    state: &dyn State,
    locator: &Locator,
    config: &RenderConfig,
) -> Result<String, RenderError> {
    let template = locator.get_template(element_name)
        .ok_or_else(|| RenderError::UnknownTemplate {
            element: element_name.to_string(),
        })?;
    let mut scope = HydrationScope::new(config.markers_v2);
    render_plan(
        locator.render_plan(element_name).expect("template was found"),
        template, state, &[], Some(locator), Some(&mut scope), false, config,
    )
        .map_err(|error| {
            error.authored(locator.authored_template(element_name).expect("template was found"))
                .in_template(element_name)
        })
}

/// Merge `template_host_attrs` (parsed from the inner `<template …>` element)
/// onto the already-built host opening tag string `element_open`.
///
/// Behaviour:
/// - Skip client-only template attrs (`@event`, `:prop`, `f-ref`, `f-slotted`,
///   `f-children`); these have no meaning on a server-rendered host element.
/// - Skip any template attr whose dedupe key already appears as an author
///   attribute on the host element — author attributes always win. The dedupe
///   key for `?name="{{expr}}"` is the bare `name` (lowercased); for everything
///   else it is the lowercased attribute name.
/// - Static `name="value"` → emit ` name="html-escaped(value)"`.
/// - `name="{{expr}}"` → resolve via `resolve_value` against `child_root`;
///   emit ` name="resolved"` for `String` / `Number` / `Bool`; skip otherwise.
/// - `?name="{{expr}}"` → evaluate via `evaluate` against `child_root`; emit
///   bare ` name` when truthy; skip when falsy.
/// - Static boolean attribute `name` → emit ` name` (no value).
///
/// Returns `element_open` unchanged when no attributes survive the filter.
pub(crate) fn merge_template_host_attrs(
    element_open: String,
    template_host_attrs: &[(String, Option<String>)],
    child_root: &dyn State,
    source_author_attrs: &[(String, Option<String>)],
) -> String {
    if template_host_attrs.is_empty() {
        return element_open;
    }

    // Author attribute names already present on the rendered opening tag.
    // `element_open` always ends with `>` and never `/>` (custom elements are
    // always rendered as non-self-closing here), so parsing the full string
    // gives the complete attribute set including any `data-fe` marker.
    let author_attrs = parse_element_attributes(&element_open);
    let mut author_names: Vec<String> = author_attrs
        .into_iter()
        .map(|(name, _)| name.to_lowercase())
        .collect();
    for (name, _) in source_author_attrs {
        if !is_client_only_attr(name) {
            author_names.push(name.strip_prefix('?').unwrap_or(name).to_lowercase());
        }
    }

    let mut injected = String::new();
    for (name, value) in template_host_attrs {
        if is_client_only_attr(name) {
            continue;
        }
        let dedupe_key = if let Some(bare) = name.strip_prefix('?') {
            bare.to_lowercase()
        } else {
            name.to_lowercase()
        };
        if author_names.contains(&dedupe_key) {
            continue;
        }
        format_template_host_attr(&mut injected, name, value.as_deref(), child_root);
    }

    if injected.is_empty() {
        return element_open;
    }

    // `element_open` always ends with `>`; splice the new attrs just before it.
    let gt_pos = match element_open.rfind('>') {
        Some(p) => p,
        None => return element_open,
    };
    let mut out = String::with_capacity(element_open.len() + injected.len());
    out.push_str(&element_open[..gt_pos]);
    out.push_str(&injected);
    out.push_str(&element_open[gt_pos..]);
    out
}

fn is_client_only_attr(name: &str) -> bool {
    name.starts_with('@')
        || name.starts_with(':')
        || name.eq_ignore_ascii_case("f-ref")
        || name.eq_ignore_ascii_case("f-slotted")
        || name.eq_ignore_ascii_case("f-children")
}

/// Append the formatted representation of a single template-host attribute to
/// `out`. Each emitted attribute is prefixed with a single space so it slots in
/// before the closing `>` of the host opening tag.
fn format_template_host_attr(
    out: &mut String,
    name: &str,
    value: Option<&str>,
    child_root: &dyn State,
) {
    if let Some(bare) = name.strip_prefix('?') {
        let expr = value
            .and_then(|v| v.trim().strip_prefix("{{").and_then(|v| v.strip_suffix("}}")))
            .map(|e| e.trim());
        if let Some(expr) = expr {
            if evaluate(expr, child_root, &[]) {
                out.push(' ');
                out.push_str(bare);
            }
        }
        return;
    }

    match value {
        None => {
            // Static boolean attribute on the template element.
            out.push(' ');
            out.push_str(name);
        }
        Some(v) => {
            if let Some(expr) = crate::attribute::single_attribute_binding(v) {
                let resolved = resolve_value(expr.trim(), child_root, &[])
                    .unwrap_or(Cow::Owned(JsonValue::Null));
                match resolved.as_ref() {
                    JsonValue::String(s) => {
                        out.push(' ');
                        out.push_str(name);
                        out.push_str("=\"");
                        out.push_str(&html_escape(&s));
                        out.push('"');
                    }
                    JsonValue::Number(n) => {
                        out.push(' ');
                        out.push_str(name);
                        out.push_str("=\"");
                        out.push_str(&n.to_string());
                        out.push('"');
                    }
                    JsonValue::Bool(b) => {
                        if crate::attribute::is_boolean_attribute(name) {
                            if *b {
                                out.push(' ');
                                out.push_str(name);
                            }
                            return;
                        }
                        out.push(' ');
                        out.push_str(name);
                        out.push_str("=\"");
                        out.push_str(if *b { "true" } else { "false" });
                        out.push('"');
                    }
                    // Array / Object / Null → cannot be expressed as an HTML attribute value.
                    _ => {}
                }
            } else if v.contains("{{") {
                if let Some(resolved) = crate::attribute::resolve_attribute_value(v, child_root, &[]) {
                    crate::attribute::append_quoted_attribute(out, name, &resolved);
                }
            } else {
                out.push(' ');
                out.push_str(name);
                out.push_str("=\"");
                out.push_str(&html_escape(v));
                out.push('"');
            }
        }
    }
}

/// Build the child state used to render a custom element's shadow template.
///
/// The child state starts with the current root state as a base so unbound state
/// keys propagate through descendant custom elements. Per-element attributes are
/// then overlaid on top, overriding root state for matching keys.
///
/// Attribute processing rules:
///   - `@event`, `?bool`, `f-ref`, `f-slotted`, `f-children` → skipped entirely
///   - `:prop="{{expr}}"` → resolved and added to state under `prop`; not rendered
///   - `data-kebab-name` → grouped under `dataset.camelName` (MDN dataset convention)
///   - `aria-*` → camelCase property name via lookup table (ARIA reflection)
///   - HTML attrs with mismatched property names → camelCase via lookup table
///   - Anything else → lowercased key (or camelCase when `attribute_name_strategy` is `CamelCase`)
pub(crate) fn build_custom_element_child_root<'a>(
    attrs: &[(String, Option<String>)],
    root: &'a dyn State,
    loop_vars: &'a LoopVars<'_>,
    strategy: AttributeNameStrategy,
) -> Option<ChildState<'a>> {
    if !has_state_relevant_attrs(attrs) {
        return None;
    }

    Some(build_attr_state(attrs, root, loop_vars, strategy))
}

fn build_attr_state<'a>(
    attrs: &[(String, Option<String>)],
    root: &'a dyn State,
    loop_vars: &'a LoopVars<'_>,
    strategy: AttributeNameStrategy,
) -> ChildState<'a> {
    let mut state_map = std::collections::HashMap::new();
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
                    .or_insert_with(|| {
                        root.is_object().then(|| root.lookup(group)).flatten()
                            .unwrap_or_else(|| Cow::Owned(JsonValue::Object(
                                std::collections::HashMap::new(),
                            )))
                    });
                if matches!(group_val.as_ref(), JsonValue::Object(_)) {
                    if let JsonValue::Object(map) = group_val.to_mut() {
                        map.insert(prop.to_string(), json_val.into_owned());
                    }
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
    ChildState::new(root, state_map)
}

fn has_state_relevant_attrs(attrs: &[(String, Option<String>)]) -> bool {
    attrs.iter().any(|(name, _)| {
        !name.starts_with('@')
            && !name.starts_with('?')
            && !name.eq_ignore_ascii_case("f-ref")
            && !name.eq_ignore_ascii_case("f-slotted")
            && !name.eq_ignore_ascii_case("f-children")
    })
}

pub(crate) fn build_shadowroot_template_attrs(attrs: &[(String, Option<String>)]) -> String {
    let mut mode: Option<Option<String>> = None;
    let mut legacy_shadowroot: Option<Option<String>> = None;
    let mut forwarded: Vec<(String, Option<String>)> = Vec::new();
    let mut seen_forwarded: Vec<String> = Vec::new();

    for (name, value) in attrs {
        let normalized = name.to_lowercase();
        match normalized.as_str() {
            "shadowrootmode" => {
                if mode.is_none() {
                    mode = Some(value.clone());
                }
            }
            "shadowroot" => {
                if legacy_shadowroot.is_none() {
                    legacy_shadowroot = Some(value.clone());
                }
            }
            _ if normalized.starts_with("shadowroot") => {
                if !seen_forwarded.contains(&normalized) {
                    seen_forwarded.push(normalized.clone());
                    forwarded.push((normalized, value.clone()));
                }
            }
            _ => {}
        }
    }

    let explicit_mode = explicit_shadowroot_attr_value(mode);
    let explicit_legacy_shadowroot = explicit_shadowroot_attr_value(legacy_shadowroot);
    let mode = explicit_mode
        .clone()
        .or_else(|| explicit_legacy_shadowroot.clone())
        .unwrap_or_else(|| "open".to_string());
    let legacy_shadowroot = explicit_legacy_shadowroot
        .or(explicit_mode)
        .unwrap_or_else(|| mode.clone());

    let mut out = String::new();
    append_template_attr_value(&mut out, "shadowrootmode", &mode);
    append_template_attr_value(&mut out, "shadowroot", &legacy_shadowroot);
    for (name, value) in forwarded {
        append_template_attr(&mut out, &name, &value);
    }
    out
}

fn explicit_shadowroot_attr_value(value: Option<Option<String>>) -> Option<String> {
    value.flatten().filter(|value| !value.is_empty())
}

fn append_template_attr(out: &mut String, name: &str, value: &Option<String>) {
    match value {
        Some(value) => append_template_attr_value(out, name, value),
        None => {
            out.push(' ');
            out.push_str(name);
        }
    }
}

fn append_template_attr_value(out: &mut String, name: &str, value: &str) {
    out.push(' ');
    out.push_str(name);
    out.push_str("=\"");
    out.push_str(&html_escape(value));
    out.push('"');
}

fn attribute_to_json_value<'a>(
    value: Option<&String>,
    root: &'a dyn State,
    loop_vars: &'a LoopVars<'_>,
) -> Cow<'a, JsonValue> {
    let v = match value {
        None => return Cow::Owned(JsonValue::Bool(true)), // boolean attribute (no value)
        Some(s) => s,
    };
    if v.starts_with("{{") && v.ends_with("}}") {
        let binding = v[2..v.len() - 2].trim();
        return resolve_value(binding, root, loop_vars).unwrap_or(Cow::Owned(JsonValue::Null));
    }
    // Try parsing JSON array or object literals passed as attribute values.
    // Trim whitespace and check matching delimiters before invoking the parser.
    let trimmed = v.trim();
    let looks_like_json_literal =
        (trimmed.starts_with('[') && trimmed.ends_with(']'))
            || (trimmed.starts_with('{') && trimmed.ends_with('}'));
    if looks_like_json_literal {
        if let Ok(parsed) = crate::json::parse(trimmed) {
            return Cow::Owned(parsed);
        }
    }
    Cow::Owned(JsonValue::String(v.clone()))
}

pub(crate) fn build_element_open_tag(
    open_tag_base: &str,
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
    parent_hydration: Option<&mut HydrationScope>,
    is_entry: bool,
    total_attr: usize,
) -> String {
    if is_entry {
        // Entry-level root custom element opening tags resolve bindings from root state.
        // Resolve {{binding}} attributes: keep primitives (string/number/bool) with
        // their resolved value, strip non-primitives (array/object/null) since they
        // cannot be meaningfully represented as an HTML attribute value.
        // Static attributes (no binding) are passed through unchanged.
        // No data-fe marker is needed — root elements have no parent hydration scope.
        return build_entry_element_open_tag(open_tag_base, root, loop_vars);
    }
    if total_attr == 0 {
        return format!("{}>", strip_client_only_attrs(open_tag_base));
    }
    let resolved = resolve_attribute_bindings_in_tag(open_tag_base, root, loop_vars);
    let stripped = strip_client_only_attrs(&resolved);
    match parent_hydration {
        Some(hy) => {
            let marker = hy.attribute_marker(total_attr);
            format!("{} {}>", stripped, marker)
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
    root: &dyn State,
    loop_vars: &LoopVars<'_>,
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
            Some(ref v) if crate::attribute::single_attribute_binding(v).is_some() => {
                let binding = crate::attribute::single_attribute_binding(v).expect("Binding was checked");
                if name.starts_with('?') {
                    // ?attr="{{expr}}" — boolean binding: emit bare attr name when truthy
                    if evaluate(binding, root, loop_vars) {
                        out.push(' ');
                        out.push_str(&name[1..]);
                    }
                } else {
                    let resolved = resolve_value(binding, root, loop_vars).unwrap_or(Cow::Owned(JsonValue::Null));
                    match resolved.as_ref() {
                        JsonValue::String(s) => out.push_str(&format!(" {}=\"{}\"", name, html_escape(&s))),
                        JsonValue::Number(n) => out.push_str(&format!(" {}=\"{}\"", name, n)),
                        JsonValue::Bool(b) => {
                            if crate::attribute::is_boolean_attribute(&name) {
                                if *b { out.push_str(&format!(" {}", name)); }
                            } else {
                                out.push_str(&format!(" {}=\"{}\"", name, b));
                            }
                        }
                        _ => {} // Array, Object, Null — strip
                    }
                }
            }
            Some(v) if v.contains("{{") => {
                if let Some(resolved) = crate::attribute::resolve_attribute_value(&v, root, loop_vars) {
                    crate::attribute::append_quoted_attribute(&mut out, &name, &resolved);
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
