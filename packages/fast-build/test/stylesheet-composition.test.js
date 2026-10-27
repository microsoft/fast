// @ts-check
const assert = require("node:assert/strict");
const { test } = require("node:test");
const typescript = require("typescript");
const { chromium } = require("@playwright/test");
const wasm = require("../wasm/microsoft_fast_build.js");
const convert = require("../wasm/convert/microsoft_fast_convert.js");

const syntaxes = ["webui-prerelease", "webui-framework-prerelease", "fast-v3-ts"];

function compose(html, options) {
    return wasm.compose_f_template_styles_with_options(html, options);
}

function position(source, at) {
    const lines = source.slice(0, at).split(/\r\n|\r|\n/);
    return { offset: at, line: lines.length, column: lines.at(-1).length + 1 };
}

test("inline styles, external URLs, and ownership markers survive all conversions", () => {
    const html =
        '<f-template name="my-card"><template class="card"><style>authored{}</style><span>{{title}}</span></template></f-template>';
    const css =
        ":host {\r\ncontent: '` ${literal} \\\\ {{notState}} <f-template><template><f-when></f-when></template></f-template>';\n}";
    for (const options of [
        { kind: "inline", css },
        { kind: "inline", css, styleId: "card\"<&'v1" },
        { kind: "external", href: '/assets/card.css?x="&y=<value>' },
    ]) {
        const result = compose(html, options);
        try {
            const definitions = JSON.parse(wasm.parse_f_templates(result.html));
            assert.equal(definitions.length, 1);
            assert.equal(definitions[0].bindings.length, 1);
            const templates = JSON.stringify({ "my-card": definitions[0] });
            const rendered = wasm.render_entry_with_templates(
                "<my-card></my-card>",
                templates,
                '{"title":"Hello"}',
            );
            const chunks = JSON.parse(
                wasm.render_entry_with_templates(
                    "<my-card></my-card>",
                    templates,
                    '{"title":"Hello"}',
                    undefined,
                    true,
                ),
            );
            assert.equal(chunks.join(""), rendered);
            assert.match(rendered, /<style>authored\{\}<\/style>/);
            if (options.kind === "inline") {
                assert.ok(rendered.includes(css));
                if (options.styleId) {
                    assert.ok(
                        rendered.includes(
                            'data-fast-ssr-style="card&quot;&lt;&amp;&#39;v1"',
                        ),
                    );
                }
            } else {
                assert.ok(
                    rendered.includes(
                        'href="/assets/card.css?x=&quot;&amp;y=&lt;value&gt;"',
                    ),
                );
            }
            for (const syntax of syntaxes) {
                const converted = convert.convert_template(result.html, syntax);
                try {
                    assert.deepEqual(converted.warnings, []);
                    if (syntax !== "fast-v3-ts") {
                        assert.ok(converted.output.includes("<style>authored{}</style>"));
                        if (options.kind === "inline")
                            assert.ok(converted.output.includes(css));
                    } else {
                        // Evaluate the generated tagged literal with a capturing html tag.
                        // This checks actual literal values, not just escaped-source snapshots.
                        const js = typescript.transpileModule(
                            converted.output.replace(/^import .*;\n/gm, ""),
                            {
                                compilerOptions: {
                                    target: typescript.ScriptTarget.ES2022,
                                    module: typescript.ModuleKind.CommonJS,
                                },
                            },
                        ).outputText;
                        const exports = {};
                        new Function("exports", "html", js)(
                            exports,
                            (strings, ...values) => strings.join(""),
                        );
                        if (options.kind === "inline")
                            assert.ok(exports.template.includes(css));
                        assert.ok(exports.template.includes("<style>authored{}</style>"));
                    }
                    if (options.kind === "external") {
                        assert.ok(
                            converted.output.includes(
                                'href="/assets/card.css?x=&quot;&amp;y=&lt;value&gt;"',
                            ),
                        );
                    }
                } finally {
                    converted.free();
                }
            }
        } finally {
            result.free();
        }
    }
});

test("composition maps binding spans and converter errors to complete authored HTML", () => {
    const html =
        '\r\n😀<f-template name="my-card" shadowrootmode="open">\r<template class=\'card\'>\n😀\t{{title}}<f-unsupported></f-unsupported></template></f-template>';
    const result = compose(html, {
        kind: "inline",
        css: "\r\n:host {\r color: red;\n}\n",
        styleId: "card-v1",
    });
    try {
        const original = JSON.parse(wasm.parse_f_templates(html))[0];
        const composed = JSON.parse(wasm.parse_f_templates(result.html))[0];
        const span = composed.bindings[0].span;
        assert.deepEqual(
            JSON.parse(result.map_span(span.start.offset, span.end.offset)),
            {
                source: "html",
                span: original.bindings[0].span,
            },
        );
        for (const syntax of syntaxes) {
            assert.throws(
                () => convert.convert_template(result.html, syntax),
                error => {
                    assert.equal(error.code, "unsupported-f-element");
                    const mapped = JSON.parse(
                        result.map_location(
                            error.line,
                            error.column,
                            error.length,
                            false,
                        ),
                    );
                    assert.equal(mapped.source, "html");
                    assert.deepEqual(
                        mapped.span.start,
                        position(html, html.indexOf("<f-unsupported>")),
                    );
                    return true;
                },
            );
        }
        const map = JSON.parse(result.source_map);
        assert.equal(map.version, 1);
        assert.equal(map.originalHtml, html);
        assert.equal(map.cssOffset, result.html.indexOf("\r\n:host"));
        assert.equal(map.insertionLength, result.html.length - html.length);
    } finally {
        result.free();
    }
});

test("locator and streaming diagnostics map selected-definition content coordinates", () => {
    const html =
        '\r\n<f-template name="my-card"><template>\n😀\t<f-when></f-when></template></f-template>';
    const result = compose(html, { kind: "inline", css: "\r\na{}\n" });
    try {
        const definition = JSON.parse(wasm.parse_f_templates(result.html))[0];
        const templates = JSON.stringify({ "my-card": definition });
        for (const stream of [false, true]) {
            assert.throws(
                () =>
                    wasm.render_entry_with_templates(
                        "<my-card></my-card>",
                        templates,
                        undefined,
                        undefined,
                        stream,
                    ),
                error => {
                    assert.equal(error.templateName, "my-card");
                    const mapped = JSON.parse(
                        result.map_location(error.line, error.column, error.length, true),
                    );
                    assert.deepEqual(
                        mapped.span.start,
                        position(html, html.indexOf("<f-when>")),
                    );
                    return true;
                },
            );
        }
    } finally {
        result.free();
    }
});

test("mapping distinguishes CSS, generated markup, invalid ranges, and UTF-16 boundaries", () => {
    const html = '<f-template name="my-card"><template>{{title}}</template></f-template>';
    const result = compose(html, {
        kind: "inline",
        css: "😀\r\nx{}",
        styleId: "card-v1",
    });
    try {
        const at = result.html.indexOf("😀");
        const mapped = JSON.parse(result.map_span(at, at + 2));
        assert.equal(mapped.source, "css");
        assert.deepEqual(mapped.span.start, { offset: 0, line: 1, column: 1 });
        const styleAt = result.html.indexOf("<style");
        assert.deepEqual(JSON.parse(result.map_span(styleAt, styleAt + 6)), {
            source: "generated",
            span: null,
        });
        for (const [start, end] of [
            [at + 1, at + 2],
            [at - 1, at + 2],
            [0, at + 2],
            [2, 1],
            [0, result.html.length + 1],
        ]) {
            assert.throws(() => result.map_span(start, end), {
                code: "invalid-composition",
            });
        }
        assert.throws(() => result.map_location(999, 1, 1, false), {
            code: "invalid-composition",
        });
        for (const value of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
            assert.throws(() => result.map_span(value, value), {
                code: "invalid-composition",
            });
            assert.throws(() => result.map_location(value, 1, 1, false), {
                code: "invalid-composition",
            });
        }
    } finally {
        result.free();
    }
});

test("composed inline and external shadow styles work without JavaScript", async () => {
    const browser = await chromium.launch();
    try {
        const page = await browser.newPage({ javaScriptEnabled: false });
        await page.route("https://example.test/card.css?x=1&y=2", route =>
            route.fulfill({
                contentType: "text/css",
                body: ":host { color: rgb(12, 34, 56); }",
            }),
        );
        for (const options of [
            {
                kind: "inline",
                css: ":host { color: rgb(12, 34, 56); }",
                styleId: "card\"<&'v1",
            },
            { kind: "external", href: "https://example.test/card.css?x=1&y=2" },
        ]) {
            const result = compose(
                '<f-template name="my-card"><template><style>:host { background-color: rgb(65, 43, 21); }</style><span>Card</span></template></f-template>',
                options,
            );
            try {
                const definition = JSON.parse(wasm.parse_f_templates(result.html))[0];
                const rendered = wasm.render_entry_with_templates(
                    "<my-card></my-card>",
                    JSON.stringify({ "my-card": definition }),
                );
                await page.setContent(rendered, { waitUntil: "load" });
                const card = page.locator("my-card");
                assert.equal(
                    await card.evaluate(element => getComputedStyle(element).color),
                    "rgb(12, 34, 56)",
                );
                assert.equal(
                    await card.evaluate(
                        element => getComputedStyle(element).backgroundColor,
                    ),
                    "rgb(65, 43, 21)",
                );
                if (options.kind === "inline") {
                    assert.equal(
                        await card
                            .locator("style[data-fast-ssr-style]")
                            .getAttribute("data-fast-ssr-style"),
                        options.styleId,
                    );
                    assert.equal(await card.locator("style").count(), 2);
                } else {
                    assert.equal(
                        await card.locator("link").getAttribute("href"),
                        options.href,
                    );
                }
            } finally {
                result.free();
            }
        }
    } finally {
        await browser.close();
    }
});

test("invalid stylesheet options and raw-text terminators fail explicitly", () => {
    const html = '<f-template name="my-card"><template></template></f-template>';
    for (const options of [
        {},
        { kind: "unknown" },
        { kind: "inline" },
        { kind: "inline", css: 3 },
        { kind: "inline", css: "", styleId: "" },
        { kind: "inline", css: "", styleId: "{{id}}" },
        { kind: "external", href: "" },
        { kind: "external", href: "/{{url}}" },
        { kind: "external", href: "/a.css", css: "a{}" },
        { kind: "inline", css: "", nonce: "not-supported" },
    ]) {
        assert.throws(() => compose(html, options), { code: "invalid-composition" });
    }
    for (const css of ["</style>", "\r\n😀</STYLE >", "</style/", "</style"]) {
        assert.throws(
            () => compose(html, { kind: "inline", css }),
            error => {
                assert.equal(error.code, "unsafe-style-content");
                assert.equal(error.sourceKind, "css");
                const expected = position(css, css.indexOf("</"));
                assert.equal(error.line, expected.line);
                assert.equal(error.column, expected.column);
                return true;
            },
        );
    }
});
