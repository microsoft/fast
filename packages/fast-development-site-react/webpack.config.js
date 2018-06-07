const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
    devtool: 'inline-source-map',
    entry: './app',
    mode: 'development',
    output: {
        path: path.resolve('www'),
        publicPath: '/',
        filename: 'app.js'
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            tslint: path.resolve(__dirname, "./tslint.json")
        }),
        new HtmlWebpackPlugin({
            title: 'Test',
            template: path.resolve(__dirname, './app/index.html')
        }),
        new WebpackShellPlugin({
            onBuildStart: [
                `npm run convert:readme`
            ]
        })
    ],
    devServer: {
        compress: false,
        historyApiFallback: true,
        port: 3000
    }
};
