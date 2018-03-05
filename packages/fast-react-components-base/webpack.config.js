const path = require("path");

const appDir = path.resolve(__dirname, "./app");
const outDir = path.resolve(__dirname, "./www");

module.exports = {
    entry: path.resolve(appDir, "index.ts"),
    output: {
        path: outDir,
        filename: "[name].js"
    }
}
