"use strict";

var _react = _interopRequireDefault(require("react"));

var _message2 = _interopRequireDefault(require("antd/lib/message"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _message2.default)('xxx');

function App() {
  var message = 'xxx';
  return _react.default.createElement("div", null, message);
}