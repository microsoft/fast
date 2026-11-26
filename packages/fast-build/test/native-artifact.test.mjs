import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { loadNativeHost } from "../native-host.mjs";
import { compileServerArtifact } from "../server.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NativeProgram = loadNativeHost(process.env.FAST_NATIVE_ADDON);

let executable;

function nativeExecutable() {
    if (executable) return executable;
    const root = path.resolve(__dirname, "../../..");
    const manifest = path.join(root, "crates/microsoft-fast-build/Cargo.toml");
    const build = execFileSync(
        "cargo",
        [
            "build",
            "--quiet",
            "--manifest-path",
            manifest,
            "--example",
            "native-render",
            "--message-format=json",
        ],
        { encoding: "utf8", timeout: 120_000 },
    );
    executable = build
        .trim()
        .split("\n")
        .map(line => JSON.parse(line))
        .find(message => message.executable)?.executable;
    assert.ok(executable, "cargo emitted the native example host");
    return executable;
}

test("Node-compiled executable artifacts deploy to a source-free native Rust host", async () => {
    const executable = nativeExecutable();
    const entry = "<native-card></native-card>";
    const templates = {
        "native-card":
            '<f-when value="{{show}}"><b title="{{label}}" data-parts=\'pre "&amp;/{{label}}/{{tail}}\'>{{label}}</b><a href="{{url}}">{{scalar}}</a></f-when><f-repeat value="{{item in items}}">{{item}}/{{$index}}</f-repeat>',
    };
    const bytes = compileServerArtifact(entry, templates);
    assert.ok(bytes instanceof Uint8Array);
    const ir = JSON.parse(Buffer.from(bytes).toString("utf8"));
    assert.equal(ir.format, "fast-server-native");
    assert.equal(ir.version, 2);
    assert.deepEqual(Object.keys(ir).sort(), ["format", "inputs", "program", "version"]);
    assert.ok(Array.isArray(ir.program.entry));
    assert.equal(typeof ir.program.templates, "object");
    assert.equal(JSON.stringify(ir.program).includes("f-when"), false);
    assert.equal(ir.inputs.entry, entry);
    assert.equal(ir.inputs.templates["native-card"].content, templates["native-card"]);
    const server = new NativeProgram(Buffer.from(bytes));
    const directory = path.relative(
        process.cwd(),
        path.join(__dirname, `.native-artifact-${process.pid}`),
    );
    fs.mkdirSync(directory);
    try {
        const artifact = path.join(directory, "server.artifact.json");
        fs.writeFileSync(artifact, bytes);
        for (const state of [
            {
                show: true,
                label: `<&"'😀`,
                tail: "é尾",
                url: 3.5,
                scalar: false,
                items: ["one", null, { x: 1 }],
            },
            { show: true, label: "&".repeat(10_000), tail: null, url: {}, scalar: [] },
            { show: false, items: [] },
            {},
        ]) {
            const html = execFileSync(executable, [artifact], {
                encoding: "utf8",
                input: JSON.stringify(state),
                // The deployed host cannot discover a JavaScript engine via PATH.
                env: { ...process.env, PATH: "" },
                timeout: 10_000,
            });
            assert.equal(
                html,
                server
                    .renderEntryJson(Buffer.from(JSON.stringify(state)))
                    .toString("utf8"),
            );
        }
        fs.writeFileSync(artifact, JSON.stringify({ ...ir, version: 99 }));
        assert.throws(
            () =>
                execFileSync(executable, [artifact], {
                    input: "{}",
                    stdio: ["pipe", "pipe", "pipe"],
                    timeout: 10_000,
                }),
            error => error.stderr.toString().includes("incompatible-artifact"),
        );
    } finally {
        fs.rmSync(directory, { recursive: true, force: true });
    }
});

test("native output preserves frozen UTF-8 workload contracts", async () => {
    const executable = nativeExecutable();
    const { fixture, outputStats } = await import("./performance/fixtures.mjs");
    const baseline = JSON.parse(
        fs.readFileSync(
            new URL(
                "../../../crates/microsoft-fast-build/benches/fixtures/expected-baseline.json",
                import.meta.url,
            ),
            "utf8",
        ),
    );
    const directory = path.join(__dirname, `.native-frozen-${process.pid}`);
    fs.mkdirSync(directory);
    try {
        const artifact = path.join(directory, "server.artifact.json");
        for (const record of baseline.filter(record => record.mode === "v3")) {
            const input = fixture(
                record.case,
                record.count,
                record.payload,
                record.rootKeys,
            );
            fs.writeFileSync(
                artifact,
                compileServerArtifact(input.entry, input.templates),
            );
            const html = execFileSync(executable, [artifact], {
                encoding: "utf8",
                input: JSON.stringify(input.state),
                env: { ...process.env, PATH: "" },
                maxBuffer: record.outputBytes + 64 * 1024,
                timeout: 10_000,
            });
            const {
                case: _case,
                count: _count,
                mode: _mode,
                payload: _payload,
                rootKeys: _root,
                ...expected
            } = record;
            assert.deepEqual(outputStats(html), expected);
        }
    } finally {
        fs.rmSync(directory, { recursive: true, force: true });
    }
});

test("packaged Rust crates accept compatible native assets after authored-manifest-only changes", () => {
    const root = path.resolve(__dirname, "../../..");
    const crate = path.join(root, "crates/microsoft-fast-build");
    const target = path.join(crate, "target", "packaged-native");
    execFileSync(
        "cargo",
        [
            "package",
            "--manifest-path",
            path.join(crate, "Cargo.toml"),
            "--target-dir",
            target,
            "--allow-dirty",
            "--locked",
            "--offline",
        ],
        { encoding: "utf8", timeout: 180_000, stdio: ["ignore", "pipe", "pipe"] },
    );
    const { version } = JSON.parse(
        fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    );
    const packaged = path.join(target, "package", `microsoft-fast-build-${version}`);
    assert.ok(fs.existsSync(path.join(packaged, "Cargo.toml.orig")));
    const hostTarget = path.join(packaged, "native-host-target");
    const buildHost = () => {
        const build = execFileSync(
            "cargo",
            [
                "build",
                "--quiet",
                "--locked",
                "--offline",
                "--manifest-path",
                path.join(packaged, "Cargo.toml"),
                "--target-dir",
                hostTarget,
                "--example",
                "native-render",
                "--message-format=json",
            ],
            { encoding: "utf8", timeout: 120_000 },
        );
        const executable = build
            .trim()
            .split("\n")
            .map(line => JSON.parse(line))
            .find(message => message.executable)?.executable;
        assert.ok(executable, "cargo emitted the packaged native host");
        return executable;
    };
    const executable = buildHost();
    const directory = fs.mkdtempSync(path.join(__dirname, ".packaged-native-"));
    try {
        const artifact = path.join(directory, "server.artifact.json");
        fs.writeFileSync(artifact, compileServerArtifact("<p>{{title}}</p>"));
        const html = execFileSync(executable, [artifact], {
            encoding: "utf8",
            input: JSON.stringify({ title: "Packaged & native" }),
            env: { ...process.env, PATH: "" },
            timeout: 10_000,
        });
        assert.equal(html, "<p>Packaged &amp; native</p>");

        const manifest = path.join(packaged, "Cargo.toml.orig");
        const original = fs.readFileSync(manifest, "utf8");
        try {
            fs.appendFileSync(manifest, "\n# Changed authored manifest only.\n");
            execFileSync(
                "cargo",
                [
                    "clean",
                    "--quiet",
                    "--offline",
                    "--manifest-path",
                    path.join(packaged, "Cargo.toml"),
                    "--target-dir",
                    hostTarget,
                    "--package",
                    "microsoft-fast-build",
                ],
                { encoding: "utf8", timeout: 10_000 },
            );
            const rebuiltExecutable = buildHost();
            const rebuiltHtml = execFileSync(rebuiltExecutable, [artifact], {
                encoding: "utf8",
                input: JSON.stringify({ title: "Packaged & native" }),
                env: { ...process.env, PATH: "" },
                timeout: 10_000,
            });
            assert.equal(rebuiltHtml, html);
        } finally {
            fs.writeFileSync(manifest, original);
            buildHost();
        }
    } finally {
        fs.rmSync(directory, { recursive: true, force: true });
    }
});
