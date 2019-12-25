
const { compileTemplateForCml } = require('./compile-template-cml');
const { compileTemplateForVue } = require('./compile-template-vue');
const {analyzeTemplate,preParseMultiTemplate} = require('./common/process-template.js')

module.exports = function(source, type, options = {lang: 'cml'}) {
  if (!source) {
    return {source, usedBuildInTagMap: {}};
  }
  let compileTemplateMap = {
    'cml': compileTemplateForCml,
    'vue': compileTemplateForVue
  };
  let result = compileTemplateMap[options.lang](source, type, options);
  if (/;$/.test(result.source)) { // 这里有个坑，jsx解析语法的时候，默认解析的是js语法，所以会在最后多了一个 ; 字符串；但是在 html中 ; 是无法解析的；
    result.source = result.source.slice(0, -1);
  }
  return result;
}
module.exports.analyzeTemplate = analyzeTemplate;
module.exports.preParseMultiTemplate = preParseMultiTemplate;
