const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin");
const path = require('path');

module.exports = function(env, { mode }) {
    const production = mode === 'production';
    return {
        mode: production ? 'production' : 'development',
        devtool: production ? 'source-map' : 'inline-source-map',
        entry: {
            app: ['./src/webapp.ts']
        },
        output: {
            filename: 'bundle.js',
            publicPath: '/',
            path: path.resolve(__dirname, './dist'),
        },
        plugins: [
            new CleanWebpackPlugin(),
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
