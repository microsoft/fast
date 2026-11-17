import { loadNativeHost } from "../../native-host.mjs";

/** Untimed setup; callers own warm/cold timing and the matched input/output boundary. */
export function createNativeHostAdapter({
    addonPath,
    artifact,
    context = "Entry",
    name,
    options,
}) {
    const Program = loadNativeHost(addonPath);
    const program = new Program(artifact, options);
    const method = `render${context}Json`;
    const render = state =>
        context === "Host" || context === "Shadow"
            ? program[method](name, state)
            : program[method](state);
    return {
        program,
        renderBuffer: render,
        renderString: state => render(state).toString("utf8"),
    };
}
