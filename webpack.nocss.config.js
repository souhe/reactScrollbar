const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
//var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
  target: 'web',
  watch: true,
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: [['env', {
            browsers: ['last 2 versions'],
            include: ['transform-es2015-arrow-functions', 'es6.map'],
            modules: false,
            useBuiltIns: 'entry',
          }]]
      }
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': 'production'
    }),
    new UglifyJSPlugin(),
  ],
  stats: {
    colors: true
  },
  devtool: 'production',
};

const mainConfig = Object.assign({}, config, {
  name: 'main',
  entry: path.resolve(__dirname, 'src/js/ScrollAreaWithoutCss.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'no-css.js'
  },
});
module.exports = [mainConfig];
