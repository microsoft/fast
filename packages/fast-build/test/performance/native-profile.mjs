import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import * as fs from "node:fs/promises";
import { Session } from "node:inspector/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";

export const profilePhases = ["load", "buffer", "string", "decode"];

function sampleNative(kind, file, durationMs) {
    const seconds = String(Math.ceil(durationMs / 1000));
    const args =
        kind === "sample"
            ? [String(process.pid), seconds, "1", "-file", file]
            : [
                  "record",
                  "--call-graph",
                  "dwarf",
                  "-p",
                  String(process.pid),
                  "-o",
                  file,
                  "--",
                  "sleep",
                  seconds,
              ];
    const child = spawn(kind, args, {
        stdio: ["ignore", "ignore", "pipe"],
        timeout: Math.ceil(durationMs / 1000) * 1000 + 5000,
    });
    let diagnostic = "";
    child.stderr.on("data", chunk => {
        diagnostic = (diagnostic + chunk).slice(-16_384);
    });
    const completion = new Promise((resolve, reject) => {
        child.once("error", reject);
        child.once("close", (code, signal) =>
            code === 0
                ? resolve()
                : reject(
                      new Error(
                          `${kind} failed (${signal ?? code}): ${diagnostic.trim()}`,
                      ),
                  ),
        );
    });
    completion.catch(() => {});
    return { child, completion };
}

export async function profileNativeRendering({
    directory,
    name,
    phase,
    durationMs,
    nativeProfiler,
    Program,
    artifactPath,
    renderOptions,
    program,
    state,
    bytes,
}) {
    const profiles = [];
    for (const current of phase === "all" ? profilePhases : [phase]) {
        const prefix = path.join(directory, `${name}-${current}`);
        const cpuProfile = `${prefix}.cpuprofile`;
        const nativeProfile =
            nativeProfiler === "none"
                ? undefined
                : `${prefix}.${nativeProfiler === "sample" ? "sample.txt" : "perf.data"}`;
        if (nativeProfile) {
            const reserved = await fs.open(nativeProfile, "wx");
            await reserved.close();
        }
        const session = new Session();
        session.connect();
        let sampler;
        try {
            await session.post("Profiler.enable");
            await session.post("Profiler.setSamplingInterval", { interval: 1000 });
            await session.post("Profiler.start");
            if (nativeProfile) {
                sampler = sampleNative(nativeProfiler, nativeProfile, durationMs);
            }
            const operations = {
                load: () => new Program(readFileSync(artifactPath), renderOptions),
                buffer: () => program.renderEntryJson(state),
                string: () => program.renderEntryJson(state).toString("utf8"),
                decode: () => bytes.toString("utf8"),
            };
            const operation = operations[current];
            const memoryBefore = process.memoryUsage();
            const cpuBefore = process.cpuUsage();
            const start = performance.now();
            let iterations = 0;
            let latest;
            do {
                latest = operation();
                iterations++;
                if (iterations % (current === "load" ? 16 : 256) === 0) {
                    if (current === "load") globalThis.gc();
                    await new Promise(resolve => setImmediate(resolve));
                }
            } while (performance.now() - start < durationMs);
            const elapsedMs = performance.now() - start;
            const cpu = process.cpuUsage(cpuBefore);
            const memoryAfter = process.memoryUsage();
            const peakRssBytes = process.resourceUsage().maxRSS * 1024;
            const { profile } = await session.post("Profiler.stop");
            await fs.writeFile(cpuProfile, JSON.stringify(profile), { flag: "wx" });
            if (sampler) await sampler.completion;
            const output =
                current === "load"
                    ? latest.renderEntryJson(state)
                    : Buffer.isBuffer(latest)
                      ? latest
                      : Buffer.from(latest, "utf8");
            assert.deepEqual(output, bytes, `${current} profiling changed output`);
            if (nativeProfile) {
                assert.ok((await fs.stat(nativeProfile)).size > 0);
            }
            profiles.push({
                phase: current,
                boundary: {
                    load: "Read the artifact and construct a program; addon already loaded. Repeated warm-filesystem loads with explicit GC every 16 constructions.",
                    buffer: "JSON Buffer validation, NAPI, Rust parsing/rendering and owned Buffer delivery.",
                    string: "Complete Buffer-rendering boundary plus UTF-8 output decoding.",
                    decode: "Decode an already-rendered fixed Buffer; no native render. This is not a subtraction estimate of per-request overhead.",
                }[current],
                cpuProfile,
                nativeProfile,
                nativeProfiler,
                iterations,
                elapsedMs,
                cpuMs: (cpu.user + cpu.system) / 1000,
                memoryBefore,
                memoryAfter,
                peakRssBytes,
                explicitGcEvery: current === "load" ? 16 : null,
                outputHash: createHash("sha256").update(output).digest("hex"),
                instrumented: true,
            });
        } finally {
            session.disconnect();
            if (sampler) {
                if (sampler.child.exitCode === null) sampler.child.kill();
                await sampler.completion.catch(() => {});
            }
        }
    }
    return profiles;
}
