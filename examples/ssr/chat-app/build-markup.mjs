import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const cwd = path.dirname(fileURLToPath(import.meta.url));
const fastCli = require.resolve("@microsoft/fast-build/bin/fast.js");
const configPath = path.join(cwd, "fast-build.config.json");
const templatesPath = path.join(cwd, "templates.html");
const indexPath = path.join(cwd, "index.html");
const scriptTag = '<script type="module" src="./src/main.ts"></script>';
const nativeAddon =
    process.env.FAST_NATIVE_ADDON ??
    fileURLToPath(
        new URL(
            "../../../crates/microsoft-fast-build/target/node-host/fast-build.node",
            import.meta.url,
        ),
    );

execFileSync(
    process.execPath,
    [fastCli, "build", `--config=${configPath}`, `--native-addon=${nativeAddon}`],
    {
        cwd,
        stdio: "inherit",
    },
);

const templates = readFileSync(templatesPath, "utf8").trim();
const rendered = readFileSync(indexPath, "utf8");

if (!rendered.includes(scriptTag)) {
    throw new Error("Unable to find the module script while injecting f-templates.");
}

writeFileSync(
    indexPath,
    rendered.replace(
        scriptTag,
        `${templates}

        ${scriptTag}`,
    ),
    "utf8",
);
