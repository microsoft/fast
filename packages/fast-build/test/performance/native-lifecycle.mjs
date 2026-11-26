import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import * as fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const script = fileURLToPath(import.meta.url);
const require = createRequire(import.meta.url);
const hash = bytes => createHash("sha256").update(bytes).digest("hex");

function keys(value, allowed, label) {
    assert.ok(
        value !== null && typeof value === "object" && !Array.isArray(value),
        `${label} must be an object.`,
    );
    for (const key of Object.keys(value)) {
        assert.ok(allowed.includes(key), `Unknown ${label} field: ${key}`);
    }
}

function filename(value, label) {
    assert.ok(typeof value === "string" && value.trim(), `${label} must be a path.`);
    return value;
}

function count(value, name, minimum = 1) {
    assert.ok(/^\d+$/.test(value), `${name} must be an integer.`);
    const result = Number(value);
    assert.ok(
        Number.isSafeInteger(result) && result >= minimum,
        `${name} must be a safe integer >= ${minimum}.`,
    );
    return result;
}

export function lifecycleOptions(argv) {
    const { values, tokens } = parseArgs({
        args: argv,
        tokens: true,
        options: {
            manifest: { type: "string" },
            samples: { type: "string", default: "3" },
            iterations: { type: "string", default: "100" },
            warmup: { type: "string", default: "20" },
            "native-addon": { type: "string" },
            output: { type: "string" },
            worker: { type: "string" },
        },
    });
    const seen = new Set();
    for (const token of tokens) {
        assert.ok(!seen.has(token.name), `Repeated option: --${token.name}`);
        seen.add(token.name);
    }
    const options = {
        manifest: path.resolve(filename(values.manifest, "manifest")),
        samples: count(values.samples, "samples"),
        iterations: count(values.iterations, "iterations"),
        warmup: count(values.warmup, "warmup", 0),
        addonPath: values["native-addon"] ?? process.env.FAST_NATIVE_ADDON,
        output: values.output,
        worker: values.worker,
    };
    if (options.addonPath !== undefined) {
        options.addonPath = path.resolve(filename(options.addonPath, "native-addon"));
    }
    if (options.output !== undefined) filename(options.output, "output");
    if (options.worker !== undefined) {
        assert.ok(["buffer", "string"].includes(options.worker), "Invalid worker mode.");
        assert.equal(options.output, undefined, "Workers write only to stdout.");
    }
    return options;
}

export function lifecycleManifest(value, manifestPath) {
    keys(value, ["version", "artifact", "requests", "renderOptions"], "manifest");
    assert.equal(value.version, 1, "Expected manifest version 1.");
    assert.ok(
        Array.isArray(value.requests) && value.requests.length >= 2,
        "Provide at least two changing-state requests.",
    );
    const base = path.dirname(manifestPath);
    const resolve = (value, label) => path.resolve(base, filename(value, label));
    const renderOptions = value.renderOptions === undefined ? {} : value.renderOptions;
    keys(
        renderOptions,
        ["markersV2", "attributeNameStrategy", "dsd", "maxSteps", "maxOutputBytes"],
        "renderOptions",
    );
    if ("markersV2" in renderOptions) {
        assert.equal(typeof renderOptions.markersV2, "boolean", "Invalid markersV2.");
    }
    if ("attributeNameStrategy" in renderOptions) {
        assert.ok(
            ["camelCase", "none"].includes(renderOptions.attributeNameStrategy),
            "Invalid attributeNameStrategy.",
        );
    }
    if ("dsd" in renderOptions) {
        assert.ok(
            Array.isArray(renderOptions.dsd) &&
                renderOptions.dsd.every(name => typeof name === "string"),
            "Invalid dsd.",
        );
    }
    for (const name of ["maxSteps", "maxOutputBytes"]) {
        if (name in renderOptions) {
            assert.ok(
                Number.isSafeInteger(renderOptions[name]) && renderOptions[name] > 0,
                `Invalid ${name}.`,
            );
        }
    }
    return {
        artifact: resolve(value.artifact, "artifact"),
        requests: value.requests.map(request => {
            keys(request, ["state", "expected"], "request");
            return {
                state: resolve(request.state, "state"),
                expected: resolve(request.expected, "expected"),
            };
        }),
        renderOptions,
    };
}

function identity(file, bytes) {
    return { path: file, bytes: bytes.length, sha256: hash(bytes) };
}

export async function readLifecycleInputs(
    manifest,
    { readFile = fs.readFile, now = () => performance.now() } = {},
) {
    let start = now();
    const artifact = await readFile(manifest.artifact);
    const artifactReadMs = now() - start;
    start = now();
    const requests = [];
    for (const request of manifest.requests) {
        requests.push({
            state: await readFile(request.state),
            expected: await readFile(request.expected),
        });
    }
    const inputReadMs = now() - start;
    assert.ok(
        requests.some(request => !request.state.equals(requests[0].state)),
        "Request state files must contain at least two byte-distinct inputs.",
    );
    for (const request of requests) {
        request.expectedString = request.expected.toString("utf8");
        assert.deepEqual(
            Buffer.from(request.expectedString, "utf8"),
            request.expected,
            "Expected output must be exact UTF-8.",
        );
    }
    return {
        artifact,
        requests,
        artifactReadMs,
        inputReadMs,
        identities: {
            artifact: identity(manifest.artifact, artifact),
            requests: requests.map((request, index) => ({
                state: identity(manifest.requests[index].state, request.state),
                expected: identity(manifest.requests[index].expected, request.expected),
            })),
        },
    };
}

async function importHost(addonPath) {
    const { loadNativeHost } = await import("../../native-host.mjs");
    return loadNativeHost(addonPath);
}

function verifyOutput(output, request, mode) {
    if (mode === "buffer") {
        assert.ok(Buffer.isBuffer(output), "Native output must be a Buffer.");
        assert.deepEqual(
            output,
            request.expected,
            "Rendered bytes differ from expected.",
        );
    } else {
        assert.equal(
            output,
            request.expectedString,
            "Rendered string differs from expected.",
        );
    }
}

export async function measureLifecycle(
    { artifact, requests, renderOptions, addonPath, mode, iterations, warmup },
    { now = () => performance.now(), loadHost = importHost, verify = verifyOutput } = {},
) {
    assert.ok(["buffer", "string"].includes(mode), "Invalid output mode.");
    for (const [name, value, minimum] of [
        ["iterations", iterations, 1],
        ["warmup", warmup, 0],
    ]) {
        assert.ok(Number.isSafeInteger(value) && value >= minimum, `Invalid ${name}.`);
    }
    const requestCount = requests.length;
    const totalRequests = 1 + requestCount * (1 + warmup + iterations);
    assert.ok(requestCount >= 2, "Provide at least two requests.");
    assert.ok(
        Number.isSafeInteger(totalRequests),
        "Request count exceeds safe integers.",
    );
    let start = now();
    const Program = await loadHost(addonPath);
    const hostImportMs = now() - start;
    start = now();
    const program = new Program(artifact, renderOptions);
    const programLoadMs = now() - start;
    const render =
        mode === "buffer"
            ? state => program.renderEntryJson(state)
            : state => program.renderEntryJson(state).toString("utf8");
    start = now();
    const first = render(requests[0].state);
    const firstRenderMs = now() - start;
    verify(first, requests[0], mode);

    // Validate the full changing-state sequence before warming either boundary.
    for (const request of requests) verify(render(request.state), request, mode);
    const cycle = () => {
        const outputs = new Array(requestCount);
        const start = now();
        for (let index = 0; index < requestCount; index++) {
            outputs[index] = render(requests[index].state);
        }
        const elapsed = now() - start;
        // Keep only one cycle of results; compare every output outside timing.
        for (let index = 0; index < requestCount; index++) {
            verify(outputs[index], requests[index], mode);
        }
        return elapsed;
    };
    let warmupMs = 0;
    for (let index = 0; index < warmup; index++) warmupMs += cycle();
    let warmTotalMs = 0;
    for (let index = 0; index < iterations; index++) warmTotalMs += cycle();
    return {
        mode,
        hostImportMs,
        programLoadMs,
        firstRenderMs,
        warmupMs,
        warmTotalMs,
        warmMsPerRequest: warmTotalMs / (iterations * requestCount),
        counts: {
            programConstructions: 1,
            firstRender: 1,
            verificationRequests: requestCount,
            warmupRequests: warmup * requestCount,
            measuredRequests: iterations * requestCount,
            totalRequests,
            handleReuses: totalRequests - 1,
        },
    };
}

async function nativeIdentities() {
    const addons = [];
    for (const file of Object.keys(require.cache).filter(file =>
        file.endsWith(".node"),
    )) {
        addons.push(identity(file, await fs.readFile(file)));
    }
    assert.ok(addons.length, "No loaded native addon identity found.");
    return addons;
}

async function worker(options, manifest) {
    const inputs = await readLifecycleInputs(manifest);
    const measurement = await measureLifecycle({
        ...options,
        ...inputs,
        mode: options.worker,
        renderOptions: manifest.renderOptions,
    });
    return {
        ...measurement,
        workerPid: process.pid,
        renderOptions: manifest.renderOptions,
        artifactReadMs: inputs.artifactReadMs,
        inputReadMs: inputs.inputReadMs,
        identities: inputs.identities,
        nativeAddons: await nativeIdentities(),
    };
}

export async function runLifecycle(argv) {
    const options = lifecycleOptions(argv);
    const manifest = lifecycleManifest(
        JSON.parse(await fs.readFile(options.manifest, "utf8")),
        options.manifest,
    );
    const totalRequests =
        1 + manifest.requests.length * (1 + options.warmup + options.iterations);
    assert.ok(
        Number.isSafeInteger(totalRequests),
        "Request count exceeds safe integers.",
    );
    if (options.worker) return worker(options, manifest);
    const samples = [];
    let identities;
    let nativeAddons;
    for (let sample = 0; sample < options.samples; sample++) {
        const modes = sample % 2 ? ["string", "buffer"] : ["buffer", "string"];
        for (const mode of modes) {
            const result = JSON.parse(
                execFileSync(
                    process.execPath,
                    [
                        script,
                        "--manifest=" + options.manifest,
                        "--worker=" + mode,
                        "--iterations=" + options.iterations,
                        "--warmup=" + options.warmup,
                        ...(options.addonPath
                            ? ["--native-addon=" + options.addonPath]
                            : []),
                    ],
                    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
                ),
            );
            identities ??= result.identities;
            nativeAddons ??= result.nativeAddons;
            assert.deepEqual(
                result.identities,
                identities,
                "Inputs changed between workers.",
            );
            assert.deepEqual(
                result.nativeAddons,
                nativeAddons,
                "Native addons changed between workers.",
            );
            assert.deepEqual(
                result.renderOptions,
                manifest.renderOptions,
                "Render options changed between workers.",
            );
            const { identities: _identities, ...measurement } = result;
            samples.push({ sample: sample + 1, ...measurement });
        }
    }
    const report = {
        reportVersion: 1,
        workflow: "native-reusable-handle",
        executionTarget: "native-node-host",
        environment: {
            node: process.version,
            platform: process.platform,
            arch: process.arch,
        },
        manifestPath: options.manifest,
        renderOptions: manifest.renderOptions,
        controls: {
            samples: options.samples,
            iterations: options.iterations,
            warmup: options.warmup,
            requestsPerCycle: manifest.requests.length,
        },
        boundaries: {
            preparation: "Excluded. Compile artifacts separately before this process.",
            artifactReadMs: "Read artifact bytes; excludes manifest parsing and hashing.",
            inputReadMs:
                "Read raw state and expected-output bytes; excludes hashing and decoding.",
            hostImportMs:
                "Import native-host.mjs and call loadNativeHost; excludes process startup, artifact I/O, construction and addon hashing.",
            programLoadMs:
                "Construct one NativeProgram from in-memory artifact bytes and fixed options.",
            firstRenderMs:
                "First request on this handle; Buffer delivery or Buffer delivery plus UTF-8 decoding, according to mode.",
            warmupMs:
                "Sum of independently warmed complete request cycles for this mode.",
            warmTotalMs:
                "Sum of request-cycle timers including result-array writes; excludes array allocation and exact output comparisons between cycles.",
            requests:
                "Raw JSON Buffers cycle in manifest order on one handle per worker; no state parsing, serialization or source compilation in JavaScript.",
            isolation:
                "Each sample and output mode uses a fresh process, host load, handle and warmup. Mode order alternates by sample. Filesystem caches are uncontrolled.",
            interpretation:
                "Lifecycle observations only; no baseline comparison or renderer speedup estimate.",
        },
        identities,
        samples,
    };
    if (options.output) {
        await fs.writeFile(options.output, JSON.stringify(report, null, 2) + "\n", {
            flag: "wx",
        });
    }
    return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === script) {
    try {
        console.log(JSON.stringify(await runLifecycle(process.argv.slice(2)), null, 2));
    } catch (error) {
        console.error(error.stack);
        process.exitCode = 1;
    }
}
