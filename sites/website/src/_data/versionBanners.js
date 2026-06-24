/**
 * Version banner configuration.
 *
 * Each key is a documentation version (e.g., "1.x", "2.x", "3.x").
 *
 * Properties:
 * - enabled:  Whether the banner is displayed.
 * - type:     "legacy" | "stable" | "prerelease" — controls color.
 * - message:  Text shown in the banner.
 *
 * To add a banner for a new version, add a new key here.
 * To remove a banner, set `enabled: false` or delete the key.
 */
export default function () {
    return {
        "1.x": {
            enabled: true,
            type: "legacy",
            message:
                "You are viewing documentation for a previous version of FAST. The latest version is 3.x.",
        },
        "2.x": {
            enabled: true,
            type: "legacy",
            message:
                "You are viewing documentation for a previous version of FAST. The latest version is 3.x.",
        },
        "3.x": {
            enabled: false,
            type: "stable",
            message: "You are viewing the current stable version of FAST.",
        },
    };
}
