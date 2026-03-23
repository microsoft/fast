#!/usr/bin/env node
/**
 * Utility for cleaning directories.
 * Usage: clean %path% [%path% ...]
 */
import { globSync } from "node:fs";
import { rm } from "node:fs/promises";
import { resolve } from "node:path";

const patterns = process.argv.slice(2);

if (patterns.length === 0) {
    console.error("No path specified.");
    process.exit(1);
}

const cwd = process.cwd();
const resolved = patterns.flatMap(p =>
    globSync(p, { cwd }).map(match => resolve(cwd, match))
);

await Promise.allSettled(
    resolved.map(async removePath => {
        if (!removePath.startsWith(cwd)) {
            console.error(`Path escapes working directory: ${removePath}`);
            process.exit(1);
        }
        await rm(removePath, { recursive: true, force: true });
        console.log(removePath, "cleaned");
    })
);
