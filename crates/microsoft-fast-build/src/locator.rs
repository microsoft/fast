use std::collections::HashMap;
use std::path::Path;
use crate::attribute::{find_tag_end, parse_element_attributes};
use crate::error::RenderError;

#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) struct FTemplate {
    pub name: Option<String>,
    pub content: String,
    pub shadowroot_attributes: Vec<(String, Option<String>)>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
struct TemplateDefinition {
    content: String,
    shadowroot_attributes: Vec<(String, Option<String>)>,
}

pub struct Locator {
    templates: HashMap<String, TemplateDefinition>,
}

impl Locator {
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
            templates.insert(element, TemplateDefinition {
                content: template.content,
                shadowroot_attributes: template.shadowroot_attributes,
            });
        }

        Ok(Locator { templates })
    }

    /// Create a Locator from an explicit map (useful for testing without filesystem).
    ///
    /// This API only carries template content. Shadowroot-prefixed attributes for
    /// Declarative Shadow DOM are empty for these entries. Use [`Locator::from_patterns`]
    /// with `<f-template>` metadata, or call [`Locator::add_template_with_shadowroot_attrs`]
    /// for templates that need shadowroot attributes.
    pub fn from_templates(templates: HashMap<String, String>) -> Self {
        let templates = templates
            .into_iter()
            .map(|(name, content)| (name, TemplateDefinition { content, shadowroot_attributes: Vec::new() }))
            .collect();
        Locator { templates }
    }

    #[cfg_attr(not(target_arch = "wasm32"), allow(dead_code))]
    pub(crate) fn from_template_definitions(templates: HashMap<String, (String, Vec<(String, Option<String>)>)>) -> Self {
        let templates = templates
            .into_iter()
            .map(|(name, (content, shadowroot_attributes))| (name, TemplateDefinition { content, shadowroot_attributes }))
            .collect();
        Locator { templates }
    }

    /// Add a template directly.
    ///
    /// This only stores template content. Shadowroot-prefixed attributes for
    /// Declarative Shadow DOM are empty for this entry. Use
    /// [`Locator::add_template_with_shadowroot_attrs`] when the rendered shadow
    /// `<template>` needs attributes such as `shadowrootmode`.
    pub fn add_template(&mut self, element_name: &str, content: &str) {
        self.templates.insert(element_name.to_string(), TemplateDefinition {
            content: content.to_string(),
            shadowroot_attributes: Vec::new(),
        });
    }

    /// Add a template directly with shadowroot-prefixed attributes.
    ///
    /// Only attributes whose names begin with `shadowroot` are retained. Names
    /// are normalized to lowercase and duplicate names are ignored, matching
    /// `<f-template>` parsing. Use `None` for boolean attributes.
    pub fn add_template_with_shadowroot_attrs(
        &mut self,
        element_name: &str,
        content: &str,
        attrs: &[(String, Option<String>)],
    ) {
        self.templates.insert(element_name.to_string(), TemplateDefinition {
            content: content.to_string(),
            shadowroot_attributes: collect_shadowroot_attributes(attrs),
        });
    }

    pub fn get_template(&self, element_name: &str) -> Option<&str> {
        self.templates.get(element_name).map(|template| template.content.as_str())
    }

    pub fn get_shadowroot_attributes(&self, element_name: &str) -> &[(String, Option<String>)] {
        self.templates
            .get(element_name)
            .map(|template| template.shadowroot_attributes.as_slice())
            .unwrap_or(&[])
    }

    pub fn has_template(&self, element_name: &str) -> bool {
        self.templates.contains_key(element_name)
    }
}

/// Parse all `<f-template>` elements from an HTML string.
/// Returns the name, inner template content, and shadowroot-prefixed attributes.
pub(crate) fn parse_f_templates(html: &str) -> Vec<FTemplate> {
    let mut results = Vec::new();
    let mut search_start = 0;
    while let Some(rel) = html[search_start..].find("<f-template") {
        let tag_start = search_start + rel;
        let after_tag = tag_start + "<f-template".len();
        // Ensure next char is not alphanumeric or '-' (avoid matching <f-templateX>)
        if let Some(next_ch) = html[after_tag..].chars().next() {
            if next_ch.is_alphanumeric() || next_ch == '-' {
                search_start = after_tag;
                continue;
            }
        }
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
        let end_tag = "</f-template>";
        let inner_end = match html[inner_start..].find(end_tag) {
            Some(i) => inner_start + i,
            None => break,
        };
        let inner_html = &html[inner_start..inner_end];
        let content = extract_template_content(inner_html);

        results.push(FTemplate {
            name,
            content,
            shadowroot_attributes,
        });
        search_start = inner_end + end_tag.len();
    }
    results
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

/// Extract the inner content of the first `<template>` element found in `html`.
/// Returns the trimmed content between `<template ...>` and `</template>`.
fn extract_template_content(html: &str) -> String {
    let open = match html.find("<template") {
        Some(i) => i,
        None => return html.trim().to_string(),
    };
    let tag_end = match html[open..].find('>') {
        Some(i) => open + i + 1,
        None => return html.trim().to_string(),
    };
    let close = match html[tag_end..].find("</template>") {
        Some(i) => tag_end + i,
        None => return html.trim().to_string(),
    };
    html[tag_end..close].trim().to_string()
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
        assert_eq!(results[1].name, Some("my-b".to_string()));
        assert_eq!(results[1].content, "<div>B</div>");
    }

    #[test]
    fn test_parse_f_templates_missing_name_returns_none() {
        let html = r#"<f-template>
    <template><span>no name</span></template>
</f-template>"#;
        let results = parse_f_templates(html);
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].name, None);
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
    }

    #[test]
    fn test_add_template_with_shadowroot_attrs_preserves_attrs() {
        let mut locator = Locator::from_templates(std::collections::HashMap::new());
        let attrs = vec![
            ("shadowrootmode".to_string(), Some("closed".to_string())),
            ("shadowrootdelegatesfocus".to_string(), None),
            ("shadowrootclonable".to_string(), Some("true".to_string())),
        ];

        locator.add_template_with_shadowroot_attrs("my-el", "<span>shadow</span>", &attrs);

        assert_eq!(locator.get_template("my-el"), Some("<span>shadow</span>"));
        assert_eq!(locator.get_shadowroot_attributes("my-el"), attrs.as_slice());
    }

    #[test]
    fn test_extract_template_content_basic() {
        let html = "    <template>\n        <button>click</button>\n    </template>\n";
        let content = extract_template_content(html);
        assert_eq!(content, "<button>click</button>");
    }
}
