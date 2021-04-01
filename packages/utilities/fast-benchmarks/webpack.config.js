/* eslint-disable */
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");

const outDir = path.resolve(__dirname, "./dist");

function template(config) {
    return `
        <html>
            <head>
                <script src="https://unpkg.com/lodash@4.17.21/lodash.js"></script>
                <script src="https://unpkg.com/benchmark@2.1.4/benchmark.js"></script>
            </head>
            <body>
            ${fs.readFileSync(config.path).toString()}
            </body>
        </html>
        `;
}

module.exports = {
    entry: {
        a: path.resolve("./benchmarks/a/index.ts"),
        b: path.resolve("./benchmarks/b/index.ts"),
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    mode: "production",
    output: {
        library: "bench",
        path: outDir,
        publicPath: "/",
    },
    module: {
        noParse: [/node_modules\/benchmark/],
        rules: [
            {
                test: /.ts?$/,
                use: [
                    {
                        loader: "ts-loader",
                    },
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "FAST a",
            chunks: ["a"],
            filename: "a.html",
            templateContent: template({
                path: path.resolve(__dirname, "./benchmarks/a/index.html"),
            }),
            inject: "body",
            scriptLoading: "blocking",
        }),
        new HtmlWebpackPlugin({
            title: "FAST b",
            chunks: ["b"],
            filename: "b.html",
            templateContent: template({
                path: path.resolve(__dirname, "./benchmarks/b/index.html"),
            }),
            inject: "body",
            scriptLoading: "blocking",
        }),
    ],
};
