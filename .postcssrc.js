const purgecss = require('@fullhuman/postcss-purgecss');
const prefixer = require('postcss-prefix-selector');

module.exports = {
  plugins: [
    purgecss({
      content: ['./**/*.vue']
    }),
    prefixer({
      prefix: '.patriot-poll'
    })
  ]
}