const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, 'src'),

  resolve: {
    extensions: ['.jsx', '.js']
  },

  entry: './index',

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  module: {
    rules: [{ 
      test: /\.jsx$/, 
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-react'
            // "@babel/preset-es2015", 
            // "@babel/preset-stage-2"
          ]
        }
      }
    }]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      chunksSortMode: 'dependency'
    })
  ]

};