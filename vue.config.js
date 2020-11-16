const webpack = require('webpack');

module.exports = {
    transpileDependencies: [
        /@vue-interface\/.+/
    ],
    configureWebpack: {
        externals: ['axios'],
        optimization: {
            sideEffects: false
        },
        plugins: [
            new webpack.IgnorePlugin(/^\.\/locale$/)
        ]
    },
    css: {
        sourceMap: process.env.NODE_ENV === 'production'
    }
};
