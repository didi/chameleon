import runtime from "chameleon-runtime";
import app from "$PROJECT/src/app/app.cml";
import store from "$PROJECT/src/store/index.js";
import router from "$ROUTER";
import routerConfig from "$PROJECT/src/router.config.json";


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
    runtime.bootstrap({ app, store, router, routerConfig });
  });
} else {
  runtime.bootstrap({ app, store, router, routerConfig });
}
