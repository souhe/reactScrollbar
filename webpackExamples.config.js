module.exports = {
    resolve: {
        modulesDirectories: ['node_modules', 'bower_components'],
        extensions: ['', '.js', '.jsx'],
        alias: {
            'react-scrollbar/no-css': '../../../src/js/scrollAreaWithoutCss.js',
            'react-scrollbar': '../../../src/js/scrollAreaWithCss.js'
        }
    },
    module: {
        loaders: [
            { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel'},
            { test: /\.less$/, loader: 'style!css!less' }
        ]
    },
    devtool: "inline-source-map"
};
