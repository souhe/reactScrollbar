/* eslint-disable import/no-extraneous-dependencies */

var baseConfig = require('./webpack.base.config.js');
var objectAssign = require('object-assign');

var config = objectAssign({}, baseConfig);

config.devtool = 'inline-source-map';

module.exports = config;
