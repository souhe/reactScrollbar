'use strict'

var webpack = require('webpack');
var baseConfig  = require('./webpack.base.config.js');

var config = baseConfig;

config.plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
        compressor: {
            screw_ie8: true,
            warnings: false
        }
    })
];

module.exports = config;
