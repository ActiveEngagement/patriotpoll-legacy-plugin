const path = require('path');
const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
    plugins: [].concat(process.env.NODE_ENV === 'production' && [
        purgecss({
            content: [
                path.resolve('./**/*.scss'),
                path.resolve('./**/*.vue'),
                path.resolve('./**/*.html'),
            ]
        })
    ])
};