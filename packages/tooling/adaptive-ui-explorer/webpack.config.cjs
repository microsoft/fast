const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const InjectBodyPlugin = require("inject-body-webpack-plugin").default;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin");
const path = require('path');

module.exports = function(env, { mode }) {
    const production = mode === 'production';
    return {
        mode: production ? 'production' : 'development',
        devtool: production ? 'source-map' : 'inline-source-map',
        entry: {
            app: ['./src/app.ts']
        },
        output: {
            filename: 'bundle.js',
            publicPath: '/',
            path: path.resolve(__dirname, './dist'),
        },
        plugins: [
            new CleanWebpackPlugin(),
            new InjectBodyPlugin({
                content: "<style>html { height: 100%; font-family: sans-serif; } body { margin: 0; height: 100%; display: flex; }</style> <app-main></app-main>",
            }),
            new HtmlWebpackPlugin({
                title: "Adaptive UI Explorer",
            }),
        ],
        devServer: {
            static: {
                directory: "./src/public",
            },
            open: true,
            port: 7700,
            allowedHosts: "all",
        },
        module: {
            rules: [
                {
                    test: /\.ts$/i,
                    use: [
                        {
                            loader: 'ts-loader'
                        }
                    ],
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: ['.ts', '.js'],
            modules: ['src', 'node_modules'],
            plugins: [new ResolveTypeScriptPlugin()]
        }
    }
}
