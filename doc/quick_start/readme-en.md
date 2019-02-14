# <img src="https://cmljs.org/doc/assets/100*100.png"/> Chameleon [![Build Status](https://www.travis-ci.org/didi/chameleon.svg?branch=master)](https://www.travis-ci.org/didi/chameleon) [![license](https://img.shields.io/npm/l/chameleon-tool.svg?registry_uri=https%3A%2F%2Fregistry.npmjs.com&style=popout-square)](https://www.npmjs.com/package/chameleon-tool) [![version](https://img.shields.io/npm/v/chameleon-tool.svg?style=flat)](https://www.npmjs.com/package/chameleon-tool)

English Introduction | [中文介绍](https://github.com/didi/chameleon)

**Chameleon**/kəˈmiːlɪən/,also named CML for short, "变色龙" in Chinese. We named our framework Chameleon as we believe it can  perfectly run on different platforms.

## Documents

Offical website: [CMLJS.org](https://cmljs.org)
* [Install](https://CMLJS.org/doc/quick_start/quick_start.html)
* [Quick start](https://CMLJS.org/doc/quick_start/quick_start.html)
* [APIs](https://CMLJS.org/doc/api/api.html)
* [Components](https://CMLJS.org/doc/component/component.html)
* [Resources](https://github.com/chameleon-team/awesome-cml): libs, demo, tutorials
* [Our plans](https://github.com/didi/chameleon/wiki/%E5%90%8E%E6%9C%9F%E8%A7%84%E5%88%92)


## CML
**Highly consistent performance on each platform**—— Highly consistent performance, no need to reference documents for each platform.

> With polymorphic protocol you can easily organize your platform specified code.

<a href="https://github.com/beatles-chameleon/cml-demo">

![Preview](https://cmljs.org/doc/assets/demo-preview.png)

</a>

| Web   |      WeChat Mini Program      |  Native-weex |  Baidu Smart Program |  AliPay Mini Program |
|:----------:|:-------------:|:------:|:------:|:------:|
| <a href="https://github.com/beatles-chameleon/cml-demo"><img src="https://cmljs.org/cml-demo/preview/web-1.jpg" width="200px"/> </a>|  <a href="https://github.com/beatles-chameleon/cml-demo"><img src="https://cmljs.org/cml-demo/preview/wx-1.jpg" width="200px"/></a>| <a href="https://github.com/beatles-chameleon/cml-demo"><img src="https://cmljs.org/cml-demo/preview/weex-1.jpg" width="200px"/> </a>|<a href="https://github.com/beatles-chameleon/cml-demo"><img src="https://cmljs.org/cml-demo/preview/baidu-1.png" width="200px"/> </a>|<a href="https://github.com/beatles-chameleon/cml-demo"><img src="https://cmljs.org/cml-demo/preview/alipay-1.png" width="200px"/></a> |



## Background

The goal that our tech team are pursuing when we develop our APP pages is achieving high performance close to native APP and keeping the flexibilities that we have in H5 pages at the same time. As platform entires, such as mobile APP, WeChat Mini Program, AliPay Mini Program, Baidu Smart Program, Quick APP, continue to grow up, it has multiplied the cost of development and maintenance for implementing one single feature. So we urgently need a framework that can write once and come out with codes that can run over all platforms. After tweenty months' hard work, we finally be able to pulish our multi-paltform development framework "Chameleon" and truely focused on build a multi-platform apps with a single codebase.


## Design Concepts

The most basic concepts in software architecture design are "dividing" and "merging". "dividing" means "divide and resolve", which is dividing a complex issue into some small problems that we can solve easily. The design of Micro-service Architecture Pattern in back-end is a good example of this  "dividing" concept. The meaning of "merging" is to make all similar business logics into one single module to achieve a high efficiency and high quality system, such as the design of "Middle service" in back-end business system.

Chameleon belongs to the latter,  and by defining an unified language framework plus <a href="https://CMLJS.org/doc/framework/polymorphism/intro.html">an unified polymorphic protocol</a> , it can essentially extract a self-contained, continuous and maintainable "front-end middle service" from business logics related to multiple platforms.

### Our Goal

Although different platforms vary in their basic implementations, their fundamental structure still remains the same: MVVM architectural pattern.  **The ultimate goal of Chameleon is to unify all MVVM-like frameworks.**.

![Alt text](https://CMLJS.org/doc/assets/en-mvvm.png)


## Overview

![Alt text](https://CMLJS.org/doc/assets/en-architecture.png)


## Development Languages

As all web developers know, a web page is a combination of HTML, CSS and JS. Our framwork Chameleon will fellow the pattern and still use CML + CMSS + JS.


[JS](https://CMLJS.org/doc/logic/logic.html) is used to implement business logic. Comparing with normal web develop workflow, Our framework has a standed MVVM framework, an entire lifecycle, watch property, computed property, two-way data-binding and other awesome features which can improve our development efficiency and reduce maintenance costs.


[CML](https://CMLJS.org/doc/view/cml.html) Chameleon Markup Language is used to describe web structures. Just like HTML has a standed set semantic tags, such as `<span>` and `<button>`, CML also has a set of "tags" which we call them `Components`. CML has provided some basic components that are released with our framework[Components](https://CMLJS.org/doc/component/base/base.html). Additionally, CML also supports <b>template syntax</b>. For example, we have conditional rendering, list rendering and data binding, etc. Except that, we support [Vue-like directives](https://CMLJS.org/doc/view/vue.html), so you can get started faster.

[CMSS](https://CMLJS.org/doc/view/cmss.html)(Chameleon Style Sheets) CMSS is used to provide styles for CML pages, and it has most properties that css has, and it supports `less` and `stylus`.

<b>That's all you need to get stated with Chameleon, we believe as long as you have experiences with web development you will be able to use Chameleon in no time.</b>

## Rich Components

Chameleon provided lots of [components](https://CMLJS.org/doc/component/component.html) that you can used to build your own CML pages, we have built-in components such as `button switch radio checkbox`, and also some extended components `c-picker c-dialog c-loading`, etc. They basiclly covered all the most used components that you want.

## Powerful APIs
Chameleon provided all those [apis](https://CMLJS.org/doc/api/api.html) in npm package named `chameleon-api`, it includes apis for  web requests, data storage, location services, system information interfaces and animations, etc.

## Customize APIs and Components

Based on Chameleon's powerful [polymorphic protocol](https://CMLJS.org/doc/framework/polymorphism/intro.html), you could extend any apis and components as you want, no need to rely on framework's updates. You can even use some native components that you already have in your previous projects by importing them with polymorphic protocol.

## <a href="https://CMLJS.org/doc/framework/polymorphism/check.html">Smart syntax checker</a>

With our smart syntax checker, you will get an tip when there is an syntax error in your IDE. So you don't have to debug CML codes for each single platform, and you can also check out command window for these error reports in text format.

## <a href="https://CMLJS.org/doc/framework/progressive.html">Progressive Integration</a>
If you want to integrate some multi-platform codes in your projects and you don't want to refactor your projects, you can develop a polymorphic component and imported it directly into your own projects.

## <a href="https://CMLJS.org/doc/framework/framework.html">Advanced development experience</a>

Chameleon is not only just a solution for multi-platform development, it also absorbed the most useful engineering design accumulated over the years in the industy. Based on the excellent front-end packaging tool Webpack, Chameleon has a set of clis to help you in the whole workflow from develop, debug, test and publish.

## Contact Us

[ChameleonCore@didiglobal.com](mailto:ChameleonCore@didiglobal.com)

##  WeChat & QQ Group

**WeChat**<br />
<img width="150px" src="https://CMLJS.org/doc/assets/wx-qr-code.png" />

<br />

**QQ**<br />
<img width="150px" src="https://CMLJS.org/doc/assets/qr-qq.jpeg" />
