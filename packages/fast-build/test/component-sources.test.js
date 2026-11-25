const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const {
    resolveComponentSources,
    validateComponentSources,
} = require("../component-sources.js");

function fixture(t) {
    const directory = fs.realpathSync(
        fs.mkdtempSync(path.join(__dirname, ".components-")),
    );
    t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
    const component = {
        tagName: "my-card",
        template: "./src/card.html",
        stylesheet: "./src/card.css",
        clientModule: "./src/card.ts",
        className: "MyCard",
        generated: "./src/generated/",
    };
    fs.writeFileSync(path.join(directory, "package.json"), '{"type":"module"}');
    fs.mkdirSync(path.join(directory, "src"));
    fs.writeFileSync(
        path.join(directory, component.template),
        '<f-template name="my-card"><template><h2>{{title}}</h2></template></f-template>',
    );
    fs.writeFileSync(
        path.join(directory, component.stylesheet),
        ":host { display: block; }",
    );
    fs.writeFileSync(
        path.join(directory, component.clientModule),
        'throw new Error("Client modules must not be evaluated"); export class MyCard { title = ""; }',
    );
    fs.writeFileSync(path.join(directory, "index.html"), "<my-card></my-card>");
    fs.writeFileSync(path.join(directory, "state.json"), '{"title":"Hello"}');
    return { directory, component };
}

function cli(directory, command, config, args = []) {
    const filename = path.join(directory, `fast-${command}.config.json`);
    fs.writeFileSync(filename, JSON.stringify(config));
    return spawnSync(
        process.execPath,
        [
            path.resolve(__dirname, "../bin/fast.js"),
            command,
            `--config=${filename}`,
            ...args,
        ],
        { cwd: __dirname, env: process.env, encoding: "utf8" },
    );
}

test("validation is operation-specific and preserves harness tag/output identities", () => {
    for (const tagName of ["my-card", "a-", "a--b", "a_.-b"]) {
        validateComponentSources([{ tagName, template: "card.html" }], "ssr");
    }
    assert.throws(() => validateComponentSources({}, "ssr"), /must be an array/);
    assert.throws(
        () =>
            validateComponentSources(
                [{ tagName: "my-card", template: "card.html" }],
                "typescript",
            ),
        /also requires clientModule/,
    );
    assert.throws(
        () =>
            validateComponentSources(
                [{ tagName: "../my-card", template: "card.html" }],
                "ssr",
            ),
        /custom-element tagName/,
    );
    assert.throws(
        () =>
            validateComponentSources(
                [{ tagName: "my-card", template: "card.html", root: "src" }],
                "ssr",
            ),
        /exact source paths/,
    );
});

test("resolution uses the config base, derives emitted imports, and never creates outputs", async t => {
    const { directory, component } = fixture(t);
    for (const [extension, emitted] of [
        ["mts", "mjs"],
        ["cts", "cjs"],
        ["tsx", "js"],
        ["ts", "js"],
    ]) {
        fs.writeFileSync(
            path.join(directory, `src/card.${extension}`),
            "export class MyCard {}",
        );
        const resolved = await resolveComponentSources(
            [{ ...component, clientModule: `src/card.${extension}` }],
            { baseDir: directory, operation: "typescript" },
        );
        assert.equal(resolved.components[0].typeSourceImport, `../card.${emitted}`);
        assert.equal(
            resolved.components[0].templateOutput,
            path.join(directory, "src/generated/my-card.template.ts"),
        );
        assert.equal(
            resolved.components[0].stylesheetOutput,
            path.join(directory, "src/generated/my-card.styles.ts"),
        );
        assert.ok(resolved.inputFiles.includes(path.join(directory, "src/card.html")));
    }
    assert.equal(fs.existsSync(path.join(directory, component.generated)), false);
    await assert.rejects(
        resolveComponentSources([component], { operation: "typescript", baseDir: "." }),
        /absolute baseDir/,
    );
    await assert.rejects(
        resolveComponentSources([{ ...component, template: "missing.html" }], {
            baseDir: directory,
            operation: "typescript",
        }),
        /my-card.*template.*missing.html/,
    );
});

test("canonical aliases share directories but reject collisions, nesting, and authored inputs", async t => {
    const { directory, component } = fixture(t);
    const output = path.join(directory, "src/generated");
    fs.symlinkSync(output, path.join(directory, "alias"), "junction");
    const options = { baseDir: directory, operation: "typescript" };
    const aliased = { ...component, generated: "./alias" };
    const resolved = await resolveComponentSources(
        [component, { ...aliased, tagName: "other-card" }],
        options,
    );
    assert.equal(resolved.components[0].generated, resolved.components[1].generated);
    if (process.platform !== "win32") {
        fs.mkdirSync(path.join(directory, "elsewhere/deep"), { recursive: true });
        fs.symlinkSync("elsewhere/deep", path.join(directory, "prefix"), "dir");
        fs.symlinkSync("prefix/../planned", path.join(directory, "dot-alias"), "dir");
        const expected = path.join(directory, "elsewhere/planned");
        const throughPrefix = [{ ...component, generated: "dot-alias" }];
        assert.equal(
            (await resolveComponentSources(throughPrefix, options)).components[0]
                .generated,
            expected,
        );
        fs.mkdirSync(expected);
        assert.equal(
            (await resolveComponentSources(throughPrefix, options)).components[0]
                .generated,
            expected,
        );
    }
    await assert.rejects(
        resolveComponentSources([component, aliased], options),
        /same output/,
    );
    await assert.rejects(
        resolveComponentSources(
            [
                component,
                {
                    ...component,
                    tagName: "other-card",
                    generated: "src/generated/nested",
                },
            ],
            options,
        ),
        /must not overlap/,
    );
    await assert.rejects(
        resolveComponentSources([{ ...component, generated: "src" }], options),
        /must not contain component inputs/,
    );
    await assert.rejects(
        resolveComponentSources(
            [{ ...component, generated: "src/card.html/generated" }],
            options,
        ),
        /not a directory/,
    );
});

test("component conversion generates real typed HTML/CSS modules and ignores unlisted files", t => {
    const { directory, component } = fixture(t);
    fs.writeFileSync(path.join(directory, "src/unlisted.html"), "invalid unlisted input");
    const result = cli(directory, "convert", {
        syntax: "fast-v3-ts",
        components: [component],
    });
    assert.equal(result.status, 0, result.stderr);
    const generated = path.join(directory, component.generated);
    const html = fs.readFileSync(path.join(generated, "my-card.template.ts"), "utf8");
    const css = fs.readFileSync(path.join(generated, "my-card.styles.ts"), "utf8");
    assert.match(html, /import type \{ MyCard \} from ["']\.\.\/card.js["']/);
    assert.match(html, /html<MyCard>/);
    assert.match(html, /ElementViewTemplate<MyCard>/);
    assert.match(css, /ElementStyles/);
    assert.deepEqual(fs.readdirSync(generated).sort(), [
        "my-card.styles.ts",
        "my-card.template.ts",
    ]);
    const refused = cli(directory, "convert", {
        syntax: "fast-v3-ts",
        components: [component],
    });
    assert.notEqual(refused.status, 0);
    assert.match(refused.stderr, /Use --overwrite/);
    const ts = require("typescript");
    const consumer = path.join(directory, "consumer.mts");
    fs.writeFileSync(
        consumer,
        `import { resolveComponentSources, type ComponentSource } from "@microsoft/fast-build/component-sources.js";
        const components: ComponentSource[] = ${JSON.stringify([component])};
        const resolved = await resolveComponentSources(components, {
            baseDir: ${JSON.stringify(directory)}, operation: "typescript",
        });
        const templatePath: string = resolved.components[0].template;`,
    );
    const diagnostics = () =>
        ts.getPreEmitDiagnostics(
            ts.createProgram({
                rootNames: [
                    consumer,
                    path.join(generated, "my-card.template.ts"),
                    path.join(generated, "my-card.styles.ts"),
                ],
                options: {
                    target: ts.ScriptTarget.ES2022,
                    module: ts.ModuleKind.NodeNext,
                    moduleResolution: ts.ModuleResolutionKind.NodeNext,
                    strict: true,
                    noEmit: true,
                    skipLibCheck: true,
                },
            }),
        );
    assert.deepEqual(
        diagnostics().map(diagnostic =>
            ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
        ),
        [],
    );
    fs.writeFileSync(
        path.join(directory, component.clientModule),
        'export class MyCard { renamed = ""; }',
    );
    assert.ok(
        diagnostics().some(diagnostic =>
            ts
                .flattenDiagnosticMessageText(diagnostic.messageText, "\n")
                .includes("Property 'title' does not exist"),
        ),
    );
});

test("conversion failures preflight the complete batch before replacing generated files", t => {
    const { directory, component } = fixture(t);
    const other = { ...component, tagName: "other-card", template: "src/other.html" };
    fs.writeFileSync(
        path.join(directory, other.template),
        '<f-template name="other-card"><template><p>{{title}}</p></template></f-template>',
    );
    const config = {
        syntax: "fast-v3-ts",
        components: [component, other],
        overwrite: true,
    };
    assert.equal(cli(directory, "convert", config).status, 0);
    const first = path.join(directory, "src/generated/my-card.template.ts");
    const original = fs.readFileSync(first, "utf8");
    fs.writeFileSync(
        path.join(directory, component.template),
        '<f-template name="my-card"><template>Changed {{title}}</template></f-template>',
    );
    fs.writeFileSync(
        path.join(directory, other.template),
        '<f-template name="wrong-card"><template>Bad</template></f-template>',
    );
    const result = cli(directory, "convert", config);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /other-card.*must contain exactly one/);
    assert.equal(fs.readFileSync(first, "utf8"), original);
});

test("build and native registry conversion reuse the manifest without generating or executing client code", t => {
    const { directory, component } = fixture(t);
    const config = {
        components: [component],
        entry: "index.html",
        state: "state.json",
        output: "rendered/page.html",
        "server-artifact": "cache/page.json",
    };
    const built = cli(directory, "build", config);
    assert.equal(built.status, 0, built.stderr);
    assert.match(
        fs.readFileSync(path.join(directory, config.output), "utf8"),
        /shadowrootmode="open".*Hello/s,
    );
    assert.equal(fs.existsSync(path.join(directory, component.generated)), false);
    const artifact = path.join(directory, config["server-artifact"]);
    const modified = fs.statSync(artifact).mtimeMs;
    fs.writeFileSync(path.join(directory, "state.json"), '{"title":"Updated"}');
    assert.equal(cli(directory, "build", config).status, 0);
    assert.equal(fs.statSync(artifact).mtimeMs, modified);
    assert.match(fs.readFileSync(path.join(directory, config.output), "utf8"), /Updated/);
    const registry = cli(directory, "convert", {
        syntax: "server-native",
        components: [component],
        output: "cache/registry.json",
    });
    assert.equal(registry.status, 0, registry.stderr);
    assert.equal(
        JSON.parse(fs.readFileSync(path.join(directory, "cache/registry.json"), "utf8"))
            .inputs.entry,
        "",
    );
    const protectedInput = cli(directory, "build", {
        ...config,
        output: component.template,
    });
    assert.notEqual(protectedInput.status, 0);
    assert.match(protectedInput.stderr, /must not replace authored component inputs/);
});

test("HTML targets use target-owned suffixes and SSR accepts minimal records", t => {
    const { directory, component } = fixture(t);
    const converted = cli(directory, "convert", {
        syntax: "webui-prerelease",
        components: [
            {
                tagName: component.tagName,
                template: component.template,
                generated: "generated",
            },
        ],
    });
    assert.equal(converted.status, 0, converted.stderr);
    assert.ok(fs.existsSync(path.join(directory, "generated/my-card.webui.html")));
    const built = cli(directory, "build", {
        components: [{ tagName: component.tagName, template: component.template }],
        entry: "index.html",
        output: "output.html",
        state: "state.json",
    });
    assert.equal(built.status, 0, built.stderr);
});

test("legacy selectors remain executable but deprecated, and cannot mix with components", t => {
    const { directory, component } = fixture(t);
    const legacy = cli(directory, "convert", {
        syntax: "fast-v3-ts",
        templates: component.template,
    });
    assert.equal(legacy.status, 0, legacy.stderr);
    assert.match(legacy.stderr, /Deprecated: templates/);
    const mixed = cli(directory, "convert", {
        syntax: "fast-v3-ts",
        components: [component],
        templates: component.template,
    });
    assert.notEqual(mixed.status, 0);
    assert.match(mixed.stderr, /Do not combine components/);
    const invalid = cli(directory, "build", { components: component });
    assert.notEqual(invalid.status, 0);
    assert.match(invalid.stderr, /must be an array/);
});
