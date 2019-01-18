##fis-server-fisdata

使用FIS开发时，提供本地调试数据功能。


###使用

    //require必要的类文件
    require_once ("<DIR_FIS_DATA>/TestData.php");

    //初始化类，必须放在其他router的最前面
    TestData::init();
    
    //渲染数据
    // $templateEngine 模板引擎，必须包含方法assign, display 如:smarty
    // $tmpl 当前要渲染的模板
    TestData::renderHelper($templateEngine, $tmpl);

####浏览器书签
    
    //新建浏览器书签，网址为以下内容
    javascript: void function() {var d = new Date();d.setFullYear(d.getFullYear() + 1);document.cookie='FIS_DEBUG_DATA=4f10e208f47bfb4d35a5e6f115a6df1a;path=/;expires=' + d.toGMTString() + '';location.reload(); }();

在预览的时候点击书签，进入数据管理页面，修改数据后再进行渲染。


###在FIS安装

    //安装特定版本
    fis server install fisdata@1.0.1
    
    or
    
    //安装最新版本
    fis server install fisdata


###测试数据
测试数据存储在网站根目录的test目录下。
模板文件放在网站根目录的template目录下。

模板文件和测试数据文件对应关系如下：

模板:
    `<www>/template/page/photo/index.tpl`

对应数据文件:

    0. <www>/test/page/photo/index.php (php格式)
    0. <www>/test/page/photo/index.json (json格式)
    0. <www>/test/page/photo/index.text (adoc格式)

也支持多份数据(php格式为例):

    0. <www>/test/page/photo/index/index_1.php
    0. <www>/test/page/photo/index/index_2.php
    ...

文件名: `index_\d+.php`

**注：adoc多份数据参见http://fe.baidu.com/doc/fis**

