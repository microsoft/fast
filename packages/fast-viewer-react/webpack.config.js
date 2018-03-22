const webpack = require('webpack');
const path = require('path');
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'inline-source-map',
    entry: './app/app.tsx',
    output: {
        path: path.resolve('./www'),
        publicPath: '/',
        filename: 'app.js'
    },
    mode: process.env.NODE_ENV || "development",
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    { loader: 'ts-loader' },
                    { loader: 'tslint-loader' }
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            tslint: path.resolve(__dirname, "./tslint.json")
        }),
        new HtmlWebpackPlugin({
            title: 'FAST viewer',
            template: path.resolve(__dirname, './app/index.html')
        })
    ],
    devServer: {
        compress: false,
        historyApiFallback: true,
        port: 3000
    }
}
