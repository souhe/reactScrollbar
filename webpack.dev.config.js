'use strict'
var baseConfig  = require('./webpack.base.config.js');

var config = baseConfig;

config.devtool = "inline-source-map";

module.exports = config;