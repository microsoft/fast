#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import {
    nativeTargets,
    nodeApiVersion,
    repoRoot,
    sourceRevision,
    validateNativeVersions,
} from "./native-packages.mjs";

const target = process.argv[2];
if (!Object.hasOwn(nativeTargets, target))
    throw new Error(`Unknown native target: ${target}`);
const parent = validateNativeVersions();
const location = join(repoRoot, "packages/fast-build/native", target);
const identity = JSON.parse(readFileSync(join(location, "native-build.json"), "utf8"));
if (
    identity.packageName !== `@microsoft/fast-build-${target}` ||
    identity.version !== parent.version ||
    identity.target !== target ||
    identity.sourceRevision !== sourceRevision() ||
    identity.napi !== nodeApiVersion()
) {
    throw new Error("Native build identity does not match the release checkout.");
}
const destination = resolve("publish_artifacts_native");
mkdirSync(destination, { recursive: true });
const result = execFileSync(
    process.platform === "win32" ? "npm.cmd" : "npm",
    ["pack", location, "--json", "--ignore-scripts", "--pack-destination", destination],
    { encoding: "utf8", shell: process.platform === "win32" },
);
const packed = JSON.parse(result)[0];
for (const required of ["fast-build.node", "native-build.json"]) {
    if (!packed.files.some(file => file.path === required)) {
        throw new Error(`Native tarball is missing ${required}.`);
    }
}
identity.sha256 = createHash("sha256")
    .update(readFileSync(join(destination, packed.filename)))
    .digest("hex");
writeFileSync(
    join(destination, `${target}.json`),
    `${JSON.stringify(identity, null, 2)}\n`,
);
// Keep a direct copy convenient for external artifact auditing.
copyFileSync(
    join(location, "native-build.json"),
    join(destination, `${target}.build.json`),
);
console.log(join(destination, packed.filename));
