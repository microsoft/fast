use microsoft_fast_convert::convert_template;

#[test]
fn raw_css_does_not_create_definitions_or_directives() {
    let css = "a {\r\n content: '{{literal}} <f-template><template><f-unsupported></f-unsupported></template></f-template> ` ${x} \\\\';\n}";
    let source = format!(
        "<f-template name='my-card'><template>\n<STYLE data-fast-ssr-style='card-v1'>{css}</STYLE><link rel='stylesheet' href='/a.css?x=&quot;&amp;y=1'><span>{{{{title}}}}</span></template></f-template>"
    );
    for syntax in [
        "webui-prerelease",
        "webui-framework-prerelease",
        "fast-v3-ts",
    ] {
        let result = convert_template(&source, syntax).unwrap();
        assert!(result.warnings.is_empty());
        assert!(result.output.contains("data-fast-ssr-style"));
        assert!(result.output.contains("/a.css?x=&quot;&amp;y=1"));
        if syntax == "fast-v3-ts" {
            assert!(result.output.contains("\\${x}"));
            assert!(result.output.contains("\\`"));
            assert!(result.output.contains("\\r"));
            assert!(result.output.contains("{{literal}}"));
        } else {
            assert!(result.output.contains(css));
        }
    }
}
