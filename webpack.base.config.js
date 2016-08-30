'use strict'

var webpack = require('webpack');

module.exports = {
    resolve: {
        modulesDirectories: ['node_modules', 'bower_components'],
        extensions: ['', '.js', '.jsx']
    },

    output: {
        library: 'ScrollArea',
        libraryTarget: 'umd'
    },

    externals: [
        {
            "react": {
                root: "React",
                commonjs2: "react",
                commonjs: "react",
                amd: "react"
            }
        }
    ],

    module: {
        loaders: [
            { 
                test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel'
            },
            { 
                test: /\.less$/, 
                loader: 'style!css!less' 
            }
        ]
    }
};
