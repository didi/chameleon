// this is a utility loader that takes a *.cml file, parses it and returns
// the requested language block, e.g. the content inside <template>, for
// further processing.

const path = require('path')
const parse = require('./parser')
const getRunTimeSnippet = require('./cml-compile/runtime/index.js');
const {getScriptCode} = require('./interface-check/getScriptCode.js');
const cmlUtils = require('chameleon-tool-utils');

// 小程序才会经过该方法
module.exports = function (content) {

  // 处理script cml-type为json的内容
  content = cmlUtils.deleteScript({content, cmlType: 'json'});
  const loaderContext = this;

  const query = queryParse(this.query);
  query.check = query.check || '{}';
  query.check = JSON.parse(query.check);
  const context = (this._compiler && this._compiler.context) || this.options.context || process.cwd()
  let filename = path.basename(this.resourcePath)
  filename = filename.substring(0, filename.lastIndexOf(path.extname(filename))) + '.vue'
  const sourceRoot = path.dirname(path.relative(context, this.resourcePath))
  const parts = parse(content, filename, this.sourceMap, sourceRoot)
  let part = parts[query.type]
  if (Array.isArray(part)) {
    let index = query.index || 0;
    part = part[index]
  }
  let output = part.content;
  if (query.type === 'styles' && ~['app', 'component'].indexOf(query.fileType) && query.isInjectBaseStyle === 'true') {
    output = `
      @import 'chameleon-runtime/src/platform/${query.cmlType}/style/index.css';
      ${output}
    `
  }
  if (query.type == 'script') {
    // 拼接wx所需要的运行时代码，如果在loader中拼接，拼接的代码将不会过loader了
    let runtimeScript = getRunTimeSnippet(query.cmlType, query.fileType);
    output = getScriptCode(loaderContext, query.cmlType, output, query.media, query.check);
    output = `
      ${output}\n
      ${runtimeScript}
    `
  }
  this.callback(null, output, part.map)
}


function queryParse(search) {
  search = search || '';
  let arr = search.split(/(\?|&)/);
  let parmsObj = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].indexOf('=') !== -1) {
      let keyValue = arr[i].match(/([^=]*)=(.*)/);
      parmsObj[keyValue[1]] = keyValue[2];
    }
  }
  return parmsObj;
}

