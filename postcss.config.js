module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      // 基准值 px to rem
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
