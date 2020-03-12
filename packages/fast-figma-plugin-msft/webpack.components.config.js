const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const appDir = path.resolve(__dirname, "./src");
const outDir = path.resolve(__dirname, "./dist");

module.exports = (env, args) => {
    const isProduction = args.mode === "production";

    return {
        devtool: isProduction ? "none" : "inline-source-map",
        entry: {
            main: path.resolve(appDir, "core/ui/components/test.ts"),
        },
        output: {
            path: outDir,
            publicPath: "/",
            filename: "[name].js",
        },
        mode: args.mode || "development",
        module: {
            rules: [
                {
                    test: /.tsx?$/,
                    use: [
                        {
                            loader: "babel-loader",
                        },
                        {
                            loader: "ts-loader",
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: "style-loader",
                        },
                        {
                            loader: "css-loader",
                        },
                    ],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: "Component testbed",
                template: "./src/core/ui/components/test.html",
            }),
        ],
        resolve: {
            extensions: [".js", ".jsx", ".tsx", ".ts"],
        },

        devServer: {
            port: 9000,
        },
    };
};
