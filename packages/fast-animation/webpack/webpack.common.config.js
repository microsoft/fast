/**
 * Required Imports
 */
const webpack                       = require('webpack');
const path                          = require('path');
const ModernizrWebpackPlugin        = require('modernizr-webpack-plugin');
const ExtractTextPlugin             = require('extract-text-webpack-plugin');
const ForkTsCheckerWebpackPlugin    = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin          = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/**
 * Define config objects
 */
const modernizrConfig = {
    'options': [
        'setClasses'
    ]
}

const config = {
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    module: {
      rules: [
            // {
            //     test: /.jsx?$/,
            //     use: [
            //         { loader: 'babel-loader' }
            //     ],
            //     exclude: /node_modules/,
            // },
            {
                test: /\.tsx?$/,
                exclude: /\.(test|spec)/,
                use: [
                    { loader: 'babel-loader' },
                    { loader: 'awesome-typescript-loader' },
                    { loader: 'tslint-loader' }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                exclude: /fonts/,
                loader: `file-loader?name=images/[name].[ext]`
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: "css-loader" },
                        { loader: "postcss-loader" },
                        { loader: "sass-loader" }
                    ]
                })
            }
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            tslint: path.resolve(__dirname, '../tslint.json')
        }),
        new ModernizrWebpackPlugin(modernizrConfig),
        new ExtractTextPlugin('fw_package.css'),
        new BundleAnalyzerPlugin({
            // Remove this to inspect bundle sizes.
            analyzerMode: 'disabled'
        })
    ],

    /**
     * Dev Server config
     */
    devServer: {
        compress: false,
        historyApiFallback: true,
        disableHostCheck: true
    }
};

module.exports = config;
