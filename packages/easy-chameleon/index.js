const {getConfig} = require('./config/getWebpackConfig');
const {styleLoaders, cssLoaders} = require('./config/utils');
const path = require('path');

module.exports = {
	getConfig,
	styleLoaders,
	cssLoaders
}