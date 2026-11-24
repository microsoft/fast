import { randomUUID } from "node:crypto";
import {
    glob,
    lstat,
    mkdir,
    readFile,
    realpath,
    rename,
    unlink,
    writeFile,
} from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, extname, isAbsolute, join, relative, resolve, sep } from "node:path";

export const sourceGenerationPluginName = "fast-test-harness:source-generation";
export const sourceGenerationEvent = "fast-test-harness:source-change";

function contains(root, file) {
    const path = relative(root, file);
    return path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path);
}

async function readOutput(file, header) {
    try {
        const info = await lstat(file);
        if (info.isFile()) {
            const content = await readFile(file, "utf8");
            if (content.startsWith(header)) {
                return content;
            }
        }
        throw new Error(`Refusing to overwrite non-generated file: ${file}`);
    } catch (error) {
        if (error.code === "ENOENT") {
            return undefined;
        }
        throw error;
    }
}

async function ensureParent(root, file) {
    let directory = root;
    for (const segment of relative(root, dirname(file)).split(sep).filter(Boolean)) {
        directory = join(directory, segment);
        await mkdir(directory).catch(error => {
            if (error.code !== "EEXIST") {
                throw error;
            }
        });
        if (!(await lstat(directory)).isDirectory()) {
            throw new Error(`Generated output cannot use a symbolic link: ${directory}`);
        }
    }
}

export function sourceGenerationPlugin(options) {
    if (
        !options ||
        typeof options.root !== "string" ||
        !options.root ||
        typeof options.outDir !== "string" ||
        !options.outDir
    ) {
        throw new Error("sourceGeneration requires root and outDir paths.");
    }
    const patterns = [
        ...(options.templates === false ? [] : [options.templates ?? "**/*.html"]),
        ...(options.stylesheets === false ? [] : [options.stylesheets ?? "**/*.css"]),
    ].flat();
    if (patterns.some(pattern => typeof pattern !== "string" || !pattern)) {
        throw new Error("Source generation patterns must be nonempty strings.");
    }
    let root;
    let outDir;
    let sourceRoots;
    let outputRoots;
    let header;
    let converter;
    let config;
    let server;
    let closed = false;
    let pending = Promise.resolve();

    async function generate() {
        const outputs = new Map();
        const warnings = [];
        for await (const name of glob(patterns, {
            cwd: root,
            exclude: [
                "**/node_modules/**",
                "**/.git/**",
                ...(contains(root, outDir)
                    ? [`${relative(root, outDir).split(sep).join("/")}/**`]
                    : []),
            ],
        })) {
            const input = resolve(root, name);
            if (contains(outDir, input) || !(await lstat(input)).isFile()) {
                continue;
            }
            if (!contains(root, input) || !contains(root, await realpath(input))) {
                throw new Error(`Source generation input escapes root: ${input}`);
            }
            const extension = extname(input);
            if (extension !== ".html" && extension !== ".css") {
                throw new Error(`Expected an HTML or CSS source: ${input}`);
            }
            const sourceName = relative(root, input).split(sep).join("/");
            const suffix = extension === ".html" ? ".template.ts" : ".styles.ts";
            const output = resolve(
                outDir,
                sourceName.slice(0, -extension.length) + suffix,
            );
            if (outputs.has(output)) {
                throw new Error(`Multiple sources generate the same output: ${output}`);
            }
            let converted;
            try {
                const source = await readFile(input, "utf8");
                if (extension === ".html") {
                    const result = converter.convert_template_with_options(
                        source,
                        "fast-v3-ts",
                        undefined,
                        undefined,
                        true,
                    );
                    try {
                        converted = result.output;
                        warnings.push(
                            ...result.warnings.map(warning => `${input}: ${warning}`),
                        );
                    } finally {
                        result.free();
                    }
                } else {
                    converted = converter.convert_stylesheet(
                        source,
                        "fast-v3-ts",
                        "styles",
                        true,
                    );
                }
            } catch (error) {
                throw new Error(`Source generation failed for ${input}: ${error}`, {
                    cause: error,
                });
            }
            outputs.set(
                output,
                `${header}// Source: ${JSON.stringify(sourceName)}\n${converted}`,
            );
        }
        // Validate the entire batch before replacing any existing generated files.
        for (const output of outputs.keys()) {
            await ensureParent(outDir, output);
            await readOutput(output, header);
        }
        for (const [output, content] of outputs) {
            if ((await readOutput(output, header)) === content) {
                continue;
            }
            const temporary = `${output}.${randomUUID()}.tmp`;
            try {
                await writeFile(temporary, content, { flag: "wx" });
                await readOutput(output, header);
                await rename(temporary, output);
            } finally {
                await unlink(temporary).catch(error => {
                    if (error.code !== "ENOENT") {
                        throw error;
                    }
                });
            }
        }
        for await (const name of glob("**/*.ts", { cwd: outDir })) {
            const output = resolve(outDir, name);
            if (outputs.has(output)) {
                continue;
            }
            // Unowned files may coexist in the output tree and are never removed.
            if (
                (await lstat(output)).isFile() &&
                contains(outDir, await realpath(output)) &&
                (await readFile(output, "utf8")).startsWith(header)
            ) {
                await unlink(output);
            }
        }
        for (const warning of warnings) {
            config.logger.warn(warning);
        }
    }

    function isSource(file) {
        return (
            !outputRoots.some(directory => contains(directory, file)) &&
            !file.split(sep).some(part => part === "node_modules" || part === ".git") &&
            (/\.[cm]?tsx?$/.test(file) ||
                (sourceRoots.some(directory => contains(directory, file)) &&
                    /\.(html|css)$/.test(file)))
        );
    }

    function enqueue() {
        pending = pending
            .catch(() => {})
            .then(async () => {
                if (closed) {
                    return;
                }
                server?.moduleGraph.invalidateAll();
                await generate();
                if (server && !closed) {
                    server.watcher.emit(sourceGenerationEvent);
                    server.ws.send({ type: "full-reload" });
                }
            });
        pending.catch(error => {
            if (server && !closed) {
                config.logger.error(error.stack);
                server.ws.send({
                    type: "error",
                    err: {
                        message: error.message,
                        stack: error.stack,
                        plugin: sourceGenerationPluginName,
                    },
                });
            }
        });
        return pending;
    }

    function onChange(event, file) {
        if (["add", "change", "unlink"].includes(event) && isSource(file)) {
            enqueue();
        }
    }

    async function ready() {
        let current;
        do {
            current = pending;
            await current;
        } while (current !== pending);
    }

    return {
        name: sourceGenerationPluginName,
        api: { ready },
        config(userConfig) {
            if (userConfig.server?.watch === null) {
                return;
            }
            return {
                server: {
                    watch: {
                        awaitWriteFinish: userConfig.server?.watch?.awaitWriteFinish ?? {
                            stabilityThreshold: 50,
                            pollInterval: 10,
                        },
                    },
                },
            };
        },
        async configResolved(resolved) {
            config = resolved;
            closed = false;
            server = undefined;
            if (
                config.plugins.filter(p => p.name === sourceGenerationPluginName).length >
                1
            ) {
                throw new Error("Configure sourceGeneration only once.");
            }
            const base = config.configFile ? dirname(config.configFile) : config.root;
            const source = resolve(base, options.root);
            root = await realpath(source);
            sourceRoots = [source, root];
            const destination = resolve(base, options.outDir);
            if (contains(destination, root)) {
                throw new Error("Source generation outDir must not contain root.");
            }
            await mkdir(destination, { recursive: true });
            outDir = await realpath(destination);
            outputRoots = [destination, outDir];
            if (contains(outDir, root)) {
                throw new Error("Source generation outDir must not contain root.");
            }
            header = `// @generated by @microsoft/fast-test-harness (${JSON.stringify(
                relative(outDir, root).split(sep).join("/"),
            )}). DO NOT EDIT.\n`;
            try {
                converter = createRequire(import.meta.url)(
                    "@microsoft/fast-build/wasm/convert/microsoft_fast_convert.js",
                );
            } catch (error) {
                throw new Error(
                    `sourceGeneration requires @microsoft/fast-build and its conversion WASM: ${error.message}`,
                    { cause: error },
                );
            }
            await enqueue();
        },
        async configureServer(vite) {
            server = vite;
            server.watcher.add(root);
            server.watcher.on("all", onChange);
            await enqueue();
        },
        async load(id) {
            const file = id.split("?")[0];
            if (
                isAbsolute(file) &&
                (outputRoots.some(directory => contains(directory, file)) ||
                    isSource(file))
            ) {
                await ready();
            }
        },
        async handleHotUpdate(context) {
            if (isSource(context.file)) {
                await ready().catch(() => {});
                return [];
            }
        },
        async closeBundle() {
            closed = true;
            server?.watcher.off("all", onChange);
            await pending.catch(() => {});
        },
    };
}
