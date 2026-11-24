import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import * as fs from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { PerformanceObserver, performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import {
    componentPropertyPrefixFixture,
    componentScopeFixture,
    escapePrefixFixture,
    fixture,
    nestedShadowFixture,
    outputStats,
    shadowOpeningFixture,
    stateValidationFixture,
} from "./fixtures.mjs";
import { profileNativeRendering, profilePhases } from "./native-profile.mjs";

const require = createRequire(import.meta.url);
const { values: args } = parseArgs({
    options: {
        worker: { type: "string" },
        directory: { type: "string" },
        samples: { type: "string", default: "3" },
        iterations: { type: "string", default: "100" },
        instances: { type: "string", default: "200" },
        warmup: { type: "string", default: "20" },
        "profile-directory": { type: "string" },
        "profile-name": { type: "string", default: "native" },
        "profile-phase": { type: "string", default: "buffer" },
        "profile-duration-ms": { type: "string", default: "1000" },
        "native-profiler": { type: "string", default: "none" },
        workloads: { type: "string" },
        "native-addon": { type: "string" },
        "markers-v2": { type: "boolean", default: false },
        "attribute-name-strategy": { type: "string", default: "camelCase" },
        output: { type: "string" },
    },
});
const addonPath = args["native-addon"] ?? process.env.FAST_NATIVE_ADDON;
assert.ok(addonPath, "Configure --native-addon or FAST_NATIVE_ADDON.");
assert.ok(
    ["camelCase", "none"].includes(args["attribute-name-strategy"]),
    "Invalid attribute name strategy.",
);
const renderOptions = {
    markersV2: args["markers-v2"],
    attributeNameStrategy: args["attribute-name-strategy"],
};
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
function integer(name, minimum = 1) {
    const value = Number(args[name]);
    assert.ok(
        Number.isSafeInteger(value) && value >= minimum,
        name + " must be " + (minimum === 0 ? "nonnegative" : "positive"),
    );
    return value;
}
assert.ok(
    ["all", ...profilePhases].includes(args["profile-phase"]),
    "Invalid profile phase; use all, load, buffer, string or decode.",
);
assert.ok(
    ["none", "sample", "perf"].includes(args["native-profiler"]),
    "Invalid native profiler; use none, sample or perf.",
);
assert.ok(
    integer("profile-duration-ms") <= 60_000,
    "Profile duration must not exceed 60000 ms.",
);
assert.ok(
    args["native-profiler"] === "none" || args["profile-directory"],
    "Native sampling requires --profile-directory.",
);
assert.ok(
    args["native-profiler"] !== "sample" || process.platform === "darwin",
    "The sample profiler requires macOS.",
);
assert.ok(
    args["native-profiler"] !== "perf" || process.platform === "linux",
    "The perf profiler requires Linux.",
);

if (args.worker) await worker();
else await main();

async function worker() {
    assert.equal(args.worker, "native", "Worker requires the native Node host.");
    const iterations = integer("iterations");
    const warmupIterations = integer("warmup", 0);
    let start = performance.now();
    const input = await fs.readFile(path.join(args.directory, "input.json"), "utf8");
    const inputReadMs = performance.now() - start;
    start = performance.now();
    const source = JSON.parse(input);
    const inputParseMs = performance.now() - start;
    start = performance.now();
    const stateJson = source.stateJson ?? JSON.stringify(source.state);
    const stateSerializeMs = performance.now() - start;
    start = performance.now();
    const state = Buffer.from(stateJson, "utf8");
    const stateEncodeMs = performance.now() - start;
    start = performance.now();
    const artifact = await fs.readFile(path.join(args.directory, "server.artifact.json"));
    const artifactReadMs = performance.now() - start;
    const memoryBefore = process.memoryUsage();
    start = performance.now();
    const { loadNativeHost } = require("../../native-host.mjs");
    const Program = loadNativeHost(addonPath);
    const addonLoadMs = performance.now() - start;
    start = performance.now();
    const program = new Program(artifact, renderOptions);
    const programLoadMs = performance.now() - start;
    const render = () => program.renderEntryJson(state);
    start = performance.now();
    const bytes = render();
    const firstRenderMs = performance.now() - start;
    assert.ok(Buffer.isBuffer(bytes));
    const memoryAfterFirst = process.memoryUsage();
    start = performance.now();
    const html = bytes.toString("utf8");
    const outputDecodeMs = performance.now() - start;
    start = performance.now();
    await fs.writeFile(path.join(args.directory, "rendered.html"), bytes);
    const outputWriteMs = performance.now() - start;
    let latest = bytes;
    start = performance.now();
    for (let index = 0; index < warmupIterations; index++) latest = render();
    const warmupMs = performance.now() - start;
    assert.equal(hash(latest), hash(bytes));
    globalThis.gc?.();
    const memoryWarm = process.memoryUsage();
    let gcCount = 0;
    let gcMs = 0;
    let warmStart = 0;
    let warmEnd = 0;
    const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
            if (entry.startTime >= warmStart && entry.startTime < warmEnd) {
                gcCount++;
                gcMs += entry.duration;
            }
        }
    });
    observer.observe({ entryTypes: ["gc"] });
    const cpu = process.cpuUsage();
    warmStart = performance.now();
    for (let index = 0; index < iterations; index++) latest = render();
    warmEnd = performance.now();
    const cpuUsed = process.cpuUsage(cpu);
    assert.equal(hash(latest), hash(bytes));
    await new Promise(resolve => setImmediate(resolve));
    await new Promise(resolve => setImmediate(resolve));
    observer.disconnect();
    const memoryAfterWarm = process.memoryUsage();
    globalThis.gc?.();
    const memoryRetained = process.memoryUsage();
    start = performance.now();
    let latestString;
    for (let index = 0; index < iterations; index++)
        latestString = render().toString("utf8");
    const warmStringMsPerRender = (performance.now() - start) / iterations;
    assert.equal(latestString, html);
    const warmMsPerRender = (warmEnd - warmStart) / iterations;
    const { outputBytes: _bytes, sha256: _hash, ...structure } = outputStats(html);
    const profiles = args["profile-directory"]
        ? await profileNativeRendering({
              directory: args["profile-directory"],
              name: args["profile-name"],
              phase: args["profile-phase"],
              durationMs: integer("profile-duration-ms"),
              nativeProfiler: args["native-profiler"],
              Program,
              artifactPath: path.join(args.directory, "server.artifact.json"),
              renderOptions,
              program,
              state,
              bytes,
          })
        : [];
    console.log(
        JSON.stringify({
            reportVersion: 3,
            executionTarget: "native-node-host",
            requestInput: "json-buffer",
            requestOutput: "owned-buffer",
            renderOptions,
            inputReadMs,
            inputParseMs,
            stateSerializeMs,
            stateEncodeMs,
            artifactReadMs,
            stateJsonBytes: state.length,
            stateJsonHash: hash(state),
            addonLoadMs,
            programLoadMs,
            firstRenderMs,
            coldLoadAndRenderMs: addonLoadMs + programLoadMs + firstRenderMs,
            outputDecodeMs,
            outputWriteMs,
            warmupMs,
            warmupIterations,
            warmMsPerRender,
            warmStringMsPerRender,
            cpuMsPerRender: (cpuUsed.user + cpuUsed.system) / 1000 / iterations,
            warmBytesPerSecond:
                warmMsPerRender > 0 ? (bytes.length * 1000) / warmMsPerRender : null,
            iterations,
            gcCount,
            gcMs,
            memoryBefore,
            memoryAfterFirst,
            memoryWarm,
            memoryAfterWarm,
            memoryRetained,
            outputBytes: bytes.length,
            outputHash: hash(bytes),
            profiles,
            outputStructure: {
                ...structure,
                dsdRoots: (html.match(/<template shadowrootmode=/g) ?? []).length,
            },
        }),
    );
}

async function main() {
    const samples = integer("samples");
    const instances = integer("instances");
    const iterations = integer("iterations");
    const warmupIterations = integer("warmup", 0);
    let profileDirectory;
    if (args["profile-directory"]) {
        const directory = path.resolve(args["profile-directory"]);
        await fs.mkdir(directory, { recursive: true });
        profileDirectory = await fs.mkdtemp(path.join(directory, "fast-server-profile-"));
    }
    const workloadStart = performance.now();
    const workloads = {
        static: {
            entry: "<bench-static></bench-static>".repeat(instances),
            templates: { "bench-static": "<h2>Static</h2><p>No bindings</p>" },
            state: {},
        },
        largeStaticTemplates: {
            entry: Array.from(
                { length: instances },
                (_, index) => `<bench-static-${index}></bench-static-${index}>`,
            ).join(""),
            templates: Object.fromEntries(
                Array.from({ length: instances }, (_, index) => [
                    `bench-static-${index}`,
                    `<h2>Definition ${index}</h2>${(
                        '<section class="panel"><p>' +
                            "Static text &amp; markup ".repeat(20) +
                            "</p><br /></section>\n"
                    ).repeat(20)}<b>{{label}}</b>`,
                ]),
            ),
            state: { label: "Small bound region & escaped text" },
        },
        uniqueHosts: {
            entry: Array.from(
                { length: instances },
                (_, index) =>
                    `<bench-unique index="${index}" data-label="item-${index}" style="--index:${index}"></bench-unique>`,
            ).join(""),
            templates: {
                "bench-unique":
                    '<article title="{{index}}">{{index}}/{{dataset.label}}</article>',
            },
            state: {},
        },
        shortCircuitConditions: {
            entry: "<bench-conditions></bench-conditions>".repeat(instances),
            templates: {
                "bench-conditions":
                    '<f-when value="{{ready || payload.first == payload.second}}">Ready</f-when><f-when value="{{blocked && payload.first == payload.second}}">Blocked</f-when>',
            },
            state: {
                ready: true,
                blocked: false,
                payload: {
                    first: "x".repeat(8192) + "a",
                    second: "x".repeat(8192) + "b",
                },
            },
        },
        literalProperties: {
            entry: (
                "<bench-literal :payload='" +
                JSON.stringify({
                    label: "Static & borrowed",
                    rows: Array.from({ length: 64 }, (_, index) => ({
                        label: `Unused ${index}`,
                        padding: "x".repeat(256),
                    })),
                }) +
                "'></bench-literal>"
            ).repeat(instances),
            templates: { "bench-literal": "<p>{{payload.label}}</p>" },
            state: {},
        },
        bindings: fixture("plain_bound_elements", instances),
        escapedBindings: {
            entry: '<f-repeat value="{{item in items}}"><p title="{{item}}">{{item}}</p></f-repeat>',
            templates: {},
            state: {
                items: Array.from(
                    { length: instances },
                    (_, index) => `${index}: ${"caf\u00e9 \u{1f600} &<>\"'".repeat(100)}`,
                ),
            },
        },
        escapePrefixAscii: escapePrefixFixture(instances, "ascii"),
        escapePrefixUnicode: escapePrefixFixture(instances, "unicode"),
        escapePrefixSparse: escapePrefixFixture(instances, "sparse"),
        escapePrefixEarly: escapePrefixFixture(instances, "early"),
        escapePrefixDense: escapePrefixFixture(instances, "dense"),
        escapePrefixHash: escapePrefixFixture(instances, "hash"),
        deepPaths: {
            entry: "<p>{{profile.name}}/{{profile.items.+00.title}}/{{profile.items.length}}</p>".repeat(
                instances,
            ),
            templates: {},
            state: { profile: { name: "Deep & escaped", items: [{ title: "First" }] } },
        },
        nestedRepeats: {
            entry: '<f-repeat value="{{group in groups}}"><f-repeat value="{{row in group.rows}}"><f-repeat value="{{cell in row.cells}}"><p>{{group.name}}/{{row.name}}/{{cell.name}}/{{$index}}/{{label}}</p></f-repeat></f-repeat></f-repeat>',
            templates: {},
            state: {
                label: "Root & fallback",
                groups: Array.from({ length: instances }, (_, group) => ({
                    name: `Group ${group}`,
                    rows: Array.from({ length: 3 }, (_, row) => ({
                        name: `Row ${row}`,
                        cells: Array.from({ length: 3 }, (_, cell) => ({
                            name: `Cell ${cell}`,
                        })),
                    })),
                })),
            },
        },
        repeated: fixture("repeat_custom_elements", instances),
        optionalBindings: {
            entry: "<optional-root></optional-root>",
            templates: {
                "optional-root":
                    '<f-repeat value="{{row in rows}}"><a href="{{optional.url}}" ' +
                    'title="link {{optional.title}} end" ?hidden="{{optional.hidden}}">' +
                    "{{optional.description}}/{{optional.detail}}/" +
                    "{{optional.caption}}</a></f-repeat>",
            },
            state: {
                rows: Array.from({ length: instances }, () => true),
            },
        },
        compositeStyles: {
            entry: "<style-root></style-root>",
            templates: {
                "style-root":
                    '<f-repeat value="{{row in rows}}">' +
                    '<i style="color:{{theme.palette.primary}};' +
                    "background:{{theme.palette.background}};" +
                    "border-color:{{theme.palette.border}};" +
                    'outline-color:{{theme.palette.outline}};">' +
                    "{{theme.label}}</i></f-repeat>",
            },
            state: {
                rows: Array.from({ length: instances }, () => true),
                theme: {
                    label: "card",
                    palette: {
                        primary: "royalblue",
                        background: "white",
                        border: "gray",
                        outline: "purple",
                        shadow: "none",
                    },
                },
            },
        },
        componentRepeats: {
            entry: "<repeat-root></repeat-root>",
            templates: {
                "repeat-card":
                    "<style>:host { display: block; }</style>" +
                    '<article data-id="{{id}}" ?data-active="{{active}}">' +
                    '<a href="{{url}}">{{label}}</a><slot></slot></article>',
                "repeat-root":
                    '<f-repeat value="{{row in rows}}">' +
                    '<repeat-card id="{{row.id}}" label="{{row.label}}" ' +
                    'url="{{row.url}}" ?active="{{row.active}}">' +
                    "{{row.detail}}</repeat-card></f-repeat>",
            },
            state: {
                rows: Array.from({ length: instances }, (_, id) => ({
                    id,
                    label: `Row ${id}`,
                    url: `#row-${id}`,
                    active: id % 2 === 0,
                    detail: `Detail ${id}`,
                })),
            },
        },
        componentScope0: componentScopeFixture(instances, 0),
        componentScope4: componentScopeFixture(instances, 4),
        componentScope5: componentScopeFixture(instances, 5),
        componentScope8: componentScopeFixture(instances, 8),
        componentScope12: componentScopeFixture(instances, 12),
        componentScope16: componentScopeFixture(instances, 16),
        componentScope17: componentScopeFixture(instances, 17),
        componentScope32: componentScopeFixture(instances, 32),
        componentDataset5: componentScopeFixture(instances, 5, true),
        componentDataset12: componentScopeFixture(instances, 12, true),
        componentDataset32: componentScopeFixture(instances, 32, true),
        stateValidationNested: stateValidationFixture(instances),
        stateValidationWide: stateValidationFixture(instances, "wide"),
        stateValidationScalars: stateValidationFixture(instances, "scalars"),
        stateValidationDuplicate: stateValidationFixture(instances, "duplicate"),
        deepShadows: nestedShadowFixture("deep"),
        staticShadows: nestedShadowFixture("static"),
        bindingShadows: nestedShadowFixture("binding"),
        shadowOpeningShort: shadowOpeningFixture(instances, "short"),
        shadowOpeningWide: shadowOpeningFixture(instances, "wide"),
        shadowOpeningTiny: shadowOpeningFixture(instances, "tiny"),
        shadowOpeningEmpty: shadowOpeningFixture(instances, "empty"),
        propertyPrefixGlobal4: componentPropertyPrefixFixture(instances, 4),
        propertyPrefixGlobal12: componentPropertyPrefixFixture(instances, 12),
        propertyPrefixRow4: componentPropertyPrefixFixture(instances, 4, "row"),
        propertyPrefixRow12: componentPropertyPrefixFixture(instances, 12, "row"),
        propertyPrefixAliasFallback4: componentPropertyPrefixFixture(
            instances,
            4,
            "alias-fallback",
        ),
        propertyPrefixAliasFallback12: componentPropertyPrefixFixture(
            instances,
            12,
            "alias-fallback",
        ),
        nested: {
            entry: "<bench-root></bench-root>".repeat(instances),
            templates: {
                "bench-root": '<bench-branch label="{{label}}"></bench-branch>',
                "bench-branch":
                    '<section><bench-leaf label="{{label}}"></bench-leaf></section>',
                "bench-leaf": "<p>{{label}}</p>",
            },
            state: { label: "Nested & escaped" },
        },
        largeState: fixture("large_state_overlay", instances, 1, 2000),
    };
    const selected = args.workloads?.split(",") ?? Object.keys(workloads);
    assert.ok(
        selected.length > 0 &&
            selected.every(name => Object.hasOwn(workloads, name)) &&
            new Set(selected).size === selected.length,
        "Unknown or duplicate workloads. Available: " + Object.keys(workloads).join(","),
    );
    const workloadSetupMs = performance.now() - workloadStart;
    const compilerStart = performance.now();
    const { compileServerArtifact } = require("../../server.js");
    require("../../wasm/microsoft_fast_build.js");
    const compilerLoadMs = performance.now() - compilerStart;
    const root = fileURLToPath(new URL("../../../../", import.meta.url));
    let source;
    try {
        source = {
            commit: execFileSync("git", ["rev-parse", "HEAD"], {
                cwd: root,
                encoding: "utf8",
            }).trim(),
            dirty:
                execFileSync("git", ["status", "--porcelain"], {
                    cwd: root,
                    encoding: "utf8",
                }).length > 0,
        };
    } catch {
        source = { commit: null, dirty: null };
    }

    const results = {
        reportVersion: 3,
        executionTarget: "native-node-host",
        renderOptions,
        node: process.version,
        platform: process.platform + "/" + process.arch,
        cpu: os.cpus()[0]?.model,
        source,
        addonPath: path.resolve(addonPath),
        addonSha256: hash(await fs.readFile(addonPath)),
        samples,
        instances,
        iterations,
        warmupIterations,
        compilerLoadMs,
        workloadSetupMs,
        profileDirectory,
        profiling: profileDirectory
            ? {
                  phase: args["profile-phase"],
                  durationMs: integer("profile-duration-ms"),
                  nativeProfiler: args["native-profiler"],
                  qualification:
                      "Instrumented diagnostic passes run after ordinary measurements; their elapsed times are not benchmark comparisons. V8 CPU profiles do not resolve Rust stacks. Native samplers may include startup/tail activity. No exclusive-host or speedup claim.",
              }
            : null,
        addonBytes: (await fs.stat(addonPath)).size,
        wasmBytes: (
            await fs.stat(require.resolve("../../wasm/microsoft_fast_build_bg.wasm"))
        ).size,
        workloads: {},
    };
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), "fast-server-bench-"));
    try {
        for (const name of selected) {
            const input = workloads[name];
            await fs.writeFile(path.join(directory, "input.json"), JSON.stringify(input));
            const start = performance.now();
            const artifact = compileServerArtifact(input.entry, input.templates);
            const compileMs = performance.now() - start;
            await fs.writeFile(path.join(directory, "server.artifact.json"), artifact);
            const record = {
                compileMs,
                artifactBytes: artifact.length,
                artifactSha256: hash(artifact),
                samples: [],
            };
            const expectedStateHash = hash(
                input.stateJson ?? JSON.stringify(input.state),
            );
            let expected;
            for (let sample = 0; sample < samples; sample++) {
                const profileName = name + "-" + (sample + 1);
                const processStart = performance.now();
                const response = execFileSync(
                    process.execPath,
                    [
                        "--expose-gc",
                        fileURLToPath(import.meta.url),
                        ...(profileDirectory
                            ? [
                                  "--profile-directory=" + profileDirectory,
                                  "--profile-name=" + profileName,
                                  "--profile-phase=" + args["profile-phase"],
                                  "--profile-duration-ms=" + args["profile-duration-ms"],
                                  "--native-profiler=" + args["native-profiler"],
                              ]
                            : []),
                        "--worker=native",
                        "--directory=" + directory,
                        "--iterations=" + iterations,
                        "--warmup=" + warmupIterations,
                        "--native-addon=" + addonPath,
                        ...(renderOptions.markersV2 ? ["--markers-v2"] : []),
                        "--attribute-name-strategy=" +
                            renderOptions.attributeNameStrategy,
                    ],
                    {
                        encoding: "utf8",
                        env: { ...process.env, NODE_DISABLE_COMPILE_CACHE: "1" },
                    },
                );
                const result = {
                    ...JSON.parse(response),
                    workerProcessMs: performance.now() - processStart,
                };
                assert.equal(result.stateJsonHash, expectedStateHash);
                expected ??= result.outputHash;
                assert.equal(result.outputHash, expected);
                if (profileDirectory) {
                    if (result.profiles.length === 1) {
                        result.cpuProfile = result.profiles[0].cpuProfile;
                    }
                    for (const profile of result.profiles) {
                        assert.equal(profile.outputHash, result.outputHash);
                        await fs.stat(profile.cpuProfile);
                    }
                }
                record.samples.push(result);
            }
            results.workloads[name] = record;
        }
        const output = JSON.stringify(results, null, 2) + "\n";
        if (args.output) await fs.writeFile(args.output, output, { flag: "wx" });
        else process.stdout.write(output);
    } finally {
        await fs.rm(directory, { recursive: true, force: true });
    }
}
