const fs = require("node:fs/promises");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { Eleventy } = require("@11ty/eleventy");
const { getVersionByPackageRoot } = require("./site-paths.cjs");
const { writeVersionEntryPoint } = require("./write-version-entry.cjs");

const packageRoot = path.resolve(process.cwd());
const sharedRoot = path.resolve(__dirname, "..");

async function copyDirectory(source, destination) {
    const stats = await fs.stat(source).catch(error => {
        throw new Error(`Required documentation directory is missing: ${source}`, {
            cause: error,
        });
    });

    if (!stats.isDirectory()) {
        throw new Error(`Documentation source is not a directory: ${source}`);
    }

    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.cp(source, destination, { recursive: true });
}

function runCommand(command, args) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: sharedRoot,
            stdio: "inherit",
        });

        child.once("error", reject);
        child.once("exit", code => {
            if (code === 0) {
                resolve();
            } else {
                reject(
                    new Error(
                        `${path.basename(command)} exited with code ${code ?? "unknown"}.`,
                    ),
                );
            }
        });
    });
}

async function main() {
    const { publicVersion } = getVersionByPackageRoot(packageRoot);
    const stagingRoot = path.join(packageRoot, "tmp", "src");
    const versionStagingRoot = path.join(stagingRoot, "docs", publicVersion);
    const outputRoot = path.join(packageRoot, "build");

    await fs.rm(path.join(packageRoot, "tmp"), { recursive: true, force: true });
    await fs.rm(outputRoot, { recursive: true, force: true });
    await copyDirectory(path.join(sharedRoot, "src"), stagingRoot);
    await copyDirectory(path.join(packageRoot, "src"), versionStagingRoot);
    await fs.rm(path.join(stagingRoot, "index.md"), { force: true });
    await writeVersionEntryPoint(versionStagingRoot, publicVersion);

    if (publicVersion === "3.x") {
        await runCommand(process.execPath, [
            path.join(sharedRoot, "scripts", "generate-docs.cjs"),
            "--version",
            "3",
            "--destination",
            versionStagingRoot,
        ]);
    }

    process.env.FAST_SITE_STAGING_SOURCE = stagingRoot;
    process.env.FAST_SITE_VERSION_ONLY = publicVersion;

    const eleventy = new Eleventy(stagingRoot, outputRoot, {
        configPath: path.join(sharedRoot, "eleventy.config.js"),
    });

    await eleventy.write();

    const outputEntries = await fs.readdir(outputRoot);
    const docsEntries = await fs.readdir(path.join(outputRoot, "docs"));

    if (
        outputEntries.length !== 1 ||
        outputEntries[0] !== "docs" ||
        docsEntries.length !== 1 ||
        docsEntries[0] !== publicVersion
    ) {
        throw new Error(
            `Version build produced files outside docs/${publicVersion}: ${outputRoot}`,
        );
    }
}

main().catch(error => {
    console.error("Failed to build versioned FAST documentation.");
    console.error(error);
    process.exitCode = 1;
});
