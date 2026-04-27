const path = require("node:path");
const { createInterface } = require("node:readline");
const { execFile } = require("node:child_process");
const fs = require("fs-extra");
const { getPackageJsonDir } = require("@microsoft/fast-build/get-package-json.js");

// sites/website
const projectRoot = path.resolve(__dirname, "../");
const tempAPIDir = path.resolve(projectRoot, "tmp");
const majorVersion = process.argv[2] || "3";
const currentVersion = `${majorVersion}x`;
const versionDir = `${majorVersion}.x`;
const markdownAPIDir = path.resolve(projectRoot, `src/docs/${versionDir}/api`);
const apiDocumenterCommand = path.join(
    projectRoot,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "api-documenter.cmd" : "api-documenter",
);

const packages = [
    {
        main: "fast-element",
        exports: [
            "context",
            "declarative",
            "declarative-utilities",
            "di",
            "hydration",
            "binding",
            "two-way",
            "signal",
            "schema",
            "dom",
            "updates",
            "observable",
            "attr",
            "volatile",
            "css",
            "html",
            "templating",
            "render",
            "array-observer",
            "children",
            "node-observation",
            "ref",
            "slotted",
            "when",
            "repeat",
            "attribute-map",
            "observer-map",
        ],
    },
];

function normalizePackageExport(pkgExport) {
    if (typeof pkgExport === "string") {
        return {
            docsFolder: pkgExport,
            publicPath: `${pkgExport}.js`,
            apiJsonPath: `${pkgExport}/${pkgExport}.api.json`,
        };
    }

    return pkgExport;
}

function yamlString(value) {
    return JSON.stringify(value);
}

function runAPIDocumenter(inputDir, outputDir) {
    return new Promise((resolve, reject) => {
        execFile(
            apiDocumenterCommand,
            ["markdown", "-i", inputDir, "-o", outputDir],
            (err, stdout, stderr) => {
                console.log(stdout);
                console.error(stderr);
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            },
        );
    });
}

async function safeCopy(source, dest) {
    if (!fs.existsSync(source)) {
        return;
    }

    if (fs.existsSync(dest)) {
        await fs.copyFile(source, dest);
    } else {
        await fs.mkdir(path.dirname(dest), { recursive: true });
        await fs.copyFile(source, dest);
    }
}

async function safeWrite(dest, content) {
    if (fs.existsSync(dest)) {
        await fs.writeFile(dest, content);
    } else {
        await fs.mkdir(path.dirname(dest), { recursive: true });
        await fs.writeFile(dest, content);
    }
}

// Copy the api.json files from the packages.
async function copyAPI() {
    for (const pkg of packages) {
        await safeCopy(
            path.join(
                getPackageJsonDir(`@microsoft/${pkg.main}`),
                "dist",
                `${pkg.main}.api.json`,
            ),
            path.join(tempAPIDir, `${pkg.main}.api.json`),
        );

        if (Array.isArray(pkg.exports)) {
            for (const pkgExport of pkg.exports) {
                const normalizedExport = normalizePackageExport(pkgExport);
                const apiJsonFileName = path.basename(normalizedExport.apiJsonPath);

                await safeCopy(
                    path.join(
                        getPackageJsonDir(`@microsoft/${pkg.main}`),
                        "dist",
                        normalizedExport.apiJsonPath,
                    ),
                    path.join(
                        tempAPIDir,
                        pkg.main,
                        normalizedExport.docsFolder,
                        apiJsonFileName,
                    ),
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
                    line = line.replace(pkg, `${pkg}/${exportPath}`);
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
        } catch (err) {
            console.error(`Could not process ${docFile}: ${err}`);
        }
    }
}

async function buildAPIMarkdown() {
    await copyAPI();

    await runAPIDocumenter(tempAPIDir, markdownAPIDir);

    for (const pkg of packages) {
        for (const pkgExport of pkg.exports) {
            const normalizedExport = normalizePackageExport(pkgExport);
            await runAPIDocumenter(
                path.join(tempAPIDir, pkg.main, normalizedExport.docsFolder),
                path.join(markdownAPIDir, pkg.main, normalizedExport.docsFolder),
            );
        }
    }

    const docFiles = await fs.readdir(markdownAPIDir);

    convertDocFiles(markdownAPIDir, docFiles);

    for (const pkg of packages) {
        for (const pkgExport of pkg.exports) {
            const normalizedExport = normalizePackageExport(pkgExport);
            const exportDir = path.join(
                markdownAPIDir,
                pkg.main,
                normalizedExport.docsFolder,
            );
            const exportDocFiles = await fs.readdir(exportDir);

            convertDocFiles(
                exportDir,
                exportDocFiles,
                `@microsoft/${pkg.main}`,
                normalizedExport.publicPath,
            );
        }
    }
}

async function buildSizesPage() {
    const sizesSource = path.resolve(
        getPackageJsonDir("@microsoft/fast-element"),
        "SIZES.md",
    );

    if (!fs.existsSync(sizesSource)) {
        console.warn("SIZES.md not found, skipping export sizes page.");
        return;
    }

    const sizesContent = fs.readFileSync(sizesSource, "utf-8");
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

    const dest = path.resolve(
        projectRoot,
        `src/docs/${versionDir}/resources/export-sizes.md`,
    );
    await safeWrite(dest, frontmatter + body);
    console.log("Export sizes page generated.");
}

async function main() {
    await Promise.all([buildAPIMarkdown(), buildSizesPage()]);
}

main();
