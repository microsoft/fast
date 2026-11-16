const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const { pathToFileURL } = require("node:url");
const { compileServerArtifact, compileServerModule } = require("../server.js");

test("Node-compiled executable artifacts deploy to a source-free native Rust host", async () => {
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
    const executable = build
        .trim()
        .split("\n")
        .map(line => JSON.parse(line))
        .find(message => message.executable)?.executable;
    assert.ok(executable, "cargo emitted the native example host");
    const entry = "<native-card></native-card>";
    const templates = {
        "native-card":
            '<f-when value="{{show}}"><b title="{{label}}">{{label}}</b></f-when><f-repeat value="{{item in items}}">{{item}}/{{$index}}</f-repeat>',
    };
    const bytes = compileServerArtifact(entry, templates);
    assert.ok(bytes instanceof Uint8Array);
    const ir = JSON.parse(Buffer.from(bytes).toString("utf8"));
    assert.equal(ir.format, "fast-server-native");
    assert.equal(ir.version, 3);
    assert.deepEqual(Object.keys(ir).sort(), [
        "components",
        "entry",
        "format",
        "fragments",
        "version",
    ]);
    assert.ok(Array.isArray(ir.entry));
    assert.equal(typeof ir.fragments, "object");
    assert.equal(Buffer.from(bytes).includes(Buffer.from("f-when")), false);
    const runtime = pathToFileURL(require.resolve("../server-runtime.mjs")).href;
    const server = await import(
        `data:text/javascript;base64,${Buffer.from(
            compileServerModule(entry, templates, runtime),
        ).toString("base64")}`
    );
    const directory = path.relative(
        process.cwd(),
        path.join(__dirname, `.native-artifact-${process.pid}`),
    );
    fs.mkdirSync(directory);
    try {
        const artifact = path.join(directory, "server.fast");
        fs.writeFileSync(artifact, bytes);
        for (const state of [
            { show: true, label: `<&"'😀`, items: ["one", null, { x: 1 }] },
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
            assert.equal(html, server.renderEntry(state));
        }
        fs.writeFileSync(artifact, JSON.stringify({ ...ir, version: 4 }));
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

test("packaged Rust crates accept compatible native assets after authored-manifest-only changes", () => {
    const root = path.resolve(__dirname, "../../..");
    const crate = path.join(root, "crates/microsoft-fast-build");
    const target = path.join(crate, "target");
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
    const packaged = path.join(
        target,
        "package",
        `microsoft-fast-build-${require("../package.json").version}`,
    );
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
        const artifact = path.join(directory, "server.fast");
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
