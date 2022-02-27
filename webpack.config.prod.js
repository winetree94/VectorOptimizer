const config = require('./webpack.config');
const path = require('path');

module.exports = {
  ...config,
  mode: 'production',
  entry: './src/main-browser.ts',
  optimization: {
    minimize: true,
  },
  output: {
    library: 'Curves',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, './dist'),
    filename: 'curves.min.js',
  },
}