const path = require("path");

module.exports = {
    entry: {
        aSketchPage: path.resolve(__dirname, "./src/aSketchPage.ts")
    },
    mode: process.env.NODE_ENV || "development",
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name].js",
        library: "sketchLibrary"
    },
    resolve: {
        extensions: [".js", ".ts"]
    },
    module: {
        rules: [
            {
                test: /.tsx?$/,
                loader: "ts-loader"
            }
        ]
    }
}
