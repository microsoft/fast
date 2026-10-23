// @ts-check
const assert = require("node:assert/strict");
const { test } = require("node:test");
const wasm = require("../wasm/microsoft_fast_build.js");
const convert = require("../wasm/convert/microsoft_fast_convert.js");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync, spawnSync } = require("node:child_process");
const typescript = require("typescript");

/**
 * @param {() => unknown} action
 * @param {string} code
 * @param {string | undefined} source
 * @param {number | undefined} at
 * @param {string | undefined} templateName
 * @param {number | undefined} length
 */
function assertDiagnostic(
    action,
    code,
    source = undefined,
    at = undefined,
    templateName = undefined,
    length = undefined,
) {
    assert.throws(action, error => {
        assert.ok(error instanceof Error);
        assert.equal(error.code, code);
        assert.equal(typeof error.stack, "string");
        assert.equal(error.templateName, templateName);
        if (source !== undefined && at !== undefined) {
            const lines = source.slice(0, at).split(/\r\n|\r|\n/);
            assert.equal(error.line, lines.length);
            assert.equal(error.column, lines.at(-1).length + 1);
            assert.equal(error.length, length);
        } else {
            for (const key of ["line", "column", "length"]) {
                assert.equal(Object.hasOwn(error, key), false);
            }
        }
        return true;
    });
}

test("render diagnostics locate authored input through escaping and nested directives", () => {
    const repeat = '<f-repeat value="{{item in items}}">{{item}}</f-repeat>';
    const source =
        "<code>{{escaped}} &lt; &#123; <f-when></f-when></code>\r\n" +
        '<f-when value="{{shown}}">\r\t😀' +
        repeat +
        "</f-when>";
    for (const stream of [false, true]) {
        assertDiagnostic(
            () =>
                wasm.render_entry_with_templates(
                    source,
                    "{}",
                    '{"shown":true,"items":42}',
                    undefined,
                    stream,
                ),
            "repeat-not-array",
            source,
            source.indexOf(repeat),
            undefined,
            '<f-repeat value="{{item in items}}">'.length,
        );
    }
    const unclosed = "<code>{{example}}</code>\n😀\t{{unfinished";
    assertDiagnostic(
        () => wasm.render(unclosed, "{}"),
        "unclosed-binding",
        unclosed,
        unclosed.indexOf("{{unfinished"),
        undefined,
        2,
    );
});

test("nested-definition diagnostics use the named content rather than the entry", () => {
    const content =
        '<code>{{example}}</code>\r\n<f-repeat value="{{item in items}}">' +
        "😀<f-when><b></b></f-when></f-repeat>";
    const templates = JSON.stringify({
        "test-card": { content },
        "test-wrapper": '<f-when value="{{shown}}"><test-card></test-card></f-when>',
    });
    for (const stream of [false, true]) {
        assertDiagnostic(
            () =>
                wasm.render_entry_with_templates(
                    "\n\n<test-wrapper></test-wrapper>",
                    templates,
                    '{"shown":true,"items":[1]}',
                    undefined,
                    stream,
                ),
            "missing-value-attribute",
            content,
            content.indexOf("<f-when>"),
            "test-card",
            "<f-when>".length,
        );
    }
    assertDiagnostic(
        () => wasm.render_shadow_root("test-card", templates, '{"items":[1]}'),
        "missing-value-attribute",
        content,
        content.indexOf("<f-when>"),
        "test-card",
        "<f-when>".length,
    );
});

test("conversion diagnostics locate the original document for every syntax target", () => {
    const source =
        '\r\n<f-template name="test-card" shadowrootmode="open">\r\n' +
        "  <template class='wide' shadowroot=\"open\">\n" +
        '<f-when value="{{shown}}">\r\n😀\t<f-unsupported></f-unsupported>' +
        "</f-when></template></f-template>";
    for (const syntax of [
        "webui-prerelease",
        "fast-v3-ts",
        "webui-framework-prerelease",
    ]) {
        assertDiagnostic(
            () => convert.convert_template(source, syntax),
            "unsupported-f-element",
            source,
            source.indexOf("<f-unsupported>"),
            "test-card",
            "<f-unsupported>".length,
        );
    }
    const unclosed =
        '<f-template name="card"><template>\n{{title}}\r\n😀 {{unfinished</template></f-template>';
    assertDiagnostic(
        () => convert.convert_template(unclosed, "fast-v3-ts"),
        "unclosed-binding",
        unclosed,
        unclosed.indexOf("{{unfinished"),
        "card",
        2,
    );
});

test("diagnostics distinguish repeated markup and rebase light DOM children", () => {
    const repeated =
        '<f-when value="{{false}}"><f-when></f-when></f-when>\n' +
        '<f-repeat value="{{item in items}}">😀<f-when></f-when></f-repeat>';
    assertDiagnostic(
        () => wasm.render_with_templates(repeated, "{}", '{"items":[1]}'),
        "missing-value-attribute",
        repeated,
        repeated.lastIndexOf("<f-when>"),
        undefined,
        "<f-when>".length,
    );
    const source =
        '<code>{{example}}</code>\r\n<test-card data-x=">">\r😀<f-when></f-when></test-card>';
    for (const stream of [false, true]) {
        assertDiagnostic(
            () =>
                wasm.render_entry_with_templates(
                    source,
                    '{"test-card":""}',
                    "{}",
                    undefined,
                    stream,
                ),
            "missing-value-attribute",
            source,
            source.indexOf("<f-when>"),
            undefined,
            "<f-when>".length,
        );
    }
    const liveCodeElement = '<code>{{example}}<test-card data-demo="{x}"></code>';
    assertDiagnostic(
        () => wasm.render_with_templates(liveCodeElement, '{"test-card":""}'),
        "unclosed-directive",
        liveCodeElement,
        liveCodeElement.indexOf("<test-card"),
        undefined,
        '<test-card data-demo="{x}">'.length,
    );
});

test("validation diagnostics locate wrappers and publisher attributes in authored HTML", () => {
    const missingInner = '\r\n😀<f-template name="card"><div></div></f-template>';
    for (const action of [
        () => convert.convert_template(missingInner, "fast-v3-ts"),
        () => wasm.compose_f_template_styles(missingInner, ""),
    ]) {
        assertDiagnostic(
            action,
            "missing-inner-template",
            missingInner,
            missingInner.indexOf("<f-template"),
            "card",
            '<f-template name="card">'.length,
        );
    }
    const publisher =
        '\n😀<f-template name="card" data-extra="x">\n<template></template></f-template>';
    assertDiagnostic(
        () => convert.convert_template(publisher, "webui-framework-prerelease"),
        "unsupported-publisher-attribute",
        publisher,
        publisher.indexOf("<f-template"),
        "card",
        '<f-template name="card" data-extra="x">'.length,
    );
    const multiple =
        '<f-template name="card"><template></template>\r\n😀<template></template></f-template>';
    for (const action of [
        () => convert.convert_template(multiple, "fast-v3-ts"),
        () => wasm.compose_f_template_styles(multiple, ""),
    ]) {
        assertDiagnostic(
            action,
            "multiple-inner-templates",
            multiple,
            multiple.lastIndexOf("<template>"),
            "card",
            "<template>".length,
        );
    }
});

test("non-HTML diagnostics have codes without invented source coordinates", () => {
    assertDiagnostic(() => wasm.render("{{title}}", "{"), "invalid-state-json");
    assertDiagnostic(
        () => wasm.render_with_templates("", "[]"),
        "invalid-template-metadata",
    );
    assertDiagnostic(
        () => wasm.render_with_templates("", "{}", "{}", "invalid"),
        "invalid-attribute-name-strategy",
    );
    assertDiagnostic(
        () => convert.convert_template("<template></template>", "invalid"),
        "unsupported-syntax",
    );
    assertDiagnostic(
        () => convert.convert_stylesheet("", "fast-v3-ts", "not-valid"),
        "invalid-export-name",
    );
    assertDiagnostic(
        () => wasm.render_with_templates("", '{"card":{"formatVersion":99}}'),
        "invalid-template-metadata",
        undefined,
        undefined,
        "card",
    );
    assertDiagnostic(
        () => wasm.render_shadow_root("missing-card", "{}"),
        "missing-template",
        undefined,
        undefined,
        "missing-card",
    );
    assertDiagnostic(
        () => wasm.compose_f_template_styles("<template></template>", ""),
        "missing-f-template",
    );
    assertDiagnostic(
        () => wasm.compose_f_template_styles("", "</style>"),
        "unsafe-style-content",
        "</style>",
        0,
        undefined,
        "</style>".length,
    );
    assert.deepEqual(JSON.parse(wasm.parse_f_templates("<f-template>{{")), []);
});

test("null attributes are omitted, empty strings retained, and HTML booleans use presence", () => {
    assert.equal(
        wasm.render(
            '<a href="{{href}}" role="{{role}}"></a>',
            '{"href":null,"role":null}',
        ),
        "<a></a>",
    );
    assert.equal(
        wasm.render('<a href="{{href}}"></a>', '{"href":""}'),
        '<a href=""></a>',
    );
    assert.equal(
        wasm.render('<input disabled="{{enabled}}">', '{"enabled":false}'),
        "<input>",
    );
    assert.equal(
        wasm.render('<input disabled="{{enabled}}">', '{"enabled":true}'),
        "<input disabled>",
    );
});

test("typed conversion explicitly annotates template and stylesheet exports", () => {
    const source =
        '<f-template name="test-card"><template>{{title}}</template></f-template>';
    const output = convert.convert_template_with_options(
        source,
        "fast-v3-ts",
        "Card",
        "./card.js",
        true,
    ).output;
    assert.match(output, /import type \{ ElementViewTemplate \}/);
    assert.match(output, /export const template: ElementViewTemplate<Card> = html<Card>/);
    const css = convert.convert_stylesheet(
        ":host { display: block; }",
        "fast-v3-ts",
        "styles",
        true,
    );
    assert.match(css, /import type \{ ElementStyles \}/);
    assert.match(css, /export const styles: ElementStyles = css/);
    assert.throws(
        () =>
            convert.convert_template_with_options(
                source,
                "webui-prerelease",
                undefined,
                undefined,
                true,
            ),
        /typed.*fast-v3-ts/,
    );
});

test("shadow-only rendering returns the exact DSD fragment without a host or light DOM", () => {
    const templates = JSON.stringify({
        "test-card": {
            content: '<a href="{{href}}">{{title}}</a><nested-card></nested-card>',
            shadowrootAttributes: [{ name: "shadowrootdelegatesfocus", value: null }],
        },
        "nested-card": "{{title}}",
    });
    for (const markersV2 of [false, true]) {
        const state = '{"title":"Hello & goodbye","href":null}';
        const fragment = wasm.render_shadow_root(
            "test-card",
            templates,
            state,
            undefined,
            markersV2,
        );
        const whole = wasm.render_entry_with_templates(
            "<test-card><b>light</b></test-card>",
            templates,
            state,
            undefined,
            false,
            markersV2,
        );
        assert.equal(whole, `<test-card>${fragment}<b>light</b></test-card>`);
        assert.match(
            fragment,
            /^<template shadowrootmode="open" shadowroot="open" shadowrootdelegatesfocus>/,
        );
        assert.throws(
            () => wasm.render_shadow_root("missing-card", templates),
            /unknown template/,
        );
    }
});

test("parsed bindings expose paths and repeat scopes, versioned metadata rejects stale artifacts", () => {
    const [metadata] = JSON.parse(
        wasm.parse_f_templates(
            '<f-template name="test-card"><template title="{{title}}"><f-repeat value="{{item in items}}"><a href="{{item.url}}">{{title}} {{item.name}}</a></f-repeat><f-when value="{{visible && count > 0}}">{{title}}</f-when><code>{{example}}</code></template></f-template>',
        ),
    );
    assert.equal(metadata.formatVersion, 1);
    const repeat = metadata.bindings.find(binding => binding.kind === "repeat");
    assert.equal(repeat.name, "items");
    const item = metadata.bindings.find(binding => binding.name === "item.url");
    assert.deepEqual(item.scope, [{ variable: "item", iterable: "items" }]);
    assert.equal(item.optional, null);
    assert.equal(item.type, null);
    assert.ok(
        metadata.bindings.some(
            binding => binding.kind === "hostAttribute" && binding.name === "title",
        ),
    );
    assert.ok(
        metadata.bindings.some(
            binding =>
                binding.kind === "when" &&
                binding.paths.includes("visible") &&
                binding.paths.includes("count"),
        ),
    );
    assert.ok(!metadata.bindings.some(binding => binding.name === "example"));
    const templates = JSON.stringify({ "test-card": metadata });
    assert.ok(
        wasm
            .render_entry_with_templates(
                "<test-card></test-card>",
                templates,
                '{"title":"Hello","items":[],"visible":false}',
            )
            .includes("Hello"),
    );
    for (const formatVersion of [0, 2, null, "1", false, 1.5]) {
        const stale = JSON.stringify({ "test-card": { ...metadata, formatVersion } });
        for (const render of [
            () => wasm.render_entry_with_templates("<test-card></test-card>", stale),
            () =>
                wasm.render_entry_with_templates(
                    "<test-card></test-card>",
                    stale,
                    undefined,
                    undefined,
                    true,
                ),
            () => wasm.render_with_templates("<test-card></test-card>", stale),
            () => wasm.render_shadow_root("test-card", stale),
        ]) {
            assert.throws(render, /formatVersion/);
        }
    }
    assert.ok(
        wasm
            .render_entry_with_templates(
                "<test-card></test-card>",
                '{"test-card":"Hello"}',
            )
            .includes("Hello"),
    );
});

test("authored source spans locate duplicate bindings, attributes, and nested scopes", () => {
    const source =
        "🚀 Préface\r\n" +
        '<f-template name="first-card"><template title="{{ title }}">\r\n' +
        '  😀<p data-label="pré &amp; {{ title }}">{{ title }}</p>\r\n' +
        '  <code>😀é {{example}} <f-when value="{{ignored}}">sample</f-when></code>\r\n' +
        '  <f-repeat value="{{ item in items }}"><f-when value="{{ item.visible }}">\r\n' +
        '    <button @click="{ save(item.id) }">{{item.label}}</button>\r\n' +
        "  </f-when></f-repeat>\r\n" +
        "</template></f-template>\r\n" +
        '<f-template name="second-card"><template>{{ title }}</template></f-template>';
    const templates = JSON.parse(wasm.parse_f_templates(source));
    const bindings = templates.flatMap(template => template.bindings);
    assert.deepEqual(
        bindings.map(binding => binding.expression),
        [
            "title",
            "title",
            "title",
            "items",
            "item.visible",
            "save(item.id)",
            "item.label",
            "title",
        ],
    );
    const markers = [
        "{{ title }}",
        "{{ title }}",
        "{{ title }}",
        "{{ item in items }}",
        "{{ item.visible }}",
        "{ save(item.id) }",
        "{{item.label}}",
        "{{ title }}",
    ];
    let cursor = 0;
    for (const [index, binding] of bindings.entries()) {
        const marker = markers[index];
        const expectedStart =
            source.indexOf(marker, cursor) + marker.indexOf(binding.expression);
        const expectedEnd = expectedStart + binding.expression.length;
        const { start, end } = binding.span;
        assert.equal(start.offset, expectedStart);
        assert.equal(end.offset, expectedEnd);
        assert.equal(source.slice(start.offset, end.offset), binding.expression);
        for (const position of [start, end]) {
            const lines = source.slice(0, position.offset).split(/\r\n|\r|\n/);
            assert.equal(position.line, lines.length);
            assert.equal(position.column, lines.at(-1).length + 1);
        }
        cursor = expectedEnd;
    }
    assert.deepEqual(bindings[6].scope, [{ variable: "item", iterable: "items" }]);
    assert.equal(bindings[3].type, "array");
    assert.equal(templates[0].formatVersion, 1);
    const fragment = wasm.render_shadow_root(
        "second-card",
        JSON.stringify({ "second-card": templates[1] }),
        '{"title":"visible"}',
    );
    assert.ok(fragment.includes("visible"));
    const olderMetadata = structuredClone(templates[1]);
    for (const binding of olderMetadata.bindings) {
        delete binding.span;
    }
    assert.equal(
        wasm.render_shadow_root(
            "second-card",
            JSON.stringify({ "second-card": olderMetadata }),
            '{"title":"visible"}',
        ),
        fragment,
    );
});

test("authored source spans preserve multiline client expressions and raw entities", () => {
    const source =
        '<f-template name="test-card">\r<template>\n' +
        '😀<input :value={input.value} ?disabled="{{count &gt; 0}}" ' +
        'f-ref="{ inputElement }" @click="{\r\n save($e,\r item.id)\n }">' +
        "{{{ html }}}</template></f-template>";
    const [{ bindings }] = JSON.parse(wasm.parse_f_templates(source));
    assert.deepEqual(
        bindings.map(binding => binding.expression),
        ["input.value", "count &gt; 0", "inputElement", "save($e,\r item.id)", "html"],
    );
    for (const binding of bindings) {
        assert.equal(
            source.slice(binding.span.start.offset, binding.span.end.offset),
            binding.expression,
        );
        for (const position of [binding.span.start, binding.span.end]) {
            const lines = source.slice(0, position.offset).split(/\r\n|\r|\n/);
            assert.equal(position.line, lines.length);
            assert.equal(position.column, lines.at(-1).length + 1);
        }
    }
});

test("authored source spans are exposed by the generated WASM declarations", () => {
    const directory = fs.mkdtempSync(path.join(__dirname, ".plugin-types-"));
    try {
        const file = path.join(directory, "metadata.ts");
        fs.writeFileSync(
            file,
            `import type { FTemplateMetadata, TemplateSourceSpan, FastBuildError } from "../../wasm/microsoft_fast_build.js";
import type { FastBuildError as ConvertError } from "../../wasm/convert/microsoft_fast_convert.js";
import { compose_f_template_styles_with_options, type CompositionMapping, type CompositionSourceMap, type StylesheetCompositionOptions } from "../../wasm/microsoft_fast_build.js";
export function composition(html: string, options: StylesheetCompositionOptions): CompositionMapping {
    const result = compose_f_template_styles_with_options(html, options);
    const sourceMap: CompositionSourceMap = JSON.parse(result.source_map);
    const mapping: CompositionMapping = JSON.parse(result.map_span(0, sourceMap.insertionOffset));
    result.free();
    return mapping;
}
export function authoredExpression(source: string, template: FTemplateMetadata): string {
    const span: TemplateSourceSpan = template.bindings[0].span;
    const line: number = span.start.line;
    const column: number = span.end.column;
    return source.slice(span.start.offset, span.end.offset) + line + column;
}
export function diagnostic(error: FastBuildError | ConvertError): [
    Error, string, number | undefined, number | undefined, number | undefined, string | undefined
] {
    return [error, error.code, error.line, error.column, error.length, error.templateName];
}
`,
        );
        const program = typescript.createProgram([file], {
            module: typescript.ModuleKind.ESNext,
            moduleResolution: typescript.ModuleResolutionKind.Bundler,
            target: typescript.ScriptTarget.ESNext,
            strict: true,
            noEmit: true,
            types: [],
        });
        const diagnostics = typescript.getPreEmitDiagnostics(program);
        assert.equal(
            diagnostics.length,
            0,
            diagnostics
                .map(diagnostic =>
                    typescript.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
                )
                .join("\n"),
        );
    } finally {
        fs.rmSync(directory, { recursive: true, force: true });
    }
});

test("typed CLI/config output emits declarations with isolatedDeclarations and explicit false overrides", () => {
    const directory = fs.mkdtempSync(path.join(__dirname, ".plugin-types-"));
    const cli = path.resolve(__dirname, "../bin/fast.js");
    const source =
        '<f-template name="test-card"><template>{{title}}</template></f-template>';
    try {
        fs.writeFileSync(path.join(directory, "card.html"), source);
        fs.writeFileSync(
            path.join(directory, "card.ts"),
            "export interface Card { title: string; }\nexport interface ElementViewTemplate { title: string; }\nexport namespace Namespace { export interface Card { title: string; } }\n",
        );
        fs.writeFileSync(
            path.join(directory, "fast-convert.config.json"),
            JSON.stringify({
                syntax: "fast-v3-ts",
                templates: "card.html",
                typed: true,
                "type-source": "Card",
                "type-source-import": "./card.js",
            }),
        );
        execFileSync(process.execPath, [cli, "convert"], { cwd: directory });
        const template = path.join(directory, "card.template.ts");
        fs.writeFileSync(
            path.join(directory, "card.styles.ts"),
            convert.convert_stylesheet(
                ":host { display: block; }",
                "fast-v3-ts",
                "styles",
                true,
            ),
        );
        const variants = ["Namespace.Card", "ElementViewTemplate"].map((name, index) => {
            const file = path.join(directory, `variant-${index}.ts`);
            fs.writeFileSync(
                file,
                convert.convert_template_with_options(
                    source,
                    "fast-v3-ts",
                    name,
                    "./card.js",
                    true,
                ).output,
            );
            return file;
        });
        const collisionStyles = path.join(directory, "collision.styles.ts");
        fs.writeFileSync(
            collisionStyles,
            convert.convert_stylesheet("a {}", "fast-v3-ts", "ElementStyles", true),
        );
        const program = typescript.createProgram(
            [
                template,
                path.join(directory, "card.ts"),
                path.join(directory, "card.styles.ts"),
                collisionStyles,
                ...variants,
            ],
            {
                module: typescript.ModuleKind.ESNext,
                moduleResolution: typescript.ModuleResolutionKind.Bundler,
                target: typescript.ScriptTarget.ES2020,
                strict: true,
                skipLibCheck: true,
                types: [],
                declaration: true,
                emitDeclarationOnly: true,
                isolatedDeclarations: true,
            },
        );
        const diagnostics = [
            ...typescript.getPreEmitDiagnostics(program),
            ...program.emit().diagnostics,
        ];
        assert.equal(
            diagnostics.length,
            0,
            diagnostics
                .map(diagnostic =>
                    typescript.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
                )
                .join("\n"),
        );
        assert.match(
            fs.readFileSync(path.join(directory, "card.template.d.ts"), "utf8"),
            /template: ElementViewTemplate<Card>/,
        );
        assert.match(
            fs.readFileSync(path.join(directory, "card.styles.d.ts"), "utf8"),
            /styles: ElementStyles/,
        );
        execFileSync(process.execPath, [cli, "convert", "--typed=false", "--overwrite"], {
            cwd: directory,
        });
        assert.match(
            fs.readFileSync(template, "utf8"),
            /export const template = html<Card>/,
        );
        execFileSync(process.execPath, [cli, "convert", "--typed", "--overwrite"], {
            cwd: directory,
        });
        assert.match(
            fs.readFileSync(template, "utf8"),
            /template: ElementViewTemplate<Card>/,
        );
        const invalid = spawnSync(
            process.execPath,
            [cli, "convert", "--typed=bad", "--overwrite"],
            { cwd: directory, encoding: "utf8" },
        );
        assert.notEqual(invalid.status, 0);
        assert.match(invalid.stderr, /Invalid --typed/);
    } finally {
        fs.rmSync(directory, { recursive: true, force: true });
    }
});
