module.exports = {
    resolve: {
        modulesDirectories: ['node_modules', 'bower_components'],
        extensions: ['', '.js', '.jsx'],
        alias: {
            'react-scrollbar/no-css': '../../src/js/ScrollAreaWithoutCss.js',
            'react-scrollbar': '../../src/js/ScrollAreaWithCss.js'
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
