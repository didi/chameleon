请求转发模块说明 ： 

## Install

```bash
$ fis server install rewrite
```

## Usage

1. 对外提供match方法，供其他调试模块调用，具体方法参考代码注释说明。
1. 默认读取根目录server.conf文件，书写方式是： 
    * rewrite和redirect开头的会被翻译成一条匹配规则，自上而下的匹配。所有非rewrite和redirect开头的会被当做注释处理。
    * rewrite ： 匹配规则后转发到一个文件
    * redirect ： 匹配规则后重定向到另一个url

```conf
rewrite ^\/news\?.*tn\=[a-zA-Z0-9]+.* app/data/news.php
redirect ^\/index\?.* /photo/index/a
rewrite ^\/(.*)\?.*  app/data/$1.php
```