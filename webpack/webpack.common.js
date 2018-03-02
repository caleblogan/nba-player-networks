const path = require('path');
const merge = require("webpack-merge");


const config = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: path.resolve(__dirname, '../dist/'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['env', {"modules": false}], 'react'],
            plugins: ['transform-object-rest-spread']
          }
        }
      },

    ]
  },
  plugins: [
  ]
};

module.exports = merge([config]);