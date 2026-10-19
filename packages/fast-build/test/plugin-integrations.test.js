// @ts-check
const assert = require("node:assert/strict");
const { test } = require("node:test");
const wasm = require("../wasm/microsoft_fast_build.js");
const convert = require("../wasm/convert/microsoft_fast_convert.js");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync, spawnSync } = require("node:child_process");
const typescript = require("typescript");

const commentTemplate =
    '<f-template name="example-card"><template><p>{{before}}</p><!-- {{ignored}} --><p>{{value}}</p></template></f-template>';

test("HTML comments do not contribute parsed binding metadata", () => {
    const [metadata] = JSON.parse(wasm.parse_f_templates(commentTemplate));
    assert.deepEqual(
        metadata.bindings.map(({ name, kind, paths }) => ({ name, kind, paths })),
        [
            { name: "before", kind: "content", paths: ["before"] },
            { name: "value", kind: "content", paths: ["value"] },
        ],
    );
    assert.ok(metadata.content.includes("<!-- {{ignored}} -->"));
});

for (const markersV2 of [false, true]) {
    test(`HTML comments remain literal beside rendered bindings (markersV2=${markersV2})`, () => {
        const [metadata] = JSON.parse(wasm.parse_f_templates(commentTemplate));
        const state = JSON.stringify({
            before: "Before comment",
            ignored: "DO NOT INTERPOLATE",
            value: "After comment",
        });
        const baseline = wasm.render_entry_with_templates(
            "<example-card></example-card>",
            JSON.stringify({
                "example-card": "<p>{{before}}</p><p>{{value}}</p>",
            }),
            state,
            undefined,
            false,
            markersV2,
        );
        const expected = baseline.replace("</p><p>", "</p><!-- {{ignored}} --><p>");
        for (const stream of [false, true]) {
            const output = wasm.render_entry_with_templates(
                "<example-card></example-card>",
                JSON.stringify({ "example-card": metadata }),
                state,
                undefined,
                stream,
                markersV2,
            );
            const rendered = stream ? JSON.parse(output).join("") : output;
            assert.equal(rendered, expected);
            assert.ok(rendered.includes("Before comment"));
            assert.ok(rendered.includes("After comment"));
            assert.ok(!rendered.includes("DO NOT INTERPOLATE"));
        }
    });
}

test("HTML comments stay literal in conversion while adjacent bindings are converted", () => {
    const result = convert.convert_template_with_options(commentTemplate, "fast-v3-ts");
    try {
        assert.ok(
            result.output.includes(
                "<p>${x => x.before}</p><!-- {{ignored}} --><p>${x => x.value}</p>",
            ),
        );
        assert.ok(!result.output.includes("x.ignored"));
    } finally {
        result.free();
    }
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
