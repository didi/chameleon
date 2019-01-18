
const loaderUtils = require('loader-utils')
const {getCode} = require('./lib/check.js');
const cmlUtils = require('chameleon-tool-utils');

module.exports = function (content) {
  const rawOptions = loaderUtils.getOptions(this);
  const options = rawOptions || {};
  // loader的类型  wx  web weex
  let {cmlType, media, check = {}} = options;
  let output = '';
  const filePath = this.resourcePath;
  // 把原型上的method 拷贝到对象上
  const copyProtoProperty = `
  import {copyProtoProperty} from 'chameleon-loader/src/cml-compile/runtime/common/util.js';
    copyProtoProperty(exports.default)
  `
  output = concatParts();
  // js类型的interface
  function concatParts() {
    let interfaceContent = cmlUtils.getScriptContent({
      content,
      cmlType: 'interface'
    })

    let methodFileContent = cmlUtils.getScriptContent({
      content,
      cmlType
    })
    if (!interfaceContent) {
      throw new Error(`文件: ${filePath}未定义<script cml-type="interface"></script>`)
    }
    if (!interfaceContent) {
      throw new Error(`文件: ${filePath}未定义<script cml-type="${cmlType}"></script>`)
    }
    let result = `
    ${interfaceContent}
    ${methodFileContent}
    `;
    if (media === 'dev' && check.enable === true) {
      try {
        result = getCode(result, {
          cmlType,
          filePath,
          enableTypes: check.enableTypes || []
        });
      } catch (e) {
        // 当有语法错误 babel parse会报错，报错信息不友好，对result不处理，交给webpack对错误模块处理
      }
    }
    return result;
  }

  output = `
  ${output}
  ${copyProtoProperty}
  `

  return output;

}
