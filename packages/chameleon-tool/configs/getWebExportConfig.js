var utils = require('./utils.js');
var getCmlLoaderConfig = require('./cml-loader.conf');
var path = require('path');
var merge = require('webpack-merge')
const getCommonConfig = require('./getCommonConfig');

module.exports = function (options) {
  var cmlLoaders = [{
    loader: 'chameleon-loader',
    options: { ...getCmlLoaderConfig({type: 'web'}),
      cmlType: 'web'
    }
  }]
  let { entry } = utils.getWebEntry(options)
  var commonConfig =
  {
    entry,
    output: {
      path: path.resolve(options.root, 'dist/components/web'),
      filename: '[name].vue'
    },
    resolve: {
      extensions: ['.cml', '.interface', '.vue', '.js'],
      alias: {
      },
      modules: [
        'node_modules',
        path.join(cml.root, '/node_modules')
      ]
    },
    resolveLoader: {
      modules: [
        'node_modules',
        path.join(cml.root, '/node_modules')
      ]
    },
    module: {
      rules: [
        {
          test: /\.cml$/,
          use: cmlLoaders
        }
      ]
    }

  }

  return merge(getCommonConfig(options), commonConfig);

}


