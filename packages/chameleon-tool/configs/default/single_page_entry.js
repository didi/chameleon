import instance from '$PROJECT/${PAGE_PATH}';

const filter = require('$PROJECT/src/filter')["default"] || [];
let promise = Promise.resolve({singlePage:false});
filter.forEach(e => {
  promise = promise.then((value) => e.call(this, [value]))
})

promise.then(() => {
  instance.el = '#root';
  new Vue(instance);
});
