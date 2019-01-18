const glob = require('glob');
const path = require('path');
const express = require('express');


function getJsFiles (dir) {
  return glob.sync('**/*.js', {
    cwd: dir,
    nodir: true,
    realpath: true
  });
}


module.exports = function(app, options) {
  const controllerFiles = getJsFiles(path.join(options.root, 'mock/api'));
  const router = express.Router();
  controllerFiles.forEach(function (file) {
    var controller = require(file);
    if (!(controller instanceof Array)) {
      controller = [controller];
    }
    controller.forEach(function (item) {
      var method = item.method || ['get', 'post'];

      if (typeof method === 'string') {
        method = [method];
      }

      method.forEach(function (verb) {
        router[verb](item.path, item.controller);
      });
    });
  });
  app.use('/', router);
}
