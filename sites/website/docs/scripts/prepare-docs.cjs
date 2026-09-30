const fs = require("node:fs/promises");
const path = require("node:path");
const { versions } = require("./site-paths.cjs");
const { writeVersionEntryPoint } = require("./write-version-entry.cjs");

const packageRoot = path.resolve(__dirname, "..");
const sharedSource = path.join(packageRoot, "src");
const stagingSource = path.join(packageRoot, "tmp", "src");
const versionsRoot = path.resolve(packageRoot, "../versions");

async function assertDirectory(directory) {
    let stats;

    try {
        stats = await fs.stat(directory);
    } catch (error) {
        throw new Error(
            `Required documentation source directory is missing: ${directory}`,
            {
                cause: error,
            },
        );
    }

    if (!stats.isDirectory()) {
        throw new Error(`Documentation source is not a directory: ${directory}`);
    }
}

async function copyDirectory(source, destination) {
    await assertDirectory(source);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.cp(source, destination, { recursive: true });
}

async function main() {
    await fs.rm(stagingSource, { recursive: true, force: true });
    await copyDirectory(sharedSource, stagingSource);

    await Promise.all(
        versions.map(async version => {
            const versionRoot = path.join(stagingSource, "docs", version.publicVersion);

            await copyDirectory(
                path.join(versionsRoot, version.packageDirectory, "src"),
                versionRoot,
            );
            await writeVersionEntryPoint(versionRoot, version.publicVersion);
        }),
    );

    console.log(`Staged shared and versioned documentation in ${stagingSource}`);
}

main().catch(error => {
    console.error("Failed to prepare the documentation staging tree.");
    console.error(error);
    process.exitCode = 1;
});
