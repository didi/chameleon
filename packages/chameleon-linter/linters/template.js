const path = require('path');
const htmllint = require('cml-htmllint');
const config = require('../config');
const whiteListConifg = require('../config/white-list');
const builtinComponents = require('../config/built-in-components');
const tagEmbedRules = require('../config/tag-embed-rules.json');
const fakeComps = require('../config/fakeComps');

const utils = require('../utils');
const linter = new htmllint.Linter();

const CML_METHODNAME_REGEX = /(?:c-bind:|c-catch:)(\w+)/;
const VUE_METHODNAME_REGEX = /(?:v-on:|v-once:|@)(\w+)/;
const VUE_PROP_REGEX = /(?:v-bind:|:)((?:\w|-)+)/;

const APP_ENTRANCE_FILENAME = 'app.cml';

/**
 * Parse json ast and retrive the custumized component names.
 * @param {Object} jsonAst
 * @returns An array contains all the component names. ej. [{name: 'view',  isOrigin: true}, {name:'picker', isOrigin: false}]
 */
function getCustimizedTags(jsonAst, {platform = '', templatePath = ''}) {
  let result = []; let componentsObj = {};

  if (jsonAst) {
    let baseJson = jsonAst.base || {};
    let platformJson = {};
    if (platform) {
      platformJson = jsonAst[platform] || {};
    }
    Object.assign(componentsObj, baseJson.usingComponents, platformJson.usingComponents);
  }

  result = Object.entries(componentsObj)
    .filter(infoPair => {
    // ignore plugin:// configuration which is used to import a native plugin component.
      return infoPair[0] != 'plugin://';
    })
    .map((infoPair) => {
      let [name, basePath] = infoPair;
      return {
        name: utils.toDash(name),
        isOrigin: !utils.isCmlComponent(path.resolve(config.getCurrentWorkspace(), templatePath), basePath)
      }
    });

  return result;
}


/**
 * Getting options for html linter.
 * @params {Object}
 *  platformType: 'web'|'wx'|'weex' | ''   // '' stands for single file component
 *  lang: 'cml'|'vue'
 *  custimizedTags: tags appeding by usingComponents.
 */
function getLintOptions(params) {
  let options = {
    'line-no-trailing-whitespace': false,
    'line-end-style': false,
    'attr-name-style': false,
    'indent-width': false,
    'class-style': 'none',
    'template-req-lang': false,
    'attr-quote-style': 'quoted',
    'spec-char-escape': false,
    'attr-req-value': false,
    'tag-close': true // ignoring tag close detection for now, a better solution will be provide in the future.
  };
  options['template-lang-allows'] = ['cml', 'vue'];
  options['template-lang'] = params.lang;
  options['attr-bans'] = whiteListConifg.getForbiddenAttrsByLang(params.lang);

  options['tag-only-allowed-names'] = whiteListConifg
    .getAllowedTags()
    .concat(params.custimizedTags
      .map((tag) => {
        return tag.name;
      }));

  // origin components that are referenced by usingComponents.
  options['origin-tag-list'] = params.custimizedTags
    .filter((tag) => {
      return tag.isOrigin;
    })
    .map((tag) => {
      return tag.name;
    });


  // options associated with directives.
  if (params.lang === 'vue') {
    options['directive-name-forbidden-regex'] = /^(c-(?:bind|catch)(?!\w))/;
  } else {
    options['directive-name-forbidden-regex'] = /^((?:v-(?:bind|on|once)(?!\w))|:|@)/;
    options['text-ignore-regex'] = /{{(.*?)}}/;
  }
  options['cml-directives'] = whiteListConifg.getForbiddenAttrsByLang('vue');
  options['cml-valid-value-regex'] = /^\s*{{.*}}\s*$/;

  // built-in components configurations.
  options['component-allow-attr'] = builtinComponents.getCml();
  if (params.lang === 'cml') {
    options['component-event-regex'] = CML_METHODNAME_REGEX;
    options['component-prop-regex'] = false;
  } else {
    options['component-event-regex'] = VUE_METHODNAME_REGEX;
    options['component-prop-regex'] = VUE_PROP_REGEX;
  }

  // built-in embed tags' rules
  options['tag-embed-tags'] = tagEmbedRules;

  // origin components rules
  options['origin-tag-forbiden-directive-regex'] = new RegExp('^(' + whiteListConifg.getForbiddenAttrsByLang('vue').join('|') + ')');

  return options;
}

/**
 * A temporary solution for application entrance file app.cml
 * @param {Object} options lint options
 */
function addFakeComp(options, comp) {
  if (options['component-allow-attr']) {
    options['component-allow-attr'][comp.name] = comp.allowAttrs;
  }
  if (options['tag-only-allowed-names']) {
    options['tag-only-allowed-names'].push(comp.name);
  }
}

function isAppEntranceFile(file) {
  return file && path.basename(file) === APP_ENTRANCE_FILENAME;
}

/**
 * @part {Object}
 *  line: line offset of template part.
 *  rawContent: the whole tempalte string.
 *  platformType:'web'|'wx'|'weex'
 *  params: {
 *    lang:'cml'
 *  }
 * @jsonAst {Object} An ast of json part.
 */
module.exports = (part, jsonAst) => {


  return new Promise(async (resolve, reject) => {
    let ast = {}; let messages = []; let lintResults = []; let lintOptions = {}; let templateMatches = [];

    part.params.lang || (part.params.lang = 'cml');

    ast = linter.parser.parse(part.rawContent);
    templateMatches = part.rawContent.match(/<\/?\s*?template/ig);

    // eslint-disable-next-line no-magic-numbers
    if (!templateMatches || templateMatches.length !== 2) {
      return resolve({
        start: part.line,
        ast,
        messages: [{
          line: part.line + 1,
          column: 0,
          token: 'template',
          msg: 'Each template can only have one group of template tags'
        }]
      });
    }

    lintOptions = getLintOptions({
      ...part.params,
      platformType: part.platformType || 'cml',
      ...{custimizedTags: getCustimizedTags(jsonAst, {
        templatePath: part.file,
        platform: part.platformType
      })}
    });

    // adding fake comps
    const allowedFakeComps = ['component'];
    if (isAppEntranceFile(part.file)) {
      allowedFakeComps.push('app');
    }
    fakeComps && fakeComps.forEach((comp) => {
      if (~allowedFakeComps.indexOf(comp.name)) {
        addFakeComp(lintOptions, comp);
      }
    });

    lintResults = await htmllint(part.rawContent, lintOptions);

    lintResults && lintResults.forEach((item) => {
      messages.push({
        line: item.line,
        column: item.column,
        token: htmllint.messages.guessToken(item),
        msg: htmllint.messages.renderIssue(item)
      });
    });

    resolve({
      start: part.line,
      ast,
      messages
    });
  });
};
