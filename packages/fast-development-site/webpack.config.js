const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'inline-source-map',
    entry: './app/app.tsx',
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
                        loader: 'ts-loader'
                    },
                    {
                        loader: 'tslint-loader'
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Test',
            template: path.resolve(__dirname, './app/index.html')
        })
    ],
    devServer: {
        compress: false,
        historyApiFallback: true,
        port: 3000
    }
};
