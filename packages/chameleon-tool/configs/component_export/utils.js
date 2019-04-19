

exports.getExportFileName = function(resourcePath, options) {

  if (/node_modules\/(chameleon-ui|chameleon-ui-builtin)/.test(resourcePath)) {
    let result = resourcePath.replace(/(.+?)(chameleon-ui|chameleon-ui-builtin)(.+)/, "$2$3");
    result = result.replace(/(\.(web|weex))?\.cml$/, '.vue');
    result = result.replace(/\.interface$/, `.interface.js`);
    return result + '?__export';
  }


  let { context, entry} = options;
  let entryKeys = Object.keys(entry);
  resourcePath = resourcePath.replace(context + '/', '');
  let minDepth = 1000;
  let minFilePath = [];
  for (let i = 0, l = entryKeys.length; i < l; i++) {
    let { currentDepth, minPath } = getFileDepth(entry[entryKeys[i]].replace(context + '/', '').split(entryKeys[i])[0], resourcePath.replace(context + '/', ''));
    if (currentDepth < minDepth) {
      minFilePath = minPath;
      minDepth = currentDepth;
    }
  }
  let result = minFilePath.join('/');
  result = result.replace(/(\.(web|weex))?\.cml$/, '.vue');
  result = result.replace(/\.interface$/, `.interface.js`);
  return result + '?__export';
}

function getFileDepth(entryPath, filePath) {
  let entryPaths = entryPath.split('/');
  let filePaths = filePath.split('/');

  for (let i = 0, l = filePaths.length; i < l; i++) {
    if (filePaths[i] === entryPaths[i]) {
      filePaths[i] = '';
    }
  }
  filePaths = filePaths.filter(item => item !== '');
  return {
    currentDepth: filePaths.length,
    minPath: filePaths
  };
}
