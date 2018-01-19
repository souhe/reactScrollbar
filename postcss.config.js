/* eslint-disable global-require */

module.exports = () => ({
  plugins: [
    require('postcss-custom-properties')(),
    require('postcss-custom-media')(),
    require('postcss-media-minmax')(),
    require('postcss-custom-selectors')(),
    require('postcss-calc')(),
    require('postcss-nesting')(),
    require('postcss-nested')(),
    require('postcss-color-function')(),
    require('postcss-selector-matches')(),
    require('postcss-selector-not')(),
    require('postcss-flexbugs-fixes')(),
    require('autoprefixer')({
      browsers: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 11',
      ],
    }),
  ],
});
