import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { fixture, outputStats } from "./fixtures.mjs";

const wasm = createRequire(import.meta.url)("../../wasm/microsoft_fast_build.js");
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
    test(`${record.case}/${record.mode}/${record.count}`, () => {
        const input = fixture(record.case, record.count, record.payload, record.rootKeys);
        const args = [
            input.entry,
            JSON.stringify(input.templates),
            JSON.stringify(input.state),
            "camelCase",
        ];
        const html = wasm.render_entry_with_templates(
            ...args,
            false,
            record.mode === "v2",
        );
        const {
            case: _case,
            count: _count,
            mode: _mode,
            payload: _payload,
            rootKeys: _root,
            ...expected
        } = record;
        assert.deepEqual(outputStats(html), expected);
        const chunks = JSON.parse(
            wasm.render_entry_with_templates(...args, true, record.mode === "v2"),
        );
        assert.ok(chunks.every(chunk => typeof chunk === "string" && chunk.length > 0));
        assert.equal(chunks.join(""), html);
        assert.equal(wasm.render_with_templates(...args, record.mode === "v2"), html);
    });
}
