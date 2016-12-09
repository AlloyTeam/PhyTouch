'use strict';

const path = require('path');

module.exports = {
  entry: path.join(__dirname, './src/index.jsx'),
  output: {
    path: path.join(__dirname, './'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      { 
        test: /\.js|jsx$/, 
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        },
        exclude: /node_modules/
      }
    ]
  }
}