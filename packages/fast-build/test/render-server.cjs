const compiler = require("../wasm/microsoft_fast_build.js");
const { compileServerArtifact } = require("../server.js");
const { loadNativeHost } = require("../native-host.mjs");
const Program = loadNativeHost(process.env.FAST_NATIVE_ADDON);

function execute(entry, templates = "{}", state, strategy, markersV2, shadow, nested) {
    const program = new Program(
        Buffer.from(compileServerArtifact(entry, JSON.parse(templates))),
        { attributeNameStrategy: strategy || undefined, markersV2: markersV2 || false },
    );
    const input = Buffer.from(state ?? "{}", "utf8");
    const result = shadow
        ? program.renderShadowJson(shadow, input)
        : nested
          ? program.renderTemplateJson(input)
          : program.renderEntryJson(input);
    return result.toString("utf8");
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
