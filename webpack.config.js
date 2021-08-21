const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const prod = process.env.NODE_ENV === 'production';

module.exports = {
  mode: 'development',
  entry: prod ? './src/curves/main.ts' : './src/curves.sample/main.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: ['ts-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {
    port: 9009,
    hot: false,
    liveReload: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      template: './src/curves.sample/index.html',
    }),
  ],
  output: {
    library: 'Curves',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, './docs'),
    filename: 'curves.min.js'
  },
  devtool: 'source-map',
  target: ['web', 'es5'],
};