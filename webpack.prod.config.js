const merge = require('webpack-merge');
const common = require('./webpack.common.config');
const { getPath } = require('./utils');
const workboxPlugin = require('workbox-webpack-plugin');

module.exports = merge(common, {
	entry: [ getPath('entry-prod.js'), getPath('src') ],
	mode: 'production',
	devtool: 'none',

	plugins: [
		new workboxPlugin.InjectManifest({
			swSrc: getPath('serviceworker.js'),
			swDest: 'sw.js',
		}),
	],
});
