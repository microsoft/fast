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
    const declaredOutputs = new Set();
    const inputs = options.map(component => {
        if (
            !component ||
            typeof component.tagName !== "string" ||
            !/^[a-z][a-z0-9._-]*-[a-z0-9._-]*$/.test(component.tagName) ||
            typeof component.template !== "string" ||
            !component.template.endsWith(".html") ||
            (component.stylesheet !== undefined &&
                (typeof component.stylesheet !== "string" ||
                    !component.stylesheet.endsWith(".css"))) ||
            typeof component.clientModule !== "string" ||
            !/\.(?:[cm]?[jt]s|[jt]sx)$/.test(component.clientModule) ||
            typeof component.className !== "string" ||
            !/^[A-Za-z_$][\w$]*$/.test(component.className) ||
            typeof component.generated !== "string" ||
            !component.generated
        ) {
            throw new Error(
                "Each component requires a custom-element tagName, template HTML path, clientModule path, named className, and generated directory; stylesheet must be a CSS path when provided.",
            );
        }
        if (
            [
                "srcDir",
                "root",
                "templates",
                "stylesheets",
                "templateTypes",
                "outDir",
                "components",
            ].some(name => Object.hasOwn(component, name))
        ) {
            throw new Error(
                "Components accept exact source paths and generated instead of nested mappings or glob settings.",
            );
        }
        const output = JSON.stringify([component.generated, component.tagName]);
        if (declaredOutputs.has(output)) {
            throw new Error(`Duplicate component output: ${component.tagName}`);
        }
        declaredOutputs.add(output);
        return component;
    });
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
        for (const { components, outDir, header } of mappings) {
            for (const component of components) {
                const { tagName, template, stylesheet, clientModule, className } =
                    component;
                for (const input of [template, stylesheet, clientModule].filter(
                    Boolean,
                )) {
                    if (!(await lstat(input)).isFile()) {
                        throw new Error(
                            `Expected a regular component source file: ${input}`,
                        );
                    }
                }
                for (const [input, suffix] of [
                    [template, ".template.ts"],
                    ...(stylesheet ? [[stylesheet, ".styles.ts"]] : []),
                ]) {
                    const output = resolve(outDir, tagName + suffix);
                    if (outputs.has(output)) {
                        throw new Error(
                            `Multiple sources generate the same output: ${output}`,
                        );
                    }
                    let converted;
                    try {
                        const source = await readFile(input, "utf8");
                        if (suffix === ".template.ts") {
                            let typeImport = relative(outDir, clientModule)
                                .split(sep)
                                .join("/")
                                .replace(/\.mts$/, ".mjs")
                                .replace(/\.cts$/, ".cjs")
                                .replace(/\.tsx?$/, ".js");
                            if (!typeImport.startsWith(".")) {
                                typeImport = `./${typeImport}`;
                            }
                            const result = converter.convert_template_with_options(
                                source,
                                "fast-v3-ts",
                                className,
                                typeImport,
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
            sourceFiles = new Set();
            outputRoots = [];
            const components = [];
            for (const component of inputs) {
                const resolved = { ...component };
                for (const name of ["template", "stylesheet", "clientModule"]) {
                    if (component[name] === undefined) {
                        continue;
                    }
                    const input = resolve(base, component[name]);
                    const canonical = await realpath(input);
                    sourceFiles.add(input);
                    sourceFiles.add(canonical);
                    resolved[name] = canonical;
                }
                components.push(resolved);
            }
            for (const component of components) {
                const destination = resolve(base, component.generated);
                if ([...sourceFiles].some(file => contains(destination, file))) {
                    throw new Error(
                        "A generated directory must not contain component inputs.",
                    );
                }
                await mkdir(destination, { recursive: true });
                const outDir = await realpath(destination);
                if ([...sourceFiles].some(file => contains(outDir, file))) {
                    throw new Error(
                        "A generated directory must not contain component inputs.",
                    );
                }
                let mapping = mappings.find(mapping => mapping.outDir === outDir);
                if (
                    !mapping &&
                    mappings.some(
                        mapping =>
                            contains(mapping.outDir, outDir) ||
                            contains(outDir, mapping.outDir),
                    )
                ) {
                    throw new Error(
                        "Source generation output directories must not overlap.",
                    );
                }
                outputRoots.push(destination, outDir);
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
