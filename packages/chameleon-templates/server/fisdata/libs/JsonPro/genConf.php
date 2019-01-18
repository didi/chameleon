<?php
    class Config{
        public static $strAdocPath = ""; //Adoc文档路径
        public static $bCharData = true; //字符截断or字节截断
        public static $bGenRef = false; //是否生成异步数据
        public static $logLevel = 4;//日志级别 暂时没有级别限制 
        public static $intUser = 1;//1 fis 2 火麒麟调试服务器 3 fe自测平台使用
        public static $strPath = "/home/iknow/";//绝对路径
        public static $asyncBasePath = "";
        
        public static $mess_arr = array(
                             "强制转义字符" => "&#1234",
                             "sprintf函数的敏感" => "%",
                             "gbk utf8冲突部分" => "璎玥",
                             "含有欧元符号" => "£123",
                             "边界字符" => "丂 亐 儈 凗 狛 癄 鳌 煪 伄  骺",
                             "相邻字节" => "牛肩猪肉",
                             "空格" => " ");
    }

?>