<?php
if (!defined('WWW_ROOT')) define('WWW_ROOT', realpath(dirname(__FILE__) . '/../') . DIRECTORY_SEPARATOR);
if (!defined('ROOT')) define('ROOT', dirname(__FILE__) . DIRECTORY_SEPARATOR);
if (!defined('PLUGIN_ROOT')) define('PLUGIN_ROOT', ROOT . DIRECTORY_SEPARATOR . 'plugin' . DIRECTORY_SEPARATOR);
if (!defined('LIBS_ROOT')) define('LIBS_ROOT', ROOT . DIRECTORY_SEPARATOR . 'libs' . DIRECTORY_SEPARATOR);

require_once LIBS_ROOT . 'Util.class.php';
require_once ROOT . 'Manager.class.php';
require_once ROOT . 'FISData.class.php';
require_once PLUGIN_ROOT . 'plugins.php';

class TestData {

    static private $_data_queue = array();
    static private $_flush_data_queue = array();
    static public $_chameleon_data = array();

   

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
        'xml' => 'text/xml',
        'xls' => 'application/vnd.ms-excel',
        'xq' => 'text/xml',
        'xql' => 'text/xml',
        'xquery' => 'text/xml',
        'xsd' => 'text/xml',
        'xsl' => 'text/xml',
        'xslt' => 'text/xml'
    );


    public static function register(FISData $data_instance) {
        self::$_data_queue[$data_instance->getDatatype()] = $data_instance;
    }

    public static function init() {
        //注册对象
        self::register(new FISPHPData());
        self::register(new FISJSONData());
        self::register(new FISAdocData());
        self::$_chameleon_data = new ChameleonData();
        
        self::$_flush_data_queue = array(); //暂时只需要一份数据
        $datatype = $_COOKIE['FIS_DEBUG_DATATYPE'];
       
        $flush_data = self::$_data_queue[$datatype];
        
        if (!$flush_data) { 
            //取数组第一个元素    FISPHPData对象     
            $flush_data = current(self::$_data_queue);
        }
        if ($flush_data) {
            self::$_flush_data_queue[] = $flush_data;
        }
        self::router();
    }

    public static function renderHelper($template_instance, $candidate_tmpl) {
             
        $mockData = self::$_chameleon_data->getMockContent();
        //如果通过json文件找到mock数据
        if($mockData) {
            $puredata=$_GET[puredata];
            //返回ajax数据
            if($puredata == 1) {
                $ajaxData = array();
                $ajaxData[errno] = $mockData[errno];
                $ajaxData[errmsg] = $mockData[errmsg];
                $ajaxData[data] = $mockData[pageData];
                echo json_encode($ajaxData);
                return;
            } else {
                $template_instance->assign($mockData);
            }
        } else {
            // 走之前的mock逻辑 mock与模板同名的php文件
            foreach (self::$_flush_data_queue as $data_instance) {
                //$data_instance FISPHPData对象
                $template_instance->assign($data_instance->getData($candidate_tmpl));
            }
        }

        $template_instance->display($candidate_tmpl);
    }
    public static function router() {
        $request_uri = $_SERVER['REQUEST_URI'];
        
        $pos = strpos($request_uri, '?');
        if ($pos !== false) {
            $request_uri = substr($request_uri, 0, $pos);
        }
        $uris = explode('/', $request_uri);
        //没有进入
        if ($uris[1] == 'fisdata') {
            if ($uris[2] == 'static') {
                $uri_file = realpath(WWW_ROOT . $request_uri);
                if (is_file($uri_file)) {
                    $info = pathinfo($uri_file);
                    header("Content-Type: " . self::$MIME[$info['extension']]);
                    echo file_get_contents($uri_file);
                    exit;
                }
            } else {
                self::doAction($uris[2]);
            }
        }
    }

    private static function doAction($action) {
        $params = $_POST;
        foreach (self::$_flush_data_queue as $data_instance) {
            if (method_exists($data_instance, $action)) {
                call_user_func_array(array($data_instance, $action), array('params' => $params));
            }
        }
        exit();
    }
}
