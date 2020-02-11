const purgecss = require('@fullhuman/postcss-purgecss');
const prefixer = require('postcss-prefix-selector');

module.exports = {
    plugins: [].concat(process.env.NODE_ENV === 'production' && [
        purgecss({
            content: ['./**/*.vue']
        }),
        prefixer({
            prefix: '.patriot-poll'
        })
    ])
};