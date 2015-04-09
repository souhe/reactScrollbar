module.exports = {
    resolve: {
        modulesDirectories: ['node_modules', 'bower_components'],
    },
    module: {
        loaders: [
            { test: /\.js|\.jsx$/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
    },
    devtool: "inline-source-map"
};
