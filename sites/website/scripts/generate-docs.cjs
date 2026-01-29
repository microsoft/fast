const path = require("path");
const { createInterface } = require("readline");
const { exec } = require("child_process");
const fs = require("fs-extra");
const { getPackageJsonDir } = require("../../../build/get-package-json");

// sites/website
const projectRoot = path.resolve(__dirname, "../");
const root = path.resolve(projectRoot, "../../");
const outputDir = path.resolve(projectRoot, "docs");
const tempAPIDir = path.resolve(projectRoot, "tmp");
const markdownAPIDir = path.resolve(projectRoot, "src/docs/2.x/api");

function findFiles(startPath, filter, paths = []) {
    if (!fs.existsSync(startPath)) {
        return;
    }

    const files = fs.readdirSync(startPath);

    for (let i = 0, ii = files.length; i < ii; ++i) {
        const filename = path.join(startPath, files[i]);
        const stat = fs.lstatSync(filename);

        if (stat.isDirectory()) {
            findFiles(filename, filter, paths);
        } else if (filename.indexOf(filter) !== -1) {
            paths.push(filename);
        }
    }

    return paths;
}

const packages = [
    {
        main: "fast-element",
        exports: [
            "context",
            "di"
        ]
    }
];

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
            path.resolve(
                getPackageJsonDir(`@microsoft/${pkg.main}`),
                `./dist/${pkg.main}.api.json`
            ),
            `${tempAPIDir}/${pkg.main}.api.json`
        );

        if (Array.isArray(pkg.exports)) {
            for (const pkgExport of pkg.exports) {
                await safeCopy(
                    path.resolve(
                        getPackageJsonDir(`@microsoft/${pkg.main}`),
                        `./dist/${pkgExport}/${pkgExport}.api.json`
                    ),
                    `${tempAPIDir}/${pkg.main}/${pkgExport}/${pkgExport}.api.json`
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
            let parent = "api2x";
            let title = "";
            const folders = dir.split("/");
            const folderName = folders[folders.length - 1];

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
                    parent = `${pkg}/${exportPath}2x`;
                }

                const homeLink = line.match(/\[Home\]\(.\/index\.md\) &gt; (.*)/);

                if (homeLink) {
                    if (!isAPIHome) {
                        // Apply link fixes to the extracted breadcrumb content
                        let breadcrumb = homeLink[1];
                        breadcrumb = breadcrumb.replace(/\]\(\.\/index\.md\)/g, '](../index.html)');
                        breadcrumb = breadcrumb.replace(/\]\(\.\/([^)]+)\.md\)/g, '](../$1/index.html)');
                        output.push(breadcrumb);
                    }

                    skip = true;
                } else {
                    line = isAPIHome
                        ? line.replace(/\]\(\.\/([^)]+)\.md\)/g, `](./$1/)`)
                        : line.replace(/\]\(\.\/([^)]+)\.md\)/g, `](../$1/)`)
                }

                if (!skip) {
                    output.push(line);
                }
            });

            await new Promise(resolve => lines.once("close", resolve));
            input.close();

            /**
             * End file content modification
             */

            title = title.replace("\\\]", "");
            title = title.replace("\\\[", "");

            if (isAPIHome) {
                const key = `api2x${parent}`;

                const headerSidebarLink = [
                    "---",
                    `id: "${id}"`,
                    `title: "${title}"`,
                    `layout: 2x`,
                    `eleventyNavigation:`,
                    `  key: "${key}"`,
                    `  parent: "api2x"`,
                    `  title: "${pkg ? `${pkg}/${exportPath}` : `@microsoft/fast-element`}"`,
                    `navigationOptions:`,
                    `  activeKey: "${key}"`,
                    "---",
                ];

                await safeWrite(docPath, headerSidebarLink.concat(output).join("\n"));
            } else {
                const key = `${exportPath ? exportPath : ""}api2x${id}`;
                parent = id.startsWith("fast-element.") && parent === "api2x"
                    ? `api2xfast-element`
                    : parent;
                const header = [
                    "---",
                    `id: "${id}"`,
                    `title: "${title}"`,
                    `layout: 2x-api`,
                    `eleventyNavigation:`,
                    `  key: "${key}"`,
                    `  parent: "${parent}"`,
                    `  title: "${title}"`,
                    `navigationOptions:`,
                    `  activeKey: "${key}"`,
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

    await new Promise((resolve, reject) =>
        exec(
            `api-documenter markdown -i ${tempAPIDir} -o ${markdownAPIDir}`,
            (err, stdout, stderr) => {
                console.log(stdout);
                console.error(stderr);
                if (err) {
                    return reject(err);
                }

                return resolve();
            }
        )
    );

    for (const pkg of packages) {
        for (const pkgExport of pkg.exports) {
            await new Promise((resolve, reject) =>
                exec(
                    `api-documenter markdown -i ${tempAPIDir}/${pkg.main}/${pkgExport} -o ${markdownAPIDir}/${pkg.main}/${pkgExport}`,
                    (err, stdout, stderr) => {
                        console.log(stdout);
                        console.error(stderr);
                        if (err) {
                            return reject(err);
                        }

                        return resolve();
                    }
                )
            );
        }
    }

    const docFiles = await fs.readdir(markdownAPIDir);

    convertDocFiles(markdownAPIDir, docFiles);

    for (const pkg of packages) {
        for (const pkgExport of pkg.exports) {
            const exportDir = `${markdownAPIDir}/${pkg.main}/${pkgExport}`;
            const exportDocFiles = await fs.readdir(exportDir);

            convertDocFiles(exportDir, exportDocFiles, `@microsoft/${pkg.main}`, `${pkgExport}.js`);
        }
    }
}

async function main() {
    await Promise.all([buildAPIMarkdown()]);
}

main();
