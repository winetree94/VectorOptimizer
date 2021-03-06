const config = require('./webpack.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  ...config,
  mode: 'development',
  entry: './sample/main.ts',
  devServer: {
    port: 9009,
    hot: false,
    liveReload: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      template: './sample/index.html',
    }),
  ],
  output: {
    library: 'VectorOptimizer',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, './docs'),
    filename: 'vector-optimizer.min.js',
  },
  devtool: 'source-map',
}