
const fs = require('fs');
const path = require('path');

class Dependencies {
  constructor() {
    this.dependencies = {
      "babel-preset-flow": "",
      "chameleon-css-loader": "",
      "chameleon-mixins": "",
      "interface-loader": ""
    };
    this.initDependency();
  }

  initDependency() {
    let modules = Object.keys(this.dependencies);
    let packages = fs.readFileSync(`${path.resolve(cml.root, 'package.json')}`);
    packages = JSON.parse(packages);
    let dependencies = packages.dependencies
    modules.forEach(item => {
      this.dependencies[item] = dependencies[item];
    })
  }

  addDependency(name, version) {
    this.dependencies[name] = version;
  }

  addDependencyByPath(path) {
    let pathArr = path.split('node_modules');
    let npmName = pathArr[1].split('/').filter(item => item !== '');
    npmName = npmName[0];
    let json = fs.readFileSync(`${pathArr[0]}node_modules/${npmName}/package.json`);
    json = JSON.parse(json);
    this.dependencies[npmName] = json.version;
  }

  getDependencies() {
    return JSON.stringify(this.dependencies, null, 2);
  }
}

module.exports = new Dependencies();
