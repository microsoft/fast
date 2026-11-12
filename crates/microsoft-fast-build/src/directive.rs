use crate::attribute::{
    find_next_plain_html_tag, is_custom_element, read_tag_name_slice, skip_single_brace_expr,
};
use crate::content::html_escape;
use crate::locator::Locator;

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
            Directive::TripleBrace(p)
            | Directive::DoubleBrace(p)
            | Directive::When(p)
            | Directive::Repeat(p)
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
                    if !matches!(bytes.get(pos + 1), Some(b'/' | b'!')) && !name.starts_with("f-") {
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

/// Parse `"item in list"` into `("item", "list")`.
pub(crate) fn parse_repeat_expr(expr: &str) -> Option<(String, String)> {
    let parts: Vec<&str> = expr.trim().splitn(3, ' ').collect();
    if parts.len() == 3 && parts[1] == "in" && !parts[0].is_empty() && !parts[2].is_empty() {
        Some((parts[0].to_string(), parts[2].to_string()))
    } else {
        None
    }
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
