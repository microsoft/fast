/// Escape special HTML characters in a string.
pub fn html_escape(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    push_html_escaped(&mut out, s);
    out
}

pub(crate) fn push_html_escaped(out: &mut String, s: &str) {
    for c in s.chars() {
        match c {
            '&' => out.push_str("&amp;"),
            '<' => out.push_str("&lt;"),
            '>' => out.push_str("&gt;"),
            '"' => out.push_str("&quot;"),
            '\'' => out.push_str("&#39;"),
            c => out.push(c),
        }
    }
}
