'use strict'
var baseConfig  = require('./webpack.base.config.js');

var config = Object.assign({}, baseConfig);

config.devtool = "inline-source-map";

module.exports = config;