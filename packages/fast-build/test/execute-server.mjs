import { readFileSync } from "node:fs";

// Test-only bridge: existing native assertions execute the generated JS backend.
const input = JSON.parse(readFileSync(0, "utf8"));
try {
    const server = await import(
        `data:text/javascript;base64,${Buffer.from(
            input.source.replace(
                'from "__FAST_TEST_RUNTIME__"',
                `from ${JSON.stringify(new URL("../server-runtime.mjs", import.meta.url).href)}`,
            ),
        ).toString("base64")}`
    );
    const value = input.shadow
        ? server.renderShadow(input.shadow, input.state, input.options)
        : input.template
          ? server.renderTemplate(input.state, input.options)
          : server.renderEntry(input.state, input.options);
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
