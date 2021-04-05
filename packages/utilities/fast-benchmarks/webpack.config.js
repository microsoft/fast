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
            ${config.path ? fs.readFileSync(config.path).toString() : ""}
            </body>
        </html>
        `;
}

module.exports = benchmarkNames => {
    return {
        entry: benchmarkNames.reduce((prev, current) => {
            return {
                ...prev,
                [current]: path.resolve(
                    process.env.BENCHMARK_SRC,
                    `./${current}/index.ts`
                ),
            };
        }, {}),
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
        plugins: [new CleanWebpackPlugin()].concat(
            benchmarkNames.map(name => {
                const templatePath = path.resolve(
                    process.env.BENCHMARK_SRC,
                    `./${name}/index.html`
                );
                return new HtmlWebpackPlugin({
                    title: `FAST ${name}`,
                    chunks: [name],
                    filename: `${name}.html`,
                    templateContent: template({
                        path: fs.existsSync(templatePath) ? templatePath : undefined,
                    }),
                    inject: "body",
                    scriptLoading: "blocking",
                });
            })
        ),
        devServer: {
            port: 8080,
        },
    };
};
