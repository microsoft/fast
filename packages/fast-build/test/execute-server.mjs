import { readFileSync } from "node:fs";

// Test-only bridge: Rust conformance assertions also execute generated JavaScript.
const input = JSON.parse(readFileSync(0, "utf8"));
try {
    const state =
        input.stateJson === undefined ? input.state : JSON.parse(input.stateJson);
    const server = await import(
        `data:text/javascript;base64,${Buffer.from(
            input.source.replace(
                'from "__FAST_TEST_RUNTIME__"',
                `from ${JSON.stringify(new URL("../server-runtime.mjs", import.meta.url).href)}`,
            ),
        ).toString("base64")}`
    );
    const method = input.host
        ? "renderHost"
        : input.shadow
          ? "renderShadow"
          : input.template
            ? "renderTemplate"
            : "renderEntry";
    const args = input.host || input.shadow ? [input.host || input.shadow] : [];
    const value = server[method](...args, state, input.options);
    const prepared = server.prepareState(state);
    if (server[`${method}Prepared`](...args, prepared, input.options) !== value) {
        throw new Error("Prepared output differs from ordinary output");
    }
    process.stdout.write(JSON.stringify({ value }));
} catch (error) {
    process.stdout.write(
        JSON.stringify({
            error: {
                message: error.message,
                code: error.code,
                line: error.line,
                column: error.column,
                length: error.length,
                templateName: error.templateName,
            },
        }),
    );
}
