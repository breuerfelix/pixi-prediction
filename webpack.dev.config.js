const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.config.js');
const { getPath } = require('./utils');

const { PORT } = process.env;

module.exports = merge(common, {
  entry: [ getPath('src') ],

  mode: 'development',
  devtool: 'eval',

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],

  devServer: {
    port: PORT || 8080,
    hot: true,
    inline: true,
    progress: true,
    compress: true,
    historyApiFallback: true,
  },
});
