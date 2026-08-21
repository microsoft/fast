const fs = require("node:fs/promises");
const path = require("node:path");
const { versions } = require("./site-paths.cjs");
const { writeVersionEntryPoint } = require("./write-version-entry.cjs");

const packageRoot = path.resolve(__dirname, "..");
const stagingSource = path.join(packageRoot, "tmp", "src");
const versionsRoot = path.resolve(packageRoot, "../versions");

const documentationMappings = Object.freeze([
    Object.freeze({
        sourceRoot: path.join(packageRoot, "src"),
        stagingRoot: stagingSource,
    }),
    ...versions.map(version =>
        Object.freeze({
            sourceRoot: path.join(versionsRoot, version.packageDirectory, "src"),
            stagingRoot: path.join(stagingSource, "docs", version.publicVersion),
            publicVersion: version.publicVersion,
        }),
    ),
]);

function findMapping(changedFile, mappings) {
    const absoluteFile = path.resolve(changedFile);

    for (const mapping of mappings) {
        const relativePath = path.relative(mapping.sourceRoot, absoluteFile);

        if (
            relativePath === "" ||
            (!relativePath.startsWith(`..${path.sep}`) &&
                relativePath !== ".." &&
                !path.isAbsolute(relativePath))
        ) {
            return {
                ...mapping,
                destination: path.join(mapping.stagingRoot, relativePath),
                source: absoluteFile,
            };
        }
    }
}

async function synchronizePath(source, destination) {
    let stats;

    try {
        stats = await fs.stat(source);
    } catch (error) {
        if (error.code === "ENOENT") {
            await fs.rm(destination, { recursive: true, force: true });
            return;
        }

        throw error;
    }

    await fs.mkdir(path.dirname(destination), { recursive: true });

    if (stats.isDirectory()) {
        await fs.cp(source, destination, { recursive: true });
    } else {
        await fs.copyFile(source, destination);
    }
}

function createDocumentationSync(mappings = documentationMappings) {
    return async changedFiles => {
        const changedVersions = new Map();

        for (const changedFile of changedFiles) {
            const mapping = findMapping(changedFile, mappings);

            if (!mapping) {
                continue;
            }

            await synchronizePath(mapping.source, mapping.destination);

            if (mapping.publicVersion) {
                changedVersions.set(mapping.publicVersion, mapping.stagingRoot);
            }
        }

        await Promise.all(
            [...changedVersions].map(([publicVersion, versionRoot]) =>
                writeVersionEntryPoint(versionRoot, publicVersion),
            ),
        );
    };
}

module.exports = {
    createDocumentationSync,
    documentationMappings,
};
