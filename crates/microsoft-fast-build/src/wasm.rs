use crate::config::{AttributeNameStrategy, RenderConfig};
use crate::json::{self, escape_json_str, json_string_array};
use crate::{
    render_entry_template_stream_with_locator,
    render_entry_template_stream_with_locator_without_state, render_entry_template_with_locator,
    render_entry_template_with_locator_without_state, render_template,
    render_template_with_locator, render_template_with_locator_without_state,
    render_template_without_state, Locator,
};
use std::collections::HashMap;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "StylesheetCompositionOptions")]
    pub type StylesheetCompositionOptions;
    #[wasm_bindgen(js_namespace = JSON, js_name = stringify, catch)]
    fn stringify_options(value: &StylesheetCompositionOptions) -> Result<String, JsValue>;
    #[wasm_bindgen(js_name = Error)]
    type JavaScriptError;
    #[wasm_bindgen(constructor, js_class = Error)]
    fn new(message: &str) -> JavaScriptError;
    #[wasm_bindgen(method, setter)]
    fn set_code(this: &JavaScriptError, value: &str);
    #[wasm_bindgen(method, setter)]
    fn set_line(this: &JavaScriptError, value: usize);
    #[wasm_bindgen(method, setter)]
    fn set_column(this: &JavaScriptError, value: usize);
    #[wasm_bindgen(method, setter)]
    fn set_length(this: &JavaScriptError, value: usize);
    #[wasm_bindgen(method, setter, js_name = templateName)]
    fn set_template_name(this: &JavaScriptError, value: &str);
    #[wasm_bindgen(method, setter, js_name = sourceKind)]
    fn set_source_kind(this: &JavaScriptError, value: &str);
}

fn js_error(
    code: &str,
    message: &str,
    location: Option<crate::ErrorLocation>,
    template_name: Option<&str>,
) -> JsValue {
    let error = JavaScriptError::new(message);
    error.set_code(code);
    if let Some(location) = location {
        error.set_line(location.line);
        error.set_column(location.column);
        error.set_length(location.length);
    }
    if let Some(name) = template_name {
        error.set_template_name(name);
    }
    error.into()
}

fn render_error(error: crate::RenderError) -> JsValue {
    let result = js_error(error.code(), &error.to_string(), error.location(), error.template_name());
    if error.source_kind() == Some("css") {
        let error: &JavaScriptError = result.unchecked_ref();
        error.set_source_kind("css");
    }
    result
}

fn metadata_error(message: &str) -> JsValue {
    js_error("invalid-template-metadata", message, None, None)
}

fn named_metadata_error(name: &str, message: &str) -> JsValue {
    js_error("invalid-template-metadata", message, None, Some(name))
}

#[wasm_bindgen(typescript_custom_section)]
const TEMPLATE_METADATA_TYPES: &str = r#"
/** A thrown Error with a stable code and optional authored-source coordinates. */
export interface FastBuildError extends Error {
    code: string;
    /** One-based line; CRLF is one break, as are lone CR and LF. */
    line?: number;
    /** One-based UTF-16 column; tabs count as one code unit. */
    column?: number;
    /** UTF-16 highlight length, in the same source as line and column. */
    length?: number;
    /** For separately supplied definitions, coordinates refer to their content. */
    templateName?: string;
    /** Present for separately supplied CSS diagnostics. */
    sourceKind?: "css";
}
export type StylesheetCompositionOptions =
    | { kind: "inline"; css: string; styleId?: string }
    | { kind: "external"; href: string };
export interface CompositionMapping {
    source: "html" | "css" | "generated";
    span: TemplateSourceSpan | null;
}
/** Single-insertion map; offsets and lengths are UTF-16 code units. */
export interface CompositionSourceMap {
    version: 1;
    originalHtml: string;
    css: string | null;
    insertionOffset: number;
    insertionLength: number;
    cssOffset: number | null;
    contentOffset: number;
    contentLength: number;
}
export interface TemplateBindingScope {
    variable: string;
    iterable: string;
}
export interface TemplateSourcePosition {
    /** Zero-based UTF-16 code-unit offset in the original HTML input. */
    offset: number;
    /** One-based line; CRLF is one break, as are lone CR and LF. */
    line: number;
    /** One-based UTF-16 code-unit column; tabs count as one code unit. */
    column: number;
}
/** Half-open trimmed expression range, excluding braces; repeats locate the iterable. */
export interface TemplateSourceSpan {
    start: TemplateSourcePosition;
    end: TemplateSourcePosition;
}
export interface TemplateBinding {
    name: string | null;
    expression: string;
    kind: "content" | "unescapedContent" | "attribute" | "hostAttribute" |
          "booleanAttribute" | "property" | "event" | "attributeDirective" |
          "when" | "repeat";
    paths: string[];
    scope: TemplateBindingScope[];
    type: "array" | null;
    optional: boolean | null;
    span: TemplateSourceSpan;
}
export interface FTemplateMetadata {
    name: string | null;
    content: string;
    shadowrootAttributes: { name: string; value: string | null }[];
    hostAttributes: { name: string; value: string | null }[];
    formatVersion: 1;
    bindings: TemplateBinding[];
}
/** An authored HTML slot, located at its opening tag in the original input. */
export interface TemplateSlot {
    /** Decoded name; an empty string denotes the default slot. */
    name: string;
    /** One-based line; CRLF is one break, as are lone CR and LF. */
    line: number;
    /** One-based UTF-16 column; tabs count as one code unit. */
    column: number;
}
"#;

/// Render a FAST HTML template with an optional JSON state string.
/// Omitted state is treated as an empty object.
/// Returns the rendered HTML or throws a JavaScript error.
#[wasm_bindgen]
pub fn render(entry: &str, state: Option<String>) -> Result<String, JsValue> {
    match state {
        Some(state) => render_template(entry, &state, None),
        None => render_template_without_state(entry, None),
    }
    .map_err(render_error)
}

/// Render a FAST HTML template with custom element templates and an optional JSON state string.
/// Omitted state is treated as an empty object.
///
/// This preserves the original non-entry rendering semantics for this export.
/// Use `render_entry_with_templates` for top-level entry HTML rendering.
///
/// `templates_json` is a JSON object mapping element names to their HTML template strings,
/// e.g. `{"my-button": "<template>...</template>"}`, or template metadata objects.
/// `attribute_name_strategy` controls attribute-to-property mapping: `"camelCase"` (default)
/// or `"none"`. Pass an empty string for the default.
/// Set `markers_v2` to emit FAST Element 2.x indexed hydration markers.
/// Returns the rendered HTML or throws a JavaScript error.
#[wasm_bindgen]
pub fn render_with_templates(
    entry: &str,
    templates_json: &str,
    state: Option<String>,
    attribute_name_strategy: Option<String>,
    markers_v2: Option<bool>,
) -> Result<String, JsValue> {
    let templates = parse_templates_map(templates_json)?;
    let locator = Locator::from_template_definitions(templates);
    let config = build_config(attribute_name_strategy.as_deref(), markers_v2.unwrap_or(false))?;
    match state {
        Some(state) => render_template_with_locator(entry, &state, &locator, config.as_ref()),
        None => render_template_with_locator_without_state(entry, &locator, config.as_ref()),
    }
    .map_err(render_error)
}

/// Render the top-level **entry HTML** with custom element templates and an optional JSON state string.
/// Omitted state is treated as an empty object.
/// Custom elements found at the root level of `entry` build child state from the full root
/// state with HTML attributes overlaid on top. For `{{binding}}` attributes on root custom
/// elements, primitive results (`string`, `number`, and `bool`) are preserved in the rendered
/// output, while missing and non-primitive values (`array`, `object`, `null`) are stripped.
///
/// `templates_json` is a JSON object mapping element names to their HTML template strings,
/// e.g. `{"my-button": "<template>...</template>"}`, or template metadata objects.
/// `attribute_name_strategy` controls attribute-to-property mapping: `"camelCase"` (default)
/// or `"none"`. Pass an empty string for the default.
/// Pass `stream: true` to return a JSON array string of stream chunks; in
/// stream mode, `templates_json` may be `{}`. Omitted or `false` stream
/// preserves the rendered HTML behavior.
/// Set `markers_v2` to emit FAST Element 2.x indexed hydration markers.
#[wasm_bindgen]
pub fn render_entry_with_templates(
    entry: &str,
    templates_json: &str,
    state: Option<String>,
    attribute_name_strategy: Option<String>,
    stream: Option<bool>,
    markers_v2: Option<bool>,
) -> Result<String, JsValue> {
    let templates = parse_templates_map(templates_json)?;
    let locator = Locator::from_template_definitions(templates);
    let config = build_config(attribute_name_strategy.as_deref(), markers_v2.unwrap_or(false))?;

    if stream.unwrap_or(false) {
        let chunks = match state {
            Some(state) => {
                render_entry_template_stream_with_locator(entry, &state, &locator, config.as_ref())
            }
            None => render_entry_template_stream_with_locator_without_state(
                entry,
                &locator,
                config.as_ref(),
            ),
        }
        .map_err(render_error)?;

        Ok(json_string_array(&chunks))
    } else {
        match state {
            Some(state) => {
                render_entry_template_with_locator(entry, &state, &locator, config.as_ref())
            }
            None => {
                render_entry_template_with_locator_without_state(entry, &locator, config.as_ref())
            }
        }
        .map_err(render_error)
    }
}

/// Render only a named component's Declarative Shadow DOM fragment.
/// State is resolved component state; host and light DOM remain caller-owned.
#[wasm_bindgen]
pub fn render_shadow_root(
    element_name: &str,
    templates_json: &str,
    state: Option<String>,
    attribute_name_strategy: Option<String>,
    markers_v2: Option<bool>,
) -> Result<String, JsValue> {
    let templates = parse_templates_map(templates_json)?;
    let locator = Locator::from_template_definitions(templates);
    let config = build_config(attribute_name_strategy.as_deref(), markers_v2.unwrap_or(false))?;
    crate::render_shadow_root_template_with_locator(element_name, state.as_deref(), &locator, config.as_ref())
        .map_err(render_error)
}

/// Apply the FAST code-sample escape to an HTML string.
///
/// Walks the input HTML and, for every `<code>` element, escapes:
///
/// * curly braces (`{` → `&#123;`, `}` → `&#125;`) in text content and
///   attribute values — so the FAST template parser does not interpret
///   `{{ ... }}` / `{ ... }` inside code samples as bindings;
/// * angle brackets of FAST directive tags (`<f-when>`, `</f-when>`,
///   `<f-repeat>`, `</f-repeat>`, case-insensitive) — so those directive
///   tags surface as literal text instead of being activated as real
///   elements. Angle brackets of any other tag (`<button>`, custom
///   elements, …) are left untouched so they keep rendering as live DOM.
///
/// Non-`<code>` regions of the input are returned verbatim. The function
/// is idempotent — running it on an already-escaped string is a no-op.
///
/// Intended for build-time tooling that needs to inject author-written
/// HTML containing `<code>` samples into a rendered page without going
/// through the full `render_*` pipeline.
#[wasm_bindgen]
pub fn escape_code_samples(html: &str) -> String {
    crate::code_escape::escape_code_sample_elements(html)
}

/// Parse all `<f-template>` elements from an HTML string.
/// Returns a JSON array of template metadata objects,
/// one per `<f-template>` element found. `name` is `null` when the element has
/// no `name` attribute.
#[wasm_bindgen]
pub fn parse_f_templates(html: &str) -> String {
    let templates = crate::locator::parse_f_templates(html);
    let mut parts = Vec::with_capacity(templates.len());
    for template in templates {
        let name_json = match template.name {
            Some(n) => format!("\"{}\"", escape_json_str(&n)),
            None => "null".to_string(),
        };
        parts.push(format!(
            "{{\"name\":{},\"content\":\"{}\",\"shadowrootAttributes\":{},\"hostAttributes\":{},\"formatVersion\":{},\"bindings\":{}}}",
            name_json,
            escape_json_str(&template.content),
            attribute_pairs_json(&template.shadowroot_attributes),
            attribute_pairs_json(&template.host_attributes),
            template.format_version,
            crate::binding_metadata::bindings_json(&template.bindings)
        ));
    }
    format!("[{}]", parts.join(","))
}

/// Compose `css` into the single `<f-template>` element in `template_html`.
///
/// Inserts `<style>{css}</style>` as the first child of the inner
/// `<template>` element, preserving all existing attributes and content
/// byte-for-byte. Has no filesystem requirement. Returns a JS error when
/// `template_html` does not contain exactly one `<f-template>` element with
/// exactly one inner `<template>` element, or when `css` contains a
/// case-insensitive `</style` raw-text terminator sequence.
#[wasm_bindgen]
pub fn compose_f_template_styles(template_html: &str, css: &str) -> Result<String, JsValue> {
    crate::f_template::compose_f_template_styles(template_html, css)
        .map_err(render_error)
}

/// HTML plus original-source mapping. Mapping methods return CompositionMapping JSON.
#[wasm_bindgen]
pub struct ComposedTemplate {
    inner: crate::ComposedTemplate,
}

#[wasm_bindgen]
impl ComposedTemplate {
    #[wasm_bindgen(getter)]
    pub fn html(&self) -> String {
        self.inner.html.clone()
    }

    /// CompositionSourceMap JSON, retained separately from template metadata.
    #[wasm_bindgen(getter)]
    pub fn source_map(&self) -> String {
        let inner = &self.inner;
        let units = |byte| inner.html[..byte].encode_utf16().count();
        let css = inner.css.as_ref().map(|css| format!("\"{}\"", escape_json_str(css)))
            .unwrap_or_else(|| "null".to_string());
        let css_offset = inner.css.as_ref().map(|_| units(inner.css_start).to_string())
            .unwrap_or_else(|| "null".to_string());
        format!(
            "{{\"version\":1,\"originalHtml\":\"{}\",\"css\":{},\"insertionOffset\":{},\"insertionLength\":{},\"cssOffset\":{},\"contentOffset\":{},\"contentLength\":{}}}",
            escape_json_str(&inner.original), css, units(inner.insertion),
            units(inner.insertion + inner.inserted_len) - units(inner.insertion),
            css_offset, units(inner.content_start),
            units(inner.content_end) - units(inner.content_start)
        )
    }

    /// Map a half-open composed-document UTF-16 range.
    pub fn map_span(&self, start: f64, end: f64) -> Result<String, JsValue> {
        let start = mapping_coordinate(start)?;
        let end = mapping_coordinate(end)?;
        self.inner.map_span(start, end).map(mapping_json).map_err(render_error)
    }

    /// Map document diagnostics, or selected-definition content diagnostics when true.
    pub fn map_location(
        &self, line: f64, column: f64, length: f64, template_content: bool,
    ) -> Result<String, JsValue> {
        let line = mapping_coordinate(line)?;
        let column = mapping_coordinate(column)?;
        let length = mapping_coordinate(length)?;
        self.inner.map_location(crate::ErrorLocation { line, column, length }, template_content)
            .map(mapping_json).map_err(render_error)
    }
}

fn mapping_coordinate(value: f64) -> Result<usize, JsValue> {
    if !value.is_finite() || value < 0.0 || value.fract() != 0.0 || value > u32::MAX as f64 {
        return Err(render_error(crate::RenderError::InvalidComposition {
            message: "mapping coordinates must be nonnegative 32-bit integers".to_string(),
        }));
    }
    Ok(value as usize)
}

fn mapping_json(mapping: crate::CompositionSpan) -> String {
    let source = match mapping.source {
        crate::CompositionSource::Html => "html",
        crate::CompositionSource::Css => "css",
        crate::CompositionSource::Generated => "generated",
    };
    let position = |p: crate::SourcePosition| format!(
        "{{\"offset\":{},\"line\":{},\"column\":{}}}", p.offset, p.line, p.column
    );
    let span = mapping.span.map(|span| format!(
        "{{\"start\":{},\"end\":{}}}", position(span.start), position(span.end)
    )).unwrap_or_else(|| "null".to_string());
    format!("{{\"source\":\"{source}\",\"span\":{span}}}")
}

/// Compose an inline stylesheet or external link, retaining source mapping.
#[wasm_bindgen]
pub fn compose_f_template_styles_with_options(
    template_html: &str, options: &StylesheetCompositionOptions,
) -> Result<ComposedTemplate, JsValue> {
    let invalid = |message: &str| render_error(crate::RenderError::InvalidComposition {
        message: message.to_string(),
    });
    let options_json = stringify_options(options)
        .map_err(|_| invalid("stylesheet options must be JSON-serializable"))?;
    let parsed = json::parse(&options_json).map_err(|error| invalid(&error.message))?;
    let json::JsonValue::Object(options) = parsed else {
        return Err(invalid("stylesheet options must be an object"));
    };
    let string = |key: &str| -> Result<&str, JsValue> {
        match options.get(key) {
            Some(json::JsonValue::String(value)) => Ok(value),
            _ => Err(invalid(&format!("{key} must be a string"))),
        }
    };
    let kind = string("kind")?;
    let allowed: &[&str] = match kind {
        "inline" => &["kind", "css", "styleId"],
        "external" => &["kind", "href"],
        _ => return Err(invalid("stylesheet kind must be inline or external")),
    };
    if options.keys().any(|key| !allowed.contains(&key.as_str())) {
        return Err(invalid("unexpected stylesheet option"));
    }
    let stylesheet = if kind == "inline" {
        crate::Stylesheet::Inline {
            css: string("css")?,
            style_id: if options.contains_key("styleId") { Some(string("styleId")?) } else { None },
        }
    } else {
        crate::Stylesheet::External { href: string("href")? }
    };
    crate::compose_f_template_styles_with_options(template_html, stylesheet)
        .map(|inner| ComposedTemplate { inner }).map_err(render_error)
}

/// Return JSON slot declarations from a named component's authored shadow template.
/// Pass original HTML before CSS composition or other source transformations.
#[wasm_bindgen]
pub fn extract_template_slots(html: &str, template_name: &str) -> Result<String, JsValue> {
    let slots = crate::extract_template_slots(html, template_name).map_err(render_error)?;
    let slots: Vec<_> = slots
        .iter()
        .map(|slot| {
            format!(
                "{{\"name\":\"{}\",\"line\":{},\"column\":{}}}",
                escape_json_str(&slot.name),
                slot.line,
                slot.column,
            )
        })
        .collect();
    Ok(format!("[{}]", slots.join(",")))
}

fn attribute_pairs_json(attrs: &[(String, Option<String>)]) -> String {
    let mut parts = Vec::with_capacity(attrs.len());
    for (name, value) in attrs {
        let value_json = match value {
            Some(value) => format!("\"{}\"", escape_json_str(value)),
            None => "null".to_string(),
        };
        parts.push(format!(
            "{{\"name\":\"{}\",\"value\":{}}}",
            escape_json_str(name),
            value_json
        ));
    }
    format!("[{}]", parts.join(","))
}

fn parse_templates_map(
    templates_json: &str,
) -> Result<
    HashMap<
        String,
        (
            String,
            Vec<(String, Option<String>)>,
            Vec<(String, Option<String>)>,
        ),
    >,
    JsValue,
> {
    let parsed = json::parse(templates_json).map_err(|e| {
        metadata_error(&format!("Failed to parse templates JSON: {}", e.message))
    })?;
    match parsed {
        json::JsonValue::Object(obj) => {
            let mut map = HashMap::new();
            for (k, v) in obj {
                match v {
                    json::JsonValue::String(s) => {
                        map.insert(k, (s, Vec::new(), Vec::new()));
                    }
                    json::JsonValue::Object(template) => {
                        map.insert(k.clone(), parse_template_metadata(&k, &template)?);
                    }
                    _ => {
                        return Err(named_metadata_error(&k, &format!(
                            "Template value for '{}' must be a string or metadata object",
                            k
                        )));
                    }
                }
            }
            Ok(map)
        }
        _ => Err(metadata_error("Templates must be a JSON object")),
    }
}

fn parse_template_metadata(
    template_name: &str,
    template: &HashMap<String, json::JsonValue>,
) -> Result<
    (
        String,
        Vec<(String, Option<String>)>,
        Vec<(String, Option<String>)>,
    ),
    JsValue,
> {
    if let Some(version) = template.get("formatVersion") {
        if !matches!(version, json::JsonValue::Number(number) if *number == f64::from(crate::TEMPLATE_FORMAT_VERSION)) {
            return Err(named_metadata_error(template_name, &format!(
                "Unsupported formatVersion for template '{}': expected {}",
                template_name, crate::TEMPLATE_FORMAT_VERSION,
            )));
        }
    }
    let content = match template.get("content") {
        Some(json::JsonValue::String(content)) => content.clone(),
        _ => {
            return Err(named_metadata_error(template_name, &format!(
                "Template metadata for '{}' must include a string content property",
                template_name
            )));
        }
    };

    let shadowroot_attrs = match template.get("shadowrootAttributes") {
        Some(json::JsonValue::Array(attrs)) => {
            parse_attribute_pairs(template_name, "shadowroot", attrs)?
        }
        Some(json::JsonValue::Null) | None => Vec::new(),
        Some(_) => {
            return Err(named_metadata_error(template_name, &format!(
                "Template metadata for '{}' must use an array shadowrootAttributes property",
                template_name
            )));
        }
    };

    let host_attrs = match template.get("hostAttributes") {
        Some(json::JsonValue::Array(attrs)) => {
            parse_attribute_pairs(template_name, "host", attrs)?
        }
        Some(json::JsonValue::Null) | None => Vec::new(),
        Some(_) => {
            return Err(named_metadata_error(template_name, &format!(
                "Template metadata for '{}' must use an array hostAttributes property",
                template_name
            )));
        }
    };

    Ok((content, shadowroot_attrs, host_attrs))
}

fn parse_attribute_pairs(
    template_name: &str,
    kind: &str,
    attrs: &[json::JsonValue],
) -> Result<Vec<(String, Option<String>)>, JsValue> {
    let mut parsed = Vec::with_capacity(attrs.len());
    for attr in attrs {
        let attr = match attr {
            json::JsonValue::Object(attr) => attr,
            _ => {
                return Err(named_metadata_error(template_name, &format!(
                    "Template metadata for '{}' contains a non-object {} attribute",
                    template_name, kind
                )));
            }
        };
        let name = match attr.get("name") {
            Some(json::JsonValue::String(name)) => name.clone(),
            _ => {
                return Err(named_metadata_error(template_name, &format!(
                    "Template metadata for '{}' contains a {} attribute without a string name",
                    template_name, kind
                )));
            }
        };
        let value = match attr.get("value") {
            Some(json::JsonValue::String(value)) => Some(value.clone()),
            Some(json::JsonValue::Null) | None => None,
            _ => {
                return Err(named_metadata_error(template_name, &format!(
                    "Template metadata for '{}' contains a {} attribute with a non-string value",
                    template_name, kind
                )));
            }
        };
        parsed.push((name, value));
    }
    Ok(parsed)
}

#[cfg(all(test, target_arch = "wasm32"))]
mod tests {
    use super::*;

    #[test]
    fn parse_templates_map_treats_null_shadowroot_attributes_as_empty() {
        let templates = match parse_templates_map(
            r#"{"test-element":{"content":"<span></span>","shadowrootAttributes":null}}"#,
        ) {
            Ok(templates) => templates,
            Err(_) => panic!("template metadata with null shadowrootAttributes should parse"),
        };

        let attrs = &templates
            .get("test-element")
            .expect("template should be present")
            .1;
        assert!(attrs.is_empty());
    }

    #[test]
    fn parse_templates_map_treats_null_host_attributes_as_empty() {
        let templates = match parse_templates_map(
            r#"{"test-element":{"content":"<span></span>","hostAttributes":null}}"#,
        ) {
            Ok(templates) => templates,
            Err(_) => panic!("template metadata with null hostAttributes should parse"),
        };

        let attrs = &templates
            .get("test-element")
            .expect("template should be present")
            .2;
        assert!(attrs.is_empty());
    }

    #[test]
    fn parse_templates_map_reads_host_attributes() {
        let templates = match parse_templates_map(
            r#"{"test-element":{"content":"<span></span>","hostAttributes":[{"name":"tabindex","value":"0"},{"name":"disabled","value":null}]}}"#,
        ) {
            Ok(templates) => templates,
            Err(_) => panic!("template metadata with hostAttributes should parse"),
        };

        let host = &templates
            .get("test-element")
            .expect("template should be present")
            .2;
        assert_eq!(
            host,
            &vec![
                ("tabindex".to_string(), Some("0".to_string())),
                ("disabled".to_string(), None),
            ]
        );
    }
}

/// Build an `Option<RenderConfig>` from the optional renderer settings.
/// Returns `None` when both settings use their defaults.
fn build_config(strategy: Option<&str>, markers_v2: bool) -> Result<Option<RenderConfig>, JsValue> {
    let strategy = strategy.unwrap_or("");
    let attribute_name_strategy = match strategy {
        "" | "camelCase" => AttributeNameStrategy::CamelCase,
        "none" => AttributeNameStrategy::None,
        _ => return Err(js_error("invalid-attribute-name-strategy", &format!(
            "Invalid attribute-name-strategy '{}': expected 'none' or 'camelCase'",
            strategy
        ), None, None)),
    };

    if attribute_name_strategy == AttributeNameStrategy::CamelCase && !markers_v2 {
        return Ok(None);
    }

    Ok(Some(
        RenderConfig::new()
            .with_attribute_name_strategy(attribute_name_strategy)
            .with_markers_v2(markers_v2),
    ))
}
