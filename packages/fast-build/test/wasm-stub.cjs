// @ts-check
"use strict";

const fs = require("node:fs");
const Module = require("node:module");

const wasmPath = process.env.FAST_BUILD_WASM_STUB_MODULE;
const recordPath = process.env.FAST_BUILD_WASM_STUB_RECORD;

if (!wasmPath || !recordPath) {
    throw new Error("WASM stub requires module and record paths.");
}

const calls = [];

const stub = {
    parse_f_templates(html) {
        calls.push({ name: "parse_f_templates", html });
        return JSON.stringify([
            {
                name: "my-el",
                content: "<span>{{text}}</span>",
                shadowrootAttributes: [{ name: "shadowrootmode", value: "open" }],
            },
        ]);
    },
    render(entry, state) {
        calls.push({ name: "render", entry, state });
        return "<h1>Non-stream</h1>";
    },
    render_entry_with_templates(
        entry,
        templatesJson,
        state,
        attributeNameStrategy,
        stream,
    ) {
        calls.push({
            name: "render_entry_with_templates",
            entry,
            templatesJson,
            state,
            attributeNameStrategy,
            stream,
        });
        if (!stream) {
            return "<my-el>Non-stream</my-el>";
        }
        let title = "";
        try {
            title = JSON.parse(state || "{}").title || "";
        } catch {}
        if (entry.includes("my-el")) {
            return JSON.stringify(["<my-el>", title, "</my-el>"]);
        }
        return JSON.stringify(["<h1>", title, "</h1>"]);
    },
};

process.on("exit", () => {
    fs.writeFileSync(recordPath, JSON.stringify(calls));
});

const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
    const resolved = Module._resolveFilename(request, parent, isMain);
    if (resolved === wasmPath) {
        return stub;
    }
    return originalLoad.call(this, request, parent, isMain);
};
