import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getFastElementVersion() {
    const pkgPath = resolve(
        __dirname,
        "..",
        "..",
        "..",
        "..",
        "packages",
        "fast-element",
        "package.json",
    );
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    return pkg.version;
}

/**
 * Version banner configuration.
 *
 * Each key is a documentation version (e.g., "1.x", "2.x", "3.x").
 *
 * Properties:
 * - enabled:  Whether the banner is displayed.
 * - type:     "legacy" | "stable" | "prerelease" — controls color.
 * - message:  Text shown in the banner.
 * - version:  Optional version string (e.g., "3.0.0-rc.1") displayed
 *             alongside the message for prerelease banners.
 *
 * To add a banner for a new version, add a new key here.
 * To remove a banner, set `enabled: false` or delete the key.
 */
export default function () {
    const fastElementVersion = getFastElementVersion();

    return {
        "1.x": {
            enabled: true,
            type: "legacy",
            message:
                "You are viewing documentation for a previous version of FAST. The latest version is 2.x.",
        },
        "2.x": {
            enabled: false,
            type: "stable",
            message: "You are viewing the current stable version of FAST.",
        },
        "3.x": {
            enabled: true,
            type: "prerelease",
            version: fastElementVersion,
            message: `This is a prerelease version of FAST (${fastElementVersion}).`,
        },
    };
}
