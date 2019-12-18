/**
 * Creates component API documents for all components in the src directory. Ensure API source documents
 * exist prior to runnning this script by running `npm run build:api`
 *
 * @param ignore-dir - a comma separated list of directories to ignore
 * @param component-dir - the source directory holding components
 * @param typedoc-src - the source of generated typedoc API data
 */
const { readdirSync } = require("fs");
const path = require("path");
const glob = require("glob");
const transformMarkdownLinks = require("transform-markdown-links");

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
    return ["handledprops", "unhandledprops", "classnamecontract"].map(val =>
        sanatized.concat(val)
    );
});

entryMatchNames.forEach(entries => {
    glob(`**/*(${entries.join("|")}).md`, { cwd: typedocSource }, (err, files) => {
        if (err) {
            throw err;
        }

        const fullpaths = files.map(filepath => path.resolve(typedocSource, filepath));
    });
});
