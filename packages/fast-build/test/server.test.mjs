import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { loadNativeHost } from "../native-host.mjs";
import { compileServerArtifact } from "../server.js";
import wasm from "../wasm/microsoft_fast_build.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const baseline = JSON.parse(
    fs.readFileSync(new URL("./server-baseline.json", import.meta.url), "utf8"),
);
const contextBaseline = JSON.parse(
    fs.readFileSync(
        new URL("./server-json-context-baseline.json", import.meta.url),
        "utf8",
    ),
);
const hash = value => createHash("sha256").update(value).digest("hex");
const NativeProgram = loadNativeHost(process.env.FAST_NATIVE_ADDON);
function renderFixture(artifact, context, state = {}, options, name, json = false) {
    const program = new NativeProgram(artifact, options);
    const input = Buffer.from(json ? state : JSON.stringify(state), "utf8");
    const method = "render" + context + "Json";
    return (
        context === "Host" || context === "Shadow"
            ? program[method](name, input)
            : program[method](input)
    ).toString("utf8");
}
async function compile(entry, templates = {}) {
    return { module: Buffer.from(compileServerArtifact(entry, templates)) };
}
async function parity(entry, templates, states, options = {}) {
    const { module } = await compile(entry, templates);
    for (const state of states) {
        const key = hash(JSON.stringify([entry, templates, state, options]));
        assert.ok(Object.hasOwn(baseline, key), "missing frozen output contract");
        assert.equal(hash(renderFixture(module, "Entry", state, options)), baseline[key]);
    }
    return module;
}
test("Native preserves text, attributes, scopes, child overlays and shadow metadata", async () => {
    const templates = {
        "test-parent": {
            content: `<style>:host { color: red } /* {{literal}} */</style>
<f-when value="{{show}}"><p title='prefix {{label}} "suffix"' :value="{label}" f-ref="{node}">{{label}}</p></f-when>
<f-repeat value="{{item in items}}"><test-child :item="{{item}}" data-x="{{item.name}}" aria-label="item" foo-bar="custom">{{item.name}}:{{$index}}</test-child></f-repeat>
<test-child :item="{{missing}}" ?disabled="{{show}}"></test-child>
<slot>Fallback</slot><code>{{literal}}</code>{{object}}{{items}}{{{raw}}}`,
            shadowrootAttributes: [
                { name: "shadowrootmode", value: "open" },
                { name: "shadowrootdelegatesfocus", value: null },
            ],
            hostAttributes: [
                { name: "title", value: "{{label}}" },
                { name: "?hidden", value: "{{!show}}" },
            ],
        },
        "test-child": {
            content:
                "<i>{{item.name}}/{{dataset.x}}/{{dataset.inherited}}/{{ariaLabel}}/{{fooBar}}/{{foo-bar}}</i>",
            hostAttributes: [
                { name: "role", value: "group" },
                { name: "title", value: "prefix {{label}}" },
            ],
        },
    };
    const entry =
        '<main title="{{label}}"><test-parent title="{{missing}}" :object="{{object}}"></test-parent></main>';
    const states = [
        {
            show: true,
            label: `& < > " '`,
            items: [{ name: "one" }, { name: "two" }],
            object: { name: "object" },
            raw: "<strong>raw</strong>",
            dataset: { inherited: "yes" },
        },
        { show: false, label: "", items: [], object: null, raw: "" },
        { items: [null, {}, false, 0] },
    ];
    for (const markersV2 of [false, true]) {
        for (const attributeNameStrategy of ["none", "camelCase"]) {
            for (const dsd of [undefined, [], ["test-child"]]) {
                await parity(entry, templates, states, {
                    markersV2,
                    attributeNameStrategy,
                    dsd,
                });
            }
        }
    }
});
test("Native lowers existing comparisons without JavaScript coercion changes", async () => {
    const expressions = [
        "a == b",
        "a != b",
        "a > b",
        "a < b",
        "a >= b",
        "a <= b",
        "a == 'true'",
        "a == '01'",
        "a && b || !c",
        "missing >= alsoMissing",
    ];
    const body = expressions
        .map((expression, index) => `<f-when value="{{${expression}}}">${index}</f-when>`)
        .join("");
    const values = [
        null,
        false,
        true,
        0,
        1,
        -1,
        "",
        "01",
        "true",
        [],
        {},
        "\u{1F600}",
        "\uE000",
        "NaN",
        "inf",
        "Infinity",
        " 1",
        "1e400",
    ];
    const states = values.flatMap(a => values.map(b => ({ a, b })));
    await parity("<test-el></test-el>", { "test-el": body }, states);
});
test("Native preserves number formatting, nullish omission and boolean attributes", async () => {
    const body = `<input disabled="{{value}}" title="before {{value}} after" ?hidden="{{value}}">
{{value}}<test-child :value="{{value}}"></test-child>`;
    const templates = {
        "test-el": body,
        "test-child": {
            content: "{{value}}",
            hostAttributes: [{ name: "title", value: "{{value}}" }],
        },
        "test-static": {
            content: "{{item.value}}",
            hostAttributes: [{ name: "title", value: "{{item.value}}" }],
        },
    };
    const values = [
        null,
        false,
        true,
        "",
        `a"b'c&d<e>`,
        [],
        {},
        0,
        -0,
        1e-7,
        1e21,
        1e30,
        1e-30,
        Number.MIN_VALUE,
        Number.MAX_VALUE,
        1000000000000000100,
    ];
    await parity(
        '<test-el value="{{value}}"></test-el><test-static :item=\'{"value":-0}\'></test-static>',
        templates,
        values.map(value => ({ value })),
    );
});
test("Native compiles finite cyclic registries without expanding component graphs", async () => {
    await parity(
        "<cycle-a></cycle-a>",
        {
            "cycle-a": '<f-when value="{{expand}}"><cycle-b></cycle-b></f-when>',
            "cycle-b": '<f-when value="{{expand}}"><cycle-a></cycle-a></f-when>',
        },
        [{ expand: false }],
    );
});
test("Native retains host default precedence and exact tag spelling rules", async () => {
    const templates = {
        "test-parent": `<test-child :value="{{value}}" title="{{missing}}" ?hidden="{{value}}" />
<test-child @click="{handle}" f-ref="{node}" data-fe="author"></test-child>
<test-child title='static &amp; text'></test-child>
<test-child dataset='{"inherited":"literal"}' data-name="local"></test-child>`,
        "test-child": {
            content: "{{dataset.inherited}}/{{dataset.name}}",
            hostAttributes: [
                { name: "title", value: "default" },
                { name: "?hidden", value: "{{value}}" },
                { name: "data-fe", value: "default" },
                { name: "data-fe-b-0", value: "indexed" },
                { name: "data-fe-c-0-3", value: "indexed-count" },
            ],
        },
    };
    for (const markersV2 of [false, true]) {
        await parity(
            '<test-parent></test-parent><test-child :value="{{value}}" ?static ?label="literal" ?mixed="prefix {{value}}"></test-child><test-child :value=\'{"negative":-0}\'></test-child>',
            templates,
            [{ value: true }, { value: false }, { value: null }],
            { markersV2 },
        );
    }
});
test("Native preserves alias shadowing, dotted aliases and primitive root overlays", async () => {
    const entry = `<test-parent title="{{0.name}}"></test-parent>`;
    const templates = {
        "test-parent": `<f-repeat value="{{item.part in items}}">{{item.part.name}}/{{$index}}
<f-repeat value="{{item in item.part.children}}">{{item.name}}/{{item.part.name}}/{{$index}}</f-repeat>
</f-repeat><test-child fixed="local"></test-child>`,
        "test-child": "{{fixed}}/{{inherited}}/{{0.name}}",
    };
    await parity(entry, templates, [
        {
            inherited: "root",
            items: [{ name: "outer", children: [{ name: "inner" }, {}] }],
        },
        [{ name: "array-root" }],
        "string-root",
        null,
    ]);
});
test("Native host and shadow exports retain selection and request isolation", async () => {
    const { module } = await compile("", { "test-el": "{{value}}" });
    for (const value of ["first", "second", ""]) {
        assert.equal(
            renderFixture(module, "Host", { value }, undefined, "test-el"),
            `<test-el><template shadowrootmode="open"><!--fe:b-->${value}<!--fe:/b--></template></test-el>`,
        );
        assert.equal(
            renderFixture(module, "Shadow", { value }, undefined, "test-el"),
            `<template shadowrootmode="open"><!--fe:b-->${value}<!--fe:/b--></template>`,
        );
    }
    assert.equal(renderFixture(module, "Shadow", {}, { dsd: [] }, "test-el"), "");
    assert.equal(
        renderFixture(module, "Host", {}, { dsd: [] }, "test-el"),
        "<test-el></test-el>",
    );
    assert.throws(() => renderFixture(module, "Host", undefined, undefined, "unknown"));
    assert.throws(() => renderFixture(module, "Shadow", undefined, undefined, "unknown"));
    const repeated = await compile(
        '<f-repeat value="{{item in items}}">{{item}}</f-repeat>',
    );
    assert.equal(renderFixture(repeated.module, "Entry", {}), "");
    for (const items of [null, false, 1, "not-an-array", {}]) {
        assert.throws(
            () => renderFixture(repeated.module, "Entry", { items }),
            error => error.code === "repeat-not-array",
        );
    }
});
test("shared bodies and component shadows do not capture repeat scopes", async () => {
    const { module } = await compile(
        '{{item.name}}/{{$index}};<f-repeat value="{{item in items}}">{{item.name}}/{{$index}};<test-child :name="{{item.name}}">{{item.name}}/{{$index}}</test-child></f-repeat>{{item.name}}/{{$index}}',
        { "test-child": "{{name}}/{{item.name}}/{{$index}}" },
    );
    const state = {
        item: { name: "root" },
        $index: 9,
        items: [{ name: "one" }, { name: "two" }],
    };
    const plain = renderFixture(module, "Entry", state);
    assert.equal(
        plain,
        'root/9;one/0;<test-child><template shadowrootmode="open"><!--fe:b-->one<!--fe:/b-->/<!--fe:b-->root<!--fe:/b-->/<!--fe:b-->9<!--fe:/b--></template>one/0</test-child>two/1;<test-child><template shadowrootmode="open"><!--fe:b-->two<!--fe:/b-->/<!--fe:b-->root<!--fe:/b-->/<!--fe:b-->9<!--fe:/b--></template>two/1</test-child>root/9',
    );
    assert.equal(renderFixture(module, "Entry", state), plain);
    assert.equal(
        renderFixture(module, "Entry", state, { dsd: [] }),
        'root/9;one/0;<test-child :name="one">one/0</test-child>two/1;<test-child :name="two">two/1</test-child>root/9',
    );
    const { module: proto } = await compile(
        '<f-repeat value="{{__proto__ in items}}">{{__proto__.name}}</f-repeat>',
    );
    assert.equal(renderFixture(proto, "Entry", { items: [{ name: "safe" }] }), "safe");
});
test("Native preserves the distinct template-context root host attribute contract", async () => {
    const { module } = await compile('<test-el list="{{items}}"></test-el>', {
        "test-el": "{{list}}",
    });
    const shadow =
        '<template shadowrootmode="open"><!--fe:b-->[Array]<!--fe:/b--></template>';
    assert.equal(
        renderFixture(module, "Entry", { items: ["one", "two"] }),
        `<test-el>${shadow}</test-el>`,
    );
    assert.equal(
        renderFixture(module, "Template", { items: ["one", "two"] }),
        `<test-el list="[Array]">${shadow}</test-el>`,
    );
});
test("component recipes preserve grouped replacement, missing masks and special keys", async () => {
    const { module } = await compile(
        '<recipe-card data-first="before" :dataset="{{replacement}}" data-y="after" :value="{{missing}}" :__proto__="{{payload}}" :constructor="{{payload}}"></recipe-card><i title="{{dataset.x}}/{{dataset.kept}}"></i>',
        {
            "recipe-card": {
                content:
                    '<p title="{{dataset.x}}/{{dataset.y}}/{{dataset.kept}}" data-proto="{{__proto__.name}}" data-constructor="{{constructor.name}}" data-value="{{value}}"></p>',
                hostAttributes: [{ name: "data-value", value: "{{value}}" }],
            },
        },
    );
    for (const replacement of [{ x: "replacement", kept: "fresh" }, null, false, []]) {
        const state = {
            dataset: { x: "original", kept: "parent" },
            replacement,
            value: "outer",
            payload: { name: "own" },
        };
        const before = JSON.stringify(state);
        for (const attributeNameStrategy of ["camelCase", "none"]) {
            for (const markersV2 of [false, true]) {
                const options = { attributeNameStrategy, markersV2 };
                const html = renderFixture(module, "Entry", state, options);
                if (replacement && !Array.isArray(replacement)) {
                    assert.match(html, /title="replacement\/after\/fresh"/);
                } else {
                    assert.doesNotMatch(
                        html.slice(0, html.indexOf("</recipe-card>")),
                        /title=/,
                    );
                }
                assert.match(html, /data-proto="own" data-constructor="own"/);
                assert.doesNotMatch(html, /data-value=/);
                assert.ok(html.endsWith('<i title="original/parent"></i>'));
                assert.equal(JSON.stringify(state), before);
            }
        }
    }
});
test("semantic recipe operands remain fresh, including own special literal keys", async () => {
    const source = compileServerArtifact(
        '<recipe-card :payload=\'{"__proto__":{"name":"own"},"constructor":"ctor","items":[{"name":"fresh"}]}\'></recipe-card>',
        {
            "recipe-card":
                "{{payload.__proto__.name}}/{{payload.constructor}}/{{payload.items.0.name}}",
        },
    );
    const bytes = Buffer.from(source);
    const program = new NativeProgram(bytes);
    const expected = program.renderEntryJson(Buffer.from("{}")).toString("utf8");
    assert.ok(
        expected.endsWith(
            "<!--fe:b-->own<!--fe:/b-->/<!--fe:b-->ctor<!--fe:/b-->/" +
                "<!--fe:b-->fresh<!--fe:/b--></template></recipe-card>",
        ),
    );
    bytes.fill(0);
    assert.equal(
        program
            .renderEntryJson(Buffer.from('{"payload":{"items":["changed"]}}'))
            .toString("utf8"),
        expected,
    );
});
test("Native diagnoses invalid skipped bodies at their authored location", () => {
    assert.throws(
        () =>
            compileServerArtifact("", {
                "test-el":
                    '<code>{{sample}}</code>\n<f-when value="{{false}}">{{}}</f-when>',
            }),
        error =>
            error.code === "empty-binding" &&
            error.templateName === "test-el" &&
            error.line === 2 &&
            error.column > 1,
    );
});
test("Native preserves every authored declarative fixture byte for byte", async () => {
    const root = path.resolve(__dirname, "../../fast-element/test/declarative/fixtures");
    const configs = fs
        .readdirSync(root, { recursive: true })
        .filter(file => path.basename(file) === "fast-build.config.json");
    for (const filename of configs) {
        const directory = path.dirname(path.join(root, filename));
        const config = JSON.parse(fs.readFileSync(path.join(root, filename), "utf8"));
        const templates = Object.fromEntries(
            JSON.parse(
                wasm.parse_f_templates(
                    fs.readFileSync(path.join(directory, "templates.html"), "utf8"),
                ),
            )
                .filter(template => template.name)
                .map(({ name, ...metadata }) => [name, metadata]),
        );
        const entry = fs.readFileSync(
            path.resolve(directory, config.entry || "entry.html"),
            "utf8",
        );
        const state = config.state
            ? JSON.parse(fs.readFileSync(path.resolve(directory, config.state), "utf8"))
            : {};
        for (const markersV2 of [false, true]) {
            await parity(entry, templates, [state], {
                markersV2,
                attributeNameStrategy: config["attribute-name-strategy"],
            });
        }
    }
});
test("native JSON rendering preserves frozen output in all contexts and configurations", () => {
    const artifact = Buffer.from(
        compileServerArtifact(
            '<json-parent :payload="{{payload}}">{{label}}</json-parent>',
            {
                "json-parent": {
                    content:
                        '{{label}}/{{payload.value}}<f-repeat value="{{item in payload.items}}"><json-child :item="{{item}}" data-x="{{item.name}}">{{item.name}}/{{$index}}</json-child></f-repeat>{{{raw}}}',
                    hostAttributes: [{ name: "title", value: "{{label}}" }],
                },
                "json-child": "{{item.name}}/{{dataset.x}}",
            },
        ),
    );
    for (const json of [
        '{"label":"< & \\uD83D\\uDE00","payload":{"value":-0,"items":[{"name":"one"},{"name":"two"}]},"raw":"<i>raw</i>"}',
        '{"label":null,"payload":{"value":null,"items":[]}}',
        '{"payload":{"items":[null,{},false,0]}}',
    ]) {
        for (const markersV2 of [false, true]) {
            for (const attributeNameStrategy of ["none", "camelCase"]) {
                for (const dsd of [undefined, [], ["json-child"]]) {
                    const options = { markersV2, attributeNameStrategy, dsd };
                    const program = new NativeProgram(artifact, options);
                    for (const context of ["Entry", "Template", "Host", "Shadow"]) {
                        const name = "render" + context;
                        const bytes =
                            context === "Host" || context === "Shadow"
                                ? program[name + "Json"]("json-parent", Buffer.from(json))
                                : program[name + "Json"](Buffer.from(json));
                        assert.equal(
                            hash(bytes),
                            contextBaseline[JSON.stringify([json, options, name])],
                        );
                    }
                }
            }
        }
    }
});
