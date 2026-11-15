import { loadNativeHost, serializeNativeState } from "../../native-host.mjs";

/** Untimed setup; callers own warm/cold timing and the matched input/output boundary. */
export function createNativeHostAdapter({
    addonPath,
    artifact,
    context = "Entry",
    name,
    options,
}) {
    const Program = loadNativeHost(addonPath);
    const program = new Program(artifact);
    const method = `render${context}Json`;
    const render = state =>
        context === "Host" || context === "Shadow"
            ? program[method](name, state, options)
            : program[method](state, options);
    return {
        program,
        renderJsonBuffer: render,
        renderJsonString: state => render(state).toString("utf8"),
        renderObjectBuffer: state => render(serializeNativeState(state)),
        renderObjectString: state => render(serializeNativeState(state)).toString("utf8"),
    };
}
