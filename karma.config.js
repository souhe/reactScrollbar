const webpackDevConfig = require('./webpack.dev.config.js');

module.exports = function (config) {
  config.set({
    browsers: [ 'PhantomJS', 'Chrome' ],
    files: [
      './test/tests.bundle.js'
    ],
    frameworks: [ 'mocha' ],
    preprocessors: {
      './test/tests.bundle.js': [ 'webpack', 'sourcemap' ]
    },
    reporters: [ 'mocha' ],
    singleRun: true,
    webpack: {
        devtool: 'inline-source-map',
        resolve: {
            modulesDirectories: ['node_modules', 'bower_components'],
            extensions: ['', '.js', '.jsx']
        },
        module: {
            loaders: [
                { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel' },
                { test: /\.less$/, loader: 'style!css!less' }
            ]
        }
    },
    webpackServer: {
      noInfo: true
    }
  });
};