

const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");

class NodeOutputFileSystem {
  constructor() {
    this.mkdirp = mkdirp;
    this.mkdir = fs.mkdir.bind(fs);
    this.rmdir = fs.rmdir.bind(fs);
    this.unlink = fs.unlink.bind(fs);
    this.writeFile = fs.writeFile.bind(fs);
    this.join = path.join.bind(path);
  }
}

module.exports = NodeOutputFileSystem;

// fileSystem.utf8BufferToString = function (buf) {
//   var str = buf.toString("utf-8");
//   if (str.charCodeAt(0) === 0xFEFF) {
//     return str.substr(1);
//   } else {
//     return str;
//   }
// }
// fileSystem.convertArgs = function(args, raw) {
//   if (!raw && Buffer.isBuffer(args[0])) {args[0] = utf8BufferToString(args[0]);} else if (raw && typeof args[0] === "string")
//     {args[0] = new Buffer(args[0], "utf-8");} // eslint-disable-line
// }
