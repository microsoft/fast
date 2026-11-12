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
            process.stdout.write(module.renderEntry({items:["one","two"]}));
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
    const helper = "data:text/javascript,export const runtimeVersion = 0;";
    const source = compileServerModule("static", {}, helper);
    await assert.rejects(
        import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`),
        /Incompatible FAST server runtime/,
    );
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
