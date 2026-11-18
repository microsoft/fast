import { execFileSync } from "node:child_process";
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
    "linux-x64-gnu": "x86_64-unknown-linux-gnu",
    "linux-x64-musl": "x86_64-unknown-linux-musl",
    "win32-x64-msvc": "x86_64-pc-windows-msvc",
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
                  ...(rustTarget?.includes("musl")
                      ? {
                            RUSTFLAGS: `${process.env.RUSTFLAGS ?? ""} -C target-feature=-crt-static`,
                        }
                      : {}),
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
    writeFileSync(
        resolve(packageDir, "native-build.json"),
        `${JSON.stringify(
            {
                packageName: packageJson.name,
                version: packageJson.version,
                target: packageTarget,
                sourceRevision: revision,
                napi,
            },
            null,
            2,
        )}\n`,
    );
}
writeFileSync(
    resolve(targetDir, "cargo-artifacts.json"),
    JSON.stringify(artifacts, null, 2),
);
console.log(addon);
