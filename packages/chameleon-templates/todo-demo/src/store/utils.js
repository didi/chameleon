
export function checkDuplicate(list) {
  let tempArray = [];
  for(let i=0;i<list.length;i++) {
    let obj = list[i];
    let keys = Object.keys(obj);
    for(let j=0;j<keys.length;j++) {
      let key = keys[j];
      if(~tempArray.indexOf(key)) {
        throw new Error('重复定义key值：'+key)
      } else {
        tempArray.push(key);
      }
    }
  }
}