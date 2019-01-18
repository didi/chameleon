const color = require('./color');
const utils = require('../utils.js');

/**
 * 处理映射表
 *
 * @type {Object}
 */
const HANDLE_MAP = {
  directions: ['top', 'right', 'bottom', 'left'],
  angles: ['top-left', 'top-right', 'bottom-right', 'bottom-left'],
  borderAttributes: ['style', 'width', 'color'],
  backgroundAttributes: ['color', 'position', 'size', 'repeat', 'origin', 'clip', 'attachment', 'image'],
  flexAttributes: ['direction', 'wrap']
};

/**
 * 获取声明列表
 *
 * @param  {string} tpl   声明模板
 * @param  {string} value 声明值
 * @param  {string} type  声明类型
 * @return {Array}        声明列表
 */
let getDeclarations = (tpl, value, type) => {
  let declarations = [];
  tpl.replace(/\${(.*)}/g, (match, varible) => {
    declarations = HANDLE_MAP[varible + 's'].map(item => {
      let val = value;

      if (type == 'margin' || type == 'padding') {
        val = getBoxValues(value)[item];
      } else if (varible == 'borderAttribute') {
        val = getBorderValues(value)[item];
      } else if (varible == 'backgroundAttribute') {
        val = getBackgroundValues(value)[item];
      } else if (varible == 'flexAttribute') {
        val = getFlexValues(value)[item];
      } else if (varible == 'angle') {
        val = getBorderRadiusValues(value)[item];
      } else {
        val = value;
      }

      if (val) {
        return {
          type: 'declaration',
          property: tpl.replace(/\${.*}/g, item),
          value: val
        };
      } else {
        return null;
      }
    }).filter(declaration => declaration);
  });

  return declarations;
}

let getValueSegs = value => {
  let vals = value.replace(/\s*,\s*/g, ',').split(/\s+/);
  return vals.map(color);
};

/**
 * 获取边框样式值
 *
 * @param  {string} value 边框样式值
 * @return {Object}       边框样式表
 */
let getBorderValues = value => {
  let result = {};
  let vals = getValueSegs(value);

  vals.forEach(val => {
    if (/^(solid|dashed|dotted|none)/g.test(val)) {
      result.style = val;
    } else if (/^(0(px)?|[0-9]+px)/g.test(val)) {
      result.width = val;
    } else if (/^(#[0-9a-fA-F]*|rgba?\(.*?\))/g.test(val)) {
      result.color = val;
    }
  });

  return result;
};

let getFlexValues = value => {
  let result = {};
  let vals = getValueSegs(value);

  if (vals.length == 2) {
    result = {
      direction: 'inherit',
      wrap: 'inherit'
    };
  }

  let directions = ['row', 'row-reverse', 'column', 'column-reverse', 'initial', 'initial'];
  let wraps = ['nowrap', 'wrap', 'wrap-reverse', 'initial', 'initial'];

  vals.forEach(function (val, index) {
    if (index == 0 && (directions.indexOf(val) > -1)) {
      result.direction = val;
    }
    else if (index == 1 && (wraps.indexOf(val) > -1)) {
      result.wrap = val;
    }
  });

  return result;
};

/**
 * 获取box样式值
 *
 * @param  {string} value box样式值
 * @return {Object}       box样式表
 */
let getBoxValues = value => {
  let vals = getValueSegs(value);

  if (vals.length == 1) {
    return {
      top: vals[0],
      right: vals[0],
      bottom: vals[0],
      left: vals[0]
    };
  } else if (vals.length == 2) {
    return {
      top: vals[0],
      right: vals[1],
      bottom: vals[0],
      left: vals[1]
    };
  } else if (vals.length == 3) {
    return {
      top: vals[0],
      right: vals[1],
      bottom: vals[2],
      left: vals[1]
    };
  } else if (vals.length == 4) {
    return {
      top: vals[0],
      right: vals[1],
      bottom: vals[2],
      left: vals[3]
    };
  } else {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  }
};

let getBorderRadiusValues = value => {
  let results = [];

  let vals = value.split('/');

  vals.forEach(val => {
    let vals = getValueSegs(value);
    let result;
    if (vals.length == 1) {
      result = {
        'top-left': vals[0],
        'top-right': vals[0],
        'bottom-right': vals[0],
        'bottom-left': vals[0]
      };
    }
    else if (vals.length == 2) {
      result = {
        'top-left': vals[0],
        'top-right': vals[1],
        'bottom-right': vals[0],
        'bottom-left': vals[1]
      };
    }
    else if (vals.length == 3) {
      result = {
        'top-left': vals[0],
        'top-right': vals[1],
        'bottom-right': vals[2],
        'bottom-left': vals[1]
      };
    }
    else if (vals.length == 4) {
      result = {
        'top-left': vals[0],
        'top-right': vals[1],
        'bottom-right': vals[2],
        'bottom-left': vals[3]
      };
    }
    results.push(result);
  })
  let result = {};
  results.forEach(current => {
    ['top-left', 'top-right', 'bottom-right', 'bottom-left'].forEach(key => {
      if (!result[key]) {
        result[key] = current[key];
      }
      else {
        result[key] += (' ' + current[key]);
      }
    });
  })

  return result;
};

/**
 * 获取background样式值
 *
 * @param  {string} value 背景样式值
 * @return {Object}       背景样式表
 */
let getBackgroundValues = value => {
  let result = {};
  let vals = getValueSegs(value);
  let positionEnd = false;
/* eslint-disable */
  vals.forEach(val => {
    if (/#[0-9a-fA-F]*|rgba?\(.*?\)/g.test(val)) {
      result.color = val;
    } else if (/^url\(.*\)/g.test(val)) {
      result.image = val;
    } else if (/^(repeat|repeat-x|repeat-y|no-repeat)/g.test(val)) {
      result.repeat = val;
    } else if (/^(padding\-box|border\-box|content\-box)/g.test(val) && !result.origin) {
      result.origin = val;
    } else if (/^(padding\-box|border\-box|content\-box)/g.test(val)) {
      result.clip = val;
    } else if (/^(top|center|bottom|left|right|[0-9.]+(px|%))/g.test(val) && !positionEnd) {
      result.position = !result.position ? val : result.position + ' ' + val;
    } else if (/\//g.test(val)) {
      positionEnd = true;
    } else if (/^(top|center|bottom|left|right|[0-9.]+(px|%))/g.test(val)) {
      result.size = !result.size ? val : result.size + ' ' + val;
    } else if (/^(scroll|fixed)/g.test(val)) {
      result.attachment = val;
    }
  });
  /* eslint-disable */
  return result;
};

let parse = function (style) {
  return style
    .split(';')
    .filter(declaration => !!declaration.trim())
    .map(declaration => {
      let {key, value} = utils.getStyleKeyValue(declaration);
      return {
        property: key,
        value
      };
    })
    .map(declaration => convert(declaration)
      .map(declaration => declaration.property + ': ' + declaration.value)
      .join(';'))
    .join(';');
};

let convert = function (declaration) {
  let declarations = [];
  let {property, value} = declaration;
  value = value.replace(/(\d*\.?\d+)cpx/gi, function(m, $1, $2) {
    return $1 + "px";
  })

  switch (property) {
    case 'margin':
      declarations = getDeclarations('margin-${direction}', value, property);
      break;
    case 'padding':
      declarations = getDeclarations('padding-${direction}', value, property);
      break;
    case 'background':
      declarations = getDeclarations('background-${backgroundAttribute}', value, property);
      break;
    case 'border':
    case 'border-top':
    case 'border-right':
    case 'border-bottom':
    case 'border-left':
      declarations = getDeclarations(property + '-${borderAttribute}', value, property);
      break;
    case 'border-style':
      declarations = getDeclarations('border-${direction}-style', value, property);
      break;
    case 'border-width':
      declarations = getDeclarations('border-${direction}-width', value);
      break;
    case 'border-color':
      declarations = getDeclarations('border-${direction}-color', value);
      break;
    case 'border-radius':
      declarations = getDeclarations('border-${angle}-radius', value, property);
      break;
    case 'flex-flow':
      declarations = getDeclarations('flex-${flexAttribute}', value, property);
      break;
    default:
      declarations = [{
        type: 'declaration',
        property: property,
        value: getValueSegs(value).join(' ')
      }];
      break;
  }
  return declarations;
}

module.exports = {
  convert: convert,
  parse: parse
};
