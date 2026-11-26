import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { loadNativeHost } from "../native-host.mjs";
import { compileServerArtifact } from "../server.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NativeProgram = loadNativeHost(process.env.FAST_NATIVE_ADDON);

test("Vite emits relocatable native artifact data with transformed inputs", async t => {
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
                name: "fixture:server-native",
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
                    const bytes = compileServerArtifact("<demo-card></demo-card>", {
                        "demo-card": {
                            content,
                            hostAttributes: [{ name: "role", value: "article" }],
                        },
                    });
                    this.emitFile({
                        type: "asset",
                        fileName: "server.artifact.json",
                        source: bytes,
                    });
                    return "export const artifact = 'server.artifact.json';";
                },
            },
        ],
        build: {
            ssr: true,
            emitAssets: true,
            outDir: path.join(directory, "output"),
            rollupOptions: {
                input: "virtual:server",
                output: { entryFileNames: "assets.mjs" },
            },
        },
    });
    const relocated = path.join(directory, "relocated");
    await fs.rename(path.join(directory, "output"), relocated);
    await fs.rm(input);
    const filename = path.join(relocated, "server.artifact.json");
    const source = await fs.readFile(filename, "utf8");
    assert.doesNotMatch(source, /WebAssembly|__BUILD_LABEL__/);
    assert.equal(source.includes(directory), false);
    const server = new NativeProgram(Buffer.from(source, "utf8"));
    assert.equal(
        server.renderEntryJson(Buffer.from('{"title":"<&"}')).toString("utf8"),
        '<demo-card role="article"><template shadowrootmode="open"><h2>Vite transformed <!--fe:b-->&lt;&amp;<!--fe:/b--></h2></template></demo-card>',
    );
    assert.match(
        server.renderEntryJson(Buffer.from('{"title":"second"}')).toString("utf8"),
        /second/,
    );
});
