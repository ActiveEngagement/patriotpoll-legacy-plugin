const path = require('path');
const purgecss = require('@fullhuman/postcss-purgecss');
const prefixer = require('postcss-prefix-selector');

module.exports = {
    plugins: [].concat(process.env.NODE_ENV === 'production' && [
        purgecss({
            content: [
                path.resolve('./**/*.scss'),
                path.resolve('./**/*.vue'),
                path.resolve('./**/*.html'),
            ]
        }),
        /*
        prefixer({
            prefix: '.patriot-poll'
        })
        */
    ])
};