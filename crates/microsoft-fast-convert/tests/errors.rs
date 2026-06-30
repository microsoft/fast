use microsoft_fast_convert::{convert_template, ConvertError};

fn fast_template(inner: &str) -> String {
    format!(r#"<f-template name="my-element">{inner}</f-template>"#)
}

#[test]
fn unknown_syntax_lists_accepted_values() {
    let err = convert_template("", "unknown").unwrap_err();
    assert!(matches!(err, ConvertError::UnsupportedSyntax { .. }));
    assert!(err.to_string().contains("webui-prerelease"));
    assert!(err.to_string().contains("fast-v3-ts"));
}

#[test]
fn missing_f_template_is_rejected() {
    let err = convert_template("<template></template>", "webui-prerelease").unwrap_err();
    assert!(matches!(err, ConvertError::MissingFTemplate));
}

#[test]
fn multiple_f_templates_are_rejected() {
    let err = convert_template(
        r#"<f-template name="one"><template></template></f-template><f-template name="two"><template></template></f-template>"#,
        "webui-prerelease",
    )
    .unwrap_err();
    assert!(matches!(err, ConvertError::MultipleFTemplates { count: 2 }));
}

#[test]
fn empty_f_template_name_is_rejected() {
    let err = convert_template(
        r#"<f-template name=""><template></template></f-template>"#,
        "webui-prerelease",
    )
    .unwrap_err();
    assert!(matches!(err, ConvertError::EmptyFTemplateName));
}

#[test]
fn missing_inner_template_is_rejected() {
    let err = convert_template(
        r#"<f-template name="my-element"><span></span></f-template>"#,
        "webui-prerelease",
    )
    .unwrap_err();
    assert!(matches!(err, ConvertError::MissingInnerTemplate));
}

#[test]
fn multiple_inner_templates_are_rejected() {
    let err = convert_template(
        r#"<f-template name="my-element"><template></template><template></template></f-template>"#,
        "webui-prerelease",
    )
    .unwrap_err();
    assert!(matches!(
        err,
        ConvertError::MultipleInnerTemplates { count: 2 }
    ));
}

#[test]
fn invalid_repeat_value_is_rejected() {
    let input = fast_template(r#"<template><f-repeat value="{{items}}"></f-repeat></template>"#);
    let err = convert_template(&input, "webui-prerelease").unwrap_err();
    assert!(matches!(err, ConvertError::InvalidRepeatExpression { .. }));
}

#[test]
fn missing_when_value_is_rejected() {
    let input = fast_template(r#"<template><f-when>Shown</f-when></template>"#);
    let err = convert_template(&input, "fast-v3-ts").unwrap_err();
    assert!(matches!(err, ConvertError::MissingValueAttribute { .. }));
}

#[test]
fn unsupported_f_attribute_is_rejected() {
    let input = fast_template(r#"<template><span f-unknown="value"></span></template>"#);
    let err = convert_template(&input, "fast-v3-ts").unwrap_err();
    assert!(matches!(err, ConvertError::UnsupportedFAttribute { .. }));
}

#[test]
fn unsupported_expression_function_call_is_rejected() {
    let input = fast_template(r#"<template>{{formatName(name)}}</template>"#);
    let err = convert_template(&input, "fast-v3-ts").unwrap_err();
    assert!(matches!(err, ConvertError::UnsupportedExpression { .. }));
}

#[test]
fn root_binding_inside_repeat_is_rejected() {
    let input = fast_template(
        r#"<template><f-repeat value="{{item in items}}"><span>{{title}}</span></f-repeat></template>"#,
    );
    let err = convert_template(&input, "fast-v3-ts").unwrap_err();
    assert!(matches!(err, ConvertError::UnsupportedExpression { .. }));
}
