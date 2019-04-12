
// 根据依赖的map 生成顺序的数组
exports.getAllFileSort = function (depsMap) {
  debugger
  let result = [];
  let currentStack = []; //记录当前处理的文件 防止循环依赖
  let allKeys = Object.keys(depsMap);
  for(let i = 0; i < allKeys.length; i++) {
    entry(allKeys[i])
  }

  function entry(filePath) {
    // 已经存在 不操作
    if(~result.indexOf(filePath)) {
      return;
    }

    // 在栈中 不操作
    if(~currentStack.indexOf(filePath)) {
      return;
    }
    // 不存在依赖
    if(!depsMap[filePath]) {
      result.push(filePath);
    } else {
      // 存在依赖   先入栈
      currentStack.push(filePath);

      let deps = depsMap[filePath];
      deps.forEach(item=>{
        entry(item);
      })
      result.push(filePath);
      // 处理完了出站
      currentStack.pop(filePath);
    }

    
  }

  return result;

} 

exports.sortChunk = function(extractedChunk, allFileSort) {
  debugger
  let modules = Array.from(extractedChunk._modules);

  let cssmodule = []; // 普通css 就是按照引用顺序 先引用的放在前面 css的module放前面 只有web端会引用
  let cmlmodule = [];
  let result = [];
  modules.forEach(item=>{
    if(/(\.cml|\.vue)$/.test(item._originalModule.resource)) {
      cmlmodule.push(item);
    } else {
      cssmodule.push(item);
    }
  });


  // 排序
  cmlmodule.sort(function(a, b) {
    let aIndex = allFileSort.indexOf(a._originalModule.resource);
    let bIndex = allFileSort.indexOf(b._originalModule.resource);
    return aIndex - bIndex;
  })

  result = result.concat(cssmodule, cmlmodule);


  extractedChunk._modules = new Set(result);

}