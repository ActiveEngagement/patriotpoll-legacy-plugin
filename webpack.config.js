module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: '[name].js',
        path: __dirname + '/test'
    },
    optimization: {
        // We no not want to minimize our code.
        minimize: true
    },
};