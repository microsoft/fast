/**
 * Creates component API documents for all components in the src directory. Ensure API source documents
 * exist prior to runnning this script by running `npm run build:api`
 *
 * @param ignore-dir - a comma separated list of directories to ignore
 * @param component-dir - the source directory holding components
 * @param typedoc-src - the source of generated typedoc API data
 */
const { createWriteStream, readdirSync, readFileSync } = require("fs");
const path = require("path");
const glob = require("glob");
const transformMarkdownLinks = require("transform-markdown-links");
const mkdirp = require("mkdirp");

/**
 * Retrieves arguments by name
 */

function getArg(raw, required = false) {
    const index = process.argv.indexOf(raw);

    if (index === -1) {
        if (required) {
            throw new Error(`Required argument "${raw}" was not provided`);
        }
    } else {
        return process.argv[index + 1];
    }
}

/**
 * Get a list of all directories
 *
 * @param source: string - the directory to look in
 * @returns string[]
 */
function getDirectories(source) {
    return readdirSync(source, { withFileTypes: true })
        .filter(dir => dir.isDirectory())
        .map(dir => dir.name);
}

/**
 * Primary source
 */
const componentSource = path.resolve(
    __dirname,
    process.cwd(),
    getArg("--component-dir", true)
);

const typedocSource = path.resolve(
    __dirname,
    process.cwd(),
    getArg("--typedoc-src", true)
);
const ignoreDirs =
    typeof getArg("--ignore-dir") === "string"
        ? getArg("--ignore-dir")
              .split(",")
              .map(value => value.trim())
        : [];
const componentDirectories = getDirectories(componentSource).filter(
    src => !ignoreDirs.includes(src)
);
const entryMatchNames = componentDirectories.map(value => {
    const sanatized = value.replace("-", "").replace("_", "");

    return {
        folderName: value,
        entries: ["handledprops", "unhandledprops", "classnamecontract"].map(val =>
            sanatized.concat(val)
        ),
    };
});

entryMatchNames.forEach(entry => {
    glob(`**/*(${entry.entries.join("|")}).md`, { cwd: typedocSource }, (err, files) => {
        if (err) {
            throw err;
        }

        const sourcePaths = files.map(filepath => path.resolve(typedocSource, filepath));
        let resolvedDependencies = new Set();
        let unresolvedDependencies = new Set(sourcePaths);

        while (unresolvedDependencies.size > 0) {
            unresolvedDependencies.forEach(filepath => {
                // Skip processing if we've already resolved this dependency
                if (resolvedDependencies.has(filepath)) {
                    return;
                }

                getDependentFiles(filepath)
                    .filter(newPath => !resolvedDependencies.has(newPath))
                    .forEach(newPath => unresolvedDependencies.add(newPath));

                unresolvedDependencies.delete(filepath);
                resolvedDependencies.add(filepath);
            });
        }

        const outpath = path.resolve(componentSource, entry.folderName, "./API.md");

        mkdirp.sync(path.parse(outpath).dir);

        const out = createWriteStream(outpath);

        resolvedDependencies.forEach(src => {
            out.write(`<a name="${fileId(src)}"></a>\n`);

            out.write(
                transformMarkdownLinks(readFileSync(src).toString(), link =>
                    fileId(link)
                ) + "\n"
            );
        });

        out.close();
    });
});

function fileId(filepath) {
    const parsed = path.parse(filepath);
    return parsed.name + parsed.ext.replace(".", "");
}

/**
 * Removes ID values from paths to get the
 * sanitized filepath. eg ../foo/bar.md@someId -> ../foo/bar.md
 */
function sanitizeFileName(filepath) {
    const parsedPath = path.parse(filepath);
    const idLinkMatcher = /\.md#.+$/; // Matches .md filepaths with a ID, eg /foo/bar.md#someId

    return parsedPath.ext.match(idLinkMatcher)
        ? filepath.replace(idLinkMatcher, ".md")
        : filepath;
}

/**
 * Resolves dependent filepaths from a file input
 */
function getDependentFiles(filepath) {
    filepath = sanitizeFileName(filepath);

    const filedata = readFileSync(filepath, { encoding: "utf8" });

    if (filedata) {
        let links = [];
        transformMarkdownLinks(filedata, val => {
            links.push(path.resolve(path.parse(filepath).dir, sanitizeFileName(val)));
        });

        return links;
    } else {
        return [];
    }
}
