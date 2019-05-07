import instance from '$PROJECT/${PAGE_PATH}';



const filter = require('$PROJECT/src/filter')["default"] || [];
let promise;
filter.forEach(e => {
  if (typeof e === 'function') {
    if (promise instanceof Promise) {
      promise = promise.then((value) => e.call(this, [value]))
    } else {
      promise = e.call(this, [promise])
    }
  }
})

if (promise instanceof Promise) {
  promise.then(() => {
    instance.el = '#root';
    new Vue(instance);
  });
} else {
  instance.el = '#root';
  new Vue(instance);
}

