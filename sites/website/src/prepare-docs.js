const path = require("path"),
    fs = require("fs"),
    fse = require("fs-extra");
const { createInterface } = require("readline");
const { join, parse } = require("path");
const { exec } = require("child_process");

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
    "fast-element",
    "fast-foundation",
    "fast-components",
    "fast-components-msft",
];

function identifyPackage(path) {
    for (const package of packages) {
        if (path.indexOf(package) !== -1) {
            return package;
        }
    }

    return "";
}

function copyMarkdown() {
    // Copy markdown guides from web-components packages.
    findFiles("../../packages/web-components", ".doc.md").forEach(source => {
        const filename = path.basename(source).replace(".doc.md", ".md");
        const root = "./docs";
        const folder = identifyPackage(source);
        const dest = path.join(root, folder, filename);

        fs.copyFile(source, dest, error => {
            if (error) {
                console.error(error);
            }
        });
    });

    // Copy component docs from fast-foundation.
    findFiles("../../packages/web-components/fast-foundation/src", "README.md").forEach(
        source => {
            const root = "./docs/fast-foundation";
            const folder = path.dirname(source);
            const dest = path.join(
                root,
                `fast-${folder.substr(folder.lastIndexOf("/") + 1)}.md`
            );

            fs.copyFile(source, dest, error => {
                if (error) {
                    console.error(error);
                }
            });
        }
    );

    // Copy site-specific docs.
    findFiles("./src/docs", ".md").forEach(source => {
        const filename = path.basename(source);
        const root = "./docs";
        const folder = path.dirname(source);
        const dest = path
            .join(root, folder.substr(folder.lastIndexOf("/") + 1), filename)
            .replace("docs/docs", "docs");

        fs.copyFile(source, dest, error => {
            if (error) {
                console.error(error);
            }
        });
    });
}

// Copy the api.json files from the web-components packages.
function copyAPI() {
    for (const package of packages) {
        fs.copyFile(
            `../../packages/web-components/${package}/dist/${package}.api.json`,
            `./src/docs/api/${package}.api.json`,
            error => {
                if (error) {
                    console.error(error);
                }
            }
        );
    }
}

async function main() {
    copyMarkdown();
    copyAPI();

    await new Promise((resolve, reject) =>
        exec(
            "api-documenter markdown -i src/docs/api -o docs/api",
            (err, stdout, stderr) => {
                console.log(stdout);
                console.error(stderr);
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        )
    );

    const dir = "./docs/api";
    const docFiles = await fse.readdir(dir);
    for (const docFile of docFiles) {
        try {
            const { name: id, ext } = parse(docFile);
            if (ext !== ".md") {
                continue;
            }

            const package = identifyPackage(docFile);
            const isAPIHome = id === package;
            const docPath = join(dir, docFile);
            const input = fse.createReadStream(docPath);
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

            await fse.writeFile(docPath, header.concat(output).join("\n"));
        } catch (err) {
            console.error(`Could not process ${docFile}: ${err}`);
        }
    }
}

main();
