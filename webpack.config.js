module.exports = {
    resolve: {
        modulesDirectories: ['node_modules', 'bower_components'],
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
    }],
    
    module: {
        loaders: [
            { test: /\.js|\.jsx$/, exclude: /node_modules/, loader: 'babel' },
            { test: /\.less$/, loader: 'style!css!less' }
        ]
    },
    devtool: "inline-source-map"
};
