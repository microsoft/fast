import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const target = process.argv[2];
if (!target) throw new Error("Usage: build-native-host.mjs <dedicated-target-directory>");
const targetDir = resolve(target);
const manifest = fileURLToPath(
    new URL("../../crates/microsoft-fast-build/Cargo.toml", import.meta.url),
);
const output = execFileSync(
    "cargo",
    [
        "build",
        "--release",
        "--locked",
        "--manifest-path",
        manifest,
        "--features",
        "node-host",
        "--lib",
        "--target-dir",
        targetDir,
        "--message-format=json",
    ],
    { encoding: "utf8", maxBuffer: 16 * 1024 * 1024, env: process.env },
);
const artifacts = output
    .trim()
    .split("\n")
    .map(line => JSON.parse(line));
const library = artifacts
    .filter(
        message =>
            message.reason === "compiler-artifact" &&
            message.target.name === "microsoft_fast_build",
    )
    .flatMap(message => message.filenames)
    .find(filename => /\.(dylib|so|dll)$/.test(filename));
if (!library) throw new Error("Cargo did not emit the FAST addon library.");
mkdirSync(targetDir, { recursive: true });
const addon = resolve(targetDir, "fast-build.node");
copyFileSync(library, addon);
writeFileSync(
    resolve(targetDir, "cargo-artifacts.json"),
    JSON.stringify(artifacts, null, 2),
);
console.log(addon);
