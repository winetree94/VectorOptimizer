const path = require('path');
const prod = process.env.NODE_ENV === 'production';
const umd = process.env.MODE === 'UMD';

module.exports = {
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
  target: ['web', 'es5'],
};