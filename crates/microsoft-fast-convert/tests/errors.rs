use microsoft_fast_convert::{
    convert_template, convert_template_with_options, ConvertError, ConvertOptions,
};

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

#[test]
fn type_source_is_rejected_for_webui_syntax() {
    let input = fast_template(r#"<template><span></span></template>"#);
    let options = ConvertOptions {
        type_source: Some("MyElement".to_string()),
        type_source_import: None,
    };
    let err = convert_template_with_options(&input, "webui-prerelease", &options).unwrap_err();
    assert!(matches!(
        err,
        ConvertError::TypeSourceUnsupportedForSyntax { .. }
    ));
    assert!(err.to_string().contains("webui-prerelease"));
}

#[test]
fn type_source_import_without_type_source_is_rejected() {
    let input = fast_template(r#"<template><span></span></template>"#);
    let options = ConvertOptions {
        type_source: None,
        type_source_import: Some("./my-element.js".to_string()),
    };
    let err = convert_template_with_options(&input, "fast-v3-ts", &options).unwrap_err();
    assert!(matches!(
        err,
        ConvertError::TypeSourceImportRequiresTypeSource
    ));
}

#[test]
fn invalid_type_source_is_rejected() {
    let input = fast_template(r#"<template><span></span></template>"#);
    let options = ConvertOptions {
        type_source: Some("My Element<T>".to_string()),
        type_source_import: None,
    };
    let err = convert_template_with_options(&input, "fast-v3-ts", &options).unwrap_err();
    assert!(matches!(err, ConvertError::InvalidTypeSource { .. }));
}

// ---------------------------------------------------------------------------
// `webui-prerelease` native-style conversion errors
//
// `f-slotted`/`f-children` are intentionally *not* tested here: they are
// stripped with a warning rather than rejected (see `tests/conversions.rs`).
// Every other unsupported construct below remains a hard error.
// ---------------------------------------------------------------------------

#[test]
fn webui_unsupported_publisher_attribute_is_rejected() {
    let input = r#"<f-template name="my-element" data-extra="value"><template><span></span></template></f-template>"#.to_string();
    let err = convert_template(&input, "webui-prerelease").unwrap_err();
    assert!(matches!(
        err,
        ConvertError::UnsupportedPublisherAttribute { ref attribute, .. } if attribute == "data-extra"
    ));
}

#[test]
fn webui_conflicting_shadow_root_mode_is_rejected() {
    let input = r#"<f-template name="my-element" shadowrootmode="open"><template shadowrootmode="closed"><span></span></template></f-template>"#.to_string();
    let err = convert_template(&input, "webui-prerelease").unwrap_err();
    assert!(matches!(
        err,
        ConvertError::ConflictingShadowRootMode { .. }
    ));
}

#[test]
fn webui_non_braced_f_ref_is_rejected() {
    let input = fast_template(r#"<template><input f-ref="input" /></template>"#);
    let err = convert_template(&input, "webui-prerelease").unwrap_err();
    assert!(matches!(
        err,
        ConvertError::InvalidAttributeValue { ref attribute, .. } if attribute == "f-ref"
    ));
}

#[test]
fn webui_event_context_c_is_rejected() {
    let input = fast_template(r#"<template><button @click="{select($c)}"></button></template>"#);
    let err = convert_template(&input, "webui-prerelease").unwrap_err();
    assert!(matches!(
        err,
        ConvertError::UnsupportedEventContext { ref value, .. } if value == "$c"
    ));
}

#[test]
fn webui_event_context_traversal_is_rejected() {
    let input =
        fast_template(r#"<template><button @click="{select($c.parent)}"></button></template>"#);
    let err = convert_template(&input, "webui-prerelease").unwrap_err();
    assert!(matches!(
        err,
        ConvertError::UnsupportedEventContext { ref value, .. } if value == "$c.parent"
    ));

    let input =
        fast_template(r#"<template><button @click="{select($e.target)}"></button></template>"#);
    let err = convert_template(&input, "webui-prerelease").unwrap_err();
    assert!(matches!(
        err,
        ConvertError::UnsupportedEventContext { ref value, .. } if value == "$e.target"
    ));
}

#[test]
fn webui_unknown_f_element_is_rejected() {
    let input = fast_template(r#"<template><f-mystery></f-mystery></template>"#);
    let err = convert_template(&input, "webui-prerelease").unwrap_err();
    assert!(matches!(err, ConvertError::UnsupportedFElement { ref tag, .. } if tag == "f-mystery"));
}

#[test]
fn webui_unknown_f_attribute_is_rejected() {
    let input = fast_template(r#"<template><span f-unknown="value"></span></template>"#);
    let err = convert_template(&input, "webui-prerelease").unwrap_err();
    assert!(matches!(
        err,
        ConvertError::UnsupportedFAttribute { ref attribute, .. } if attribute == "f-unknown"
    ));
}

#[test]
fn webui_unclosed_binding_is_rejected() {
    let input = fast_template(r#"<template><span>{{title</span></template>"#);
    let err = convert_template(&input, "webui-prerelease").unwrap_err();
    assert!(matches!(err, ConvertError::UnclosedBinding { .. }));
}

#[test]
fn webui_empty_binding_is_rejected() {
    let input = fast_template(r#"<template><span>{{}}</span></template>"#);
    let err = convert_template(&input, "webui-prerelease").unwrap_err();
    assert!(matches!(err, ConvertError::EmptyBinding { .. }));
}
