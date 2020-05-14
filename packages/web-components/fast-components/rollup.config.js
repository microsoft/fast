const resolve = require("rollup-plugin-node-resolve");
const typescript = require("rollup-plugin-typescript");
const path = require("path");

module.exports = {
    input: path.resolve(__dirname, "./build/generate-default-palettes.js"),
    output: {
        file: ".tmp/generate-palettes.js",
        format: "cjs",
    },
    plugins: [resolve(), typescript()],
    external: ["fs", "path"],
};
