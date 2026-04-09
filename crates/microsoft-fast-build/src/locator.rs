use std::collections::HashMap;
use std::path::Path;
use crate::error::RenderError;

pub struct Locator {
    templates: HashMap<String, String>,
}

impl Locator {
    /// Create a Locator by scanning files matching glob patterns.
    /// Each pattern is a glob like `"./components/**/*.html"`.
    /// The element name is read from the `name` attribute of `<f-template>` elements inside each file.
    /// Errors if two different files contain an `<f-template>` with the same name.
    pub fn from_patterns(patterns: &[&str]) -> Result<Self, RenderError> {
        // element_name → list of (file_path, template_content) from all matching files
        let mut element_entries: HashMap<String, Vec<(String, String)>> = HashMap::new();

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
                    for (name_opt, content) in parse_f_templates(&html) {
                        match name_opt {
                            Some(name) => {
                                element_entries
                                    .entry(name)
                                    .or_default()
                                    .push((norm_file.clone(), content));
                            }
                            None => {
                                eprintln!(
                                    "warning: <f-template> without a 'name' attribute in '{}': {}",
                                    norm_file,
                                    content.trim()
                                );
                            }
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
            let (_, content) = entries.into_iter().next().unwrap();
            templates.insert(element, content);
        }

        Ok(Locator { templates })
    }

    /// Create a Locator from an explicit map (useful for testing without filesystem).
    pub fn from_templates(templates: HashMap<String, String>) -> Self {
        Locator { templates }
    }

    /// Add a template directly.
    pub fn add_template(&mut self, element_name: &str, content: &str) {
        self.templates.insert(element_name.to_string(), content.to_string());
    }

    pub fn get_template(&self, element_name: &str) -> Option<&str> {
        self.templates.get(element_name).map(|s| s.as_str())
    }

    pub fn has_template(&self, element_name: &str) -> bool {
        self.templates.contains_key(element_name)
    }
}

/// Parse all `<f-template>` elements from an HTML string.
/// Returns list of (name, inner_template_content). name is None if missing.
pub(crate) fn parse_f_templates(html: &str) -> Vec<(Option<String>, String)> {
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
        let tag_close = match html[after_tag..].find('>') {
            Some(i) => after_tag + i + 1,
            None => break,
        };
        let attrs = &html[after_tag..tag_close - 1];
        let name = extract_attr_value(attrs, "name");

        // Find </f-template>
        let inner_start = tag_close;
        let end_tag = "</f-template>";
        let inner_end = match html[inner_start..].find(end_tag) {
            Some(i) => inner_start + i,
            None => break,
        };
        let inner_html = &html[inner_start..inner_end];
        let content = extract_template_content(inner_html);

        results.push((name, content));
        search_start = inner_end + end_tag.len();
    }
    results
}

/// Extract the value of an attribute from an attribute string like ` name="foo" `.
fn extract_attr_value(attrs: &str, attr_name: &str) -> Option<String> {
    // Try double-quoted: name="value"
    let double_pat = format!("{}=\"", attr_name);
    if let Some(pos) = attrs.find(&double_pat) {
        let value_start = pos + double_pat.len();
        if let Some(end) = attrs[value_start..].find('"') {
            return Some(attrs[value_start..value_start + end].to_string());
        }
    }
    // Try single-quoted: name='value'
    let single_pat = format!("{}='", attr_name);
    if let Some(pos) = attrs.find(&single_pat) {
        let value_start = pos + single_pat.len();
        if let Some(end) = attrs[value_start..].find('\'') {
            return Some(attrs[value_start..value_start + end].to_string());
        }
    }
    None
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
        assert_eq!(results[0].0, Some("my-button".to_string()));
        assert_eq!(results[0].1, "<button>{{label}}</button>");
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
        assert_eq!(results[0].0, Some("my-a".to_string()));
        assert_eq!(results[0].1, "<span>A</span>");
        assert_eq!(results[1].0, Some("my-b".to_string()));
        assert_eq!(results[1].1, "<div>B</div>");
    }

    #[test]
    fn test_parse_f_templates_missing_name_returns_none() {
        let html = r#"<f-template>
    <template><span>no name</span></template>
</f-template>"#;
        let results = parse_f_templates(html);
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].0, None);
    }

    #[test]
    fn test_extract_template_content_basic() {
        let html = "    <template>\n        <button>click</button>\n    </template>\n";
        let content = extract_template_content(html);
        assert_eq!(content, "<button>click</button>");
    }
}
