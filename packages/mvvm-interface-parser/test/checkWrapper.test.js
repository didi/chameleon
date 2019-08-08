

const _ = require('../runtime/checkWrapper.js');
const expect = require('chai').expect;


var __INTERFACE__FILEPATH = "node_modules/chameleon-api/src/interfaces/showToast/index.interface";
var __CML_ERROR__ = function throwError(content) {
  throw new Error("\u6587\u4EF6\u4F4D\u7F6E: " + __INTERFACE__FILEPATH + "\n            " + content);
};

var __enableTypes__ = "";
var __CHECK__DEFINES__ = {
  "types": {
    "toastOpt": {
      "message": "String",
      "duration": "Number",
      "date": "Null"
    }
  },
  "interfaces": {
    "uiInterface": {
      "showToast": {
        "input": ["toastOpt"],
        "output": "Undefined"
      }
    }
  },
  "classes": {
    "Method": ["uiInterface"]
  }
};

function Method() {
}
Method.prototype.showToast = function({message, duration}) {
}

var obj = _(new Method(), __CML_ERROR__, __enableTypes__, __CHECK__DEFINES__);


describe('mvvm-interface-parser/checkWrapper', function() {
  it('定义了String类型的参数，传入的却是Number', function() {
    obj.showToast({
      message: '22',
      duration: 123,
      "date": null
    })
    try {
      obj.showToast({
        message: 23,
        duration: 123,
        "date": null
      })
    } catch (e) {
      expect(!!~e.message.indexOf('错误信息: 定义了String类型的参数，传入的却是Number')).to.equal(true)
    }
  })

  it('定义了String类型的参数，传入的却是Null', function() {
    try {
      obj.showToast({
        message: null,
        duration: 123,
        "date": null
      })
    } catch (e) {
      expect(!!~e.message.indexOf('定义了String类型的参数，传入的却是Null')).to.equal(true)
    }
  })

})

