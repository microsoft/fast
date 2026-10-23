//! In-memory `<f-template>` CSS composition, with no filesystem requirement.

use crate::attribute::{find_tag_end, parse_element_attributes};
use crate::error::{template_context, RenderError};
use crate::locator::{
    find_html_end_tag, find_html_start_tag, is_html_tag_name_boundary,
    starts_with_ascii_case_insensitive,
};
use crate::SourceSpan;

/// A stylesheet to insert as the first child of a definition's inner template.
#[derive(Debug, Clone, Copy)]
pub enum Stylesheet<'a> {
    /// Literal CSS, optionally marked as a generated SSR fallback.
    Inline {
        css: &'a str,
        style_id: Option<&'a str>,
    },
    /// A public URL owned and served by the caller.
    External { href: &'a str },
}

/// Which original input owns a mapped range.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CompositionSource {
    Html,
    Css,
    /// Inserted tags and escaped attributes have no authored source coordinates.
    Generated,
}

/// An authored range, or an explicitly generated range without coordinates.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CompositionSpan {
    pub source: CompositionSource,
    pub span: Option<SourceSpan>,
}

/// Composed HTML and its single-insertion provenance.
///
/// Mapping accepts UTF-16 offsets in `html`, or diagnostics in either the complete
/// document or the trimmed inner content returned by `parse_f_templates`.
#[derive(Debug, Clone)]
pub struct ComposedTemplate {
    pub(crate) html: String,
    pub(crate) original: String,
    pub(crate) css: Option<String>,
    pub(crate) insertion: usize,
    pub(crate) inserted_len: usize,
    pub(crate) css_start: usize,
    pub(crate) content_start: usize,
    pub(crate) content_end: usize,
}

impl ComposedTemplate {
    /// The composed definition. Keep it unchanged while using this result's map.
    pub fn html(&self) -> &str {
        &self.html
    }

    /// Map a half-open UTF-16 range in the composed document to an original input.
    /// Ranges crossing source boundaries are rejected instead of inventing a location.
    pub fn map_span(&self, start: usize, end: usize) -> Result<CompositionSpan, RenderError> {
        let start = utf16_byte(&self.html, start)?;
        let end = utf16_byte(&self.html, end)?;
        if start > end {
            return Err(mapping_error("range start must not exceed its end"));
        }
        let insertion_end = self.insertion + self.inserted_len;
        let (source, text, range) = if start >= insertion_end {
            (
                CompositionSource::Html,
                self.original.as_str(),
                start - self.inserted_len..end - self.inserted_len,
            )
        } else if end <= self.insertion && start < self.insertion {
            (CompositionSource::Html, self.original.as_str(), start..end)
        } else if let Some(css) = self.css.as_deref().filter(|css| {
            start >= self.css_start
                && end <= self.css_start + css.len()
                && start < self.css_start + css.len()
        }) {
            (
                CompositionSource::Css,
                css,
                start - self.css_start..end - self.css_start,
            )
        } else if start >= self.insertion && end <= insertion_end {
            let crosses_css = self
                .css
                .as_ref()
                .is_some_and(|css| start < self.css_start + css.len() && end > self.css_start);
            if crosses_css {
                return Err(mapping_error("range crosses generated and CSS sources"));
            }
            return Ok(CompositionSpan {
                source: CompositionSource::Generated,
                span: None,
            });
        } else {
            return Err(mapping_error("range crosses HTML and inserted sources"));
        };
        let mut locations = crate::binding_metadata::SourceLocations::new(text);
        Ok(CompositionSpan {
            source,
            span: Some(SourceSpan {
                start: locations.position(range.start),
                end: locations.position(range.end),
            }),
        })
    }

    /// Map an existing renderer/converter diagnostic without parsing its message.
    /// `template_content` is true only for the selected definition's trimmed
    /// content (locator/shadow-root errors), not entry HTML or nested definitions.
    pub fn map_location(
        &self,
        location: crate::ErrorLocation,
        template_content: bool,
    ) -> Result<CompositionSpan, RenderError> {
        let base = if template_content {
            self.content_start
        } else {
            0
        };
        let end = if template_content {
            self.content_end
        } else {
            self.html.len()
        };
        let source = &self.html[base..end];
        let mut cursor = crate::binding_metadata::SourceLocations::new(source);
        for byte in source
            .char_indices()
            .map(|(byte, _)| byte)
            .chain([source.len()])
        {
            let position = cursor.position(byte);
            if source.as_bytes().get(byte) == Some(&b'\n')
                && byte > 0
                && source.as_bytes()[byte - 1] == b'\r'
            {
                continue;
            }
            if position.line == location.line && position.column == location.column {
                if location.length > source[byte..].encode_utf16().count() {
                    return Err(mapping_error("location extends beyond its source"));
                }
                let offset = self.html[..base].encode_utf16().count() + position.offset;
                let end = offset
                    .checked_add(location.length)
                    .ok_or_else(|| mapping_error("location length overflow"))?;
                return self.map_span(offset, end);
            }
        }
        Err(mapping_error("location is outside the composed source"))
    }
}

fn utf16_byte(text: &str, offset: usize) -> Result<usize, RenderError> {
    let mut units = 0;
    for (byte, ch) in text.char_indices() {
        if units == offset {
            return Ok(byte);
        }
        units += ch.len_utf16();
        if units > offset {
            return Err(mapping_error("offset splits a UTF-16 surrogate pair"));
        }
    }
    if units == offset {
        Ok(text.len())
    } else {
        Err(mapping_error("offset is outside the source"))
    }
}

fn mapping_error(message: &str) -> RenderError {
    RenderError::InvalidComposition {
        message: message.to_string(),
    }
}

fn static_attribute(value: &str) -> Result<String, RenderError> {
    if value.trim().is_empty()
        || value
            .chars()
            .any(|ch| ch.is_control() || matches!(ch, '{' | '}'))
    {
        return Err(mapping_error(
            "stylesheet URL or identity must be nonempty static text without controls or braces",
        ));
    }
    Ok(crate::content::html_escape(value))
}

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
    compose_f_template_styles_with_options(
        template_html,
        Stylesheet::Inline {
            css,
            style_id: None,
        },
    )
    .map(|result| result.html)
}

/// Compose literal inline CSS or an external link, retaining original-source mapping.
/// Generated inline styles use `data-fast-ssr-style`; the identity is not a nonce.
pub fn compose_f_template_styles_with_options(
    template_html: &str,
    stylesheet: Stylesheet<'_>,
) -> Result<ComposedTemplate, RenderError> {
    if let Stylesheet::Inline { css, .. } = stylesheet {
        if let Some(at) = find_style_terminator(css) {
            return Err(RenderError::UnsafeStyleContent {
                context: template_context(css, at),
            });
        }
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
    let name = parse_element_attributes(&template_html[outer_start..outer_tag_end])
        .into_iter()
        .find(|(name, _)| name.eq_ignore_ascii_case("name"))
        .and_then(|(_, value)| value);
    compose_inner_styles(template_html, stylesheet, outer_start, outer_tag_end).map_err(|error| {
        match name {
            Some(name) => error.in_template(&name),
            None => error,
        }
    })
}

fn compose_inner_styles(
    template_html: &str,
    stylesheet: Stylesheet<'_>,
    outer_start: usize,
    outer_tag_end: usize,
) -> Result<ComposedTemplate, RenderError> {
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
    )
    .map_err(|error| match error {
        RenderError::MissingInnerTemplate => error.at(template_html, outer_start),
        _ => error,
    })?;
    let inner_tag_end =
        find_tag_end(template_html, inner_start).ok_or_else(|| RenderError::UnclosedDirective {
            tag: "template".to_string(),
            context: template_context(template_html, inner_start),
        })?;
    let inner_close = find_html_end_tag(template_html, "template", inner_tag_end)
        .filter(|(close_start, _)| *close_start < outer_close_start)
        .map(|(close_start, _)| close_start)
        .ok_or_else(|| RenderError::UnclosedDirective {
            tag: "template".to_string(),
            context: template_context(template_html, inner_start),
        })?;

    let (inserted, css, css_offset) = match stylesheet {
        Stylesheet::Inline { css, style_id } => {
            let opening = match style_id {
                Some(id) => format!("<style data-fast-ssr-style=\"{}\">", static_attribute(id)?),
                None => "<style>".to_string(),
            };
            (
                format!("{opening}{css}</style>"),
                Some(css.to_string()),
                opening.len(),
            )
        }
        Stylesheet::External { href } => (
            format!(
                "<link rel=\"stylesheet\" href=\"{}\">",
                static_attribute(href)?
            ),
            None,
            0,
        ),
    };
    let mut output = String::with_capacity(template_html.len() + inserted.len());
    output.push_str(&template_html[..inner_tag_end]);
    output.push_str(&inserted);
    output.push_str(&template_html[inner_tag_end..]);
    Ok(ComposedTemplate {
        html: output,
        original: template_html.to_string(),
        css,
        insertion: inner_tag_end,
        inserted_len: inserted.len(),
        css_start: inner_tag_end + css_offset,
        content_start: inner_tag_end,
        content_end: inner_tag_end
            + inserted.len()
            + template_html[inner_tag_end..inner_close].trim_end().len(),
    })
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
        count => Err(multiple(count).at(html, starts[1])),
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
            && (name_start + 5 == bytes.len()
                || is_html_tag_name_boundary(bytes.get(name_start + 5).copied()))
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
