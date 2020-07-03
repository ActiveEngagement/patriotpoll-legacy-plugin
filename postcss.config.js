const path = require('path');
const Color = require('color');

module.exports = {
    plugins: [].concat(process.env.NODE_ENV === 'production' && [
        require('@fullhuman/postcss-purgecss')({
            content: [
                path.resolve('./**/*.scss'),
                path.resolve('./**/*.vue'),
                path.resolve('./**/*.html'),
            ]
        })
    ])
};