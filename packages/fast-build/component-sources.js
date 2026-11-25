const { lstat, readlink, realpath, stat } = require("node:fs/promises");
const path = require("node:path");

function contains(directory, filename) {
    const relative = path.relative(directory, filename);
    return (
        relative !== ".." &&
        !relative.startsWith(`..${path.sep}`) &&
        !path.isAbsolute(relative)
    );
}

function pathKey(filename) {
    return process.platform === "win32" ? filename.toLowerCase() : filename;
}

/**
 * Validate explicit component records without accessing files or loading a compiler.
 * @param {readonly import("./component-sources.js").ComponentSource[]} components
 * @param {"ssr" | "typescript" | "html"} operation
 */
function validateComponentSources(components, operation) {
    if (!["ssr", "typescript", "html"].includes(operation)) {
        throw new Error("Component source operation must be ssr, typescript, or html.");
    }
    if (!Array.isArray(components)) {
        throw new Error("components must be an array.");
    }
    const outputs = new Set();
    for (const component of components) {
        if (
            !component ||
            typeof component.tagName !== "string" ||
            !/^[a-z][a-z0-9._-]*$/.test(component.tagName) ||
            !component.tagName.includes("-") ||
            typeof component.template !== "string" ||
            !component.template.endsWith(".html") ||
            (component.stylesheet !== undefined &&
                (typeof component.stylesheet !== "string" ||
                    !component.stylesheet.endsWith(".css"))) ||
            (component.clientModule !== undefined &&
                (typeof component.clientModule !== "string" ||
                    !/\.(?:[cm]?[jt]s|[jt]sx)$/.test(component.clientModule))) ||
            (component.className !== undefined &&
                (typeof component.className !== "string" ||
                    !/^[A-Za-z_$][\w$]*$/.test(component.className))) ||
            (component.generated !== undefined &&
                (typeof component.generated !== "string" || !component.generated)) ||
            (operation === "typescript" &&
                (component.clientModule === undefined ||
                    component.className === undefined)) ||
            (operation !== "ssr" && component.generated === undefined)
        ) {
            throw new Error(
                "Each component requires a custom-element tagName and template HTML path; " +
                    "TypeScript generation also requires clientModule, named className, and generated directory. " +
                    "HTML conversion requires a generated directory. " +
                    "stylesheet must be a CSS path when provided.",
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
        const output =
            operation === "ssr"
                ? component.tagName
                : JSON.stringify([component.generated, component.tagName]);
        if (outputs.has(output)) {
            throw new Error(`Duplicate component output: ${component.tagName}`);
        }
        outputs.add(output);
    }
}

async function canonicalDirectory(directory) {
    const segments = [];
    const links = new Set();
    let current = directory;
    while (true) {
        let info;
        try {
            info = await lstat(current);
        } catch (error) {
            if (error.code !== "ENOENT" || path.dirname(current) === current) {
                throw error;
            }
            segments.unshift(path.basename(current));
            current = path.dirname(current);
            continue;
        }
        let canonical;
        try {
            canonical = await realpath(current);
        } catch (error) {
            if (!info.isSymbolicLink() || error.code !== "ENOENT") {
                throw error;
            }
            if (links.has(pathKey(current))) {
                throw new Error(`Circular generated directory symlink: ${current}`);
            }
            links.add(pathKey(current));
            const target = await readlink(current);
            // Keep .. segments until their existing symlink prefixes are canonicalized.
            current = path.isAbsolute(target)
                ? target
                : `${path.dirname(current)}${path.sep}${target}`;
            continue;
        }
        if (!(await stat(canonical)).isDirectory()) {
            throw new Error(`Generated directory parent is not a directory: ${current}`);
        }
        return path.resolve(canonical, ...segments);
    }
}

/**
 * Resolve component files and planned outputs without importing client modules or writing files.
 * @param {readonly import("./component-sources.js").ComponentSource[]} components
 * @param {import("./component-sources.js").ComponentSourceOptions} options
 * @returns {Promise<import("./component-sources.js").ComponentSourceResolution>}
 */
async function resolveComponentSources(components, options) {
    validateComponentSources(components, options?.operation);
    if (typeof options.baseDir !== "string" || !path.isAbsolute(options.baseDir)) {
        throw new Error("Component sources require an explicit absolute baseDir.");
    }
    if (options.operation === "html") {
        if (
            typeof options.templateSuffix !== "string" ||
            !/^\.[a-z0-9.-]+$/.test(options.templateSuffix) ||
            !options.templateSuffix.endsWith(".html")
        ) {
            throw new Error("HTML conversion requires a templateSuffix ending in .html.");
        }
    } else if (options.templateSuffix !== undefined) {
        throw new Error("templateSuffix applies only to HTML conversion.");
    }
    const resolved = [];
    const inputFiles = new Set();
    const generatedDirectories = new Set();
    const canonicalOutputs = new Map();
    for (const component of components) {
        const source = { ...component };
        for (const field of ["template", "stylesheet", "clientModule"]) {
            if (component[field] === undefined) {
                continue;
            }
            const filename = path.resolve(options.baseDir, component[field]);
            try {
                const canonical = await realpath(filename);
                if (!(await stat(canonical)).isFile()) {
                    throw new Error("Expected a regular file.");
                }
                source[field] = canonical;
                inputFiles.add(filename);
                inputFiles.add(canonical);
            } catch (error) {
                throw new Error(
                    `Component "${component.tagName}" ${field} "${filename}": ${error.message}`,
                    { cause: error },
                );
            }
        }
        if (component.generated !== undefined) {
            const directory = path.resolve(options.baseDir, component.generated);
            source.generated =
                options.operation === "ssr"
                    ? directory
                    : await canonicalDirectory(directory);
            if (options.operation !== "ssr") {
                generatedDirectories.add(directory);
                generatedDirectories.add(source.generated);
                canonicalOutputs.set(pathKey(source.generated), source.generated);
            }
        }
        resolved.push(source);
    }
    for (const directory of generatedDirectories) {
        if ([...inputFiles].some(filename => contains(directory, filename))) {
            throw new Error("A generated directory must not contain component inputs.");
        }
    }
    const directories = [...canonicalOutputs.values()];
    for (let index = 0; index < directories.length; index++) {
        const directory = directories[index];
        if (
            directories
                .slice(index + 1)
                .some(other => contains(directory, other) || contains(other, directory))
        ) {
            throw new Error("Source generation output directories must not overlap.");
        }
    }
    const outputs = new Set();
    for (const component of resolved) {
        if (options.operation === "ssr") {
            continue;
        }
        const suffix =
            options.operation === "typescript" ? ".template.ts" : options.templateSuffix;
        component.templateOutput = path.join(
            component.generated,
            component.tagName + suffix,
        );
        if (options.operation === "typescript") {
            let specifier = path.relative(component.generated, component.clientModule);
            if (path.isAbsolute(specifier)) {
                throw new Error(
                    `Cannot derive a relative type import for "${component.tagName}" across filesystem roots.`,
                );
            }
            specifier = specifier
                .split(path.sep)
                .join("/")
                .replace(/\.mts$/, ".mjs")
                .replace(/\.cts$/, ".cjs")
                .replace(/\.tsx?$/, ".js");
            component.typeSourceImport =
                specifier.startsWith("./") || specifier.startsWith("../")
                    ? specifier
                    : `./${specifier}`;
            if (component.stylesheet !== undefined) {
                component.stylesheetOutput = path.join(
                    component.generated,
                    component.tagName + ".styles.ts",
                );
            }
        }
        for (const output of [
            component.templateOutput,
            component.stylesheetOutput,
        ].filter(Boolean)) {
            const key = pathKey(output);
            if (outputs.has(key)) {
                throw new Error(`Multiple sources generate the same output: ${output}`);
            }
            outputs.add(key);
        }
    }
    return {
        components: resolved,
        inputFiles: [...inputFiles],
        generatedDirectories: [...generatedDirectories],
    };
}

exports.validateComponentSources = validateComponentSources;
exports.resolveComponentSources = resolveComponentSources;
