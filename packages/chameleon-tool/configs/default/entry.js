import runtime from "chameleon-runtime";
import app from "$PROJECT/src/app/app.cml";
import store from "$PROJECT/src/store/index.js";
import router from "$ROUTER";
import routerConfig from "$PROJECT/src/router.config.json";
import api from "fs-base-chameleon";

api.config.getHost()
  .then(() => {
    runtime.bootstrap({ app, store, router, routerConfig });
  });

