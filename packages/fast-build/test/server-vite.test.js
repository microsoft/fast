const assert = require("node:assert/strict");
const { randomUUID } = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");
const { test } = require("node:test");
const { pathToFileURL } = require("node:url");
const { compileServerModule } = require("../server.js");

test("Vite SSR emits relocatable AOT code with transformed inputs and no compiler", async t => {
    const { build } = await import("vite");
    const directory = path.join(__dirname, `server-vite-${randomUUID()}`);
    await fs.mkdir(directory);
    t.after(() => fs.rm(directory, { recursive: true, force: true }));
    const input = path.join(directory, "card.html");
    await fs.writeFile(input, "<h2>__BUILD_LABEL__ {{title}}</h2>");
    await build({
        configFile: false,
        root: directory,
        logLevel: "silent",
        plugins: [
            {
                name: "fixture:server-js",
                resolveId(id) {
                    if (id === "virtual:server") return "\0virtual:server";
                },
                async load(id) {
                    if (id !== "\0virtual:server") return;
                    this.addWatchFile(input);
                    const content = (await fs.readFile(input, "utf8")).replace(
                        "__BUILD_LABEL__",
                        "Vite transformed",
                    );
                    return compileServerModule("<demo-card></demo-card>", {
                        "demo-card": {
                            content,
                            hostAttributes: [{ name: "role", value: "article" }],
                        },
                    });
                },
            },
        ],
        build: {
            ssr: true,
            outDir: path.join(directory, "output"),
            rollupOptions: {
                input: "virtual:server",
                external: ["@microsoft/fast-build/server-runtime.mjs"],
                output: { entryFileNames: "server.mjs" },
            },
        },
    });
    const relocated = path.join(directory, "relocated");
    await fs.rename(path.join(directory, "output"), relocated);
    await fs.rm(input);
    const filename = path.join(relocated, "server.mjs");
    const source = await fs.readFile(filename, "utf8");
    assert.doesNotMatch(source, /compileServerModule|WebAssembly|__BUILD_LABEL__/);
    assert.equal(source.includes(directory), false);
    const server = await import(pathToFileURL(filename).href);
    assert.equal(
        server.renderEntry({ title: "<&" }),
        '<demo-card role="article"><template shadowrootmode="open" shadowroot="open"><h2>Vite transformed <!--fe:b-->&lt;&amp;<!--fe:/b--></h2></template></demo-card>',
    );
    assert.match(server.renderEntry({ title: "second" }), /second/);
});
