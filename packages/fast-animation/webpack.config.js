const path                          = require('path');
const BundleAnalyzerPlugin          = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCSSExtractPlugin          = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin    = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin             = require('html-webpack-plugin');
const ModernizrWebpackPlugin        = require('modernizr-webpack-plugin');

const appDir = path.resolve('./client/examples/app');
const outDir = path.resolve('./www');

const modernizrConfig = {
    'options': [
        'setClasses'
    ]
}

module.exports = (env, args) => {
    const isProduction = args.mode === "production";

    return {
        devServer: {
            compress: false,
            historyApiFallback: true,
            disableHostCheck: true,
            open: true,
            overlay: true,
            port: 9005
        },
        entry: appDir + '/app.tsx',
        devtool: isProduction ? "none" : "inline-source-map",
        mode: args.mode || "development",
        optimization: {
            splitChunks: {
                chunks: "all",
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                    },
                },
            }
        },
        output: {
            path: outDir,
            publicPath: "/",
            filename: isProduction ? "[name]-[contenthash].js" : "[name].js",
        },
        module: {
            rules: [
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
                use: [
                    { loader: `file-loader?name=images/[name].[ext]` }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    { loader: MiniCSSExtractPlugin.loader },
                    { loader: "css-loader" },
                    { loader: "postcss-loader" }
                ]
            }]
        },   
        plugins: [
            new ForkTsCheckerWebpackPlugin({
                tslint: path.resolve(__dirname, 'tslint.json')
            }),
            new HtmlWebpackPlugin({
                title: 'Animation system examples',
                template: path.resolve(appDir, 'index.html')
            }),
            new ModernizrWebpackPlugin(modernizrConfig),
            new MiniCSSExtractPlugin('fast-animation-package.css'),
            new BundleAnalyzerPlugin({
                analyzerMode: 'disabled'
            })
        ],
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            alias: {
                fbjs: path.resolve('./node_modules/fbjs'),
                'lodash-es': path.resolve('./node_modules/lodash-es'),
                react: path.resolve('./node_modules/react'),
                'react-dom': path.resolve('./node_modules/react-dom'),
            }
        },
    }
};