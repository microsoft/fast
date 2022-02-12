const path = require("path");
const srcDir = path.resolve(__dirname, "./src");
const outDir = path.resolve(__dirname, "./dist");

/**
 * This file exports the minified fast-style web component
 */
module.exports = {
    entry: {
        "fast-style": path.resolve(srcDir, "./fast-style/index.ts"),
    },
    output: {
        path: outDir,
        filename: "[name].min.js",
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /.ts$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            onlyCompileBundledFiles: true,
                            configFile: "tsconfig.json",
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: [".js", ".ts", ".json"],
    },
};
