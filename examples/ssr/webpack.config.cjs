const path = require('path');

module.exports = function(env, { mode }) {
  const production = mode === 'production';
  return {
    mode: production ? 'production' : 'development',
    devtool: production ? 'source-map' : 'inline-source-map',
    entry: {
      app: './src/main.ts'
    },
    output: {
      filename: 'bundle.js',
      publicPath:'/',
      path: path.resolve(process.cwd(), 'www'),
      clean: true
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
      extensionAlias: {
        ".js": [".ts", ".js"],
        ".mjs": [".mts", ".mjs"]
      }
    }
  }
}
