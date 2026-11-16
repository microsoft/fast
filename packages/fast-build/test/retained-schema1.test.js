const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const { createHash } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { pathToFileURL } = require("node:url");

test("frozen semantic schema1 assets preserve legacy bytes without compiler or WASM", () => {
    const directory = path.join(__dirname, "fixtures/static-output");
    const filename = path.join(directory, "legacy-schema1.mjs");
    const runtime = pathToFileURL(path.join(__dirname, "../server-runtime.mjs")).href;
    const oracle = JSON.parse(
        fs.readFileSync(path.join(directory, "legacy-schema1-oracles.json"), "utf8"),
    );
    const hash = value => createHash("sha256").update(value).digest("hex");
    assert.equal(hash(fs.readFileSync(filename)), oracle.provenance.moduleSha256);
    const native = fs.readFileSync(path.join(directory, "legacy.fast"));
    assert.equal(hash(native), oracle.provenance.nativeSha256);
    const plan = JSON.parse(native);
    assert.equal(plan.format, "fast-server-native");
    assert.equal(plan.version, 1);
    assert.equal(
        oracle.cases[0].html,
        fs.readFileSync(path.join(directory, "legacy.html"), "utf8"),
    );
    const script = `
        import assert from "node:assert/strict";
        import { registerHooks } from "node:module";
        let candidateHelperImported = false;
        registerHooks({
            resolve(specifier, context, nextResolve) {
                const result = nextResolve(specifier, context);
                if (result.url.endsWith("/server.js") || result.url.includes("/wasm/")) {
                    throw new Error("Compiler import forbidden: " + result.url);
                }
                if (result.url.endsWith("/server-runtime.mjs")) {
                    assert.equal(result.url, ${JSON.stringify(runtime)});
                    candidateHelperImported = true;
                }
                return result;
            },
        });
        globalThis.WebAssembly = new Proxy(globalThis.WebAssembly, {
            get() { throw new Error("WASM forbidden"); },
        });
        JSON.parse = () => { throw new Error("Runtime parsing forbidden"); };
        const module = await import(${JSON.stringify(pathToFileURL(filename).href)});
        const { createServerRenderer } = await import(${JSON.stringify(runtime)});
        const nativePlan = ${JSON.stringify(plan)};
        const nativeRenderer = createServerRenderer({
            ...nativePlan, format: "fast-server-js",
        });
        const cases = ${JSON.stringify(oracle.cases)};
        for (const record of cases) {
            const args = record.method === "renderHost" || record.method === "renderShadow"
                ? [record.name] : [];
            const prepared = module.prepareState(record.state);
            assert.equal(module[record.method](...args, record.state, record.options), record.html);
            assert.equal(module[record.method + "Prepared"](...args, prepared, record.options), record.html);
            assert.equal(nativeRenderer[record.method](...args, record.state, record.options), record.html);
        }
        assert.equal(candidateHelperImported, true);
        process.stdout.write(String(cases.length));
    `;
    assert.equal(
        execFileSync(process.execPath, ["--input-type=module", "-e", script], {
            encoding: "utf8",
        }),
        String(oracle.cases.length),
    );
    assert.equal(hash(fs.readFileSync(filename)), oracle.provenance.moduleSha256);
});
