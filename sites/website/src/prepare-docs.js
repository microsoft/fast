const path = require("path");
const fs = require("fs-extra");
const glob = require("glob");
const { createInterface } = require("readline");
const { exec } = require("child_process");

const fastFoundation = path.dirname(
    require.resolve("@microsoft/fast-foundation/package.json")
);
const fastElement = path.dirname(require.resolve("@microsoft/fast-element/package.json"));
const fastComponents = path.dirname(
    require.resolve("@microsoft/fast-components/package.json")
);

// sites/website
const projectRoot = path.resolve(__dirname, "../");

const root = path.resolve(projectRoot, "../../");

const outputDir = path.resolve(projectRoot, "docs");

function findFiles(startPath, filter, paths = []) {
    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
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
    "fast-animation",
    "fast-colors",
    "fast-element",
    "fast-foundation",
    "fast-components",
];

function identifyPackage(path) {
    for (const pkg of packages) {
        if (path.indexOf(pkg) !== -1) {
            return pkg;
        }
    }

    return "";
}

async function safeCopy(source, dest) {
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

async function moveMarkdownFiles(src, docsFolderDest) {
    const files = findFiles(src, ".md");
    for (const source of files) {
        const filename = path.basename(source);
        const dest = path.join(__dirname, "../docs", docsFolderDest, filename);

        await safeCopy(source, dest);
    }
}

async function copyArticleMarkdown() {
    await moveMarkdownFiles(
        path.resolve(fastFoundation, "docs/integrations"),
        "integrations"
    );

    await moveMarkdownFiles(path.resolve(fastFoundation, "docs/tools"), "tools");

    await moveMarkdownFiles(path.resolve(fastElement, "docs/guide"), "fast-element");

    await moveMarkdownFiles(path.resolve(fastComponents, "docs/design"), "design");

    const componentDocs = findFiles(
        path.resolve(fastFoundation, "src"),
        "README.md"
    ).filter(x => !x.includes("anchored-region"));

    for (const source of componentDocs) {
        const folder = path.dirname(source);
        const dest = path.join(
            "./docs/components",
            `fast-${folder.substr(folder.lastIndexOf(path.sep) + 1)}.mdx`
        );

        await safeCopy(source, dest);
    }

    const mergeDocs = [
        {
            src: path.resolve(root, "CODE_OF_CONDUCT.md"),
            dest: path.resolve(outputDir, "community/code-of-conduct.md"),
            metadata: {
                id: "code-of-conduct",
                title: "Code of Conduct",
                sidebar_label: "Code of Conduct",
                custom_edit_url:
                    "https://github.com/microsoft/fast/edit/master/CODE_OF_CONDUCT.md",
            },
        },
        {
            src: path.resolve(root, "CONTRIBUTING.md"),
            dest: path.resolve(outputDir, "community/contributor-guide.md"),
            metadata: {
                id: "contributor-guide",
                title: "Contributor Guide",
                sidebar_label: "Contributor Guide",
                custom_edit_url:
                    "https://github.com/microsoft/fast/edit/master/CONTRIBUTING.md",
            },
        },
        {
            src: path.resolve(root, "LICENSE"),
            dest: path.resolve(outputDir, "resources/license.md"),
            metadata: {
                id: "license",
                title: "License",
                sidebar_label: "License",
                custom_edit_url: "https://github.com/microsoft/fast/edit/master/LICENSE",
            },
        },
        {
            src: path.resolve(root, "SECURITY.md"),
            dest: path.resolve(outputDir, "resources/security.md"),
            metadata: {
                id: "security",
                title: "Security",
                sidebar_label: "Security",
                custom_edit_url:
                    "https://github.com/microsoft/fast/edit/master/SECURITY.md",
            },
        },
        {
            src: require.resolve("@microsoft/fast-element/docs/ACKNOWLEDGEMENTS.md"),
            dest: path.resolve(outputDir, "resources/acknowledgements.md"),
            metadata: {
                id: "acknowledgements",
                title: "Acknowledgements",
                sidebar_label: "Acknowledgements",
                custom_edit_url:
                    "https://github.com/microsoft/fast/edit/master/packages/web-components/fast-element/docs/ACKNOWLEDGEMENTS.md",
            },
        },
        {
            src: require.resolve("@microsoft/fast-element/README.md"),
            dest: path.resolve(outputDir, "fast-element/getting-started.md"),
            metadata: {
                id: "getting-started",
                title: "Getting Started with FAST Element",
                sidebar_label: "Getting Started",
                custom_edit_url:
                    "https://github.com/microsoft/fast/edit/master/packages/web-components/fast-element/README.md",
            },
        },
        {
            src: path.resolve(root, "examples/site-rebrand-tutorial/README.md"),
            dest: path.resolve(outputDir, "tutorials/site-rebrand.md"),
            metadata: {
                id: "site-rebrand",
                title: "Using FAST to Rebrand an Existing Website",
                sidebar_label: "Rebranding an Existing Site",
                custom_edit_url:
                    "https://github.com/microsoft/fast/blob/master/examples/site-rebrand-tutorial/README.md",
            },
        },
    ];

    for (const file of mergeDocs) {
        try {
            const docPath = file.src;
            const input = fs.createReadStream(docPath);
            const output = [];
            const lines = createInterface({
                input,
                crlfDelay: Infinity,
            });

            let title = "";
            lines.on("line", line => {
                let skip = false;

                if (!title) {
                    const titleLine = line.match(/# (.*)/);

                    if (titleLine) {
                        title = titleLine[1];
                        skip = true;
                    }
                }

                if (!skip) {
                    // Replace badges routes with static versions generated in @microsoft/site-utilities
                    line = line.replace(
                        /https:\/\/(?:img\.shields\.io\/badge\/|badge\.fury\.io\/js\/%40microsoft%2F)(.*\.svg)/gi,
                        "/badges/$1"
                    );
                    output.push(line);
                }
            });

            await new Promise(resolve => lines.once("close", resolve));
            input.close();

            const header = [
                "---",
                `id: ${file.metadata.id}`,
                `title: ${file.metadata.title}`,
                `sidebar_label: ${file.metadata.sidebar_label}`,
                `custom_edit_url: ${file.metadata.custom_edit_url}`,
                "---",
            ];

            await safeWrite(file.dest, header.concat(output).join("\n"));
        } catch (err) {
            console.error(`Could not process ${file.src}: ${err}`);
        }
    }

    const siteDocs = findFiles("./src/docs", ".md");
    for (const source of siteDocs) {
        const filename = path.basename(source);
        const folder = path.dirname(source);
        const dest = path
            .join("./docs", folder.substr(folder.lastIndexOf(path.sep) + 1), filename)
            .replace(`docs${path.sep}docs`, "docs");

        await safeCopy(source, dest);
    }
}

// Copy the api.json files from the web-components packages.
async function copyAPI() {
    for (const pkg of packages) {
        const packageDir = glob.sync(path.resolve(root, `packages/**/${pkg}`))[0];

        await safeCopy(
            path.resolve(packageDir, `dist/${pkg}.api.json`),
            `./src/docs/api/${pkg}.api.json`
        );
    }
}

async function buildAPIMarkdown() {
    await copyAPI();

    await new Promise((resolve, reject) =>
        exec(
            "yarn api-documenter markdown -i src/docs/api -o docs/api",
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

    const dir = "./docs/api";
    const docFiles = await fs.readdir(dir);
    for (const docFile of docFiles) {
        try {
            const { name: id, ext } = path.parse(docFile);
            if (ext !== ".md") {
                continue;
            }

            const pkg = identifyPackage(docFile);
            const isAPIHome = id === pkg;
            const docPath = path.join(dir, docFile);
            const input = fs.createReadStream(docPath);
            const output = [];
            const lines = createInterface({
                input,
                crlfDelay: Infinity,
            });

            let title = "";
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

                const homeLink = line.match(/\[Home\]\(.\/index\.md\) &gt; (.*)/);

                if (homeLink) {
                    if (!isAPIHome) {
                        output.push(homeLink[1]);
                    }

                    skip = true;
                }

                if (!skip) {
                    output.push(line);
                }
            });

            await new Promise(resolve => lines.once("close", resolve));
            input.close();

            const header = [
                "---",
                `id: ${id}`,
                `title: ${title}`,
                `hide_title: ${!isAPIHome}`,
                "---",
            ];

            await safeWrite(docPath, header.concat(output).join("\n"));
        } catch (err) {
            console.error(`Could not process ${docFile}: ${err}`);
        }
    }
}

async function main() {
    await copyArticleMarkdown();
    await buildAPIMarkdown();
}

main();
