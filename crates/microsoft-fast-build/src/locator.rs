use std::collections::HashMap;
use std::path::Path;
use crate::attribute::{find_tag_end, parse_element_attribute_parts, parse_element_attributes};
use crate::error::RenderError;
use crate::code_escape::escape_code_sample_elements;

/// A parsed definition with versioned, descriptive binding metadata.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct FTemplate {
    pub name: Option<String>,
    pub content: String,
    pub shadowroot_attributes: Vec<(String, Option<String>)>,
    pub host_attributes: Vec<(String, Option<String>)>,
    pub format_version: u32,
    pub bindings: Vec<crate::BindingMetadata>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct TemplateDefinition {
    content: String,
    original_content: Option<String>,
    shadowroot_attributes: Vec<(String, Option<String>)>,
    host_attributes: Vec<(String, Option<String>)>,
}

impl TemplateDefinition {
    fn new(
        content: &str,
        shadowroot_attributes: Vec<(String, Option<String>)>,
        host_attributes: Vec<(String, Option<String>)>,
    ) -> Self {
        let escaped = escape_code_sample_elements(content);
        Self {
            original_content: (escaped != content).then(|| content.to_string()),
            content: escaped,
            shadowroot_attributes,
            host_attributes,
        }
    }
}

pub struct Locator {
    templates: HashMap<String, TemplateDefinition>,
}

impl Locator {
    /// Build a locator from parsed metadata, validating format versions and names.
    pub fn from_metadata(templates: Vec<FTemplate>) -> Result<Self, RenderError> {
        let mut definitions = HashMap::new();
        for template in templates {
            let name = template.name.ok_or_else(|| {
                RenderError::InvalidTemplateMetadata {
                    message: "a template definition requires a name".to_string(),
                }
            })?;
            if template.format_version != crate::TEMPLATE_FORMAT_VERSION {
                return Err(RenderError::InvalidTemplateMetadata {
                    message: format!(
                        "unsupported formatVersion {} for '{}': expected {}",
                        template.format_version, name, crate::TEMPLATE_FORMAT_VERSION,
                    ),
                });
            }
            if definitions.contains_key(&name) {
                return Err(RenderError::InvalidTemplateMetadata {
                    message: format!("duplicate template name '{name}'"),
                });
            }
            definitions.insert(
                name,
                (template.content, template.shadowroot_attributes, template.host_attributes),
            );
        }
        Ok(Self::from_template_definitions(definitions))
    }

    /// Create a Locator by scanning files matching glob patterns.
    /// Each pattern is a glob like `"./components/**/*.html"`.
    /// The element name is read from the `name` attribute of `<f-template>` elements inside each file.
    /// Errors if two different files contain an `<f-template>` with the same name.
    pub fn from_patterns(patterns: &[&str]) -> Result<Self, RenderError> {
        // element_name → list of (file_path, template_definition) from all matching files
        let mut element_entries: HashMap<String, Vec<(String, FTemplate)>> = HashMap::new();

        for &pattern in patterns {
            let dir_str = static_prefix_dir(pattern);
            let dir_path = Path::new(&dir_str);

            if !dir_path.exists() || !dir_path.is_dir() {
                continue;
            }

            let mut files = Vec::new();
            walk_html_files(dir_path, &mut files).map_err(|e| RenderError::TemplateReadError {
                path: dir_str.clone(),
                message: e.to_string(),
            })?;

            let norm_pattern = normalize_path(pattern);
            for file_path in files {
                let norm_file = normalize_path(&file_path.to_string_lossy());
                if glob_match(&norm_pattern, &norm_file) {
                    let html = std::fs::read_to_string(&norm_file).map_err(|e| {
                        RenderError::TemplateReadError {
                            path: norm_file.clone(),
                            message: e.to_string(),
                        }
                    })?;
                    for template in parse_f_templates(&html) {
                        if let Some(name) = template.name.clone() {
                            element_entries
                                .entry(name)
                                .or_default()
                                .push((norm_file.clone(), template));
                        } else {
                            eprintln!(
                                "warning: <f-template> without a 'name' attribute in '{}': {}",
                                norm_file,
                                template.content.trim()
                            );
                        }
                    }
                }
            }
        }

        let mut templates = HashMap::new();
        for (element, entries) in element_entries {
            if entries.len() > 1 {
                let paths = entries.into_iter().map(|(p, _)| p).collect();
                return Err(RenderError::DuplicateTemplate { element, paths });
            }
            let (_, template) = entries.into_iter().next().expect(
                "expected exactly one entry for element; duplicates rejected above and entries are only created when a template is added",
            );
            templates.insert(element, TemplateDefinition::new(
                &template.content,
                template.shadowroot_attributes,
                template.host_attributes,
            ));
        }

        Ok(Locator { templates })
    }

    /// Create a Locator from an explicit map (useful for testing without filesystem).
    ///
    /// This API only carries template content. Shadowroot-prefixed attributes for
    /// Declarative Shadow DOM and host attributes are empty for these entries. Use
    /// [`Locator::from_patterns`] with `<f-template>` metadata, or call
    /// [`Locator::add_template_with_attrs`] for templates that need shadowroot
    /// or host attributes.
    pub fn from_templates(templates: HashMap<String, String>) -> Self {
        let templates = templates
            .into_iter()
            .map(|(name, content)| (name, TemplateDefinition::new(
                &content, Vec::new(), Vec::new(),
            )))
            .collect();
        Locator { templates }
    }

    /// Create a Locator from explicit template metadata.
    ///
    /// Each map value is `(content, shadowroot_attributes, host_attributes)`.
    /// `shadowroot_attributes` are forwarded to the Declarative Shadow DOM
    /// `<template>` tag; `host_attributes` are merged onto the rendered host
    /// element's opening tag (author attributes win on conflicts).
    pub fn from_template_definitions(
        templates: HashMap<
            String,
            (
                String,
                Vec<(String, Option<String>)>,
                Vec<(String, Option<String>)>,
            ),
        >,
    ) -> Self {
        let templates = templates
            .into_iter()
            .map(|(name, (content, shadowroot_attributes, host_attributes))| (
                name,
                TemplateDefinition::new(&content, shadowroot_attributes, host_attributes),
            ))
            .collect();
        Locator { templates }
    }

    /// Add a template directly.
    ///
    /// This only stores template content. Shadowroot-prefixed attributes for
    /// Declarative Shadow DOM and host attributes are empty for this entry.
    /// Use [`Locator::add_template_with_attrs`] when the rendered shadow
    /// `<template>` needs attributes such as `shadowrootmode`, or when host
    /// attributes from the source `<f-template>`'s inner `<template>` should
    /// be merged onto the host element opening tag.
    pub fn add_template(&mut self, element_name: &str, content: &str) {
        self.templates.insert(element_name.to_string(), TemplateDefinition::new(
            content, Vec::new(), Vec::new(),
        ));
    }

    /// Add a template directly with shadowroot-prefixed attributes and host
    /// attributes that should be merged onto the rendered host element.
    ///
    /// `shadowroot_attrs` are filtered by [`collect_shadowroot_attributes`]:
    /// only attributes whose names begin with `shadowroot` are retained, names
    /// are normalized to lowercase, and duplicates are ignored. Use `None` for
    /// boolean attributes.
    ///
    /// `host_attrs` are stored verbatim in source order — the renderer is
    /// responsible for filtering client-only attributes and resolving any
    /// `{{expr}}` / `?name="{{expr}}"` bindings against the child state.
    pub fn add_template_with_attrs(
        &mut self,
        element_name: &str,
        content: &str,
        shadowroot_attrs: &[(String, Option<String>)],
        host_attrs: &[(String, Option<String>)],
    ) {
        self.templates.insert(element_name.to_string(), TemplateDefinition::new(
            content,
            collect_shadowroot_attributes(shadowroot_attrs),
            host_attrs.to_vec(),
        ));
    }

    pub fn get_template(&self, element_name: &str) -> Option<&str> {
        self.templates.get(element_name).map(|template| template.content.as_str())
    }

    pub(crate) fn authored_template(&self, element_name: &str) -> Option<&str> {
        self.templates.get(element_name).map(|template| {
            template.original_content.as_deref().unwrap_or(&template.content)
        })
    }

    pub fn get_shadowroot_attributes(&self, element_name: &str) -> &[(String, Option<String>)] {
        self.templates
            .get(element_name)
            .map(|template| template.shadowroot_attributes.as_slice())
            .unwrap_or(&[])
    }

    pub fn get_host_attributes(&self, element_name: &str) -> &[(String, Option<String>)] {
        self.templates
            .get(element_name)
            .map(|template| template.host_attributes.as_slice())
            .unwrap_or(&[])
    }

    pub fn has_template(&self, element_name: &str) -> bool {
        self.templates.contains_key(element_name)
    }
}

/// Parse all `<f-template>` elements from an HTML string.
/// Returns names, content, host/shadow attributes and versioned binding metadata.
pub fn parse_f_templates(html: &str) -> Vec<FTemplate> {
    let mut results = Vec::new();
    let mut search_start = 0;
    let mut source_locations = crate::binding_metadata::SourceLocations::new(html);
    while let Some(tag_start) = find_html_start_tag(html, "f-template", search_start) {
        // Find the closing '>' of the opening <f-template ...> tag
        let tag_close = match find_tag_end(html, tag_start) {
            Some(i) => i,
            None => break,
        };
        let open_tag = &html[tag_start..tag_close];
        let attrs = parse_element_attributes(open_tag);
        let name = attrs
            .iter()
            .find(|(name, _)| name.eq_ignore_ascii_case("name"))
            .and_then(|(_, value)| value.clone());
        let shadowroot_attributes = collect_shadowroot_attributes(&attrs);
        // Find </f-template>
        let inner_start = tag_close;
        let (inner_end, end_tag_close) = match find_html_end_tag(html, "f-template", inner_start) {
            Some(result) => result,
            None => break,
        };
        let inner_html = &html[inner_start..inner_end];
        let (content_range, host_tag) = extract_template_content(inner_html);
        let content = &inner_html[content_range.clone()];
        let host_attributes = host_tag.as_ref()
            .map(|range| parse_element_attribute_parts(&inner_html[range.clone()]))
            .unwrap_or_default();
        let bindings = crate::binding_metadata::collect_bindings(
            content,
            inner_start + content_range.start,
            &host_attributes,
            inner_start + host_tag.map(|range| range.start).unwrap_or(0),
            &mut source_locations,
        );
        results.push(FTemplate {
            name,
            content: content.to_string(),
            shadowroot_attributes,
            host_attributes: host_attributes.into_iter().map(|attr| (attr.name, attr.value)).collect(),
            format_version: crate::TEMPLATE_FORMAT_VERSION,
            bindings,
        });
        search_start = end_tag_close;
    }
    results
}

pub(crate) fn find_html_start_tag(html: &str, tag_name: &str, from: usize) -> Option<usize> {
    let bytes = html.as_bytes();
    let tag_name = tag_name.as_bytes();
    let mut pos = from;

    while let Some(rel) = html[pos..].find('<') {
        let tag_start = pos + rel;
        let name_start = tag_start + 1;

        if let Some(end) = crate::attribute::style_element_end(html, tag_start) {
            pos = end;
            continue;
        }

        if name_start >= bytes.len() {
            return None;
        }

        if bytes[name_start] != b'/'
            && starts_with_ascii_case_insensitive(bytes, name_start, tag_name)
            && is_html_tag_name_boundary(bytes.get(name_start + tag_name.len()).copied())
        {
            return Some(tag_start);
        }

        pos = name_start;
    }

    None
}

pub(crate) fn find_html_end_tag(html: &str, tag_name: &str, from: usize) -> Option<(usize, usize)> {
    let bytes = html.as_bytes();
    let tag_name = tag_name.as_bytes();
    let mut pos = from;

    while let Some(rel) = html[pos..].find('<') {
        let tag_start = pos + rel;
        if let Some(end) = crate::attribute::style_element_end(html, tag_start) {
            pos = end;
            continue;
        }
        if !html[tag_start..].starts_with("</") {
            pos = tag_start + 1;
            continue;
        }
        let name_start = tag_start + 2;

        if starts_with_ascii_case_insensitive(bytes, name_start, tag_name) {
            let mut tag_end = name_start + tag_name.len();

            while tag_end < bytes.len() && bytes[tag_end].is_ascii_whitespace() {
                tag_end += 1;
            }

            if tag_end < bytes.len() && bytes[tag_end] == b'>' {
                return Some((tag_start, tag_end + 1));
            }
        }

        pos = name_start;
    }

    None
}

pub(crate) fn starts_with_ascii_case_insensitive(bytes: &[u8], start: usize, expected: &[u8]) -> bool {
    let end = start + expected.len();

    if end > bytes.len() {
        return false;
    }

    bytes[start..end]
        .iter()
        .zip(expected)
        .all(|(actual, expected)| actual.eq_ignore_ascii_case(expected))
}

pub(crate) fn is_html_tag_name_boundary(byte: Option<u8>) -> bool {
    matches!(byte, Some(b'>') | Some(b'/'))
        || byte
            .map(|byte| byte.is_ascii_whitespace())
            .unwrap_or(false)
}

fn collect_shadowroot_attributes(attrs: &[(String, Option<String>)]) -> Vec<(String, Option<String>)> {
    let mut results = Vec::new();
    let mut seen = Vec::new();
    for (name, value) in attrs {
        let normalized = name.to_lowercase();
        if !normalized.starts_with("shadowroot") || seen.contains(&normalized) {
            continue;
        }
        seen.push(normalized.clone());
        results.push((normalized, value.clone()));
    }
    results
}

/// Locate the trimmed content and opening tag of the first `<template>`.
///
/// If no `<template>` element is found, returns the trimmed input with an
/// absent opening-tag range. All ranges are byte offsets into `html`.
fn extract_template_content(html: &str) -> (std::ops::Range<usize>, Option<std::ops::Range<usize>>) {
    let template = find_html_start_tag(html, "template", 0).and_then(|open| {
        let tag_end = find_tag_end(html, open)?;
        let (close, _) = find_html_end_tag(html, "template", tag_end)?;
        Some((tag_end..close, Some(open..tag_end)))
    });
    let (range, host_tag) = template.unwrap_or((0..html.len(), None));
    let content = &html[range.clone()];
    let start = range.start + content.len() - content.trim_start().len();
    (start..start + content.trim().len(), host_tag)
}


fn normalize_path(path: &str) -> String {
    let normalized = path.replace('\\', "/");
    normalized.trim_start_matches("./").to_string()
}

/// Return the static directory prefix before the first wildcard in `pattern`.
fn static_prefix_dir(pattern: &str) -> String {
    let first_wild = pattern.find(|c: char| c == '*' || c == '?');
    match first_wild {
        None => match pattern.rfind('/') {
            Some(i) => pattern[..=i].to_string(),
            None => ".".to_string(),
        },
        Some(i) => {
            let before = &pattern[..i];
            match before.rfind('/') {
                Some(j) => pattern[..=j].to_string(),
                None => ".".to_string(),
            }
        }
    }
}

/// Maximum directory depth walked by `walk_html_files`. This guards against
/// accidental stack overflows on very deep directory trees and prevents infinite
/// loops caused by symlink cycles.
const MAX_DIR_DEPTH: usize = 50;

/// Recursively walk `dir` and collect all `.html` files.
fn walk_html_files(dir: &Path, result: &mut Vec<std::path::PathBuf>) -> std::io::Result<()> {
    walk_html_files_inner(dir, result, 0)
}

fn walk_html_files_inner(dir: &Path, result: &mut Vec<std::path::PathBuf>, depth: usize) -> std::io::Result<()> {
    if depth > MAX_DIR_DEPTH {
        return Ok(());
    }
    for entry in std::fs::read_dir(dir)? {
        let entry = entry?;
        let file_type = entry.file_type()?;
        let path = entry.path();
        // Skip symlinks to avoid following cycles into previously-visited dirs.
        if file_type.is_symlink() {
            continue;
        }
        if file_type.is_dir() {
            walk_html_files_inner(&path, result, depth + 1)?;
        } else if path.extension().and_then(|s| s.to_str()) == Some("html") {
            result.push(path);
        }
    }
    Ok(())
}

/// Match a normalized path against a normalized glob pattern.
/// `*` matches any chars within one path segment.
/// `**` matches zero or more path segments.
/// `?` matches exactly one character within a segment.
fn glob_match(pattern: &str, path: &str) -> bool {
    let pat_segs: Vec<&str> = pattern.split('/').collect();
    let path_segs: Vec<&str> = path.split('/').collect();
    match_segments(&pat_segs, &path_segs)
}

fn match_segments(pat: &[&str], path: &[&str]) -> bool {
    if pat.is_empty() {
        return path.is_empty();
    }
    if pat[0] == "**" {
        // `**` matches zero or more path segments.
        // Try consuming zero segments (skip `**` and keep current path).
        if match_segments(&pat[1..], path) {
            return true;
        }
        // Try consuming one more path segment (keep `**` and advance path).
        if !path.is_empty() && match_segments(pat, &path[1..]) {
            return true;
        }
        return false;
    }
    if path.is_empty() {
        return false;
    }
    if match_segment(pat[0], path[0]) {
        match_segments(&pat[1..], &path[1..])
    } else {
        false
    }
}

fn match_segment(pat: &str, seg: &str) -> bool {
    let pat_chars: Vec<char> = pat.chars().collect();
    let seg_chars: Vec<char> = seg.chars().collect();
    match_chars(&pat_chars, &seg_chars)
}

fn match_chars(pat: &[char], seg: &[char]) -> bool {
    if pat.is_empty() {
        return seg.is_empty();
    }
    if pat[0] == '*' {
        // `*` matches 0 or more characters (within a single segment).
        for i in 0..=seg.len() {
            if match_chars(&pat[1..], &seg[i..]) {
                return true;
            }
        }
        return false;
    }
    if seg.is_empty() {
        return false;
    }
    if pat[0] == '?' || pat[0] == seg[0] {
        match_chars(&pat[1..], &seg[1..])
    } else {
        false
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_glob_star() {
        assert!(glob_match("tests/fixtures/*.html", "tests/fixtures/my-button.html"));
        assert!(!glob_match("tests/fixtures/*.html", "tests/fixtures/duplicate/my-button.html"));
    }

    #[test]
    fn test_glob_double_star() {
        assert!(glob_match("tests/fixtures/**/*.html", "tests/fixtures/my-button.html"));
        assert!(glob_match("tests/fixtures/**/*.html", "tests/fixtures/duplicate/my-button.html"));
        assert!(!glob_match("tests/fixtures/**/*.html", "tests/fixtures/my-button.txt"));
    }

    #[test]
    fn test_glob_question_mark() {
        assert!(glob_match("tests/fixtures/my-?.html", "tests/fixtures/my-x.html"));
        assert!(!glob_match("tests/fixtures/my-?.html", "tests/fixtures/my-xy.html"));
    }

    #[test]
    fn test_glob_exact_path() {
        // An exact path (no wildcards) must match only itself.
        assert!(glob_match("tests/fixtures/my-button.html", "tests/fixtures/my-button.html"));
        assert!(!glob_match("tests/fixtures/my-button.html", "tests/fixtures/my-badge.html"));
        assert!(!glob_match("tests/fixtures/my-button.html", "tests/fixtures/duplicate/my-button.html"));
    }

    #[test]
    fn test_parse_f_templates_basic() {
        let html = r#"<f-template name="my-button">
    <template>
        <button>{{label}}</button>
    </template>
</f-template>"#;
        let results = parse_f_templates(html);
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].name, Some("my-button".to_string()));
        assert_eq!(results[0].content, "<button>{{label}}</button>");
        assert!(results[0].shadowroot_attributes.is_empty());
        assert!(results[0].host_attributes.is_empty());
    }

    #[test]
    fn test_parse_f_templates_multiple() {
        let html = r#"<f-template name="my-a">
    <template><span>A</span></template>
</f-template>
<f-template name="my-b">
    <template><div>B</div></template>
</f-template>"#;
        let results = parse_f_templates(html);
        assert_eq!(results.len(), 2);
        assert_eq!(results[0].name, Some("my-a".to_string()));
        assert_eq!(results[0].content, "<span>A</span>");
        assert!(results[0].host_attributes.is_empty());
        assert_eq!(results[1].name, Some("my-b".to_string()));
        assert_eq!(results[1].content, "<div>B</div>");
        assert!(results[1].host_attributes.is_empty());
    }

    #[test]
    fn test_parse_f_templates_missing_name_returns_none() {
        let html = r#"<f-template>
    <template><span>no name</span></template>
</f-template>"#;
        let results = parse_f_templates(html);
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].name, None);
        assert!(results[0].host_attributes.is_empty());
    }

    #[test]
    fn test_parse_f_templates_shadowroot_attrs() {
        let html = r#"<f-template name="my-el" shadowrootmode="closed" shadowrootdelegatesfocus shadowrootclonable="true">
    <template><span>shadow</span></template>
</f-template>"#;
        let results = parse_f_templates(html);
        assert_eq!(results.len(), 1);
        assert_eq!(
            results[0].shadowroot_attributes,
            vec![
                ("shadowrootmode".to_string(), Some("closed".to_string())),
                ("shadowrootdelegatesfocus".to_string(), None),
                ("shadowrootclonable".to_string(), Some("true".to_string())),
            ]
        );
        assert!(results[0].host_attributes.is_empty());
    }

    #[test]
    fn test_parse_f_templates_open_tags_with_whitespace() {
        let html = r#"<f-template
    name="my-button"
    shadowrootmode="open"
>
    <template
        tabindex="0"
    ><button>{{label}}</button></template>
</f-template>"#;
        let results = parse_f_templates(html);
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].name, Some("my-button".to_string()));
        assert_eq!(results[0].content, "<button>{{label}}</button>");
        assert_eq!(
            results[0].shadowroot_attributes,
            vec![("shadowrootmode".to_string(), Some("open".to_string()))]
        );
        assert_eq!(
            results[0].host_attributes,
            vec![("tabindex".to_string(), Some("0".to_string()))]
        );
    }

    #[test]
    fn test_parse_f_templates_template_closing_tag_with_whitespace() {
        let html = "<f-template name=\"my-button\"><template><button>{{label}}</button></template\n\t></f-template>";
        let results = parse_f_templates(html);
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].name, Some("my-button".to_string()));
        assert_eq!(results[0].content, "<button>{{label}}</button>");
    }

    #[test]
    fn test_parse_f_templates_f_template_closing_tag_with_whitespace() {
        let html = "<f-template name=\"my-button\"><template><button>{{label}}</button></template></f-template\n>";
        let results = parse_f_templates(html);
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].name, Some("my-button".to_string()));
        assert_eq!(results[0].content, "<button>{{label}}</button>");
    }

    #[test]
    fn test_parse_f_templates_host_attributes() {
        let html = r#"<f-template name="my-el">
    <template tabindex="0" @click="{handle()}" attr="{{val}}"><span>x</span></template>
</f-template>"#;
        let results = parse_f_templates(html);
        assert_eq!(results.len(), 1);
        assert_eq!(
            results[0].host_attributes,
            vec![
                ("tabindex".to_string(), Some("0".to_string())),
                ("@click".to_string(), Some("{handle()}".to_string())),
                ("attr".to_string(), Some("{{val}}".to_string())),
            ]
        );
    }

    #[test]
    fn test_parse_f_templates_host_attributes_with_quoted_gt() {
        // A `>` inside a quoted attribute value must not terminate the opening tag.
        let html = r#"<f-template name="my-el">
    <template data-x="a>b"><span>x</span></template>
</f-template>"#;
        let results = parse_f_templates(html);
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].content, "<span>x</span>");
        assert_eq!(
            results[0].host_attributes,
            vec![("data-x".to_string(), Some("a>b".to_string()))]
        );
    }

    #[test]
    fn test_add_template_with_attrs_shadowroot_only() {
        let mut locator = Locator::from_templates(std::collections::HashMap::new());
        let attrs = vec![
            ("shadowrootmode".to_string(), Some("closed".to_string())),
            ("shadowrootdelegatesfocus".to_string(), None),
            ("shadowrootclonable".to_string(), Some("true".to_string())),
        ];

        locator.add_template_with_attrs("my-el", "<span>shadow</span>", &attrs, &[]);

        assert_eq!(locator.get_template("my-el"), Some("<span>shadow</span>"));
        assert_eq!(locator.get_shadowroot_attributes("my-el"), attrs.as_slice());
        assert!(locator.get_host_attributes("my-el").is_empty());
    }

    #[test]
    fn test_add_template_with_attrs_shadowroot_and_host() {
        let mut locator = Locator::from_templates(std::collections::HashMap::new());
        let shadowroot_attrs = vec![
            ("shadowrootmode".to_string(), Some("closed".to_string())),
        ];
        let host_attrs = vec![
            ("tabindex".to_string(), Some("0".to_string())),
            ("?disabled".to_string(), Some("{{isDisabled}}".to_string())),
        ];

        locator.add_template_with_attrs(
            "my-el",
            "<span>x</span>",
            &shadowroot_attrs,
            &host_attrs,
        );

        assert_eq!(locator.get_template("my-el"), Some("<span>x</span>"));
        assert_eq!(locator.get_shadowroot_attributes("my-el"), shadowroot_attrs.as_slice());
        assert_eq!(locator.get_host_attributes("my-el"), host_attrs.as_slice());
    }

    #[test]
    fn test_extract_template_content_basic() {
        let html = "    <template>\n        <button>click</button>\n    </template>\n";
        let (content, tag) = extract_template_content(html);
        assert_eq!(&html[content], "<button>click</button>");
        assert!(parse_element_attributes(&html[tag.unwrap()]).is_empty());
    }

    #[test]
    fn test_extract_template_content_with_attrs() {
        let html = "<template tabindex=\"0\" ?disabled=\"{{isDisabled}}\"><span>x</span></template>";
        let (content, tag) = extract_template_content(html);
        assert_eq!(&html[content], "<span>x</span>");
        assert_eq!(
            parse_element_attributes(&html[tag.unwrap()]),
            vec![
                ("tabindex".to_string(), Some("0".to_string())),
                ("?disabled".to_string(), Some("{{isDisabled}}".to_string())),
            ]
        );
    }

    #[test]
    fn test_extract_template_content_closing_tag_with_whitespace() {
        let html = "<template tabindex=\"0\"><span>x</span></template \n\t>";
        let (content, tag) = extract_template_content(html);
        assert_eq!(&html[content], "<span>x</span>");
        assert_eq!(parse_element_attributes(&html[tag.unwrap()]), vec![("tabindex".to_string(), Some("0".to_string()))]);
    }
}
