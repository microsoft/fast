use microsoft_fast_convert::convert_template;

fn fast_template(inner: &str) -> String {
    format!(r#"<f-template name="my-element">{inner}</f-template>"#)
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
