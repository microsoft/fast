// @ts-check
"use strict";

const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");

const wasmPath = process.env.FAST_BUILD_WASM_STUB_MODULE;
const convertWasmPath = process.env.FAST_CONVERT_WASM_STUB_MODULE;
const recordPath = process.env.FAST_BUILD_WASM_STUB_RECORD;

if ((!wasmPath && !convertWasmPath) || !recordPath) {
    throw new Error("WASM stub requires module and record paths.");
}

const calls = [];
globalThis[Symbol.for("fast-build-test-calls")] = calls;

const stub = {
    parse_f_templates(html) {
        calls.push({ name: "parse_f_templates", html });
        return JSON.stringify([
            {
                name: "my-el",
                content: "<span>{{text}}</span>",
                shadowrootAttributes: [{ name: "shadowrootmode", value: "open" }],
                formatVersion: 1,
                bindings: [
                    {
                        name: "text",
                        expression: "text",
                        kind: "content",
                        paths: ["text"],
                        scope: [],
                        type: null,
                        optional: null,
                    },
                ],
            },
        ]);
    },
    compile_server_module(entry, templatesJson) {
        calls.push({ name: "compile_server_module", entry, templatesJson });
        return `
            export function renderEntry(state, options) {
                globalThis[Symbol.for("fast-build-test-calls")].push({
                    name: "renderEntry",
                    entry: ${JSON.stringify(entry)},
                    templatesJson: ${JSON.stringify(templatesJson)},
                    state,
                    ...options,
                });
                return ${JSON.stringify(
                    entry.includes("my-el")
                        ? "<my-el>Non-stream</my-el>"
                        : "<h1>Non-stream</h1>",
                )};
            }
        `;
    },
};

const convertStub = {
    convert_syntax_metadata() {
        return JSON.stringify([
            {
                syntax: "webui-prerelease",
                extension: ".html",
                suffix: ".webui.html",
            },
            {
                syntax: "fast-v3-ts",
                extension: ".ts",
                suffix: ".template.ts",
            },
        ]);
    },
    convert_template(template, syntax) {
        calls.push({ name: "convert_template", template, syntax });
        return { output: `converted:${syntax}:${template}`, warnings: [] };
    },
    convert_template_with_options(template, syntax, typeSource, typeSourceImport) {
        calls.push({
            name: "convert_template_with_options",
            template,
            syntax,
            typeSource,
            typeSourceImport,
        });
        if (typeSourceImport && !typeSource) {
            throw new Error(
                "type-source-import requires type-source: provide the type name to import alongside the import module",
            );
        }
        if (typeSource && syntax !== "fast-v3-ts") {
            throw new Error(
                `type-source is only supported for syntax 'fast-v3-ts', not '${syntax}'`,
            );
        }
        let suffix = "";
        if (typeSource) {
            suffix += `:type-source=${typeSource}`;
        }
        if (typeSourceImport) {
            suffix += `:type-source-import=${typeSourceImport}`;
        }
        const warnings = [];
        return { output: `converted:${syntax}:${template}${suffix}`, warnings };
    },
};

process.on("exit", () => {
    fs.writeFileSync(recordPath, JSON.stringify(calls));
});

const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
    if (path.isAbsolute(request)) {
        const resolvedRequest = path.resolve(request);
        if (wasmPath && resolvedRequest === wasmPath) {
            return stub;
        }
        if (convertWasmPath && resolvedRequest === convertWasmPath) {
            return convertStub;
        }
    }

    const resolved = Module._resolveFilename(request, parent, isMain);
    if (wasmPath && resolved === wasmPath) {
        return stub;
    }
    if (convertWasmPath && resolved === convertWasmPath) {
        return convertStub;
    }
    return originalLoad.call(this, request, parent, isMain);
};
