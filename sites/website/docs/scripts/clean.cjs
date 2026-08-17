const fs = require("node:fs/promises");
const path = require("node:path");
const { versions } = require("./site-paths.cjs");

const packageRoot = path.resolve(__dirname, "..");
const generatedDirectories = ["build", "tmp"];

function parseArguments(args) {
    if (args.length === 0) {
        return packageRoot;
    }

    if (args.length !== 2 || args[0] !== "--workspace-root" || !args[1]) {
        throw new Error("Usage: clean.cjs [--workspace-root <path>]");
    }

    return path.resolve(process.cwd(), args[1]);
}

function assertAllowedWorkspaceRoot(workspaceRoot) {
    const allowedRoots = [
        packageRoot,
        ...versions.map(version =>
            path.resolve(packageRoot, "../versions", version.packageDirectory),
        ),
    ];

    if (!allowedRoots.includes(workspaceRoot)) {
        throw new Error(`Refusing to clean unknown website workspace: ${workspaceRoot}`);
    }
}

async function cleanGeneratedDirectories(workspaceRoot) {
    assertAllowedWorkspaceRoot(workspaceRoot);

    for (const directory of generatedDirectories) {
        const target = path.resolve(workspaceRoot, directory);

        if (path.dirname(target) !== workspaceRoot) {
            throw new Error(
                `Refusing to remove path outside the website package: ${target}`,
            );
        }

        await fs.rm(target, { recursive: true, force: true });
    }
}

async function main() {
    await cleanGeneratedDirectories(parseArguments(process.argv.slice(2)));
}

main().catch(error => {
    console.error("Failed to clean generated website files.");
    console.error(error);
    process.exitCode = 1;
});
