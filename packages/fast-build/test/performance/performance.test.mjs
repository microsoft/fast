import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { pathToFileURL } from "node:url";
import { fixture, outputStats } from "./fixtures.mjs";

const require = createRequire(import.meta.url);
const { compileServerModule } = require("../../server.js");
const runtime = pathToFileURL(require.resolve("../../server-runtime.mjs")).href;
const baseline = JSON.parse(
    readFileSync(
        new URL(
            "../../../../crates/microsoft-fast-build/benches/fixtures/expected-baseline.json",
            import.meta.url,
        ),
        "utf8",
    ),
);

for (const record of baseline) {
    test(`${record.case}/${record.mode}/${record.count}`, async () => {
        const input = fixture(record.case, record.count, record.payload, record.rootKeys);
        const source = compileServerModule(input.entry, input.templates, runtime);
        const server = await import(
            `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
        );
        const html = server.renderEntry(input.state, { markersV2: record.mode === "v2" });
        const {
            case: _case,
            count: _count,
            mode: _mode,
            payload: _payload,
            rootKeys: _root,
            ...expected
        } = record;
        assert.deepEqual(outputStats(html), expected);
    });
}
