
const crypto = require('crypto');
const {chameleonHandle} = require('./utils.js');

module.exports = function(compiler) {
  // eslint-disable-next-line
  var _plugin = this;
  var compilerPlugin;
  var compilationPlugin;
  if (compiler.hooks) {
    compilerPlugin = function (fn) {
      compiler.hooks.compilation.tap('chameleon-plugin', fn);
    };
    compilationPlugin = function (compilation, fn) {
      compilation.hooks.chunkHash.tap('chameleon-plugin', fn);
    }
  } else {
    compilerPlugin = function (fn) {
      compiler.plugin('compilation', fn);
    };
    compilationPlugin = function (compilation, fn) {
      compilation.plugin('chunk-hash', fn);
    }
  }
  // eslint-disable-next-line
  let i = 0;
  compilerPlugin(function(compilation) {
    compilationPlugin(compilation, function(chunk, chunkHash) {
      var modules;
      if (chunk.modulesIterable) {
        modules = Array.from(chunk.modulesIterable, getModuleSource);
      } else if (chunk.mapModules) {
        modules = chunk.mapModules(getModuleSource);
      } else {
        modules = chunk.modules.map(getModuleSource);
      }
      // 解决manifest的modules为0 source为空字符串 导致hash相同
      if (modules.length > 0) {
        var source = modules.sort(sortById).reduce(concatenateSource, '')
        source = chameleonHandle(source, _plugin.options.cliName); 
        var hash = crypto.createHash(_plugin.algorithm).update(source + _plugin.additionalHashContent(chunk));
        chunkHash.digest = function(digest) {
          return hash.digest(digest || _plugin.digest);
        };
      }
    });
  });
}


// helpers

function sortById(a, b) {
  if (a < b) {
    return -1;
  } else {
    return 1;
  }
}

function getModuleSource(module) {
  return {
    id: module.id,
    source: (module._source || {})._value || '',
    dependencies: (module.dependencies || []).map(function(d) {return d.module ? d.module.id : '';})
  };
}

function concatenateSource(result, module) {
  return result + '#' + module.id + ':!' + module.source + '$' + (module.dependencies.join(','));
}
