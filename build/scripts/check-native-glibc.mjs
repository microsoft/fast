#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { validateGlibcVersions } from "./native-packages.mjs";

const addon = process.argv[2];
if (!addon) throw new Error("Usage: check-native-glibc.mjs <Linux addon>");
const versions = execFileSync("readelf", ["--version-info", addon], {
    encoding: "utf8",
});
validateGlibcVersions(versions);
console.log(`${addon}: all required GLIBC symbol versions are <= 2.35.`);
