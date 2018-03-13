/**
 * Required Imports
 */
const webpack                       = require('webpack');
const path                          = require('path');
const fs                            = require('fs');
const UglifyJsPlugin                = require('uglifyjs-webpack-plugin');
const ForkTsCheckerWebpackPlugin    = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin             = require('copy-webpack-plugin');
const GenerateJsonWebpackPlugin     = require('generate-json-webpack-plugin');
const APP_DIR                       = path.resolve('./src');
const EXTENSION_DIR                 = path.resolve(APP_DIR, 'extension');
const BUILD_DIR                     = path.resolve('./dist', process.env.TARGET_BROWSER);
const browser_manifest              = require(path.resolve(EXTENSION_DIR, 'manifest.ts'));

/**
 * Configuration
 */
let config = {
    entry: {
        contextMenu: path.resolve(EXTENSION_DIR, 'contextMenu/index.ts'),
        content: path.resolve(EXTENSION_DIR, 'content.ts')
    },
    output: {
        path: BUILD_DIR,
        filename: '[name].js'
    },
    mode: process.env.NODE_ENV,
    watchOptions: {
        ignored: '/node_modules/',
    },
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    module: {
      rules: [
            {
                test: /\.tsx?$/,
                exclude: /\.(test|spec)/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: { transpileOnly: true }
                    },
                    { loader: 'tslint-loader' }
                ]
            },
            {
                test: /\.(eot|ttf|woff|woff2|svg)$/i,
                exclude: /images/,
                loader: `file-loader?name=fonts/[name].[ext]`
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                exclude: /fonts/,
                loader: `file-loader?name=images/[name].[ext]`
            }
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            tslint: path.resolve(__dirname, "./tslint.json")
        }),
        new CopyWebpackPlugin([
            // Copy icons to build directory
            { from: path.resolve(EXTENSION_DIR, 'icons'), to: path.resolve(BUILD_DIR, 'icons') },
        ]),
        new GenerateJsonWebpackPlugin('manifest.json', browser_manifest)
    ]
};

/**
 * Development and Production configurations
 */
const productionPlugins = [
    new UglifyJsPlugin()
];

switch (process.env.NODE_ENV) {
    case 'development':
        config.watch = true;
        break;
    case 'production':
        config.plugins = config.plugins.concat(productionPlugins);
        break;
}

module.exports = config;
