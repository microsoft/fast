/**
 * Required Imports
 */
const webpack                   = require('webpack');
const ModernizrWebpackPlugin    = require('modernizr-webpack-plugin');
const path                      = require('path');
const HtmlWebpackPlugin         = require('html-webpack-plugin');

let config = require('./webpack.common.config');
let APP_DIR = path.resolve('./client/examples/app');
let BUILD_DIR = path.resolve('./www');

/**
 * Export WebPack Config
 */
config.entry = APP_DIR + '/app.tsx';
config.output = {
    path: BUILD_DIR,
    publicPath: '/',
    filename: 'app.js'
};
config.plugins = config.plugins.concat([
    new HtmlWebpackPlugin({
        title: 'Animation system examples',
        template: path.resolve(APP_DIR, 'index.html')
    })
]);
config.devServer.port = 9005;

module.exports = config;