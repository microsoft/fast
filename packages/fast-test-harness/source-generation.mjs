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
    const inputs = options.map(options => {
        if (
            !options ||
            typeof options.srcDir !== "string" ||
            !options.srcDir ||
            typeof options.outDir !== "string" ||
            !options.outDir
        ) {
            throw new Error("Each sources mapping requires srcDir and outDir paths.");
        }
        const patterns = [
            ...(options.templates === false ? [] : [options.templates ?? "**/*.html"]),
            ...(options.stylesheets === false ? [] : [options.stylesheets ?? "**/*.css"]),
        ].flat();
        if (patterns.some(pattern => typeof pattern !== "string" || !pattern)) {
            throw new Error("Source generation patterns must be nonempty strings.");
        }
        const templateTypes = options.templateTypes ?? {};
        if (
            typeof templateTypes !== "object" ||
            Array.isArray(templateTypes) ||
            Object.entries(templateTypes).some(
                ([name, type]) =>
                    isAbsolute(name) ||
                    name.includes("\\") ||
                    name
                        .split("/")
                        .some(part => !part || part === "." || part === "..") ||
                    !name.endsWith(".html") ||
                    !type ||
                    typeof type.typeSource !== "string" ||
                    !type.typeSource ||
                    (type.typeSourceImport !== undefined &&
                        (typeof type.typeSourceImport !== "string" ||
                            !type.typeSourceImport)),
            )
        ) {
            throw new Error(
                "templateTypes must map srcDir-relative HTML paths to typeSource and optional typeSourceImport strings.",
            );
        }
        return { ...options, patterns, templateTypes };
    });
    let mappings;
    let sourceRoots;
    let outputRoots;
    let converter;
    let config;
    let server;
    let closed = false;
    let pending = Promise.resolve();

    async function generate() {
        const outputs = new Map();
        const warnings = [];
        for (const {
            srcDir: root,
            outDir,
            header,
            patterns,
            templateTypes,
        } of mappings) {
            for await (const name of glob(patterns, {
                cwd: root,
                exclude: [
                    "**/node_modules/**",
                    "**/.git/**",
                    ...mappings
                        .filter(mapping => contains(root, mapping.outDir))
                        .map(
                            mapping =>
                                `${relative(root, mapping.outDir).split(sep).join("/")}/**`,
                        ),
                ],
            })) {
                const input = resolve(root, name);
                if (
                    outputRoots.some(directory => contains(directory, input)) ||
                    !(await lstat(input)).isFile()
                ) {
                    continue;
                }
                if (!contains(root, input) || !contains(root, await realpath(input))) {
                    throw new Error(`Source generation input escapes srcDir: ${input}`);
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
                    throw new Error(
                        `Multiple sources generate the same output: ${output}`,
                    );
                }
                let converted;
                try {
                    const source = await readFile(input, "utf8");
                    if (extension === ".html") {
                        const type = templateTypes[sourceName];
                        const result = converter.convert_template_with_options(
                            source,
                            "fast-v3-ts",
                            type?.typeSource,
                            type?.typeSourceImport,
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
                outputs.set(output, {
                    outDir,
                    header,
                    content: `${header}// Source: ${JSON.stringify(sourceName)}\n${converted}`,
                });
            }
        }
        // Validate the entire batch before replacing any existing generated files.
        for (const [output, { outDir, header }] of outputs) {
            await ensureParent(outDir, output);
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
                throw new Error("Configure sources only once.");
            }
            const base = config.configFile ? dirname(config.configFile) : config.root;
            mappings = [];
            sourceRoots = [];
            outputRoots = [];
            for (const options of inputs) {
                const source = resolve(base, options.srcDir);
                const srcDir = await realpath(source);
                sourceRoots.push(source, srcDir);
                mappings.push({ ...options, srcDir });
            }
            for (const mapping of mappings) {
                const destination = resolve(base, mapping.outDir);
                if (sourceRoots.some(root => contains(destination, root))) {
                    throw new Error("Source generation outDir must not contain srcDir.");
                }
                await mkdir(destination, { recursive: true });
                const outDir = await realpath(destination);
                if (sourceRoots.some(root => contains(outDir, root))) {
                    throw new Error("Source generation outDir must not contain srcDir.");
                }
                if (
                    outputRoots.some(
                        root => contains(root, outDir) || contains(outDir, root),
                    )
                ) {
                    throw new Error(
                        "Source generation output directories must not overlap.",
                    );
                }
                outputRoots.push(destination, outDir);
                mapping.outDir = outDir;
                mapping.header = `// @generated by @microsoft/fast-test-harness (${JSON.stringify(
                    relative(outDir, mapping.srcDir).split(sep).join("/"),
                )}). DO NOT EDIT.\n`;
            }
            try {
                converter = createRequire(import.meta.url)(
                    "@microsoft/fast-build/wasm/convert/microsoft_fast_convert.js",
                );
            } catch (error) {
                throw new Error(
                    `Configuring sources requires @microsoft/fast-build and its conversion WASM: ${error.message}`,
                    { cause: error },
                );
            }
            await enqueue();
        },
        async configureServer(vite) {
            server = vite;
            server.watcher.add(mappings.map(mapping => mapping.srcDir));
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
