const path = require("path");

const appDir = path.resolve(__dirname, "./app");
const outDir = path.resolve(__dirname, "./dist");

module.exports = {
    entry: {
        "message-system": path.resolve(__dirname, "./src/message-system/webworker.ts"),
    },
    output: {
        path: outDir,
        filename: "[name].min.js",
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: {
                                declaration: false,
                            },
                            configFile: "tsconfig.esm.json",
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: [".js", ".tsx", ".ts", ".json"],
    },
};
