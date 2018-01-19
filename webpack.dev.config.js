const baseConfig = require('./webpack.base.config.js');
const objectAssign = require('object-assign');

const config = objectAssign({}, baseConfig);

config.devtool = 'inline-source-map';
module.exports = config;
