const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const appDir = path.resolve(__dirname, "./app");
const outDir = path.resolve(__dirname, "./www");

module.exports = (env, args) => {

    const isProduction = args.mode === "production";

    return {
        devServer: {
            compress: false,
            historyApiFallback: true,
            open: true,
            port: 3000
        },
        devtool: isProduction ? "none" : "inline-source-map",
        entry: path.resolve(appDir, "index.tsx"),
        mode: args.mode || "development",
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                compilerOptions: {
                                    declaration: false,
                                }
                            }
                        }
                    ],
                    exclude: /node_modules/
                }
            ]
        },
        output: {
            path: outDir,
            publicPath: "/",
            filename: isProduction ? "[name]-[contenthash].js" : "[name].js"
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: "FAST viewer",
                contentBase: outDir
            })
        ],
        resolve: {
            extensions: [".js", ".ts", ".tsx"],
        }
    }
}
