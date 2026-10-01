use microsoft_fast_convert::{convert_stylesheet, ConvertError};

#[test]
fn converts_basic_stylesheet() {
    let css = ":host { display: block; } .label { color: red; }";
    let output = convert_stylesheet(css, "fast-v3-ts", "styles").unwrap();

    assert_eq!(
        output,
        "import { css } from \"@microsoft/fast-element/css.js\";\n\nexport const styles = css`:host { display: block; } .label { color: red; }`;\n"
    );
}

#[test]
fn converts_representative_css_content() {
    let css = r#"
:host {
    display: flex;
    flex-direction: column;
}

@media (max-width: 600px) {
    .label::before {
        content: "→";
    }
}
"#;
    let output = convert_stylesheet(css, "fast-v3-ts", "myElementStyles").unwrap();

    assert!(output.starts_with("import { css } from \"@microsoft/fast-element/css.js\";\n\n"));
    assert!(output.contains("export const myElementStyles = css`"));
    assert!(output.contains("@media (max-width: 600px) {"));
    assert!(output.contains(r#"content: "→";"#));
    assert!(output.ends_with("`;\n"));
}

#[test]
fn escapes_backticks_and_dollar_brace() {
    let css = "content: \"`hi`\"; width: calc(${x} - 1px);";
    let output = convert_stylesheet(css, "fast-v3-ts", "styles").unwrap();

    assert!(output.contains(r#"content: "\`hi\`"; width: calc(\${x} - 1px);"#));
}

#[test]
fn escapes_backslashes() {
    let css = r"content: '\2014'";
    let output = convert_stylesheet(css, "fast-v3-ts", "styles").unwrap();

    assert!(output.contains(r"content: '\\2014'"));
}

#[test]
fn escapes_carriage_returns() {
    let css = "a {\r\n  color: red;\r\n}";
    let output = convert_stylesheet(css, "fast-v3-ts", "styles").unwrap();

    assert!(output.contains("a {\\r\n  color: red;\\r\n}"));
    assert!(!output.contains('\r'));
}

#[test]
fn rejects_webui_prerelease_syntax() {
    let err = convert_stylesheet("a {}", "webui-prerelease", "styles").unwrap_err();
    assert!(matches!(
        err,
        ConvertError::StylesheetUnsupportedForSyntax { .. }
    ));
    assert!(err.to_string().contains("fast-v3-ts"));
}

#[test]
fn rejects_unknown_syntax() {
    let err = convert_stylesheet("a {}", "unknown", "styles").unwrap_err();
    assert!(matches!(err, ConvertError::UnsupportedSyntax { .. }));
}

#[test]
fn rejects_empty_export_name() {
    let err = convert_stylesheet("a {}", "fast-v3-ts", "").unwrap_err();
    assert!(matches!(err, ConvertError::InvalidExportName { .. }));
}

#[test]
fn rejects_export_name_with_dots() {
    let err = convert_stylesheet("a {}", "fast-v3-ts", "my.styles").unwrap_err();
    assert!(matches!(err, ConvertError::InvalidExportName { .. }));
}

#[test]
fn rejects_export_name_starting_with_digit() {
    let err = convert_stylesheet("a {}", "fast-v3-ts", "1styles").unwrap_err();
    assert!(matches!(err, ConvertError::InvalidExportName { .. }));
}

#[test]
fn accepts_export_name_with_underscore_and_dollar_sign() {
    let output = convert_stylesheet("a {}", "fast-v3-ts", "_$styles2").unwrap();
    assert!(output.contains("export const _$styles2 = css`a {}`;"));
}
