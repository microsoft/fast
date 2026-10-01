//! In-memory `<f-template>` CSS composition, with no filesystem requirement.

use crate::attribute::find_tag_end;
use crate::error::{template_context, RenderError};
use crate::locator::{
    find_html_end_tag, find_html_start_tag, is_html_tag_name_boundary,
    starts_with_ascii_case_insensitive,
};

/// Compose `css` into the single `<f-template>` element in `template_html`.
///
/// Parses exactly one outer `<f-template>` element and exactly one inner
/// `<template>` element inside it, then inserts `<style>{css}</style>` as the
/// first child of the inner `<template>`. The outer `<f-template>` opening and
/// closing tags, the inner `<template>` opening and closing tags, and all
/// existing inner content are preserved byte-for-byte — only the `<style>`
/// element is inserted.
///
/// This operation is pure string composition: it has no filesystem
/// requirement and does not require a [`crate::Locator`].
///
/// # Errors
///
/// - [`RenderError::UnsafeStyleContent`] — `css` contains a case-insensitive
///   `</style` raw-text terminator sequence, which would prematurely close
///   the inserted `<style>` element.
/// - [`RenderError::MissingFTemplate`] / [`RenderError::MultipleFTemplates`] —
///   `template_html` does not contain exactly one `<f-template>` element.
/// - [`RenderError::MissingInnerTemplate`] / [`RenderError::MultipleInnerTemplates`] —
///   the `<f-template>` element does not contain exactly one inner
///   `<template>` element.
/// - [`RenderError::UnclosedDirective`] — the outer `<f-template>` or inner
///   `<template>` element is not properly closed.
pub fn compose_f_template_styles(template_html: &str, css: &str) -> Result<String, RenderError> {
    if let Some(at) = find_style_terminator(css) {
        return Err(RenderError::UnsafeStyleContent {
            context: template_context(css, at),
        });
    }

    let outer_start = require_single_tag(
        template_html,
        "f-template",
        0,
        template_html.len(),
        RenderError::MissingFTemplate,
        |count| RenderError::MultipleFTemplates { count },
    )?;
    let outer_tag_end =
        find_tag_end(template_html, outer_start).ok_or_else(|| RenderError::UnclosedDirective {
            tag: "f-template".to_string(),
            context: template_context(template_html, outer_start),
        })?;
    let (outer_close_start, _) = find_html_end_tag(template_html, "f-template", outer_tag_end)
        .ok_or_else(|| RenderError::UnclosedDirective {
            tag: "f-template".to_string(),
            context: template_context(template_html, outer_start),
        })?;

    let inner_start = require_single_tag(
        template_html,
        "template",
        outer_tag_end,
        outer_close_start,
        RenderError::MissingInnerTemplate,
        |count| RenderError::MultipleInnerTemplates { count },
    )?;
    let inner_tag_end =
        find_tag_end(template_html, inner_start).ok_or_else(|| RenderError::UnclosedDirective {
            tag: "template".to_string(),
            context: template_context(template_html, inner_start),
        })?;
    let inner_closed_within_outer = find_html_end_tag(template_html, "template", inner_tag_end)
        .is_some_and(|(close_start, _)| close_start < outer_close_start);
    if !inner_closed_within_outer {
        return Err(RenderError::UnclosedDirective {
            tag: "template".to_string(),
            context: template_context(template_html, inner_start),
        });
    }

    let mut output = String::with_capacity(template_html.len() + css.len() + 17);
    output.push_str(&template_html[..inner_tag_end]);
    output.push_str("<style>");
    output.push_str(css);
    output.push_str("</style>");
    output.push_str(&template_html[inner_tag_end..]);
    Ok(output)
}

/// Find the single start-tag position of `tag` within `html[from..before]`.
///
/// Returns `missing` when no match is found and `multiple(count)` when more
/// than one match is found, so callers can surface a specific structured
/// error for each case.
fn require_single_tag(
    html: &str,
    tag: &str,
    from: usize,
    before: usize,
    missing: RenderError,
    multiple: impl Fn(usize) -> RenderError,
) -> Result<usize, RenderError> {
    let mut starts = Vec::new();
    let mut pos = from;
    while let Some(start) = find_html_start_tag(html, tag, pos) {
        if start >= before {
            break;
        }
        starts.push(start);
        pos = start + 1;
    }

    match starts.len() {
        0 => Err(missing),
        1 => Ok(starts[0]),
        count => Err(multiple(count)),
    }
}

/// Find the byte offset of a case-insensitive `</style` raw-text terminator
/// in `css`, requiring an HTML tag-name boundary (whitespace, `/`, `>`, or
/// end of string) after `style` so that safe content such as
/// `content: "</stylesheet>"` is not rejected.
fn find_style_terminator(css: &str) -> Option<usize> {
    let bytes = css.as_bytes();
    let mut pos = 0usize;

    while let Some(relative) = css[pos..].find("</") {
        let start = pos + relative;
        let name_start = start + 2;

        if starts_with_ascii_case_insensitive(bytes, name_start, b"style")
            && is_html_tag_name_boundary(bytes.get(name_start + 5).copied())
        {
            return Some(start);
        }

        pos = name_start;
    }

    None
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn find_style_terminator_matches_case_insensitively() {
        assert!(find_style_terminator("</style>").is_some());
        assert!(find_style_terminator("</STYLE>").is_some());
        assert!(find_style_terminator("</StYlE >").is_some());
        assert!(find_style_terminator("</style/>").is_some());
    }

    #[test]
    fn find_style_terminator_ignores_non_boundary_matches() {
        assert!(find_style_terminator("</stylesheet>").is_none());
        assert!(find_style_terminator("content: '</style-like';").is_none());
    }

    #[test]
    fn find_style_terminator_ignores_safe_content() {
        assert!(find_style_terminator(":host { display: block; }").is_none());
        assert!(find_style_terminator("/* </notstyle> */").is_none());
    }
}
