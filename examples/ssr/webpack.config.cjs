const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin");
const path = require('path');

module.exports = function(env, { mode }) {
  const production = mode === 'production';
  return {
    mode: production ? 'production' : 'development',
    devtool: production ? 'source-map' : 'inline-source-map',
    entry: {
      app: ['./src/main.ts']
    },
    output: {
      filename: 'bundle.js',
      publicPath:'/',
      path: path.resolve(process.cwd(), 'www'),
    },
    plugins: [
      new CleanWebpackPlugin()
    ],
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
