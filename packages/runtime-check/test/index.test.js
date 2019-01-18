const {expect} = require('chai');
const {getDefines} = require('../index.js');
const fs = require('fs');
const path = require('path');

let code = fs.readFileSync(path.resolve(__dirname,'./interface.test'),'utf-8');
let defines = getDefines(code,'path/to/errorfile');
let result = {
  "types": {
    "Scheme": {
      "a": "String",
      "b": "Boolean",
      "c": "Number"
    }
  },
  "interfaces": {
    "EntryInterface": {
      "retValueUndefind": {
        "input": [],
        "output": "Undefined"
      },
      "retValueNumber": {
        "input": [],
        "output": "Number"
      },
      "retValueString": {
        "input": [],
        "output": "String"
      },
      "retValueBoolean": {
        "input": [],
        "output": "Boolean"
      },
      "retValueObject": {
        "input": [],
        "output": "Object"
      },
      "retValueArray": {
        "input": [],
        "output": "Array"
      },
      "retValueRegExp": {
        "input": [],
        "output": "RegExp"
      },
      "retValueDate": {
        "input": [],
        "output": "Date"
      },
      "retValuePromise": {
        "input": [],
        "output": "Promise"
      },
      "retValueAsync": {
        "input": [],
        "output": "Promise"
      },
      "retValueFunction": {
        "input": [],
        "output": "Function"
      },
      "argsUndefined": {
        "input": [
          "Undefined"
        ],
        "output": "Undefined"
      },
      "argsNumber": {
        "input": [
          "Number"
        ],
        "output": "Undefined"
      },
      "argsString": {
        "input": [
          "String"
        ],
        "output": "Undefined"
      },
      "argsBoolean": {
        "input": [
          "Boolean"
        ],
        "output": "Undefined"
      },
      "argsObject": {
        "input": [
          "Object"
        ],
        "output": "Undefined"
      },
      "argsArray": {
        "input": [
          "Array"
        ],
        "output": "Undefined"
      },
      "argsRegexp": {
        "input": [
          "RegExp"
        ],
        "output": "Undefined"
      },
      "argsDate": {
        "input": [
          "Date"
        ],
        "output": "Undefined"
      },
      "argsPromsie": {
        "input": [
          "Promise"
        ],
        "output": "Undefined"
      },
      "argsAsync": {
        "input": [
          "Promise"
        ],
        "output": "Undefined"
      },
      "argsNullable": {
        "input": [
          "Number_cml_nullable_lmc_"
        ],
        "output": "Undefined"
      },
      "argsMixins": {
        "input": [
          "Number",
          "Object_cml_nullable_lmc_",
          "String"
        ],
        "output": "Undefined"
      }
    }
  },
  "classes": {
    "Method": [
      "EntryInterface"
    ]
  }
}

describe('test runtime check',function(){
  it('test the type of args and return value ',function(){
    expect(defines.defines).to.be.deep.equal(result)
  })
})
