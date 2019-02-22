
const loaderUtils = require('loader-utils');
const { getExportFileName } = require('./utils');
const dependencies = require('./dependencies');
const cmlCssLoader = require('chameleon-css-loader');

module.exports = function(content) {
  let options = loaderUtils.getOptions(this);
  if (options.mode === 'production') {
    // 导出生产环境组件不处理
    return content;
  }
  let modules = this._compiler.options.resolve.modules;
  if (inNodeModules(this.resourcePath, modules)) {
    // 不导出node_modules的内容
    dependencies.addDependencyByPath(this.resourcePath);
    return content;
  }
  //  可能会做替换
  let exportContent = content;
  let fileName = getExportFileName(this.resourcePath, this._compiler.options);
  if (/.vue\?__export$/.test(fileName)) {
    exportContent = replaceCmlPath(exportContent, fileName, this._compiler.options);
    exportContent = replaceCmss(exportContent, {
      platform: options.platform
    })
  }
  this.emitFile(fileName, exportContent);

  if (options && options.fileType === 'assets') {
    // 将文件内容置空，避免报错
    content = "";
  }

  return content;
}

function inNodeModules(target, modules) {
  return modules.some(item => target.indexOf(item) !== -1 && !(/(chameleon-ui|chameleon-ui-builtin)/.test(target)))
}


function replaceCmlPath(content, filename, options) {
  let filePrefix = filename.replace(/(.+?)\//g, '../').replace(/[^\/]{0,}$/, '');
  // 替换chameleon-ui/chameleon-ui-builtin路径
  content = content.replace(/import (.+?) from ('|")(.+?)(chameleon-ui-builtin|chameleon-ui)(.+?)\.(web|weex)?.cml('|")/g, `import $1 from $2${filePrefix}$4$5.vue$7`);
  // 替换子组件路径
  let components = content.match(/import (.+?) from ('|")(.+?).cml('|")/g);
  if (!components) {
    return content;
  }
  components = components.map(item => {
    let o = {};
    o.old = item;
    o["new"] = componentsPathHandle(item);
    return o;
  })
  components.forEach(item => {
    content = content.replace(item.old, item["new"]);
  });
  return content;

  function componentsPathHandle(oldPath) {
    let filePath = oldPath.replace(/import (.+?) from ('|")(.+?).cml('|")/, "$3.cml");
    let relative = getExportFileName(filePath, options);
    let relativeArr = relative.split('/');
    let fileArr = filename.split('/');
    let prefix = '';
    let outPath = '';
    if (relativeArr[0] !== fileArr[0]) {
      prefix = '../'.repeat(fileArr.length - 1);
      outPath = prefix + relativeArr.join('/');
    } else {
      for (let i = 0, l = fileArr.length - 1, rl = relativeArr.length - 1; i < l && i < rl; i++) {
        if (relativeArr[i] === fileArr[i]) {
          relativeArr[i] = '';
          fileArr[i] = '';
        } else {
          break;
        }
      }
      relativeArr = relativeArr.filter(item => item !== '')
      fileArr = relativeArr.filter(item => item !== '')
      outPath = (fileArr.length === 1 ? './' : '../'.repeat(fileArr.length - 1)) + relativeArr.join('/');
    }
    outPath = outPath.replace('?__export', '');
    return oldPath.replace(/import (.+?) from ('|")(.+?).cml('|")/, `import $1 from "${outPath}"`);
  }
}

function replaceCmss(content, options) {
  let style = cml.utils.splitParts({
    content
  }).style;
  options = {
    ...options,
    ...cml.config.get().cmss
  }
  style.forEach(item => {
    let newContent = cmlCssLoader(item.content, options);
    content = content.replace(item.content, newContent);
  })
  return content;
}


