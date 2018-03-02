const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const localCss = new ExtractTextPlugin('styles-local.css');
const globalCss = new ExtractTextPlugin('styles-global.css');

const common = require('./webpack.common');


const prodConfig = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: localCss.extract({
          fallback: "style-loader",
          use: ["css-loader?modules=true&localIdentName=[name]__[local]__[hash:base64:5]", 'postcss-loader', 'sass-loader']
        })
      },
      {
        test: /\.css$/,
        use: globalCss.extract({
          fallback: "style-loader",
          use: ["css-loader", 'postcss-loader', 'sass-loader']
        })
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    globalCss,
    localCss,
    new UglifyJsPlugin(),
  ]
};

module.exports = merge(common, prodConfig);
