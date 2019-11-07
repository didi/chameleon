
"use strict";

const ConcatSource = require("webpack-sources").ConcatSource;
const cmlUtils = require('chameleon-tool-utils');
class JsonpChunkTemplatePlugin {
  apply(chunkTemplate) {
    chunkTemplate.plugin("render", function(modules, chunk) {
      const jsonpFunction = this.outputOptions.jsonpFunction;
      const source = new ConcatSource();
      const chunkNameLength = cmlUtils.handleWinPath(chunk.name).split('/').length;
      // 所有chunk都在static/js下，求该chunk相对manifest.js的路径
      const manifestPath = [
        'manifest.js'
      ]
      if (chunkNameLength === 1) {
        manifestPath.unshift('./');
      } else {
        let prefix = '';
        // 如果是3  ../../
        for (let i = 1; i < chunkNameLength; i++) {
          prefix += '../'
        }
        manifestPath.unshift(prefix);
      }
      source.add(`var __CML__GLOBAL = require("${manifestPath.join('')}");\n`);
      source.add(`__CML__GLOBAL.${jsonpFunction}(${JSON.stringify(chunk.ids)},`);
      source.add(modules);
      const entries = [chunk.entryModule].filter(Boolean).map(m => m.id);
      if(entries.length > 0) {
        source.add(`,${JSON.stringify(entries)}`);
      }
      source.add(")\n");
      if(chunk.name !== 'common'){
        
        source.add(`module.exports = __CML__GLOBAL.__CMLCOMPONNETS__['${chunk.name}']`)
      }
      return source;
    });
    chunkTemplate.plugin("hash", function(hash) {
      hash.update("JsonpChunkTemplatePlugin");
      hash.update("3");
      hash.update(`${this.outputOptions.jsonpFunction}`);
      hash.update(`${this.outputOptions.library}`);
    });
  }
}
module.exports = JsonpChunkTemplatePlugin;