const path = require('path');
const fs = require('fs');
let _entrances = [];

function _clean() {
  _entrances = [];
}

function _getAllEntrances() {
  return [..._entrances];
}

function _tryAppendEntrance(entrance) {
  let subEntrances = fs.readdirSync(entrance);
  let subFiles = subEntrances.filter((subEntrance) => {
    return fs.lstatSync(path.resolve(entrance, subEntrance)).isFile();
  });
  if (subFiles.length) {
    let interfaceFiles = subFiles.filter((subFile) => {
      return path.extname(subFile) === '.interface';
    });

    if (interfaceFiles.length) {
      _entrances.push(path.resolve(entrance, interfaceFiles[0]));
    }

    if (!interfaceFiles.length) {
      subFiles = subFiles.filter((subFile) => {
        return /^[\w-]+\.cml/.test(path.basename(subFile));
      });
      subFiles.length && _entrances.push(path.resolve(entrance, subFiles[0]));
    }
  }
}

function getEntrances(entrance) {
  let results = [];
  _recursive(entrance);
  results = _getAllEntrances();
  _clean();
  return results;
}

function _recursive(entrance) {
  if (fs.lstatSync(entrance).isDirectory()) {
    _tryAppendEntrance(entrance);
    fs.readdirSync(entrance, {encoding: 'utf8'}).forEach((subEntrance) => {
      subEntrance = path.resolve(entrance, subEntrance);
      fs.lstatSync(subEntrance).isDirectory() && _recursive(subEntrance);
    });
  }
}

module.exports = {
  getEntrances
}
