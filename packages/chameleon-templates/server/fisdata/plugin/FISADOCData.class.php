<?php

class FISADOCData extends FISData {

    private $adoc_data_path;

    public function __construct() {
        $this->datatype = 'adoc';
        $this->adoc_data_path = WWW_ROOT . '/test/data/';
    }

    protected function getId($tmpl) {
        $uri = $_SERVER['REQUEST_URI'];
        if (($p = strpos($uri, '?')) !== false) {
            $uri = substr($uri, 0, $p);
        }
        $uris = explode('/', $uri);
        if (isset($uris[1]) && $uris[1] !== '') {
            unset($uris[0]);
            $id = implode('_', $uris);
        }
        return $id;
    }

    protected function getFile($tmpl) {
        $root = Util::normalizePath(WWW_ROOT . 'template');
        $id = str_replace($root, '', Util::normalizePath($tmpl));
        return Util::normalizePath(WWW_ROOT . '/test/' . preg_replace('/\.[a-z]{2,6}$/i', '.text', $id));
    }

    private function parseAdocFile($filepath) {
        $content = file_get_contents($filepath);
        require_once(LIBS_ROOT . 'JsonPro' . DIRECTORY_SEPARATOR . 'genInterface.php');
        $genHandle = new genInterface();
        $genHandle->setPath($this->adoc_data_path);
        $genHandle->genCaseData($content);
    }

    public function getData($tmpl) {
        $id = $this->getId();
        if (!$id) {
            $this->parseAdocFile($this->getFile($tmpl));
        }
        $data_path = Util::normalizePath($this->adoc_data_path . $id . '.php');
        if (!is_file($data_path)) {
            return array();
        }
        ob_start();
        require_once($data_path);
        $data = ob_get_clean();
        $data = json_decode($data, true);
        $render_data = array();
        if ($cookie_id = $this->getCookieId()) {
            $render_data = $data[$cookie_id];
        } else {
            $render_data = current($data);
        }
        return $render_data;
    }

    public function fetchRemoteData($tmpl_id) {
    }

    public function getDataList($tmpl) {
        $id = $this->getId();
        if (!$id) {
            $this->parseAdocFile($this->getFile($tmpl));
        }
        $data_path = Util::normalizePath($this->adoc_data_path . $id . 'HTML.php');
        if (!is_file($data_path)) {
            return array();
        }
        ob_start();
        require_once($data_path);
        $data = ob_get_clean();
        $data = json_decode($data, true);
        return $data;
    }

    public function save($post) {
        $file = $post['path'];
        $dir = dirname($file);
        if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
            echo '{"message": "填写的路径无法创建，请重新填写！", "code": 1}';
            exit(1);
        }
        if (!is_file($file) && false === file_put_contents($file, '')) {
            echo '{"message": "填写的路径无法创建，请重新填写！", "code": 1}';
            exit(1);
        }
        $data = $post['data'];
        file_put_contents($file, $data);
        $this->parseAdocFile($file);
        echo '{"message": "保存成功", "code": 0}';
    }
}
