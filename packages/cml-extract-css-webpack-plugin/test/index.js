const {getAllFileSort} = require('../dist/helper');
const map  = {
  'a': ['b','c','d'],
  'b': ['a','e','f']
}

let result = getAllFileSort(map);
// [ 'e', 'f', 'b', 'c', 'd', 'a' ]
console.log(result);