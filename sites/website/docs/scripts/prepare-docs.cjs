const fs = require("node:fs/promises");
const path = require("node:path");
const { versions } = require("./site-paths.cjs");
const { writeVersionEntryPoint } = require("./write-version-entry.cjs");
const { copyDirectory } = require("./fs-utils.cjs");

const packageRoot = path.resolve(__dirname, "..");
const sharedSource = path.join(packageRoot, "src");
const stagingSource = path.join(packageRoot, "tmp", "src");
const versionsRoot = path.resolve(packageRoot, "../versions");

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
