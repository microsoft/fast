#!/usr/bin/env node
/**
 * Run a biome command on files modified in the working tree or staging area.
 * Uses git to find changed files and passes them directly to biome.
 *
 * Usage: biome-changed [command] [--staged] [-- ...biome-args]
 *
 * Commands:
 *   lint     Run biome lint (default)
 *   check    Run biome check (lint + format)
 *   format   Run biome format
 *
 * Options:
 *   --staged  Only process files staged for commit.
 *
 * Arguments after -- are forwarded to biome.
 */
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const ignoredPaths = [
    /^packages\/fast-element\/test\/declarative\/fixtures\/.+\/index\.html$/,
    /^packages\/fast-element\/test\/declarative\/fixtures\/.+\/templates\.html$/,
];

const root = execFileSync("git", ["rev-parse", "--show-toplevel"], {
    encoding: "utf-8",
}).trim();

const args = process.argv.slice(2);
const separator = args.indexOf("--");
const ownArgs = separator === -1 ? args : args.slice(0, separator);
const biomeArgs = separator === -1 ? [] : args.slice(separator + 1);

const validCommands = ["lint", "check", "format"];
const command = validCommands.includes(ownArgs[0]) ? ownArgs.shift() : "lint";
const staged = ownArgs.includes("--staged");

const gitArgs = ["diff", "--name-only", "--diff-filter=d"];
if (staged) {
    gitArgs.push("--cached");
}

const files = execFileSync("git", gitArgs, {
    encoding: "utf-8",
    cwd: root,
})
    .trim()
    .split("\n")
    .filter(Boolean)
    .filter(file => !ignoredPaths.some(pattern => pattern.test(file)))
    .map(f => resolve(root, f));

if (files.length === 0) {
    console.log("No changed files to process.");
    process.exit(0);
}

try {
    execFileSync(
        resolve(root, "node_modules", ".bin", "biome"),
        [command, ...biomeArgs, ...files],
        { stdio: "inherit", cwd: root },
    );
} catch (error) {
    process.exit(error.status ?? 1);
}
