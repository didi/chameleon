
/* istanbul ignore next */
module.exports = function(obj, __CML_ERROR__, __enableTypes__, __INTERFAE__DEFINES__, __CML__DEFINES__) {
 const className = obj.constructor.name;
 const interfaceDefines = __INTERFAE__DEFINES__;
 const enableTypes = __enableTypes__; // ['Object','Array','Nullable']
 const types = interfaceDefines.types;
 const interfaceKey = Object.keys(interfaceDefines.interfaces)[0]; // interface Name
 const interfaceObj = interfaceDefines.interfaces[interfaceKey];
 const cmlDefines = __CML__DEFINES__;
 let isImplementInterface = false;
 // 找到class
 if (cmlDefines.classes[className]) {
   // class 的interface数组中有interface中的定义
   if (~cmlDefines.classes[className].indexOf(interfaceKey)) {
     isImplementInterface = true;
   } else {
     console.error(`class ${className} not implements interface ${interfaceKey}`);
   }
 }


 let props = [];
 let events = {};

 Object.keys(interfaceObj).forEach(key => {
   let item = interfaceObj[key];
   if (is(item, 'Object')) {
     // 是事件  有output和input
     events[key] = item;
   } else {
     // 是属性
     props.push({
       key,
       value: item
     })
   }
 })

 // created 时做props校验  同时建立watch属性检测props类型
 // 包装this.$cmlEmit 校验自定义事件参数类型
 function isFunc(target) {
   return target && is(target, 'Function')
 }

 function is(source, type) {
   return Object.prototype.toString.call(source) === '[object ' + type + ']';
 }

 const getType = function (value) {
   const type = Object.prototype.toString.call(value);
   return type.replace(/\[object\s(.*)\]/g, '$1').replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
 };

 // beforeCreate时 vue中还获取不到mixins的this.$cmlEmit方法
 let oldCreated = obj.created || function() {};
 obj.created = function(...args) {
   checkProps.call(this);
   oldCreated.call(this);
 }

 obj.methods = obj.methods || {};

 obj.methods.$__checkCmlEmit__ = function(eventName, eventDetail) {
   if (events[eventName]) {
     let {input} = events[eventName];
     let detailType = input[0];
     let errList = checkType(eventDetail, detailType, []);
     if (errList && errList.length) {
       __CML_ERROR__(`errorinfo: event ${eventName} detail verification fails
           ${errList.join('\n')}
         `)
     }
   } else {
     __CML_ERROR__(`errorinfo:  event ${eventName} is not defined in interface
           ${errList.join('\n')}
         `)
   }
 }

 function checkProps() {
   props.forEach(item => {
     let errList = checkType(this[item.key], item.value, []);
     if (errList && errList.length) {
       __CML_ERROR__(`error: prop [${item.key}] verification fails
         ${errList.join('\n')}
       `)
     }

   })
 }

 obj.watch = obj.watch || {};

 props.forEach(item => {
   let oldWatch = obj.watch[item.key];
   obj.watch[item.key] = function (newVal, oldVal) {
     let errList = checkType(newVal, item.value, []);
     if (errList && errList.length) {
       __CML_ERROR__(`errorinfo: prop [${item.key}] verification fails
           ${errList.join('\n')}
         `)
     }
     if (isFunc(oldWatch)) {
       oldWatch.call(this, newVal, oldVal);
     }
   }

 })


 /**
  * 校验类型  两个loader共用代码
  *
  * @param  {*}      value 实际传入的值
  * @param  {string} type  静态分析时候得到的值得类型
  * @param  {array[string]} errList 校验错误信息  类型
  * @return {bool}         校验结果
  */
 const checkType = function(value, originType, errList = []) {
   let isNullableReg = /_cml_nullable_lmc_/g;
   let type = originType.replace('_cml_nullable_lmc_', '');
   (type === "Void") && (type = "Undefined")
   let currentType = getType(value);// Undefined Null Object Array Number String  Function只可能是这几种类型；
   // 但是对于type的值则可能是 Undefined Null Number String NullUndefinedStiring
   // Object Array Function EventDetail(...这种自定义的复杂数据类型) 这几种；
   // 判断nullable类型的参数
   // 如果 currentType === type 那么就会直接返回 [];
   let canUseNullable = enableTypes.includes("Nullable");
   let canUseObject = enableTypes.includes("Object");
   let canUseArray = enableTypes.includes("Array");
   if (currentType == 'Null') { // 如果传入的值是 null类型，那么可能的情况是该值在接口处的被定义为Null或者是 ?string 这种可选参数的形式；
     if (type == "Null") {// 如果定义的参数的值就是 Null，那么校验通过
       errList = [];
     } else { // 实际定义的参数的值不是 Null  ?string这种形式的定义，type = new String('String') ?Callback type = new String('Callback')
     // 那么判断是否是可选参数的情况
       (canUseNullable && isNullableReg.test(originType)) ? errList = [] : errList.push(`定义了${type}类型的参数，传入的却是${currentType},请确认是否开启nullable配置`)
     }
     return errList;

   }
   if (currentType == 'Undefined') { // 如果运行时传入的真实值是undefined,那么可能改值在接口处就是被定义为 Undefined类型或者是 ?string 这种可选参数 nullable的情况；
     if (type == "Undefined") {
       errList = [];
     } else {
       (canUseNullable && isNullableReg.test(originType)) ? errList = [] : errList.push(`定义了${type}类型的参数，传入的却是${currentType},请确认是否开启nullable配置或者检查所传参数是否和接口定义的一致`)
     }
     return errList;
   }
   if (currentType == 'String') {
     if (type == 'String') {
       errList = [];
     } else {
       errList.push(`定义了${type}类型的参数，传入的却是${currentType},请检查所传参数是否和接口定义的一致`)
     }
     return errList;
   }
   if (currentType == 'Boolean') {
     if (type == 'Boolean') {
       errList = [];
     } else {
       errList.push(`定义了${type}类型的参数，传入的却是${currentType},请检查所传参数是否和接口定义的一致`)
     }
     return errList;
   }
   if (currentType == 'Number') {
     if (type == 'Number') {
       errList = [];
     } else {
       errList.push(`定义了${type}类型的参数，传入的却是${currentType},请检查所传参数是否和接口定义的一致`)
     }
     return errList;
   }
   if (currentType == 'Object') {
     if (type == 'Object') {
       (!canUseObject) ? errList.push(`不能直接定义类型${type}，需要使用符合类型定义，请确认是否开启了可以直接定义 Object 类型参数；`) : (errList = []);
     } else if (type == 'CMLObject') {
       errList = [];
     } else { // 这种情况的对象就是自定义的对象；
       if (types[type]) {
         const keys = Object.keys(types[type]);
         // todo 这里是同样的问题，可能多传递
         keys.forEach(key => {
           let subError = checkType(value[key], types[type][key], []);
           if (subError && subError.length) {
             errList = errList.concat(subError)
           }
         });
         if (Object.keys(value).length > keys.length) {
           errList.push(`type [${type}] 参数个数与定义不符`)
         }
       } else {
         errList.push('找不到定义的type [' + type + ']!');
       }
     }
     return errList;
   }
   if (currentType == 'Array') {
     if (type == 'Array') {
       (!canUseObject) ? errList.push(`不能直接定义类型${type}，需要使用符合类型定义，请确认是否开启了可以直接定义 Array 类型参数；`) : (errList = []);
     } else {
       if (types[type]) {
         // 数组元素的类型
         let itemType = types[type][0];
         for (let i = 0; i < value.length; i++) {
           let subError = checkType(value[i], itemType, []);
           if (subError && subError.length) {
             errList = errList.concat(subError)
           }
         }
       } else {
         errList.push('找不到定义的type [' + type + ']!');

       }
     }

     return errList;
   }
   if (currentType == 'Function') {
     if (types[type]) {
       if (!types[type].input && !types[type].output) {
         errList.push(`找不到${types[type]} 函数定义的输入输出`);
       }
     } else {
       errList.push('找不到定义的type [' + type + ']!');
     }
   }
   if (currentType == 'Promise') {
     if (type == 'Promise') {
       errList = [];
     } else {
       errList.push(`定义了${type}类型的参数，传入的却是${currentType},请检查所传参数是否和接口定义的一致`)
     }
     return errList;
   }
   if (currentType == 'Date') {
     if (type == 'Date') {
       errList = [];
     } else {
       errList.push(`定义了${type}类型的参数，传入的却是${currentType},请检查所传参数是否和接口定义的一致`)
     }
     return errList;
   }
   if (currentType == 'RegExp') {
     if (type == 'RegExp') {
       errList = [];
     } else {
       errList.push(`定义了${type}类型的参数，传入的却是${currentType},请检查所传参数是否和接口定义的一致`)
     }
     return errList;
   }


   return errList;
 }

 return obj;


}