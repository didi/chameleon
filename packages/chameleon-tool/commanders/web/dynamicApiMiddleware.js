const glob = require('glob');
const path = require('path');


function getJsFiles(dir) {
  return glob.sync('**/*.js', {
    cwd: dir,
    nodir: true,
    realpath: true
  });
}


module.exports = function (app, options) {
  app.use(function (req, res, next) {
    const controllerFiles = getJsFiles(path.join(options.root, 'mock/api'));
    let self = this;
    let reqPath = req.path;
    let reqMethod = req.method.toLowerCase();

    for (let j = 0; j < controllerFiles.length; j++) {
      let file = controllerFiles[j];
      delete require.cache[file];
      let controller = require(file);
      if (!(controller instanceof Array)) {
        controller = [controller];
      }

      for (let i = 0; i < controller.length; i++) {
        let item = controller[i];

        let method = item.method || ['get', 'post'];

        if (typeof method === 'string') {
          method = [method];
        }

        if (~method.indexOf(reqMethod) && item.path === reqPath) {
          return item.controller.call(self, req, res, next);
        }
      }
    }
    return next();
  })
}
