# 接口校验语法


> 接口是一系列方法的声明，是一些方法特征的集合，一个接口只有方法的特征没有方法的实现，因此这些方法可以在不同的地方被不同的类实现，而这些实现可以具有不同的行为（功能）进行沟通。

## 类型说明
**注意：建议定义类型的时候取值为 Number String Boolean Null Undefined(Void) Object Array Function Date RegExp**

目前chameleon接口定义支持简单类型和复合类型。

其中简单类型包括以下类型：

- Number(number)
- String(string)
- Boolean(bool)
- Undefined(void)
- Null


复合类型包括以下类型：

- Function
- Object
- Array
- Date
- RegExp
- Promise

## 接口语法

接口的使用分两个过程：

1. 定义一个接口。
2. 定义实现接口的类。

### 接口定义

#### 范式:

    interface [接口名称] {
        // 接口中的属性
        [属性名称]: [类型],

        // 接口中的方法
        [方法名称]([传入参数1名称]: [传入参数1类型], [传入参数2名称]: [传入参数2类型], ...): [返回类型]
    }

#### 举例：

    // 一个名为interface1的接口
    interface interface1 {
      // foo1: 传入分别为string和number的两个数据，返回值类型为string值
      foo1(a: string, b: number): string;

      // foo2: 传入分别为string和Callback(上文定义)的两个数据，返回值类型为bool值
      foo2(c: string, d: Callback): string;
    }

### 实现接口（定义类）

#### 范式：

    class [类名称] implaments [接口名称] {

        // 实现接口中的属性
        [属性名称]: [类型]

        // 实现接口中的方法
        [方法名称]([传入参数1名称], [传入参数2名称], ...) {
          return [返回值];
        }
    }

#### 举例：

    // 实现一个名称为Clazz，实现上文定义的interface1接口
    class Clazz implaments interface1 {

        // 实现interface1定义的foo1方法，输入值和输出值要满足定义
        foo1(a, b) {
            return 'hello ' + a + ' : ' + (b + 1);
        }

        // 实现interface1定义的foo2方法，输入值和输出值要满足定义
        foo2(c, d) {
            return 'balabala...';
        }
    }



## 复合类型的定义范式

    type [类型名称] = [类型定义]

不同的复合类型，类型定义也不相同，下面会对三种复合类型做详细说明。

### Function类型定义

#### 范式:

    type [Function类型名称] = ([传入参数1名称]: [传入参数1类型], [传入参数2名称]: [传入参数2类型], ...) => [返回类型]

#### 举例：

    // 定义一个传参分别为number,string,bool类型的三个参数，返回值为number的函数类型
    type Callback = (a: number, b: string, c: bool) => number;

### Object类型定义

#### 范式：

    type [Object类型名称] = {
        [属性名称1]: [类型1],
        [属性名称2]: [类型2]
    }

#### 举例：

    // 定义含有a,b,c三个属性的复合类型
    type Scheme = {
        a: string,
        b: bool,
        c: number
    }


### Array类型定义

#### 范式：

    type [Array类型名称] = [
      [类型1]
    ]

#### 举例：

    // 定义名称为arrayType1的数组类型，数组元素为number类型
    type arrayType1 = [
        number
    ]

## 复合类型中的相互嵌套

Function、Object、Array三种复合类型可以互相嵌套：


    // 定义一个传参分别为number,string,bool类型的三个参数，返回值为number的函数类型
    type Callback = (a: number, b: string, c: bool) => number;

    // 定义名称为arrayType1的数组类型，数组元素为number类型
    type arrayType1 = [
        number
    ]

    // 定义名称为Scheme的，含有Array类型和Function类型属性的Object类型
    type Scheme = {
        a: arrayType1,
        b: Callback,
    }

    // 定义名称为Plan，含有Scheme类型和Callback的属性的Object类型
    type Plan = {
        a: string,
        b: Scheme,
        c: Callback
    }

    // 定义名称为arrayType1类型，元素为Plan类型
    type arrayType1 = [
        Plan
    ]
### Promise 类型的定义

对于 async函数，由于该函数调用之后的返回值是 Promise对象，所以这样的函数的返回值要声明成 Promise;

```javascript
interface EntryInterface {
  appEntry(): Promise;
  appEntry2() : Promise;
}
```

在 methods 中
```javascript
class Method implements EntryInterface {
  async appEntry(num) {
  }
  appEntry2(){
    return new Promise((resolve,reject) => {
      setTimeout(resolve,2000);
    })
  }
}
```

### Date 类型的定义

如果函数参数或者返回值是 Date 数据类型，那么可以按照下面的方式进行定义；
```javascript
interface EntryInterface {
  handleDate(d:Date) : Date
}
```

```javascript
class Method implements EntryInterface {
  handleDate(d){
    return new Date();
  }
}
```
## RegExp 类型的定义
如果函数参数或者返回值是 RegExp 数据类型，那么可以按照下面的方式进行定义；
```javascript
interface EntryInterface {
  handleDate(d:RegExp) : RegExp
}
```

```javascript
class Method implements EntryInterface {
  handleDate(r){
    return new RegExp();
  }
}
```
