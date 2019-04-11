'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.raw = undefined;
exports.default = loader;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

var _schemaUtils = require('schema-utils');

var _schemaUtils2 = _interopRequireDefault(_schemaUtils);

var _options = require('./options.json');

var _options2 = _interopRequireDefault(_options);

const mime = require('mime');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable
  multiline-ternary,
*/
function loader(content) {

  var options = _loaderUtils2.default.getOptions(this) || {};

  (0, _schemaUtils2.default)(_options2.default, options, 'File Loader');

  var context = options.context || this.rootContext || this.options && this.options.context;

  

  const file = this.resourcePath;
  // Set limit for resource inlining (file size)
  let limit = options.limit;
  let limitSize = options.limitSize;

  if (limit) {
    limitSize = parseInt(limitSize, 10);
  }
  // Get MIME type
  const mimetype = options.mimetype || mime.getType(file);

  const hasInline = !!~this.resourceQuery.indexOf('__inline');
  // No limit or within the specified limit
  if (limit && content.length < limitSize || hasInline) {
    if (typeof content === 'string') {
      content = Buffer.from(content);
    }
    return `module.exports = ${JSON.stringify(`data:${mimetype || ''};base64,${content.toString('base64')}`)}`;
  } else {
    var url = _loaderUtils2.default.interpolateName(this, options.name, {
      context,
      content,
      regExp: options.regExp
    });
  
    var outputPath = url;
  
    if (options.outputPath) {
      if (typeof options.outputPath === 'function') {
        outputPath = options.outputPath(url);
      } else {
        outputPath = _path2.default.posix.join(options.outputPath, url);
      }
    }
  
    let publicPath = outputPath;
  
    if(typeof options.publicPath === 'function') {
      publicPath = options.publicPath(outputPath)
    } else if(typeof options.publicPath === 'string') {
      publicPath = options.publicPath + outputPath;
    }
    this._module._nodeType = 'module';
    this._module._moduleType = 'asset';
    this._module._cmlSource = content;
    this._module._outputPath = outputPath;
    return `module.exports = "${publicPath}";`;

  }  
}

var raw = exports.raw = true;