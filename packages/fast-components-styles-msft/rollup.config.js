const resolve = require("rollup-plugin-node-resolve");
const path = require("path");

module.exports = {
    input: path.resolve(__dirname, "./generate-palettes.js"),
    output: {
        file: ".tmp/generate-palettes.js",
        format: "cjs",
    },
    plugins: [
        resolve()
    ],
    external: [
        "fs",
        "path"
    ],
}
