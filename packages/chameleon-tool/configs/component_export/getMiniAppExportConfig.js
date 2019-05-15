

var merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin')
var path = require('path');

module.exports = function (config, options) {
  let { type, root, externals } = options;
  let outputPath = options.outputPath || path.resolve(root, `dist/export/${type}`);
  Object.keys(externals).forEach(key => {
    externals[key] = `require('${externals[key]}')`;
  })
  return merge(config, {
    output: {
      path: outputPath
    },
    externals,
    plugins: [
      new CleanWebpackPlugin(['./*'], {root: outputPath, verbose: false})
    ]
  })
}
