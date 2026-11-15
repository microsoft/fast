import { readFileSync } from "node:fs";

// Test-only bridge: Rust conformance assertions also execute generated JavaScript.
const input = JSON.parse(readFileSync(0, "utf8"));
try {
    const stateJson =
        input.stateJson ?? JSON.stringify(input.state === undefined ? {} : input.state);
    const server = await import(
        `data:text/javascript;base64,${Buffer.from(
            input.source.replace(
                'from "__FAST_TEST_RUNTIME__"',
                `from ${JSON.stringify(new URL("../server-runtime.mjs", import.meta.url).href)}`,
            ),
        ).toString("base64")}`
    );
    const method = input.host
        ? "renderHostJson"
        : input.shadow
          ? "renderShadowJson"
          : input.template
            ? "renderTemplateJson"
            : "renderEntryJson";
    const args = input.host || input.shadow ? [input.host || input.shadow] : [];
    const value = server[method](...args, stateJson, input.options);
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
