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
    const value = input.host
        ? server.renderHost(input.host, state, input.options)
        : input.shadow
          ? server.renderShadow(input.shadow, state, input.options)
          : input.template
            ? server.renderTemplate(state, input.options)
            : server.renderEntry(state, input.options);
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
