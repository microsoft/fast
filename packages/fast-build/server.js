// @ts-check

/**
 * Compile trusted declarative HTML to synchronous server ESM.
 * The returned module imports only the server runtime, not this build-time API.
 * @param {string} entry
 * @param {Record<string, string | import("./prepared.js").PreparedTemplateDefinition>} [templates]
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

module.exports = { compileServerModule };
