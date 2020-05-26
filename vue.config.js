const webpack = require('webpack');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
    configureWebpack: {
        // mode: 'production',
        output: {
            // libraryExport: 'default'
        },
        optimization: {
            sideEffects: false
        },
        plugins: [
            new LodashModuleReplacementPlugin,
            new webpack.IgnorePlugin(/^\.\/locale$/)
        ]
    },
    css: {
        sourceMap: process.env.NODE_ENV === 'production'
    }
};
