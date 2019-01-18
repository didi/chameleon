const config = require('../config');

function getCmlType(mediaParams = '') {
  let types = [];
  if (mediaParams) {
    let typeStr = /\((.*)\)/.exec(mediaParams);
    if (typeStr && typeStr[1]) {
      types = typeStr[1].split(',')
        .filter(type => !!type.trim())
        .map(type => {
          return type.trim().toLowerCase();
        });
    }
  }
  return types;
}

function detectFloatProp(rule, result) {
  rule.walkDecls('float', (decl) => {
    result.style.messages.push({
      line: decl.source.start.line,
      column: decl.source.start.column,
      token: decl.prop,
      msg: `Weex does not support style property: "${decl.prop}", therefor you should not use "float" under a media rule with weex parameter or use "float" in a template file with platform type set to weex`
    });
  });
}

function isMediaNode(node) {
  return node && node.type === 'atrule' && node.name === 'media';
}

const RULER_MAP = {
  'important': {
    rule: function (decl, platform) {
      return config.neexLintWeex() && (!platform || platform == 'weex') && decl.important === true;
    },
    msg: function (decl) {
      return `The CSS attribute "${decl.prop}" does not support "!important"`
    }
  },
  'percentages': {
    rule: function (decl, platform) {
      return config.neexLintWeex() && (!platform || platform == 'weex') && /%\s*$/g.test(decl.value);
    },
    msg: function (decl, platform) {
      return `The CSS attribute "${decl.prop}" does not support percentages`;
    }
  },
  'lineHeight': {
    rule: function (decl, platform) {
      return config.neexLintWeex() && (!platform || platform == 'weex') && decl.prop == 'line-height' && /^\d+$/.test(decl.value);
    },
    msg: function (decl) {
      return `The CSS attribute "${decl.prop}" does not support the number type unit`;
    }
  },
  'cpx': {
    rule: function (decl, platform) {
      return config.getRuleOption('cpx-support') && !platform && /\d+\s*(rpx|px)\s*$/g.test(decl.value);
    },
    msg: function (decl) {
      return `The CSS attribute "${decl.prop}" must use \'cpx\' as it\'s unit`;
    }
  },
  'display': {
    rule: function (decl, platform) {
      return config.neexLintWeex() && (!platform || platform == 'weex') && decl.prop == 'display' && (decl.value == 'none' || decl.value == 'inline-block');
    },
    msg: function (decl) {
      return 'The CSS attribute "display" does not support "' + decl.value + '" as it\'s value';
    }
  }
  // 'flex': {
  //   rule: function (decl, platform) {
  //     if (config.neexLintWeex() && (!platform || platform === 'weex') && decl.prop == 'display' && decl.value == 'flex') {
  //       let flag = true;
  //       decl.parent.nodes.forEach(node => {
  //         if (node.prop == 'flex-direction') {
  //           flag = false;
  //         }
  //       });
  //       return flag;
  //     }
  //   },
  //   msg: function (decl) {
  //     return 'When the CSS attribute "display" value is "flex", you need to add the attribute "flex-direction" at the same time';
  //   }
  // }
};

const SELECTOR_MAP = {
  'pseudo': {
    rule: function (selector, platform) {
      let flag = false;
      if (config.neexLintWeex() && (!platform || platform == 'weex')) {
        selector.replace(/\:([^\s]+)/g, (match, pseudo) => {
          if (['active', 'focus', 'disabled', 'enabled'].indexOf(pseudo) == -1) {
            flag = true;
          }
        });
      }
      return flag;
    },
    msg: function (selector) {
      return 'The CSS selector "' + selector + '" only supports pseudo-classes of "active, focus, disabled, enabled"';
    }
  }
};


module.exports = (result) => {
  if (result.style && result.style.ast) {
    let platform = result.style.platform;
    let root = result.style.ast;

    root.walk((node) => {
      (node.selectors || []).forEach(selector => {
        Object.keys(SELECTOR_MAP).forEach(key => {
          if (SELECTOR_MAP[key].rule(selector, platform)) {
            result.style.messages.push({
              line: node.source.start.line,
              column: node.source.start.column,
              token: node.value,
              msg: SELECTOR_MAP[key].msg(selector)
            });
          }
        });
      });
    });

    root.walkDecls((decl) => {
      Object.keys(RULER_MAP).forEach(key => {
        if (RULER_MAP[key].rule(decl, platform)) {
          result.style.messages.push({
            line: decl.source.start.line,
            column: decl.source.start.column,
            token: decl.value,
            msg: RULER_MAP[key].msg(decl)
          });
        }
      });
    });

    // polymorphic components forbid float property.
    if (config.neexLintWeex() && platform === 'weex') {
      detectFloatProp(root, result);
    }
    // single file components.
    if (config.neexLintWeex() && (platform === undefined || platform === 'cml')) {
      root.walkRules((rule) => {
        if (!isMediaNode(rule.parent) || ~getCmlType(rule.parent.params).indexOf('weex')) {
          detectFloatProp(rule, result);
        }
      });
    }
  }
};
