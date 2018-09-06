const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// TODO webpack v4 upgrade
// https://github.com/thegreenhouseio/docker-ssr/issues/9
module.exports = {
  context: path.resolve(__dirname, 'src'),

  resolve: {
    extensions: ['.jsx', '.js']
  },

  entry: './index',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'static')
  },

  module: {
    rules: [
      { test: /\.jsx$/, use: 'babel-loader' }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      chunksSortMode: 'dependency'
    })
  ]

};