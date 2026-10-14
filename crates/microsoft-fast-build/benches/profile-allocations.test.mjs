import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { combineReports, requests } from "./profile-allocations.mjs";

test("existing reports are refused before Cargo builds and remain unchanged", () => {
    const directory = mkdtempSync(path.join(os.tmpdir(), "fast-allocation-test-"));
    const output = path.join(directory, "existing.json");
    try {
        writeFileSync(output, "original report");
        const result = spawnSync(
            process.execPath,
            [
                fileURLToPath(new URL("./profile-allocations.mjs", import.meta.url)),
                `--output=${output}`,
            ],
            { cwd: directory, encoding: "utf8" },
        );
        assert.ifError(result.error);
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /Refusing to overwrite existing allocation report/);
        assert.equal(readFileSync(output, "utf8"), "original report");
        const empty = spawnSync(
            process.execPath,
            [
                fileURLToPath(new URL("./profile-allocations.mjs", import.meta.url)),
                "--output=",
            ],
            { cwd: directory, encoding: "utf8" },
        );
        assert.ifError(empty.error);
        assert.notEqual(empty.status, 0);
        assert.match(empty.stderr, /--output must be a nonempty path/);
    } finally {
        rmSync(output);
        rmdirSync(directory);
    }
});

test("allocation matrix contains both modes, phases, scaling sizes and controls", () => {
    const matrix = requests();
    assert.equal(matrix.length, 30);
    assert.equal(new Set(matrix.map(record => JSON.stringify(record))).size, 30);
    for (const mode of ["v3", "v2"]) {
        for (const count of [100, 250, 1000]) {
            assert.ok(
                matrix.some(
                    r =>
                        r.case === "repeat_custom_elements" &&
                        r.mode === mode &&
                        r.count === count &&
                        r.phase === "render",
                ),
            );
            assert.ok(
                matrix.some(
                    r =>
                        r.case === "plain_bound_elements" &&
                        r.mode === mode &&
                        r.count === count &&
                        r.phase === "render",
                ),
            );
        }
        for (const caseName of ["large_state_overlay", "large_state_no_overlay"]) {
            for (const rootKeys of [0, 200]) {
                assert.ok(
                    matrix.some(
                        r =>
                            r.case === caseName &&
                            r.mode === mode &&
                            r.rootKeys === rootKeys,
                    ),
                );
            }
        }
        for (const phase of ["render", "parse_state_and_render", "locator"]) {
            assert.ok(
                matrix.some(
                    r =>
                        r.case === "many_definitions" &&
                        r.mode === mode &&
                        r.phase === phase &&
                        r.payload === 20,
                ),
            );
        }
    }
});

test("combining samples refuses missing, duplicate, mixed and multi-record reports", () => {
    const sample = {
        nativeBinarySha256: "binary",
        target: { platform: "test" },
        records: [requests()[0]],
    };
    assert.equal(combineReports([sample]).records.length, 1);
    assert.throws(() => combineReports([]), /No allocation/);
    assert.throws(() => combineReports([sample, sample]), /Duplicate/);
    assert.throws(
        () => combineReports([sample, { ...sample, nativeBinarySha256: "other" }]),
        /provenance/,
    );
    assert.throws(() => combineReports([{ ...sample, records: [] }]), /one sample/);
    assert.throws(
        () =>
            combineReports([
                { ...sample, records: [sample.records[0], sample.records[0]] },
            ]),
        /one sample/,
    );
});
