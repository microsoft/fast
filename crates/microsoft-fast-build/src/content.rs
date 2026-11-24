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
    let mut skipped = 0;
    if s.len() >= 64 {
        const LOW: u64 = 0x0101_0101_0101_0101;
        const HIGH: u64 = 0x8080_8080_8080_8080;
        for chunk in s.as_bytes().chunks_exact(8) {
            let word = u64::from_ne_bytes(chunk.try_into().unwrap());
            // These supersets cover quotes/ampersand and angle brackets.
            // A '#' may stop the scan early; scalar matching remains authoritative.
            let quotes = (word | LOW * 0x05) ^ (LOW * 0x27);
            let angles = (word | LOW * 0x02) ^ (LOW * 0x3e);
            if ((quotes.wrapping_sub(LOW) & !quotes) | (angles.wrapping_sub(LOW) & !angles)) & HIGH
                != 0
            {
                break;
            }
            skipped += 8;
        }
    }
    for (index, byte) in s.bytes().enumerate().skip(skipped) {
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

    #[test]
    fn long_escape_prefixes_preserve_ascii_and_utf8_boundaries() {
        for filler in ["a", "é", "😀"] {
            for offset in 0..81 {
                let prefix = filler.repeat(offset);
                for byte in 0..=127u8 {
                    let ch = char::from(byte);
                    let replacement = match ch {
                        '&' => "&amp;".to_owned(),
                        '<' => "&lt;".to_owned(),
                        '>' => "&gt;".to_owned(),
                        '"' => "&quot;".to_owned(),
                        '\'' => "&#39;".to_owned(),
                        _ => ch.to_string(),
                    };
                    let text = format!("{prefix}{ch}é😀{}", "z".repeat(96));
                    assert_eq!(
                        html_escape(&text),
                        format!("{prefix}{replacement}é😀{}", "z".repeat(96)),
                        "filler={filler}, offset={offset}, byte={byte}",
                    );
                }
            }
        }
    }

    #[test]
    fn long_prefix_escaping_preserves_fallible_span_order() {
        let prefix = format!("{}é😀", "a".repeat(69));
        let text = format!("{prefix}&<tail");
        for fail_at in 0..4 {
            let mut spans = Vec::new();
            let result = write_html_escaped(&text, |span| {
                spans.push(span.to_owned());
                if spans.len() == fail_at + 1 {
                    Err("full")
                } else {
                    Ok(())
                }
            });
            let expected = [prefix.as_str(), "&amp;", "&lt;", "tail"];
            assert_eq!(spans, expected[..=fail_at]);
            assert_eq!(result, Err("full"));
        }
    }
}
