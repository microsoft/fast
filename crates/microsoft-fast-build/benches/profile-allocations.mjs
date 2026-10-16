import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

export function requests() {
    const result = [];
    for (const mode of ["v3", "v2"]) {
        const add = (caseName, count, rootKeys = 0, phase = "render", payload = 1) =>
            result.push({ case: caseName, count, payload, rootKeys, mode, phase });
        for (const caseName of ["repeat_custom_elements", "plain_bound_elements"]) {
            for (const count of [100, 250, 1000]) add(caseName, count);
            add(caseName, 1000, 0, "parse_state_and_render");
        }
        for (const caseName of ["large_state_overlay", "large_state_no_overlay"]) {
            for (const rootKeys of [0, 200]) add(caseName, 1000, rootKeys);
        }
        for (const phase of ["render", "parse_state_and_render", "locator"]) {
            add("many_definitions", 1000, 0, phase, 20);
        }
    }
    return result;
}

export function combineReports(reports) {
    assert.ok(reports.length > 0, "No allocation samples");
    const { records: _, ...provenance } = reports[0];
    const records = [];
    const seen = new Set();
    for (const report of reports) {
        const { records: sample, ...metadata } = report;
        assert.deepEqual(metadata, provenance, "Allocation sample provenance changed");
        assert.equal(sample.length, 1, "Each process must produce one sample");
        const record = sample[0];
        const key = [
            record.case,
            record.count,
            record.payload,
            record.rootKeys,
            record.mode,
            record.phase,
        ].join("/");
        assert.ok(!seen.has(key), `Duplicate allocation sample: ${key}`);
        seen.add(key);
        records.push(record);
    }
    return {
        ...provenance,
        target: { ...provenance.target, cpu: os.cpus()[0].model },
        records,
    };
}

function main() {
    const { values } = parseArgs({ options: { output: { type: "string" } } });
    if (values.output === "") {
        throw new Error("Allocation report --output must be a nonempty path");
    }
    if (values.output && existsSync(values.output)) {
        throw new Error(
            `Refusing to overwrite existing allocation report: ${values.output}`,
        );
    }
    const build = execFileSync(
        "cargo",
        [
            "build",
            "--manifest-path",
            "crates/microsoft-fast-build/Cargo.toml",
            "--release",
            "--features",
            "allocation-profiling",
            "--example",
            "profile-allocations",
            "--message-format=json",
        ],
        { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] },
    );
    const artifact = build
        .trim()
        .split("\n")
        .map(JSON.parse)
        .find(
            entry =>
                entry.reason === "compiler-artifact" &&
                entry.target.name === "profile-allocations" &&
                entry.executable,
        );
    assert.ok(artifact, "Cargo did not report the allocation profiler executable");
    const reports = requests().map(request => {
        const args = Object.entries(request).map(
            ([key, value]) => `--${key === "rootKeys" ? "root-keys" : key}=${value}`,
        );
        const report = JSON.parse(
            execFileSync(artifact.executable, args, {
                encoding: "utf8",
                stdio: ["ignore", "pipe", "inherit"],
            }),
        );
        const record = report.records[0];
        for (const [key, value] of Object.entries(request)) {
            assert.equal(
                record[key],
                value,
                `Allocation sample request mismatch: ${key}`,
            );
        }
        console.error(
            `${request.case}/${request.mode}/${request.count}/${request.rootKeys}/${request.phase}: ${record.totalBlocks} allocations, ${record.totalBytes} bytes`,
        );
        return report;
    });
    const output = `${JSON.stringify(combineReports(reports), null, 4)}\n`;
    if (values.output) writeFileSync(values.output, output, { flag: "wx" });
    else process.stdout.write(output);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    main();
}
