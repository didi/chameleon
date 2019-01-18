module.exports.flatArray = function(arr) {
  let tempArr = [];
  if (Array.isArray(arr)) {
    arr.forEach((item) => {
      if (Array.isArray(item)) {
        tempArr.push(...item);
      } else {
        tempArr.push(item);
      }
    });
  }
  return tempArr;
}
