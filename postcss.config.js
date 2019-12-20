module.exports = {
  plugins: {
    autoprefixer: {},
    cssnano: {
      assets: 'default'
    },
    'postcss-px-to-viewport': {
      'viewportWidth': 375,
      'viewportHeight': 750,
      'unitPrecision': 3,
      'viewportUnit': 'vw',
      'selectorBlackList': [
        '.ignore',
        '.hairlines'
      ],
      'minPixelValue': 1,
      'mediaQuery': false
    }
  }
}