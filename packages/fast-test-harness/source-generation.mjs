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
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";

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

export function sourceGenerationPlugin(options) {
    let resolveComponentSources;
    try {
        const sources = createRequire(import.meta.url)(
            "@microsoft/fast-build/component-sources.js",
        );
        sources.validateComponentSources(options, "typescript");
        resolveComponentSources = sources.resolveComponentSources;
    } catch (error) {
        if (
            error.code === "MODULE_NOT_FOUND" ||
            error.code === "ERR_PACKAGE_PATH_NOT_EXPORTED"
        ) {
            throw new Error(
                "Configuring components requires @microsoft/fast-build with its component-sources.js API. Install or update the optional converter peer.",
                { cause: error },
            );
        }
        throw error;
    }
    let mappings;
    let sourceFiles;
    let outputRoots;
    let converter;
    let config;
    let base;
    let server;
    let closed = false;
    let pending = Promise.resolve();

    async function generate() {
        const outputs = new Map();
        const warnings = [];
        for (const { components, header } of mappings) {
            for (const component of components) {
                const {
                    template,
                    stylesheet,
                    clientModule,
                    className,
                    typeSourceImport,
                } = component;
                for (const input of [template, stylesheet, clientModule].filter(
                    Boolean,
                )) {
                    if (!(await lstat(input)).isFile()) {
                        throw new Error(
                            `Expected a regular component source file: ${input}`,
                        );
                    }
                }
                for (const [input, output] of [
                    [template, component.templateOutput],
                    ...(stylesheet ? [[stylesheet, component.stylesheetOutput]] : []),
                ]) {
                    if (outputs.has(output)) {
                        throw new Error(
                            `Multiple sources generate the same output: ${output}`,
                        );
                    }
                    let converted;
                    try {
                        const source = await readFile(input, "utf8");
                        if (input === template) {
                            const result = converter.convert_template_with_options(
                                source,
                                "fast-v3-ts",
                                className,
                                typeSourceImport,
                                true,
                            );
                            try {
                                converted = result.output;
                                warnings.push(
                                    ...result.warnings.map(
                                        warning => `${input}: ${warning}`,
                                    ),
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
                        throw new Error(
                            `Source generation failed for ${input}: ${error}`,
                            {
                                cause: error,
                            },
                        );
                    }
                    outputs.set(output, {
                        header,
                        content: `${header}// Source: ${JSON.stringify(relative(base, input).split(sep).join("/"))}\n${converted}`,
                    });
                }
            }
        }
        // Validate the entire batch before replacing any existing generated files.
        for (const [output, { header }] of outputs) {
            await readOutput(output, header);
        }
        for (const [output, { content, header }] of outputs) {
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
        for (const { outDir, header } of mappings) {
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
        }
        for (const warning of warnings) {
            config.logger.warn(warning);
        }
    }

    function isSource(file) {
        return (
            !outputRoots.some(directory => contains(directory, file)) &&
            !file.split(sep).some(part => part === "node_modules" || part === ".git") &&
            (/\.[cm]?tsx?$/.test(file) || sourceFiles.has(file))
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
                throw new Error("Configure components only once.");
            }
            base = config.configFile ? dirname(config.configFile) : config.root;
            mappings = [];
            const resolutionOptions = { baseDir: base, operation: "typescript" };
            let resolvedSources = await resolveComponentSources(
                options,
                resolutionOptions,
            );
            for (const component of resolvedSources.components) {
                await mkdir(component.generated, { recursive: true });
            }
            // Resolve again after creation to catch case-folded or newly aliased directories.
            resolvedSources = await resolveComponentSources(options, resolutionOptions);
            sourceFiles = new Set(resolvedSources.inputFiles);
            outputRoots = resolvedSources.generatedDirectories;
            for (const component of resolvedSources.components) {
                const outDir = component.generated;
                let mapping = mappings.find(mapping => mapping.outDir === outDir);
                if (!mapping) {
                    mapping = {
                        outDir,
                        components: [],
                        header: `// @generated by @microsoft/fast-test-harness (${JSON.stringify(
                            relative(outDir, base).split(sep).join("/"),
                        )}). DO NOT EDIT.\n`,
                    };
                    mappings.push(mapping);
                }
                mapping.components.push(component);
            }
            try {
                converter = createRequire(import.meta.url)(
                    "@microsoft/fast-build/wasm/convert/microsoft_fast_convert.js",
                );
            } catch (error) {
                throw new Error(
                    `Configuring components requires @microsoft/fast-build and its conversion WASM: ${error.message}`,
                    { cause: error },
                );
            }
            await enqueue();
        },
        async configureServer(vite) {
            server = vite;
            server.watcher.add([...sourceFiles]);
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
