const fs = require("node:fs/promises");
const path = require("node:path");

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

module.exports = {
    assertDirectory,
    copyDirectory,
    synchronizePath,
};
