<?php

class Rewrite{

    private static $root = null;
    private static $userRules = array();
    private static $MIME = array(
        'bmp' => 'image/bmp',
        'css' => 'text/css',
        'doc' => 'application/msword',
        'dtd' => 'text/xml',
        'gif' => 'image/gif',
        'hta' => 'application/hta',
        'htc' => 'text/x-component',
        'htm' => 'text/html',
        'html' => 'text/html',
        'xhtml' => 'text/html',
        'ico' => 'image/x-icon',
        'jpe' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'jpg' => 'image/jpeg',
        'js' => 'text/javascript',
        'json' => 'application/json',
        'mocha' => 'text/javascript',
        'mp3' => 'audio/mp3',
        'mp4' => 'video/mpeg4',
        'mpeg' => 'video/mpg',
        'mpg' => 'video/mpg',
        'manifest' => 'text/cache-manifest',
        'pdf' => 'application/pdf',
        'png' => 'image/png',
        'ppt' => 'application/vnd.ms-powerpoint',
        'rmvb' => 'application/vnd.rn-realmedia-vbr',
        'rm' => 'application/vnd.rn-realmedia',
        'rtf' => 'application/msword',
        'svg' => 'image/svg+xml',
        'swf' => 'application/x-shockwave-flash',
        'tif' => 'image/tiff',
        'tiff' => 'image/tiff',
        'txt' => 'text/plain',
        'vml' => 'text/xml',
        'vxml' => 'text/xml',
        'wav' => 'audio/wav',
        'wma' => 'audio/x-ms-wma',
        'wmv' => 'video/x-ms-wmv',
        'woff' => 'image/woff',
        'xml' => 'text/xml',
        'xls' => 'application/vnd.ms-excel',
        'xq' => 'text/xml',
        'xql' => 'text/xml',
        'xquery' => 'text/xml',
        'xsd' => 'text/xml',
        'xsl' => 'text/xml',
        'xslt' => 'text/xml'
    );

    /**
     * HTTP状态码表
     * @var array
     */
    public static $statusMap = array(
        200 => 'OK',
        304 => 'Not Modified',
        404 => 'File Not Found',
        403 => 'Forbidden',
        500 => 'Internal Server Error'
    );

    /**
     * 设置HTTP请求头信息
     * @param int $code HTTP状态码
     * @param null|string $status 状态信息
     */
    public static function header($code = 200, $status = null) {
        if ($status === null && isset(self::$statusMap[$code])) {
            $status = self::$statusMap[$code];
        }

        if (php_sapi_name() == 'cgi') {
            header("Status: $code $status");
        } else {
            header("HTTP/1.1 $code $status");
        }
    }

    /**
     * 添加用户自定义的url处理规则
     * @param $type 规则名称
     * @param callable $callback  用户处理callback函数，callback参数为匹配的$matches数组
     */
    public static function addRewriteRule($type, $callback){
        if(is_callable($callback)){
            $type = strtolower($type);
            self::$userRules[$type] = $callback;
        }
    }

    public static function setRoot($root){
        self::$root = $root;
    }

    public static function getRoot(){
        return isset(self::$root) ? self::$root : dirname(dirname(__FILE__)) . DIRECTORY_SEPARATOR;
    }

    private static function padString($path, $matches) {
        for ($i = 1, $len = count($matches); $i < $len; $i++) {
            $path = preg_replace('/\\$' . $i . '\\b/', $matches[$i], $path);
            $path = preg_replace('/\\\\' . $i . '\\b/', $matches[$i], $path);
        }
        return $path;
    }

    /**
     *  $url : 需要匹配的url
     *  $matches : 正则匹配的引用
     *  返回值 ：
     *    true ： 表示命中正则
     *    false ： 表示没有命中
     */
    public static function match($url, &$matches = null){
        $root = self::getRoot();
        //命中server.conf文件中定义的rewrite，redirect规则
        // $configFile = $root . 'server.conf';
        $configFiles = self::getConfigFiles($root . 'server-conf/');
        for ($i=0; $i < count($configFiles); $i++) { 
            $configFile = $configFiles[$i];
            if(file_exists($configFile) && ($handle = fopen($configFile, 'r'))){
                while (($buffer = fgets($handle)) !== false) {
                    $ruleTokens = preg_split('/\s+/', trim($buffer));
                    $type = strtolower($ruleTokens[0]);
                    if(preg_match('/^\w+$/', $type)){
                        $rule = array(
                            'rule' => $ruleTokens[1],
                            'rewrite' => $ruleTokens[2],
                            'type' => $type
                        );
                        $ret = self::_match($rule, $root, $url, $matches);
                        if($ret) {
                            fclose($handle);
                            return $ret;
                        }
                    }
                }
                if (!feof($handle)) {
                    echo "Error: unexpected fgets() fail\n";
                }
                fclose($handle);
            }
        }
        
        return false;
    }

    private static function _match($rule, $root, $url, &$matches = null){
        if(preg_match('/' . $rule['rule'] . '/', $url, $matches)){
            $rewrite = self::padString($rule['rewrite'], $matches);
            $type = $rule['type'];
            if(isset(self::$userRules[$type])){
                $ret = call_user_func(self::$userRules[$type], $rewrite, $url, $root, $matches);
                if($ret === false){
                    return false;
                } else {
                    return true;
                }
            } if($type == 'rewrite'){
                if(file_exists($file = $root . $rewrite)){
                    $pos = strrpos($rewrite, '.');
                    if(false !== $pos){
                        $ext = substr($rewrite, $pos + 1);
                        if($ext == 'php'){
                            self::includePhp($root . $rewrite, $matches);
                        } else {
                            self::header(200);
                            if(isset(self::$MIME[$ext])){
                                $content_type = 'Content-Type: ' . self::$MIME[$ext];
                            } else {
                                $content_type = 'Content-Type: application/x-' . $ext;
                            }
                            header($content_type);
                            echo file_get_contents($root . $rewrite);
                        }
                    } else {
                        echo file_get_contents($root . $rewrite);
                    }
                } else {
                    self::header(404);
                }
            } else if($type == 'redirect'){
                header('Location: ' . $rewrite);
                exit();
            }
            return true;
        }
        return false;
    }

    private static function includePhp($file, $matches){
        $fis_matches = $matches;
        include($file);
    }

    private static function  getConfigFiles($path){
        if(is_dir($path)){
            $files = array();
            $dir = dir($path);
            $containCommon = false;
            while (($file = $dir->read()) !== false) {
                if ($file == '.' || $file == '..' || is_dir($path . $file)) {
                    continue;
                }
                if($file == "common.conf"){
                    $containCommon = true;
                }
                array_push($files, $path . $file);
            }
            if ($containCommon) {
                array_unshift($files, $path . "common.conf");
            }
            return $files;
        }
        return array();
    }
}
