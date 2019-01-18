"use strict";

var _animation = _interopRequireDefault(require("antd/lib/animation"));

require("antd/lib/button/style/2x");

var _button = _interopRequireDefault(require("antd/lib/button"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

ReactDOM.render(_react.default.createElement(_animation.default, null, _react.default.createElement(_button.default, null, "xxxx")), document.getElementById("react-container"));
