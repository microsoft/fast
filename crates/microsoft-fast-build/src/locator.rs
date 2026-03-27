use std::collections::HashMap;
use std::path::Path;
use crate::error::RenderError;

pub struct Locator {
    templates: HashMap<String, String>,
}

impl Locator {
    /// Create a Locator by scanning files matching glob patterns.
    /// Each pattern is a glob like `"./components/**/*.html"`.
    /// The element name for each file is its stem (e.g. `my-button` from `my-button.html`).
    /// Errors if two different files resolve to the same element name.
    pub fn from_patterns(patterns: &[&str]) -> Result<Self, RenderError> {
        // element_name → list of file paths that produce it
        let mut element_files: HashMap<String, Vec<String>> = HashMap::new();

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
                    if let Some(stem) = file_path.file_stem().and_then(|s| s.to_str()) {
                        element_files
                            .entry(stem.to_string())
                            .or_default()
                            .push(norm_file);
                    }
                }
            }
        }

        let mut templates = HashMap::new();
        for (element, paths) in element_files {
            if paths.len() > 1 {
                return Err(RenderError::DuplicateTemplate { element, paths });
            }
            let path = &paths[0];
            let content = std::fs::read_to_string(path).map_err(|e| RenderError::TemplateReadError {
                path: path.clone(),
                message: e.to_string(),
            })?;
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

/// Normalize path separators to `/` and strip a leading `./`.
fn normalize_path(path: &str) -> String {
    let normalized = path.replace('\\', "/");
    normalized.trim_start_matches("./").to_string()
}

/// Return the static directory prefix before the first wildcard in `pattern`.
fn static_prefix_dir(pattern: &str) -> String {
    let first_wild = pattern.find(|c: char| c == '*' || c == '?');
    let base = match first_wild {
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
    };
    base
}

/// Recursively walk `dir` and collect all `.html` files.
fn walk_html_files(dir: &Path, result: &mut Vec<std::path::PathBuf>) -> std::io::Result<()> {
    for entry in std::fs::read_dir(dir)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_dir() {
            walk_html_files(&path, result)?;
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
}
