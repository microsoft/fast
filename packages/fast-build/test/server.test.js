const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");
const { pathToFileURL } = require("node:url");
const { createHash } = require("node:crypto");
const { compileServerModule } = require("../server.js");
const wasm = require("../wasm/microsoft_fast_build.js");

const runtime = pathToFileURL(require.resolve("../server-runtime.mjs")).href;
const baseline = require("./server-baseline.json");
const hash = value => createHash("sha256").update(value).digest("hex");

test("retired renderer APIs cannot be loaded from the compiler package", () => {
    assert.throws(
        () => require("@microsoft/fast-build/prepared.js"),
        error => error.code === "ERR_PACKAGE_PATH_NOT_EXPORTED",
    );
    for (const name of [
        "render",
        "render_with_templates",
        "render_entry_with_templates",
        "render_shadow_root",
        "PreparedCompiler",
        "PreparedPiece",
        "PreparedProgram",
        "prepared_compiler_id",
        "validate_prepared_request",
    ]) {
        assert.equal(Object.hasOwn(wasm, name), false, `${name} is retired`);
    }
});

async function compile(entry, templates = {}) {
    const source = compileServerModule(entry, templates, runtime);
    const module = await import(
        `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
    );
    return { source, module };
}

async function parity(entry, templates, states, options = {}) {
    const { module } = await compile(entry, templates);
    for (const state of states) {
        const key = hash(JSON.stringify([entry, templates, state, options]));
        assert.ok(Object.hasOwn(baseline, key), "missing historical output contract");
        assert.equal(hash(module.renderEntry(state, options)), baseline[key]);
    }
    return module;
}

test("AOT preserves text, attributes, scopes, child overlays and shadow metadata", async () => {
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

test("AOT lowers existing comparisons without JavaScript coercion changes", async () => {
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

test("AOT numeric comparisons preserve syntax without pathological backtracking", () => {
    execFileSync(
        process.execPath,
        [
            "--input-type=module",
            "-e",
            `
                import assert from "node:assert/strict";
                import { compare } from ${JSON.stringify(runtime)};
                for (const [input, value] of [
                    ["+1", 1], ["-1", -1], [".5", 0.5], ["-.5", -0.5],
                    ["1.", 1], ["1.e2", 100], ["1.5E+2", 150],
                    ["1e-2", 0.01], ["0001.50", 1.5], ["-0", 0],
                ]) {
                    assert.equal(compare(input, value, ">="), true, input);
                    assert.equal(compare(input, value, "<="), true, input);
                }
                for (const input of [".", "1..0", "1e", "1e+", "0x10", " 1", "1 "]) {
                    assert.equal(compare(input, 100, ">"), input > "100", input);
                    assert.equal(compare(input, 100, "<"), input < "100", input);
                }
                const invalid = "9".repeat(100_000) + "x";
                assert.equal(compare(invalid, "9", ">"), true);
                assert.equal(compare("9", invalid, "<"), true);
            `,
        ],
        { timeout: 2_000, stdio: "pipe" },
    );
});

test("AOT preserves number formatting, nullish omission and boolean attributes", async () => {
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

test("AOT compiles finite cyclic registries without expanding component graphs", async () => {
    await parity(
        "<cycle-a></cycle-a>",
        {
            "cycle-a": '<f-when value="{{expand}}"><cycle-b></cycle-b></f-when>',
            "cycle-b": '<f-when value="{{expand}}"><cycle-a></cycle-a></f-when>',
        },
        [{ expand: false }],
    );
});

test("AOT retains host default precedence and exact tag spelling rules", async () => {
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

test("AOT preserves alias shadowing, dotted aliases and primitive root overlays", async () => {
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

test("AOT host and shadow exports retain selection and request isolation", async () => {
    const { module } = await compile("", { "test-el": "{{value}}" });
    for (const value of ["first", "second", ""]) {
        assert.equal(
            module.renderHost("test-el", { value }),
            `<test-el><template shadowrootmode="open" shadowroot="open"><!--fe:b-->${value}<!--fe:/b--></template></test-el>`,
        );
        assert.equal(
            module.renderShadow("test-el", { value }),
            `<template shadowrootmode="open" shadowroot="open"><!--fe:b-->${value}<!--fe:/b--></template>`,
        );
    }
    assert.equal(module.renderShadow("test-el", {}, { dsd: [] }), "");
    assert.equal(module.renderHost("test-el", {}, { dsd: [] }), "<test-el></test-el>");
    assert.throws(() => module.renderHost("unknown"));
    assert.throws(() => module.renderShadow("unknown"));
    const repeated = await compile(
        '<f-repeat value="{{item in items}}">{{item}}</f-repeat>',
    );
    assert.equal(repeated.module.renderEntry({}), "");
    for (const items of [null, false, 1, "not-an-array", {}]) {
        assert.throws(
            () => repeated.module.renderEntry({ items }),
            error => error.code === "repeat-not-array",
        );
    }
});

test("compiled access plans preserve lexical precedence, indexes and root masking", async () => {
    const helper = await import(runtime);
    const [root] = helper.request({
        item: { part: { name: "root" } },
        items: [{ name: "array" }],
        $index: 7,
    });
    const access = helper.access(
        ["item", "part", "name"],
        [
            [1, 2],
            [2, 1],
        ],
    );
    const outer = helper.loop(null, 1);
    outer.value.value = { name: "outer" };
    outer.index.value = 3;
    const inner = helper.loop(outer, 2);
    inner.value.value = { part: null };
    inner.index.value = 4;
    assert.equal(access(root, null), "root");
    assert.equal(access(root, outer), "outer");
    assert.equal(access(root, inner), undefined);
    inner.value.value = { part: { name: "inner" } };
    assert.equal(access(root, inner), "inner");
    assert.equal(access(root, outer), "outer");
    assert.equal(helper.access(["$index"], [[0, 1]])(root, inner), 4);
    const indexAlias = helper.loop(inner, 0);
    indexAlias.value.value = "must be masked";
    indexAlias.index.value = 5;
    assert.equal(helper.access(["$index"], [[0, 1]])(root, indexAlias), 5);
    assert.equal(helper.access(["items", "+00", "name"], [])(root, inner), "array");
    assert.equal(helper.access(["items", "length"], [])(root, inner), 1);
    assert.equal(helper.access(["items", "length", "name"], [])(root, inner), undefined);
    const [arrayRoot] = helper.request([{ name: "array" }]);
    assert.equal(helper.access(["+00"], [])(arrayRoot, null), arrayRoot.values[0]);
    assert.equal(helper.access(["length"], [])(arrayRoot, null), 1);
    assert.equal(helper.access(["map"], [])(arrayRoot, null), undefined);
    const [ownNames] = helper.request(
        JSON.parse('{"constructor":"own","__proto__":"data"}'),
    );
    assert.equal(helper.access(["constructor"], [])(ownNames, null), "own");
    assert.equal(helper.access(["__proto__"], [])(ownNames, null), "data");
    const child = helper.child(root, [["item", null, null]]);
    assert.equal(access(child, null), undefined);
});

test("repeat frames are reused across items and omitted for empty data", async () => {
    const probe = `import * as helper from ${JSON.stringify(runtime)};
export * from ${JSON.stringify(runtime)};
export let frames = 0;
export function loop(...args) { frames++; return helper.loop(...args); }`;
    const probeUrl = `data:text/javascript;base64,${Buffer.from(probe).toString("base64")}`;
    const source = compileServerModule(
        '<f-repeat value="{{item in items}}">{{item}}</f-repeat>',
        {},
        probeUrl,
    );
    const module = await import(
        `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
    );
    assert.equal(module.renderEntry({}), "");
    assert.equal(module.renderEntry({ items: [] }), "");
    const measured = await import(probeUrl);
    assert.equal(measured.frames, 0);
    assert.equal(module.renderEntry({ items: [1, 2, 3] }), "123");
    assert.equal(measured.frames, 1);
    assert.equal(module.renderEntry({ items: [4, 5] }), "45");
    assert.equal(measured.frames, 2);
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
    const plain = module.renderEntry(state);
    assert.equal(
        plain,
        'root/9;one/0;<test-child><template shadowrootmode="open" shadowroot="open"><!--fe:b-->one<!--fe:/b-->/<!--fe:b-->root<!--fe:/b-->/<!--fe:b-->9<!--fe:/b--></template>one/0</test-child>two/1;<test-child><template shadowrootmode="open" shadowroot="open"><!--fe:b-->two<!--fe:/b-->/<!--fe:b-->root<!--fe:/b-->/<!--fe:b-->9<!--fe:/b--></template>two/1</test-child>root/9',
    );
    assert.equal(module.renderEntry(state), plain);
    assert.equal(
        module.renderEntry(state, { dsd: [] }),
        'root/9;one/0;<test-child :name="one">one/0</test-child>two/1;<test-child :name="two">two/1</test-child>root/9',
    );
    const { module: proto } = await compile(
        '<f-repeat value="{{__proto__ in items}}">{{__proto__.name}}</f-repeat>',
    );
    assert.equal(proto.renderEntry({ items: [{ name: "safe" }] }), "safe");
});

test("AOT preserves the distinct template-context root host attribute contract", async () => {
    const { module } = await compile('<test-el list="{{items}}"></test-el>', {
        "test-el": "{{list}}",
    });
    const shadow =
        '<template shadowrootmode="open" shadowroot="open"><!--fe:b-->[Array]<!--fe:/b--></template>';
    assert.equal(
        module.renderEntry({ items: ["one", "two"] }),
        `<test-el>${shadow}</test-el>`,
    );
    assert.equal(
        module.renderTemplate({ items: ["one", "two"] }),
        `<test-el list="[Array]">${shadow}</test-el>`,
    );
});

test("AOT rejects unsupported state without invoking getters or toJSON", async () => {
    const { module } = await compile("{{value}}");
    let invoked = false;
    const getter = {
        get value() {
            invoked = true;
            return "getter";
        },
    };
    const cycle = {};
    cycle.self = cycle;
    class ArraySubclass extends Array {}
    for (const state of [
        { value: undefined },
        { value: NaN },
        { value: Infinity },
        { value: 1n },
        { value: new Date() },
        { value: () => "" },
        { value: Array(2) },
        { value: new ArraySubclass(1, 2) },
        { value: "\uD800" },
        getter,
        cycle,
        {
            toJSON() {
                invoked = true;
                return {};
            },
        },
        Object.create({ inherited: true }),
        { [Symbol("key")]: 1 },
    ]) {
        assert.throws(() => module.renderEntry(state), TypeError);
        assert.throws(() => module.prepareState(state), TypeError);
    }
    assert.equal(invoked, false);
    assert.equal(module.renderEntry({ value: "safe" }), "safe");
    const frozen = Object.freeze({ value: -0 });
    assert.equal(module.renderEntry(frozen), "0");
    assert.ok(Object.is(frozen.value, -0));
    for (const options of [
        { dsd: [1] },
        { markersV2: "yes" },
        { attributeNameStrategy: "bad" },
    ]) {
        assert.throws(() => module.renderEntry({}, options), TypeError);
    }
});

test("prepared snapshots isolate nested input and work across modules and render targets", async () => {
    const { module } = await compile(
        '<test-el data-name="{{label}}">{{label}}</test-el>',
        {
            "test-el": {
                content:
                    '{{label}}/{{value}}/{{dataset.inherited}}<f-repeat value="{{item in items}}">{{item.name}}/{{$index}};</f-repeat><test-child :item="{{item}}"></test-child>',
                hostAttributes: [{ name: "title", value: "{{label}}" }],
            },
            "test-child": "{{item.name}}/{{label}}",
        },
    );
    const state = {
        label: "before & text",
        value: -0,
        dataset: { inherited: "root" },
        item: { name: "child" },
        items: [{ name: "first" }, { name: "second" }],
    };
    const methods = ["renderEntry", "renderTemplate", "renderHost", "renderShadow"];
    const snapshots = [];
    for (const markersV2 of [false, true]) {
        for (const attributeNameStrategy of ["none", "camelCase"]) {
            for (const dsd of [undefined, [], ["test-el"]]) {
                const options = { markersV2, attributeNameStrategy, dsd };
                for (const method of methods) {
                    const args =
                        method === "renderHost" || method === "renderShadow"
                            ? ["test-el"]
                            : [];
                    snapshots.push({
                        method,
                        args,
                        options,
                        expected: module[method](...args, state, options),
                    });
                }
            }
        }
    }
    const prepared = module.prepareState(state);
    state.label = "changed";
    state.dataset.inherited = "changed";
    state.item.name = "changed";
    state.items.push({ name: "third" });
    Object.defineProperty(state.items[0], "name", {
        get() {
            throw new Error("getter must not be invoked");
        },
    });
    for (const { method, args, options, expected } of snapshots) {
        assert.equal(module[`${method}Prepared`](...args, prepared, options), expected);
    }
    assert.throws(() => module.renderEntry(state), TypeError);
    const { module: other } = await compile("<aside>{{label}}</aside>");
    assert.equal(other.renderEntryPrepared(prepared), "<aside>before &amp; text</aside>");
    assert.equal(
        other.renderEntryPrepared(other.prepareState({ label: "new" })),
        "<aside>new</aside>",
    );
    assert.equal(other.renderEntryPrepared(prepared), "<aside>before &amp; text</aside>");
});

test("prepared methods reject forged or foreign handles and validate options each call", async () => {
    const { module } = await compile("{{value}}/{{items.0}}/{{zero}}");
    const state = { value: "kept", items: ["nested"], zero: -0 };
    const prepared = module.prepareState(state);
    const helper = await import(runtime);
    const [{ values }] = helper.preparedRequest(prepared);
    assert.throws(
        () => Object.defineProperty(values.items, "0", { value: "changed" }),
        TypeError,
    );
    assert.throws(() => Object.setPrototypeOf(values, { value: "changed" }), TypeError);
    assert.equal(Object.is(values.zero, -0), false);
    const foreign = await import(
        `data:text/javascript;base64,${Buffer.from(fs.readFileSync(require.resolve("../server-runtime.mjs"))).toString("base64")}`
    );
    for (const fake of [
        undefined,
        null,
        {},
        state,
        { ...prepared },
        Object.create(Object.getPrototypeOf(prepared)),
        new Proxy(prepared, {}),
        foreign.prepareState(state),
    ]) {
        assert.throws(() => module.renderEntryPrepared(fake), TypeError);
    }
    assert.throws(() => module.renderEntry(prepared), TypeError);
    for (const options of [
        { dsd: [1] },
        { markersV2: "yes" },
        { attributeNameStrategy: "bad" },
    ]) {
        assert.throws(() => module.renderEntryPrepared(prepared, options), TypeError);
    }
    for (const value of [null, false, "string", 3, [-0], { value: -0 }, {}]) {
        assert.equal(
            module.renderEntryPrepared(module.prepareState(value)),
            module.renderEntry(value),
        );
    }
    assert.equal(module.renderEntryPrepared(prepared), "kept/nested/0");
    assert.equal(module.renderEntryPrepared(module.prepareState()), "//");
});

test("dataset overlays never mutate explicitly bound objects, including prepared state", async () => {
    for (const attrs of [
        ':dataset="{{dataset}}" data-x="local" data-y="second"',
        'data-x="overridden" :dataset="{{dataset}}" data-y="second"',
    ]) {
        const { module } = await compile(`<test-el ${attrs}></test-el>`, {
            "test-el": "{{dataset.x}}/{{dataset.y}}/{{dataset.kept}}",
        });
        const state = { dataset: { x: "original", kept: "kept" } };
        const plain = module.renderEntry(state);
        assert.deepEqual(state.dataset, { x: "original", kept: "kept" });
        assert.equal(module.renderEntryPrepared(module.prepareState(state)), plain);
        assert.deepEqual(state.dataset, { x: "original", kept: "kept" });
    }
});

test("server module types distinguish prepared handles from ordinary state", () => {
    const ts = require("typescript");
    const directory = fs.mkdtempSync(path.join(__dirname, "server-types-"));
    try {
        const filename = path.join(directory, "consumer.mts");
        fs.writeFileSync(
            filename,
            `
import type { ServerModule, PreparedServerState } from "../../server.js";
declare const server: ServerModule;
const state: PreparedServerState = server.prepareState({ value: -0 });
const html: string = server.renderEntryPrepared(state);
server.renderTemplatePrepared(state);
server.renderHostPrepared("test-el", state);
server.renderShadowPrepared("test-el", state, { markersV2: true });
// @ts-expect-error Ordinary data cannot bypass validation.
server.renderEntryPrepared({});
// @ts-expect-error A handle is not ordinary JSON-shaped state.
server.renderEntry(state);
// @ts-expect-error The opaque brand cannot be forged structurally.
const fake: PreparedServerState = {};
`,
        );
        const program = ts.createProgram([filename], {
            target: ts.ScriptTarget.ESNext,
            module: ts.ModuleKind.NodeNext,
            moduleResolution: ts.ModuleResolutionKind.NodeNext,
            strict: true,
            noEmit: true,
            types: [],
        });
        const diagnostics = ts.getPreEmitDiagnostics(program);
        assert.equal(
            diagnostics.length,
            0,
            ts.formatDiagnosticsWithColorAndContext(diagnostics, {
                getCurrentDirectory: () => directory,
                getCanonicalFileName: filename => filename,
                getNewLine: () => "\n",
            }),
        );
    } finally {
        fs.rmSync(directory, { recursive: true, force: true });
    }
});

test("server-js CLI links all definitions and preserves browser conversion separately", async () => {
    const directory = fs.mkdtempSync(path.join(__dirname, "server-cli-"));
    try {
        const input = path.join(directory, "templates.html");
        const output = path.join(directory, "server.mjs");
        fs.writeFileSync(
            input,
            `<f-template name="test-parent"><template><test-child></test-child></template></f-template>
<f-template name="test-child"><template>{{label}}</template></f-template>`,
        );
        const cli = path.resolve(__dirname, "../bin/fast.js");
        const args = [
            cli,
            "convert",
            "--syntax=server-js",
            `--templates=${input}`,
            `--output=${output}`,
        ];
        execFileSync(process.execPath, args);
        const module = await import(pathToFileURL(output).href);
        assert.match(module.renderHost("test-parent", { label: "linked" }), /linked/);
        assert.throws(() => execFileSync(process.execPath, args, { stdio: "pipe" }));
        execFileSync(process.execPath, [...args, "--overwrite"]);
        fs.writeFileSync(
            input,
            '<f-template name="test-child"><template>{{label}}</template></f-template>',
        );
        const browser = path.join(directory, "browser.ts");
        execFileSync(process.execPath, [
            cli,
            "convert",
            "--syntax=fast-v3-ts",
            `--templates=${input}`,
            `--output=${browser}`,
        ]);
        assert.match(fs.readFileSync(browser, "utf8"), /@microsoft\/fast-element/);
    } finally {
        fs.rmSync(directory, { recursive: true, force: true });
    }
});

test("AOT diagnoses invalid skipped bodies at their authored location", () => {
    assert.throws(
        () =>
            compileServerModule("", {
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

test("AOT executes in a fresh process with WASM and template parsing disabled", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "fast-server-"));
    try {
        const filename = path.join(directory, "server.mjs");
        fs.writeFileSync(
            filename,
            compileServerModule(
                "<test-el></test-el>",
                {
                    "test-el": '<f-repeat value="{{item in items}}">{{item}}</f-repeat>',
                },
                runtime,
            ),
        );
        const script = `
            WebAssembly.compile = WebAssembly.instantiate = () => { throw new Error("WASM used"); };
            JSON.parse = () => { throw new Error("JSON parsing used"); };
            const module = await import(${JSON.stringify(pathToFileURL(filename).href)});
            const state = {items:["one","two"]};
            const html = module.renderEntry(state);
            if (module.renderEntryPrepared(module.prepareState(state)) !== html) {
                throw new Error("Prepared output differs");
            }
            process.stdout.write(html);
        `;
        assert.match(
            execFileSync(process.execPath, ["--input-type=module", "-e", script], {
                encoding: "utf8",
            }),
            /one.*two/,
        );
        const source = fs.readFileSync(filename, "utf8");
        assert.doesNotMatch(
            source,
            /\beval\b|new Function|WebAssembly|JSON\.parse|PreparedProgram/,
        );
        assert.equal((source.match(/\bimport\b/g) || []).length, 1);
        assert.doesNotMatch(
            fs.readFileSync(require.resolve("../server-runtime.mjs"), "utf8"),
            /\bimport\b|\brequire\b|\beval\b|new Function|WebAssembly|JSON\.parse/,
        );
    } finally {
        fs.rmSync(directory, { recursive: true, force: true });
    }
});

test("AOT rejects a mismatched helper contract on module import", async () => {
    for (const version of [0, 2]) {
        const helper = `data:text/javascript,export const runtimeVersion = ${version};`;
        const source = compileServerModule("static", {}, helper);
        await assert.rejects(
            import(
                `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
            ),
            /Incompatible FAST server runtime/,
        );
    }
});

test("AOT preserves every authored declarative fixture byte for byte", async () => {
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
