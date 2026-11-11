import { readFile } from "node:fs/promises";
import path from "node:path";
import { normalizePath } from "vite";
import {
    compileArtifacts,
    createPreparedRuntime,
} from "@microsoft/fast-build/prepared.js";

const sourceQuery = "?prepared-source";
const virtualId = "\0virtual:prepared-site";

/**
 * An application-owned Vite integration, not an additional filesystem watcher.
 * The preceding transform plugin owns preprocessing; this plugin compiles its output.
 */
export function preparedPlugin({
    root,
    entries,
    templates,
    loadArtifact,
    maxMemoryBytes,
}) {
    const sources = new Map();
    const artifacts = new Map();
    const snapshots = new Map();
    const files = new Set(
        [
            ...Object.values(entries),
            ...Object.values(templates).map(template => template.file),
        ].map(file => path.resolve(root, file)),
    );
    let config;
    let server;
    let runtime;
    let previous;
    let initializing;
    let updates = Promise.resolve();
    let disposed = false;
    let signalShutdown;
    const shutdownStarted = new Promise(resolve => {
        signalShutdown = resolve;
    });

    function compile() {
        function source(file) {
            const value = sources.get(path.resolve(root, file));
            if (value === undefined) {
                throw new Error(`Missing Vite-transformed input: ${file}`);
            }
            return value;
        }
        return compileArtifacts(
            {
                entries: Object.fromEntries(
                    Object.entries(entries).map(([name, file]) => [name, source(file)]),
                ),
                templates: Object.fromEntries(
                    Object.entries(templates).map(([name, { file, ...metadata }]) => [
                        name,
                        { ...metadata, content: source(file) },
                    ]),
                ),
            },
            { previous },
        );
    }

    function prune() {
        const live = new Set([...snapshots.values()].flatMap(ids => [...ids]));
        for (const id of artifacts.keys()) {
            if (!live.has(id)) {
                artifacts.delete(id);
            }
        }
    }

    function publish(compiled) {
        for (const [id, bytes] of compiled.artifacts) {
            artifacts.set(id, bytes);
        }
        try {
            if (runtime) {
                runtime.activate(compiled.manifest);
            } else {
                runtime = createPreparedRuntime({
                    manifest: compiled.manifest,
                    maxMemoryBytes,
                    loadArtifact: id => {
                        const read = async () => {
                            const bytes = artifacts.get(id);
                            if (!bytes) {
                                throw new Error(`Missing prepared artifact: ${id}`);
                            }
                            return bytes;
                        };
                        return loadArtifact ? loadArtifact(id, read) : read();
                    },
                });
            }
        } catch (error) {
            prune();
            throw error;
        }
        previous = compiled;
        const snapshot = runtime.snapshot;
        snapshots.set(snapshot, new Set(Object.keys(compiled.manifest.pieces)));
        snapshot.drained.then(() => {
            snapshots.delete(snapshot);
            prune();
        });
        return compiled.manifest;
    }

    async function prepare() {
        if (disposed) {
            throw new Error("Prepared Vite integration is disposed.");
        }
        if (!server) {
            throw new Error("Development preparation requires a Vite server.");
        }
        if (!initializing) {
            initializing = (async () => {
                for (const file of files) {
                    await server.transformRequest(normalizePath(file) + sourceQuery);
                }
                publish(compile());
                return runtime;
            })().catch(error => {
                initializing = undefined;
                throw error;
            });
        }
        return initializing;
    }

    return {
        name: "fixture:prepared-site",
        api: {
            prepare,
            shutdownStarted,
            get sources() {
                return new Map(sources);
            },
            get runtime() {
                return runtime;
            },
            get artifactIds() {
                return new Set(artifacts.keys());
            },
            get snapshotCount() {
                return snapshots.size;
            },
        },
        configResolved(resolved) {
            config = resolved;
        },
        configureServer(viteServer) {
            server = viteServer;
        },
        resolveId(id) {
            if (id === "virtual:prepared-site") {
                return virtualId;
            }
        },
        async load(id) {
            if (id.endsWith(sourceQuery)) {
                const file = path.normalize(id.slice(0, -sourceQuery.length));
                if (files.has(file)) {
                    this.addWatchFile(file);
                    return readFile(file, "utf8");
                }
            }
            if (id === virtualId) {
                if (!config.build.ssr) {
                    throw new Error("Prepared artifacts are server-only.");
                }
                return `
                    ${[...files].map(file => `import ${JSON.stringify(normalizePath(file) + sourceQuery)};`).join("\n")}
                    import { readFile } from "node:fs/promises";
                    import { createPreparedRuntime } from "@microsoft/fast-build/prepared.js";
                    const directory = new URL("./prepared/", import.meta.url);
                    export async function openSite({ loadArtifact, maxMemoryBytes } = {}) {
                        const manifest = JSON.parse(await readFile(new URL("manifest.json", directory), "utf8"));
                        const runtime = createPreparedRuntime({
                            manifest,
                            maxMemoryBytes,
                            loadArtifact: id => {
                                const read = () => readFile(new URL(id + ".fast-artifact.json", directory));
                                return loadArtifact ? loadArtifact(id, read) : read();
                            },
                        });
                        return { manifest, runtime };
                    }
                `;
            }
        },
        transform(code, id) {
            if (id.endsWith(sourceQuery)) {
                const file = path.normalize(id.slice(0, -sourceQuery.length));
                if (files.has(file)) {
                    sources.set(file, code);
                    return { code: `export default ${JSON.stringify(code)};`, map: null };
                }
            }
        },
        generateBundle() {
            if (!config.build.ssr) {
                return;
            }
            const compiled = compile();
            this.emitFile({
                type: "asset",
                fileName: "prepared/manifest.json",
                source: JSON.stringify(compiled.manifest),
            });
            for (const [id, bytes] of compiled.artifacts) {
                this.emitFile({
                    type: "asset",
                    fileName: `prepared/${id}.fast-artifact.json`,
                    source: bytes,
                });
            }
        },
        async handleHotUpdate(context) {
            if (disposed) {
                throw new Error("Prepared Vite integration is disposed.");
            }
            const file = path.normalize(context.file);
            if (!files.has(file) || !initializing) {
                return;
            }
            const update = updates.then(async () => {
                await initializing;
                const id = normalizePath(file) + sourceQuery;
                const module = server.moduleGraph.getModuleById(id);
                if (module) {
                    server.moduleGraph.invalidateModule(module);
                }
                await server.transformRequest(id);
                publish(compile());
                return [];
            });
            updates = update.catch(() => {});
            return update;
        },
        async closeBundle() {
            disposed = true;
            await initializing?.catch(() => {});
            await updates;
            const drained = runtime?.dispose();
            signalShutdown();
            await drained;
            artifacts.clear();
            previous = undefined;
        },
    };
}

export function fixtureTextTransform(label = "Vite transformed") {
    return {
        name: "fixture:authored-html-transform",
        transform(code, id) {
            if (id.endsWith(sourceQuery)) {
                if (code.includes("__BUILD_ERROR__")) {
                    throw new Error("Authored HTML preprocessing failed.");
                }
                return {
                    code: code.replaceAll("__BUILD_LABEL__", label),
                    map: null,
                };
            }
        },
    };
}
