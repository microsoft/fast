import { execFileSync } from "node:child_process";
import { copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const crate = fileURLToPath(
    new URL("../../../../crates/microsoft-fast-build-node/", import.meta.url),
);
execFileSync(
    "cargo",
    [
        "build",
        "--release",
        "--locked",
        "--manifest-path",
        path.join(crate, "Cargo.toml"),
        "--target-dir",
        path.join(crate, "target"),
    ],
    { stdio: "inherit" },
);
const library = {
    darwin: "libmicrosoft_fast_build_node.dylib",
    linux: "libmicrosoft_fast_build_node.so",
    win32: "microsoft_fast_build_node.dll",
}[process.platform];
if (!library)
    throw new Error(`Unsupported native prototype platform: ${process.platform}`);
const output = path.join(crate, "target", "release", "fast-build.node");
await copyFile(path.join(crate, "target", "release", library), output);
console.log(output);
