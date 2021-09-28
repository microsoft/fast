require("./build/releasing/ts-node-register");
/* .module.exports = require("./build/releasing/index");*/

module.exports = {
    bumpDeps: true,
    disallowedChangeTypes: ["major"],
    groups: [
        {
            name: "excluded packages",
            excludes: "sites/*",
        },
    ],
    ignorePatterns: [
        ".ignore",
        ".github/",
        ".prettierrc",
        ".vscode/",
        "docs/**",
        "jest..js",
        "src/e2e/",
        "src/tests/",
        "src/fixtures/**",
        // This one is especially important (otherwise dependabot would be blocked by change file requirements)
        "yarn.lock",
    ],
};
