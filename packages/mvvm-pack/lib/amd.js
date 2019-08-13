const amdWrapModule = require('./amdwrapper.js');
const path = require('path');
const fs = require('fs');
const globalBootstrap = fs.readFileSync(path.join(__dirname, 'amdbootstrap.global.js'), {encoding: 'utf8'})
const moduleBootstrap = fs.readFileSync(path.join(__dirname, 'amdbootstrap.module.js'), {encoding: 'utf8'})

function getGlobalBootstrap(globalName) {
  return globalBootstrap.replace('$GLOBAL', globalName);
}

function getModuleBootstrap() {
  return moduleBootstrap;
}

module.exports = {
  amdWrapModule,
  getGlobalBootstrap,
  getModuleBootstrap
}
