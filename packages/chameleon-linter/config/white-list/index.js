const cmlWhiteList = require('./cml-white-list');
const vueWhiteList = require('./vue-white-list');
const webWhiteList = require('./web-white-list');
const weexWhiteList = require('./weex-white-list');
const wxWhiteList = require('./wx-white-list');

module.exports = {
  web: webWhiteList,
  vue: vueWhiteList,
  wx: wxWhiteList,
  weex: weexWhiteList,
  cml: cmlWhiteList
}

module.exports.getFunctionalTags = function() {
  return ['template', 'component', 'block', 'slot', 'view', 'text', 'cell', 'image'];
}

module.exports.getAllowedTags = function() {
  return this.cml.tags;
}

module.exports.getForbiddenAttrsByLang = function(lang = 'cml') {
  return (lang === 'cml') ? this.vue.attrs : this.cml.attrs;
}
