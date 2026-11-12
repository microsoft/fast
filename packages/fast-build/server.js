// @ts-check

/**
 * Compile trusted declarative HTML to synchronous server ESM.
 * The returned module imports only the server runtime, not this build-time API.
 * @param {string} entry
 * @param {Record<string, string | import("./server.js").ServerTemplateDefinition>} [templates]
 * @param {string} [runtimeImport]
 * @returns {string}
 */
function compileServerModule(
    entry,
    templates = {},
    runtimeImport = "@microsoft/fast-build/server-runtime.mjs",
) {
    const wasm = require("./wasm/microsoft_fast_build.js");
    return wasm.compile_server_module(entry, JSON.stringify(templates), runtimeImport);
}

/**
 * Compile trusted declarative HTML to a native Rust executable artifact.
 * Deploy with the exact compiler-matching microsoft-fast-build Rust library.
 * @param {string} entry
 * @param {Record<string, string | import("./server.js").ServerTemplateDefinition>} [templates]
 * @returns {Uint8Array}
 */
function compileServerArtifact(entry, templates = {}) {
    const wasm = require("./wasm/microsoft_fast_build.js");
    return wasm.compile_server_artifact(entry, JSON.stringify(templates));
}

module.exports = { compileServerModule, compileServerArtifact };
