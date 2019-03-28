
const mediaCompile = require('./mediaCompile.js');
const lessCompile = require('./lessCompile.js');
const stylusCompile = require('./stylusCompile.js');
const assetsCompile = require('./assetsCompile.js');

module.exports = async function({source, filePath, cmlType, lang = 'less', compiler}) {
  let imports = [];
  source = mediaCompile(source, cmlType);

  if (lang === 'less') {
    let lessResult = await lessCompile({source, filePath});
    source = lessResult.css;
    imports = lessResult.imports;
  }

  if (lang === 'stylus' || lang === 'styl') {
    let stylusResult = await stylusCompile({source, filePath});
    source = stylusResult.css;
    imports = stylusResult.imports;
  }
  if (compiler) {
    let {source: newSource, deps} = assetsCompile({source, filePath, compiler})
    source = newSource;
    imports = imports.concat(deps);
  }

  return {
    output: source,
    imports // 返回依赖文件的绝对路径
  };
}
