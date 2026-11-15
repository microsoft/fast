const { execFileSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");
const compiler = require("../wasm/microsoft_fast_build.js");
const { compileServerModule } = require("../server.js");

// Keep pre-existing byte/diagnostic assertions on the single generated-JS engine.
function execute(entry, templates = "{}", state, strategy, markersV2, shadow, nested) {
    let parsed;
    try {
        parsed = state === undefined ? undefined : JSON.parse(state);
    } catch (error) {
        error.code = "invalid-state-json";
        throw error;
    }
    const source = compileServerModule(
        entry,
        JSON.parse(templates),
        pathToFileURL(require.resolve("../server-runtime.mjs")).href,
    );
    const result = JSON.parse(
        execFileSync(process.execPath, [require.resolve("./execute-server.mjs")], {
            input: JSON.stringify({
                source,
                state: parsed,
                options: {
                    attributeNameStrategy: strategy || undefined,
                    markersV2: markersV2 || false,
                },
                shadow,
                template: nested,
            }),
            encoding: "utf8",
        }),
    );
    if (result.error) {
        throw Object.assign(new Error(result.error.message), result.error);
    }
    return result.value;
}

module.exports = {
    ...compiler,
    render: (entry, state) => execute(entry, "{}", state),
    render_with_templates: (entry, templates, state, strategy, markersV2) =>
        execute(entry, templates, state, strategy, markersV2, undefined, true),
    render_entry_with_templates(entry, templates, state, strategy, chunks, markersV2) {
        const html = execute(entry, templates, state, strategy, markersV2);
        return chunks ? JSON.stringify(html ? [html] : []) : html;
    },
    render_shadow_root: (name, templates, state, strategy, markersV2) =>
        execute("", templates, state, strategy, markersV2, name),
};
