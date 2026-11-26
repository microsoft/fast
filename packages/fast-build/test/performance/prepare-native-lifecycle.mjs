import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import * as fs from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const script = fileURLToPath(import.meta.url);
const hash = bytes => createHash("sha256").update(bytes).digest("hex");

export async function prepareLifecycle(
    argv,
    {
        now = () => performance.now(),
        readFile = fs.readFile,
        writeFile = fs.writeFile,
        loadCompiler = () => import("../../server.js"),
    } = {},
) {
    const { values, tokens } = parseArgs({
        args: argv,
        tokens: true,
        options: {
            entry: { type: "string" },
            templates: { type: "string" },
            artifact: { type: "string" },
            output: { type: "string" },
        },
    });
    const seen = new Set();
    for (const token of tokens) {
        assert.ok(!seen.has(token.name), `Repeated option: --${token.name}`);
        seen.add(token.name);
    }
    for (const name of ["entry", "templates", "artifact"]) {
        assert.ok(values[name]?.trim(), `Provide --${name}=path.`);
    }
    if (values.output !== undefined)
        assert.ok(values.output.trim(), "Invalid output path.");
    const entryPath = path.resolve(values.entry);
    const templatesPath = path.resolve(values.templates);
    const artifactPath = path.resolve(values.artifact);
    const outputPath =
        values.output === undefined ? undefined : path.resolve(values.output);
    assert.ok(
        ![entryPath, templatesPath, artifactPath].includes(outputPath),
        "Report must not overwrite an input or artifact.",
    );
    let start = now();
    const entry = await readFile(entryPath);
    const templatesBytes = await readFile(templatesPath);
    const sourceReadMs = now() - start;
    start = now();
    const templates = JSON.parse(templatesBytes.toString("utf8"));
    const entryText = entry.toString("utf8");
    const sourceDecodeMs = now() - start;
    start = now();
    const { compileServerArtifact } = await loadCompiler();
    const compilerImportMs = now() - start;
    start = now();
    const artifact = Buffer.from(compileServerArtifact(entryText, templates), "utf8");
    const compileMs = now() - start;
    start = now();
    await writeFile(artifactPath, artifact, { flag: "wx" });
    const artifactWriteMs = now() - start;
    const identity = (file, bytes) => ({
        path: file,
        bytes: bytes.length,
        sha256: hash(bytes),
    });
    const report = {
        reportVersion: 1,
        workflow: "native-lifecycle-preparation",
        sourceReadMs,
        sourceDecodeMs,
        compilerImportMs,
        compileMs,
        artifactWriteMs,
        identities: {
            entry: identity(entryPath, entry),
            templates: identity(templatesPath, templatesBytes),
            artifact: identity(artifactPath, artifact),
        },
        boundaries: {
            compilerImportMs:
                "Import the build-time compiler module; compiler WASM initialization may remain lazy until compilation.",
            compileMs:
                "Compile decoded entry and named templates, including any lazy compiler initialization, then encode artifact bytes.",
            artifactWriteMs:
                "Exclusive artifact write; no native host import, artifact load or render.",
        },
    };
    if (outputPath) {
        await writeFile(outputPath, JSON.stringify(report, null, 2) + "\n", {
            flag: "wx",
        });
    }
    return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === script) {
    try {
        console.log(
            JSON.stringify(await prepareLifecycle(process.argv.slice(2)), null, 2),
        );
    } catch (error) {
        console.error(error.stack);
        process.exitCode = 1;
    }
}
