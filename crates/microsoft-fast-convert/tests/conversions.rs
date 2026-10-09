use microsoft_fast_convert::{
    convert_template, convert_template_with_options, syntax_metadata, syntax_metadata_json,
    ConvertOptions,
};

fn fast_template(inner: &str) -> String {
    format!(r#"<f-template name="my-element">{inner}</f-template>"#)
}

#[test]
fn exposes_syntax_metadata() {
    let metadata = syntax_metadata();

    assert_eq!(metadata.len(), 3);
    assert_eq!(metadata[0].name, "webui-prerelease");
    assert_eq!(metadata[0].extension, ".html");
    assert_eq!(metadata[0].suffix, ".webui.html");
    assert_eq!(metadata[1].name, "fast-v3-ts");
    assert_eq!(metadata[1].extension, ".ts");
    assert_eq!(metadata[1].suffix, ".template.ts");
    assert_eq!(metadata[2].name, "webui");
    assert_eq!(metadata[2].extension, ".html");
    // Deliberately distinct from `webui-prerelease`'s `.webui.html` default so
    // converting the same input for both targets without an explicit
    // `--output` cannot silently overwrite the other target's file.
    assert_eq!(metadata[2].suffix, ".webui-native.html");
    assert_eq!(
        syntax_metadata_json(),
        r#"[{"syntax":"webui-prerelease","extension":".html","suffix":".webui.html"},{"syntax":"fast-v3-ts","extension":".ts","suffix":".template.ts"},{"syntax":"webui","extension":".html","suffix":".webui-native.html"}]"#
    );
}

#[test]
fn webui_unwraps_template() {
    let input = fast_template(r#"<template><span>{{name}}</span></template>"#);
    let output = convert_template(&input, "webui-prerelease").unwrap();

    assert_eq!(output, r#"<template><span>{{name}}</span></template>"#);
}

#[test]
fn webui_converts_repeat_and_when() {
    let input = fast_template(
        r#"<template><f-repeat value="{{item in items}}"><f-when value="{{item.visible}}"><span>{{item.name}}</span></f-when></f-repeat></template>"#,
    );
    let output = convert_template(&input, "webui-prerelease").unwrap();

    assert_eq!(
        output,
        r#"<template><for each="item in items"><if condition="item.visible"><span>{{item.name}}</span></if></for></template>"#
    );
}

#[test]
fn fast_v3_ts_converts_basic_text_and_attributes() {
    let input = fast_template(r#"<template><h1 title="{{title}}">{{title}}</h1></template>"#);
    let output = convert_template(&input, "fast-v3-ts").unwrap();

    assert_eq!(
        output,
        "import { html } from \"@microsoft/fast-element/html.js\";\n\nexport const template = html`<template><h1 title=\"${x => x.title}\">${x => x.title}</h1></template>`;\n"
    );
}

#[test]
fn fast_v3_ts_converts_repeat() {
    let input = fast_template(
        r#"<template><f-repeat value="{{item in items}}"><span>{{item.name}}</span></f-repeat></template>"#,
    );
    let output = convert_template(&input, "fast-v3-ts").unwrap();

    assert_eq!(
        output,
        "import { html } from \"@microsoft/fast-element/html.js\";\nimport { repeat } from \"@microsoft/fast-element/repeat.js\";\n\nexport const template = html`<template>${repeat(x => x.items, x => html`<span>${x => x.name}</span>`)}</template>`;\n"
    );
}

#[test]
fn fast_v3_ts_converts_when() {
    let input = fast_template(
        r#"<template><f-when value="{{isVisible && count > 0}}"><span>Shown</span></f-when></template>"#,
    );
    let output = convert_template(&input, "fast-v3-ts").unwrap();

    assert_eq!(
        output,
        "import { html } from \"@microsoft/fast-element/html.js\";\nimport { when } from \"@microsoft/fast-element/when.js\";\n\nexport const template = html`<template>${when(x => x.isVisible && x.count > 0, html`<span>Shown</span>`)}</template>`;\n"
    );
}

#[test]
fn fast_v3_ts_converts_f_attribute_mappings() {
    let input = fast_template(
        r#"<template><h1 f-ref="title"></h1><slot f-slotted="{slottedNodes}"></slot><ul f-children="items"></ul></template>"#,
    );
    let output = convert_template(&input, "fast-v3-ts").unwrap();

    assert_eq!(
        output,
        "import { html } from \"@microsoft/fast-element/html.js\";\nimport { ref } from \"@microsoft/fast-element/ref.js\";\nimport { children } from \"@microsoft/fast-element/children.js\";\nimport { slotted } from \"@microsoft/fast-element/slotted.js\";\n\nexport const template = html`<template><h1 ${ref(\"title\")}></h1><slot ${slotted(\"slottedNodes\")}></slot><ul ${children(\"items\")}></ul></template>`;\n"
    );
}

#[test]
fn fast_v3_ts_converts_event_e_and_c_arguments() {
    let input = fast_template(
        r#"<template><button @click="{handleClick($e)}" @mouseover="{handleOver($c)}"></button></template>"#,
    );
    let output = convert_template(&input, "fast-v3-ts").unwrap();

    assert_eq!(
        output,
        "import { html } from \"@microsoft/fast-element/html.js\";\n\nexport const template = html`<template><button @click=\"${(x, c) => x.handleClick(c.event)}\" @mouseover=\"${(x, c) => x.handleOver(c)}\"></button></template>`;\n"
    );
}

#[test]
fn fast_v3_ts_maps_nested_repeat_event_parent_chain() {
    let input = fast_template(
        r#"<template><f-repeat value="{{item in items}}"><f-repeat value="{{child in item.children}}"><button @click="{handleClick($e)}">{{child.name}}</button></f-repeat></f-repeat></template>"#,
    );
    let output = convert_template(&input, "fast-v3-ts").unwrap();

    assert_eq!(
        output,
        "import { html } from \"@microsoft/fast-element/html.js\";\nimport { repeat } from \"@microsoft/fast-element/repeat.js\";\n\nexport const template = html`<template>${repeat(x => x.items, x => html`${repeat(x => x.children, x => html`<button @click=\"${(x, c) => c.parentContext.parent.handleClick(c.event)}\">${x => x.name}</button>`)}`)}</template>`;\n"
    );
}

#[test]
fn fast_v3_ts_escapes_template_literal_content() {
    let input = fast_template(
        "<template><span data-text=\"a ` ${ b \\ c\">literal ` ${ \\</span></template>",
    );
    let output = convert_template(&input, "fast-v3-ts").unwrap();

    assert_eq!(
        output,
        "import { html } from \"@microsoft/fast-element/html.js\";\n\nexport const template = html`<template><span data-text=\"a \\` \\${ b \\\\ c\">literal \\` \\${ \\\\</span></template>`;\n"
    );
}

#[test]
fn fast_v3_ts_converts_aspected_attribute_bindings() {
    let input = fast_template(
        r#"<template><input ?disabled="{{disabled}}" :value="{{value}}" /></template>"#,
    );
    let output = convert_template(&input, "fast-v3-ts").unwrap();

    assert_eq!(
        output,
        "import { html } from \"@microsoft/fast-element/html.js\";\n\nexport const template = html`<template><input ?disabled=\"${x => x.disabled}\" :value=\"${x => x.value}\" /></template>`;\n"
    );
}

#[test]
fn fast_v3_ts_emits_type_source_generic_without_import() {
    let input = fast_template(r#"<template><h1 title="{{title}}"></h1></template>"#);
    let options = ConvertOptions {
        type_source: Some("MyElement".to_string()),
        type_source_import: None,
    };
    let output = convert_template_with_options(&input, "fast-v3-ts", &options).unwrap();

    assert_eq!(
        output,
        "import { html } from \"@microsoft/fast-element/html.js\";\n\nexport const template = html<MyElement>`<template><h1 title=\"${x => x.title}\"></h1></template>`;\n"
    );
}

#[test]
fn fast_v3_ts_emits_type_source_generic_with_import() {
    let input = fast_template(r#"<template><h1 title="{{title}}"></h1></template>"#);
    let options = ConvertOptions {
        type_source: Some("MyElement".to_string()),
        type_source_import: Some("./my-element.js".to_string()),
    };
    let output = convert_template_with_options(&input, "fast-v3-ts", &options).unwrap();

    assert_eq!(
        output,
        "import { html } from \"@microsoft/fast-element/html.js\";\nimport type { MyElement } from \"./my-element.js\";\n\nexport const template = html<MyElement>`<template><h1 title=\"${x => x.title}\"></h1></template>`;\n"
    );
}

#[test]
fn fast_v3_ts_accepts_dotted_type_source() {
    let input = fast_template(r#"<template><span></span></template>"#);
    let options = ConvertOptions {
        type_source: Some("Namespace.MyElement".to_string()),
        type_source_import: None,
    };
    let output = convert_template_with_options(&input, "fast-v3-ts", &options).unwrap();

    assert!(output.contains("html<Namespace.MyElement>`"));
}

// ---------------------------------------------------------------------------
// Native `webui` target
// ---------------------------------------------------------------------------

#[test]
fn webui_native_metadata_is_present() {
    let metadata = syntax_metadata();
    let native = metadata
        .iter()
        .find(|entry| entry.name == "webui")
        .expect("webui metadata entry present");

    assert_eq!(native.extension, ".html");
    // Intentionally distinct from `webui-prerelease`'s `.webui.html` default
    // so converting the same input for both targets without an explicit
    // `--output` cannot silently overwrite the other target's file.
    assert_eq!(native.suffix, ".webui-native.html");

    let prerelease = metadata
        .iter()
        .find(|entry| entry.name == "webui-prerelease")
        .expect("webui-prerelease metadata entry present");
    assert_eq!(prerelease.extension, ".html");
    assert_eq!(prerelease.suffix, ".webui.html");
}

#[test]
fn webui_native_light_dom_has_no_shadow_attributes() {
    let input = fast_template(r#"<template><span>{{name}}</span></template>"#);
    let output = convert_template(&input, "webui").unwrap();

    assert_eq!(output, r#"<template><span>{{name}}</span></template>"#);
}

#[test]
fn webui_native_moves_shadow_root_mode_to_inner_template() {
    let input = r#"<f-template name="my-element" shadowrootmode="open"><template><span>{{name}}</span></template></f-template>"#;
    let output = convert_template(input, "webui").unwrap();

    assert_eq!(
        output,
        r#"<template shadowrootmode="open"><span>{{name}}</span></template>"#
    );
}

#[test]
fn webui_native_accepts_matching_inner_shadow_root_mode_deterministically() {
    let input = r#"<f-template name="my-element" shadowrootmode="open"><template shadowrootmode="open"><span>{{name}}</span></template></f-template>"#;
    let output = convert_template(input, "webui").unwrap();

    assert_eq!(
        output,
        r#"<template shadowrootmode="open"><span>{{name}}</span></template>"#
    );
}

#[test]
fn webui_native_converts_repeat_and_when() {
    let input = fast_template(
        r#"<template><f-repeat value="{{item in items}}"><f-when value="{{item.visible}}"><span>{{item.name}}</span></f-when></f-repeat></template>"#,
    );
    let output = convert_template(&input, "webui").unwrap();

    assert_eq!(
        output,
        r#"<template><for each="item in items"><if condition="item.visible"><span>{{item.name}}</span></if></for></template>"#
    );
}

#[test]
fn webui_native_converts_f_ref_to_braced_w_ref() {
    let input = fast_template(r#"<template><input f-ref="{input}" /></template>"#);
    let output = convert_template(&input, "webui").unwrap();

    assert_eq!(output, r#"<template><input w-ref="{input}" /></template>"#);
}

#[test]
fn webui_native_converts_event_e_argument_to_bare_e() {
    let input = fast_template(r#"<template><button @click="{select($e)}"></button></template>"#);
    let output = convert_template(&input, "webui").unwrap();

    assert_eq!(
        output,
        r#"<template><button @click="{select(e)}"></button></template>"#
    );
}

#[test]
fn webui_native_passes_through_no_arg_and_ordinary_argument_calls() {
    let input = fast_template(
        r#"<template><button @click="{save()}"></button><button @click="{select(item.id)}"></button><button @click="{select('a', 1)}"></button></template>"#,
    );
    let output = convert_template(&input, "webui").unwrap();

    assert_eq!(
        output,
        r#"<template><button @click="{save()}"></button><button @click="{select(item.id)}"></button><button @click="{select('a', 1)}"></button></template>"#
    );
}

#[test]
fn webui_native_passes_through_compatible_bindings() {
    let input = fast_template(
        r#"<template><span>{{title}}</span><h1 title="{{title}}"></h1><input ?disabled="{{disabled}}" :config="{{config}}" /></template>"#,
    );
    let output = convert_template(&input, "webui").unwrap();

    assert_eq!(
        output,
        r#"<template><span>{{title}}</span><h1 title="{{title}}"></h1><input ?disabled="{{disabled}}" :config="{{config}}" /></template>"#
    );
}

#[test]
fn webui_native_retains_nested_repeat_and_when_scope() {
    let input = fast_template(
        r#"<template><f-repeat value="{{item in items}}"><f-repeat value="{{child in item.children}}"><f-when value="{{child.visible}}"><span>{{child.name}}</span></f-when></f-repeat></f-repeat></template>"#,
    );
    let output = convert_template(&input, "webui").unwrap();

    assert_eq!(
        output,
        r#"<template><for each="item in items"><for each="child in item.children"><if condition="child.visible"><span>{{child.name}}</span></if></for></for></template>"#
    );
}

#[test]
fn webui_native_comments_with_fast_looking_text_pass_through_unchanged() {
    let input = fast_template(
        r#"<template><!-- <f-repeat value="{{item in items}}">{{x}}</f-repeat> --><span>{{title}}</span></template>"#,
    );
    let output = convert_template(&input, "webui").unwrap();

    assert_eq!(
        output,
        r#"<template><!-- <f-repeat value="{{item in items}}">{{x}}</f-repeat> --><span>{{title}}</span></template>"#
    );
}

#[test]
fn webui_native_supports_single_and_double_quoted_attributes() {
    // Both quote styles parse successfully; the converter normalizes output
    // attribute values to double quotes regardless of the source quote style.
    let input =
        fast_template(r#"<template><h1 title='{{title}}' data-id="fixed"></h1></template>"#);
    let output = convert_template(&input, "webui").unwrap();

    assert_eq!(
        output,
        r#"<template><h1 title="{{title}}" data-id="fixed"></h1></template>"#
    );
}

#[test]
fn webui_native_is_deterministic() {
    let input = fast_template(
        r#"<template><f-repeat value="{{item in items}}"><button @click="{select($e)}">{{item.name}}</button></f-repeat></template>"#,
    );
    let first = convert_template(&input, "webui").unwrap();
    let second = convert_template(&input, "webui").unwrap();

    assert_eq!(first, second);
}

#[test]
fn webui_native_avatar_fixture_after_caller_adaptation() {
    // The source has already been adapted by the caller: the default slot
    // uses `w-ref`/`@slotchange` directly rather than `f-slotted`, since
    // `f-slotted` has no native equivalent and always errors in this target.
    let input = r#"<f-template name="fast-avatar" shadowrootmode="open"><template><div class="link"><slot w-ref="{defaultSlot}" @slotchange="{syncSlottedDefaults()}"></slot></div></template></f-template>"#;
    let output = convert_template(input, "webui").unwrap();

    assert!(output.contains(r#"<template shadowrootmode="open">"#));
    assert!(output.contains(r#"w-ref="{defaultSlot}""#));
    assert!(output.contains(r#"@slotchange="{syncSlottedDefaults()}""#));
    assert!(!output.contains("<f-template"));
    assert!(!output.contains("f-ref"));
    assert!(!output.contains("f-slotted"));
    assert!(!output.contains("f-children"));
    assert!(!output.contains("$e"));
    assert!(!output.contains("$c"));
}

#[test]
fn webui_native_raw_text_script_content_is_not_rewritten() {
    let input = fast_template(
        r#"<template><script>const msg = "f-repeat and {{not a binding in js}}";</script></template>"#,
    );
    let output = convert_template(&input, "webui").unwrap();

    assert_eq!(
        output,
        r#"<template><script>const msg = "f-repeat and {{not a binding in js}}";</script></template>"#
    );
}

#[test]
fn webui_native_preserves_uppercase_tag_and_attribute_case() {
    // The converter is case-sensitive: directive keywords (`f-repeat`,
    // `f-when`, `f-ref`, …) are only recognized in lowercase. An uppercase
    // tag/attribute is treated as an ordinary element and its case is
    // preserved rather than rewritten.
    let input = fast_template(r#"<template><DIV CLASS="x">{{title}}</DIV></template>"#);
    let output = convert_template(&input, "webui").unwrap();

    assert_eq!(
        output,
        r#"<template><DIV CLASS="x">{{title}}</DIV></template>"#
    );
}
