const { getPath } = require('./utils');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  performance: { hints: false },

  resolve: {
    extensions: [ '.js', '.ts' ],
    modules: [ 'node_modules', 'src' ],
  },

  output: {
    filename: 'bundle.[hash].js',
    path: getPath('dist'),
  },

  module: {
    rules: [
      {
        test: /\.(j|t)s$/,
        loader: 'babel-loader',
      },
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: getPath('src', 'index.html'),
    }),
    new CleanWebpackPlugin(),
  ],
};
