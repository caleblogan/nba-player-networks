const webpack = require('webpack');
const merge = require("webpack-merge");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const globalCss = new ExtractTextPlugin('styles-global.css');

const common = require('./webpack.common')

const devConfig = merge([{
  devServer: {
    historyApiFallback: true,
    contentBase: './dist',
    hot: true,
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader?modules=true&localIdentName=[name]__[local]__[hash:base64:5]", 'postcss-loader', 'sass-loader']
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
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    globalCss
  ]
}]);

module.exports = merge(common, devConfig);