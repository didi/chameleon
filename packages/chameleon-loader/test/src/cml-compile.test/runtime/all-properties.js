function Person(name,age){
  //定义自身属性
  this.name = name ;
  this.age = age;
}
//定义原型属性
Person.prototype.jump = function(){};
Person.prototype.yell = function(){};
var person = new Person("JiM",23);
//Object.defineProperty 直接给一个对象定义一个自身属性值
//给person对象定义一个可以枚举的属性gender
Object.defineProperty(person,'gender',{value:'male',enumerable:true});
//给person对象定义一个不可以枚举的属性weight 
Object.defineProperty(person,'weight',{value:'200kg',enumerable:false});
module.exports.person = person;