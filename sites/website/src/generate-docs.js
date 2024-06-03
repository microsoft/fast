const path = require("path");
const { createInterface } = require("readline");
const { exec } = require("child_process");
const fs = require("fs-extra");
const { getPackageJsonDir } = require("../../../build/get-package-json");

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

const packages = ["fast-element"];

function identifyPackage(path) {
    for (const pkg of packages) {
        if (path.indexOf(pkg) !== -1) {
            return pkg;
        }
    }

    return "";
}

function updateContentForMdx(content) {
    content = content.replace("{", "&#123;");
    content = content.replace("}", "&#125;");
    return content;
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

async function copyArticleMarkdown() {
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
                description:
                    "In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to making participation in our project and our community a harassment-free experience for everyone.",
                keywords: ["code of conduct"],
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
                description: "Guide for contributing to FAST.",
                keywords: ["contributing"],
            },
        },
        {
            src: path.resolve(root, "BRANCH_GUIDE.md"),
            dest: path.resolve(outputDir, "community/branch-guide.md"),
            metadata: {
                id: "branch-guide",
                title: "Branch Guide",
                sidebar_label: "Branch Guide",
                custom_edit_url:
                    "https://github.com/microsoft/fast/blob/master/BRANCH_GUIDE.md",
                desciption: "A branch guide for the FAST repository.",
                keywords: ["branch guide"],
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
                description: "MIT License",
                keywords: ["mit license"],
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
                description:
                    "Microsoft takes the security of our software products and services seriously, which includes all source code repositories managed through our GitHub organizations.",
                keywords: ["security"],
            },
        },
        {
            src: path.resolve(
                getPackageJsonDir("@microsoft/fast-element"),
                "./docs/ACKNOWLEDGEMENTS.md"
            ),
            dest: path.resolve(outputDir, "resources/acknowledgements.md"),
            metadata: {
                id: "acknowledgements",
                title: "Acknowledgements",
                sidebar_label: "Acknowledgements",
                custom_edit_url:
                    "https://github.com/microsoft/fast/edit/master/packages/web-components/fast-element/docs/ACKNOWLEDGEMENTS.md",
                description:
                    "There are many great open source projects that have inspired us and enabled us to build FAST.",
                keywords: ["acknowlegements"],
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
                `description: ${file.metadata.description}`,
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
        await safeCopy(
            path.resolve(
                getPackageJsonDir(`@microsoft/${pkg}`),
                `./dist/${pkg}.api.json`
            ),
            // require.resolve(`@microsoft/${pkg}/dist/${pkg}.api.json`),
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
                    line = updateContentForMdx(line);
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
    await Promise.all([copyArticleMarkdown(), buildAPIMarkdown()]);
}

main();
