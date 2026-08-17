const path = require("node:path");
const { createInterface } = require("node:readline");
const { execFile } = require("node:child_process");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const { versions } = require("./site-paths.cjs");

const repositoryRoot = path.resolve(__dirname, "../../../..");
const packagesRoot = path.join(repositoryRoot, "packages");
const projectRoot = path.resolve(__dirname, "..");
const apiDocumenterPath = require.resolve("@microsoft/api-documenter/lib/start");
const options = parseArguments(process.argv.slice(2));
const majorVersion = options.version;
const currentVersion = `${majorVersion}x`;
const versionDir = `${majorVersion}.x`;
const version = versions.find(item => item.publicVersion === versionDir);
const destinationRoot = path.resolve(
    projectRoot,
    options.destination ?? `tmp/src/docs/${versionDir}`,
);
const markdownAPIDir = path.join(destinationRoot, "api");

if (!version) {
    throw new Error(`Unsupported documentation version: ${versionDir}`);
}

const allowedDestinationRoots = [
    path.resolve(projectRoot, "tmp", "src", "docs", versionDir),
    path.resolve(
        projectRoot,
        "../versions",
        version.packageDirectory,
        "tmp",
        "src",
        "docs",
        versionDir,
    ),
];

if (!allowedDestinationRoots.includes(destinationRoot)) {
    const allowedDestinations = allowedDestinationRoots.join(", ");

    throw new Error(
        `Documentation destination must be an allowed ${versionDir} staging directory: ${allowedDestinations}`,
    );
}

const stagingWorkspaceRoot = path.resolve(destinationRoot, "../../../..");
const tempAPIDir = path.join(stagingWorkspaceRoot, "tmp", "api", versionDir);

const packages = [
    {
        main: "fast-element",
        exports: ["context", "declarative", "di"],
    },
];

function parseArguments(args) {
    const parsed = {
        version: "3",
        destination: undefined,
    };

    for (let index = 0; index < args.length; index++) {
        const argument = args[index];

        if (argument === "--version") {
            parsed.version = args[++index];
        } else if (argument === "--destination") {
            parsed.destination = args[++index];
        } else {
            throw new Error(`Unknown argument: ${argument}`);
        }
    }

    if (!parsed.version || !/^\d+$/.test(parsed.version)) {
        throw new Error("--version must be a major version number.");
    }

    if (args.includes("--destination") && !parsed.destination) {
        throw new Error("--destination requires a path.");
    }

    return parsed;
}

function yamlString(value) {
    return JSON.stringify(value);
}

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function copyRequiredFile(source, destination) {
    if (!fs.existsSync(source)) {
        throw new Error(
            `Required API report is missing: ${source}. Build the package before generating documentation.`,
        );
    }

    await fsp.mkdir(path.dirname(destination), { recursive: true });
    await fsp.copyFile(source, destination);
}

async function safeWrite(destination, content) {
    await fsp.mkdir(path.dirname(destination), { recursive: true });
    await fsp.writeFile(destination, content);
}

function runApiDocumenter(inputDir, outputDir) {
    return new Promise((resolve, reject) =>
        execFile(
            process.execPath,
            [apiDocumenterPath, "markdown", "-i", inputDir, "-o", outputDir],
            { cwd: projectRoot },
            (err, stdout, stderr) => {
                if (stdout) {
                    process.stdout.write(stdout);
                }

                if (stderr) {
                    process.stderr.write(stderr);
                }

                if (err) {
                    return reject(
                        new Error(
                            `API documenter failed for ${inputDir}: ${err.message}`,
                            {
                                cause: err,
                            },
                        ),
                    );
                }

                return resolve();
            },
        ),
    );
}

// Copy the api.json files from the packages.
async function copyAPI() {
    await fsp.rm(tempAPIDir, { recursive: true, force: true });

    for (const pkg of packages) {
        await copyRequiredFile(
            path.resolve(packagesRoot, pkg.main, `./dist/${pkg.main}.api.json`),
            `${tempAPIDir}/${pkg.main}.api.json`,
        );

        if (Array.isArray(pkg.exports)) {
            for (const pkgExport of pkg.exports) {
                await copyRequiredFile(
                    path.resolve(
                        packagesRoot,
                        pkg.main,
                        `./dist/${pkgExport}/${pkgExport}.api.json`,
                    ),
                    `${tempAPIDir}/${pkg.main}/${pkgExport}/${pkgExport}.api.json`,
                );
            }
        }
    }
}

async function convertDocFiles(dir, docFiles, pkg, exportPath) {
    for (const docFile of docFiles) {
        try {
            const { name: id, ext } = path.parse(docFile);
            if (ext !== ".md") {
                continue;
            }

            const isAPIHome = id === "index";
            const docPath = path.join(dir, docFile);
            let parent = `api${currentVersion}`;
            let title = "";
            /**
             * Start file content modification
             */
            const input = fs.createReadStream(docPath);
            const output = [];
            const lines = createInterface({
                input,
                crlfDelay: Infinity,
            });
            lines.on("line", line => {
                let skip = false;

                if (!title) {
                    const titleLine = line.match(/## (.*)/);

                    if (titleLine) {
                        title = titleLine[1];

                        if (title.indexOf("package") !== -1) {
                            title = title.replace("package", "");
                            skip = true;
                        }
                    }
                }

                if (!title) {
                    const titleLine = line.match(/## (.*)/);

                    if (titleLine) {
                        title = titleLine[1];

                        if (title.indexOf("package") !== -1) {
                            title = title.replace("package", "");
                        }
                    }
                }

                if (pkg && exportPath) {
                    line = line.replace(
                        new RegExp(`${escapeRegExp(pkg)}(?!/)`, "g"),
                        `${pkg}/${exportPath}`,
                    );
                    parent = `${pkg}/${exportPath}${currentVersion}`;
                }

                const homeLink = line.match(/\[Home\]\(.\/index\.md\) &gt; (.*)/);

                if (homeLink) {
                    if (!isAPIHome) {
                        // Apply link fixes to the extracted breadcrumb content
                        let breadcrumb = homeLink[1];
                        breadcrumb = breadcrumb.replace(
                            /\]\(\.\/index\.md\)/g,
                            "](../index.html)",
                        );
                        breadcrumb = breadcrumb.replace(
                            /\]\(\.\/([^)]+)\.md\)/g,
                            "](../$1/index.html)",
                        );
                        output.push(breadcrumb);
                    }

                    skip = true;
                } else {
                    line = isAPIHome
                        ? line.replace(/\]\(\.\/([^)]+)\.md\)/g, `](./$1/)`)
                        : line.replace(/\]\(\.\/([^)]+)\.md\)/g, `](../$1/)`);
                }

                line = line.replace(/[ \t]+$/u, "");

                if (!skip) {
                    output.push(line);
                }
            });

            await new Promise(resolve => lines.once("close", resolve));
            input.close();

            /**
             * End file content modification
             */

            title = title.replace("\\]", "");
            title = title.replace("\\[", "");

            if (isAPIHome) {
                const key = `api${currentVersion}${parent}`;

                const headerSidebarLink = [
                    "---",
                    `id: ${yamlString(id)}`,
                    `title: ${yamlString(title)}`,
                    `layout: ${currentVersion}`,
                    `eleventyNavigation:`,
                    `  key: ${yamlString(key)}`,
                    `  parent: ${yamlString(`api${currentVersion}`)}`,
                    `  title: ${yamlString(pkg ? `${pkg}/${exportPath}` : `@microsoft/fast-element`)}`,
                    `navigationOptions:`,
                    `  activeKey: ${yamlString(key)}`,
                    "---",
                ];

                await safeWrite(docPath, headerSidebarLink.concat(output).join("\n"));
            } else {
                const key = `${exportPath ? exportPath : ""}api${currentVersion}${id}`;
                parent =
                    id.startsWith("fast-element.") && parent === `api${currentVersion}`
                        ? `api${currentVersion}fast-element`
                        : parent;
                const header = [
                    "---",
                    `id: ${yamlString(id)}`,
                    `title: ${yamlString(title)}`,
                    `layout: ${currentVersion}-api`,
                    `eleventyNavigation:`,
                    `  key: ${yamlString(key)}`,
                    `  parent: ${yamlString(parent)}`,
                    `  title: ${yamlString(title)}`,
                    `navigationOptions:`,
                    `  activeKey: ${yamlString(key)}`,
                    "---",
                ];

                await safeWrite(docPath, header.concat(output).join("\n"));
            }
        } catch (error) {
            throw new Error(`Could not process ${docFile}.`, { cause: error });
        }
    }
}

async function buildAPIMarkdown() {
    await copyAPI();
    await fsp.rm(markdownAPIDir, { recursive: true, force: true });

    await runApiDocumenter(tempAPIDir, markdownAPIDir);

    for (const pkg of packages) {
        for (const pkgExport of pkg.exports) {
            await runApiDocumenter(
                path.join(tempAPIDir, pkg.main, pkgExport),
                path.join(markdownAPIDir, pkg.main, pkgExport),
            );
        }
    }

    const docFiles = await fsp.readdir(markdownAPIDir);

    await convertDocFiles(markdownAPIDir, docFiles);

    for (const pkg of packages) {
        for (const pkgExport of pkg.exports) {
            const exportDir = `${markdownAPIDir}/${pkg.main}/${pkgExport}`;
            const exportDocFiles = await fsp.readdir(exportDir);

            await convertDocFiles(
                exportDir,
                exportDocFiles,
                `@microsoft/${pkg.main}`,
                `${pkgExport}.js`,
            );
        }
    }
}

async function buildSizesPage() {
    const sizesSource = path.resolve(packagesRoot, "fast-element", "SIZES.md");

    if (!fs.existsSync(sizesSource)) {
        console.warn("SIZES.md not found, skipping export sizes page.");
        return;
    }

    const sizesContent = await fsp.readFile(sizesSource, "utf8");
    // Strip the heading from SIZES.md since we add our own via frontmatter
    const body = sizesContent.replace(/^# .*\n*/m, "");

    const frontmatter = [
        "---",
        "id: export-sizes",
        "title: Export Sizes",
        `layout: ${currentVersion}`,
        "eleventyNavigation:",
        `  key: export-sizes${currentVersion}`,
        `  parent: resources${currentVersion}`,
        "  title: Export Sizes",
        "navigationOptions:",
        `  activeKey: export-sizes${currentVersion}`,
        "description: Bundle sizes for @microsoft/fast-element exports.",
        "keywords:",
        "  - export size",
        "  - bundle size",
        "---",
        "",
        "# Export Sizes",
        "",
    ].join("\n");

    const dest = path.join(destinationRoot, "resources", "export-sizes.md");
    await safeWrite(dest, frontmatter + body);
    console.log("Export sizes page generated.");
}

async function main() {
    const destinationStats = await fsp.stat(destinationRoot).catch(error => {
        throw new Error(
            `Documentation destination is missing: ${destinationRoot}. Prepare the staging tree first.`,
            { cause: error },
        );
    });

    if (!destinationStats.isDirectory()) {
        throw new Error(
            `Documentation destination is not a directory: ${destinationRoot}`,
        );
    }

    await Promise.all([buildAPIMarkdown(), buildSizesPage()]);
}

main().catch(error => {
    console.error("Failed to generate API documentation.");
    console.error(error);
    process.exitCode = 1;
});
