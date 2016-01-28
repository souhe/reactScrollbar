var webpackDevConfig = require('./webpack.dev.config.js');

module.exports = function (config) {
  config.set({
    browsers: [ 'PhantomJS' ],
    files: [
      'tests/test.bundle.js',
      'node_modules/react/dist/react.js'
    ],
    frameworks: [ 'chai', 'mocha' ],
    plugins: [
      'karma-chai',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-phantomjs-launcher',
      'karma-mocha-reporter'
    ],
    preprocessors: {
      'tests/test.bundle.js': [ 'webpack', 'sourcemap' ]
    },
    reporters: [ 'mocha' ],
    singleRun: true,
    webpack: webpackDevConfig,
    webpackMiddleware: {
      noInfo: true,
    }
  });
};