import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
function option(name) {
    const index = args.indexOf(name);
    if (index < 0) return undefined;
    if (!args[index + 1] || args[index + 1].startsWith("--")) {
        throw new Error(`Missing value for ${name}.`);
    }
    return args[index + 1];
}
const packageTarget = option("--package");
const rustTargets = {
    "darwin-arm64": "aarch64-apple-darwin",
    "darwin-x64": "x86_64-apple-darwin",
    "linux-arm64": "aarch64-unknown-linux-gnu",
    "linux-x64": "x86_64-unknown-linux-gnu",
    "win32-arm64": "aarch64-pc-windows-msvc",
    "win32-x64": "x86_64-pc-windows-msvc",
};
if (packageTarget && !Object.hasOwn(rustTargets, packageTarget)) {
    throw new Error(`Unsupported native package target: ${packageTarget}`);
}
const rustTarget = option("--target") ?? rustTargets[packageTarget];
if (packageTarget && rustTarget !== rustTargets[packageTarget]) {
    throw new Error("Rust target does not match the native package target.");
}
const existingAddon = option("--addon");
const target = args[0]?.startsWith("--") ? undefined : args[0];
if (!target && !packageTarget) {
    throw new Error(
        "Usage: build-native-host.mjs <target-directory> [--target <Rust triple>] [--package <npm target>] [--addon <path>]",
    );
}
const targetDir = target
    ? resolve(target)
    : fileURLToPath(
          new URL("../../crates/microsoft-fast-build/target/node-host", import.meta.url),
      );
const packageDir = packageTarget
    ? fileURLToPath(new URL(`./native/${packageTarget}/`, import.meta.url))
    : undefined;
const packageJson = packageDir
    ? JSON.parse(readFileSync(resolve(packageDir, "package.json"), "utf8"))
    : undefined;
if (packageJson && packageJson.fastBuild?.target !== packageTarget) {
    throw new Error("Unsupported native package target.");
}
if (packageJson) {
    const parent = JSON.parse(
        readFileSync(new URL("./package.json", import.meta.url), "utf8"),
    );
    if (
        packageJson.name !== `@microsoft/fast-build-${packageTarget}` ||
        packageJson.version !== parent.version ||
        parent.optionalDependencies?.[packageJson.name] !== parent.version
    ) {
        throw new Error("Native package version must exactly match the parent package.");
    }
}
const revision = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: fileURLToPath(new URL("../../", import.meta.url)),
    encoding: "utf8",
}).trim();
const manifest = fileURLToPath(
    new URL("../../crates/microsoft-fast-build/Cargo.toml", import.meta.url),
);
const output = existingAddon
    ? ""
    : execFileSync(
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
              ...(rustTarget ? ["--target", rustTarget] : []),
              "--target-dir",
              targetDir,
              "--message-format=json",
          ],
          {
              encoding: "utf8",
              maxBuffer: 16 * 1024 * 1024,
              env: {
                  ...process.env,
                  FAST_BUILD_SOURCE_REVISION: revision,
              },
          },
      );
const artifacts = output
    .trim()
    .split("\n")
    .filter(Boolean)
    .map(line => JSON.parse(line));
const library =
    existingAddon ??
    artifacts
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
if (packageDir) {
    copyFileSync(addon, resolve(packageDir, "fast-build.node"));
    const cargo = readFileSync(manifest, "utf8");
    const napi = Number(cargo.match(/^napi\s*=.*features\s*=\s*\["napi(\d+)"\]/m)?.[1]);
    if (!napi || napi !== packageJson.fastBuild.nodeApi) {
        throw new Error("Package Node-API requirement does not match Cargo.toml.");
    }
    const identity = {
        packageName: packageJson.name,
        version: packageJson.version,
        target: packageTarget,
        sourceRevision: revision,
        napi,
    };
    const identityPath = resolve(packageDir, "native-build.json");
    writeFileSync(identityPath, `${JSON.stringify(identity, null, 2)}\n`);
    const destination = fileURLToPath(
        new URL("../../publish_artifacts_native/", import.meta.url),
    );
    mkdirSync(destination, { recursive: true });
    const result = execFileSync(
        process.platform === "win32" ? "npm.cmd" : "npm",
        [
            "pack",
            packageDir,
            "--json",
            "--ignore-scripts",
            "--pack-destination",
            destination,
        ],
        { encoding: "utf8", shell: process.platform === "win32" },
    );
    const packed = JSON.parse(result)[0];
    for (const required of ["fast-build.node", "native-build.json"]) {
        if (!packed.files.some(file => file.path === required)) {
            throw new Error(`Native tarball is missing ${required}.`);
        }
    }
    const tarball = resolve(destination, packed.filename);
    identity.sha256 = createHash("sha256").update(readFileSync(tarball)).digest("hex");
    writeFileSync(
        resolve(destination, `${packageTarget}.json`),
        `${JSON.stringify(identity, null, 2)}\n`,
    );
    copyFileSync(identityPath, resolve(destination, `${packageTarget}.build.json`));
    console.log(tarball);
}
writeFileSync(
    resolve(targetDir, "cargo-artifacts.json"),
    JSON.stringify(artifacts, null, 2),
);
console.log(addon);
