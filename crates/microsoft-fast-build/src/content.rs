/// Escape special HTML characters in a string.
pub fn html_escape(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    push_html_escaped(&mut out, s);
    out
}

pub(crate) fn push_html_escaped(out: &mut String, s: &str) {
    write_html_escaped(s, |span| {
        out.push_str(span);
        Ok::<_, std::convert::Infallible>(())
    })
    .unwrap();
}

pub(crate) fn write_html_escaped<E>(
    s: &str,
    mut write: impl FnMut(&str) -> Result<(), E>,
) -> Result<(), E> {
    let mut start = 0;
    for (index, byte) in s.bytes().enumerate() {
        let entity = match byte {
            b'&' => "&amp;",
            b'<' => "&lt;",
            b'>' => "&gt;",
            b'"' => "&quot;",
            b'\'' => "&#39;",
            _ => continue,
        };
        // ASCII matches always lie on UTF-8 boundaries.
        if start < index {
            write(&s[start..index])?;
        }
        write(entity)?;
        start = index + 1;
    }
    if start < s.len() {
        write(&s[start..])?;
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn escaped_spans_stop_at_the_first_sink_error() {
        let mut spans = Vec::new();
        let result = write_html_escaped("é&<tail", |span| {
            spans.push(span.to_string());
            if span == "&amp;" {
                Err("full")
            } else {
                Ok(())
            }
        });
        assert_eq!(result, Err("full"));
        assert_eq!(spans, ["é", "&amp;"]);
    }
}
