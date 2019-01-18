const path = require('path');
const fs = require('fs');
const {expect} = require('chai');

const generator = require('./generator.test.js');
let code = fs.readFileSync(path.resolve(__dirname, './interface.test'), 'utf-8');
let result = generator(code);
result = result.replace(/export\s+default/g, 'module.exports =')
let generateFileName = './wrap-method.js';
fs.writeFileSync(path.join(__dirname, `${generateFileName}`), result, {encoding: 'utf-8'});
let wrappedMethods = require(`${generateFileName}`);
console.log('wrappedMethods', wrappedMethods)
// 这个loader的主要作用是用来校验interface中定义的参数类型是否在对应的函数执行的时候中是一致的；
// 只要函数执行通过就可以；将  .interface 文件中的methods 进行一层包装，从而进行函数的参数和返回值的校验；
describe('test interface loader:used for check the parammeters and return valus of the function', function() {
  describe('test the type of return value of function', function() {
    it('test return value of function is Undefined', function() {
      wrappedMethods.retValueUndefind();
    });
    it('test return value of function is String', function() {
      wrappedMethods.retValueString();
    });
    it('test return value of function is Boolean', function() {
      wrappedMethods.retValueBoolean();
    });
    it('test return value of function is Object', function() {
      wrappedMethods.retValueObject();
    });
    it('test return value of function is Array', function() {
      wrappedMethods.retValueArray();
    });
    it('test return value of function is RegExp', function() {
      wrappedMethods.retValueRegExp();
    });
    it('test return value of function is Date', function() {
      wrappedMethods.retValueDate();
    });
    it('test return value of function is Promise', function() {
      wrappedMethods.retValuePromise();
    });
    it('test return value of function is Promise-Async', function() {
      wrappedMethods.retValueAsync();
    });
  });
  describe('test the type of arguments of function ', function() {
    it('test arguments of function is Undefined', function() {
      wrappedMethods.argsUndefined(undefined);
    });
    it('test arguments of function is Undefined', function() {
      wrappedMethods.argsNumber(4);

    });
    it('test arguments of function is String', function() {
      wrappedMethods.argsString('this is string');

    });
    it('test arguments of function is Boolean', function() {
      wrappedMethods.argsBoolean(true);

    });
    it('test arguments of function is Object', function() {
      wrappedMethods.argsObject({});

    });
    it('test arguments of function is Array', function() {
      wrappedMethods.argsArray([]);

    });
    it('test arguments of function is RegExp', function() {
      wrappedMethods.argsRegexp(/reg/);
    });
    it('test arguments of function is Date', function() {
      wrappedMethods.argsDate(new Date());
    });
    it('test arguments of function is Promise', function() {
      wrappedMethods.argsAsync((async function a() {})());
      wrappedMethods.argsPromsie(new Promise(() => {}));
    });
    it('test arguments of function is nullable', function() {
      wrappedMethods.argsNullable(null);
      wrappedMethods.argsNullable(undefined);
      wrappedMethods.argsNullable();

    });
    // nullable数据类型必须在实际传参的时候有个占位；
    it('test arguments of function is Mixins', function() {
      wrappedMethods.argsMixins(1, {}, 'str');
      wrappedMethods.argsMixins(1, null, 'str');
      wrappedMethods.argsMixins(1, undefined, 'str');
    });
  })
})
