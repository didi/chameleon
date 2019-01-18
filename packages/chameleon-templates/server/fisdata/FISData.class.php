<?php

abstract class FISData {
    public $datatype;


    public function getDatatype() {
        return $this->datatype;
    }

    protected function existDataFile($id) {
        $filepath = Util::normalizePath(WWW_ROOT . '/test/' . preg_replace('/\.[a-z]{2,6}$/i', '.' . $this->getDatatype(), $id));
        if (is_file($filepath)) {
            return $filepath;
        }
        return false;
    }

    /**
     * @param $tmpl 当前渲染模板路径
     */
    protected function getId($tmpl) {
        $root = Util::normalizePath(WWW_ROOT . 'template');
        $id = str_replace($root, '', Util::normalizePath($tmpl));

        //add zhangnan03
        $root_page =  Util::normalizePath(WWW_ROOT . 'page');
        $id = str_replace($root_page, '', $id);
        //add end
        return $id;
    }

    public function getCookieId() {
        $cookie_id = $_COOKIE['FIS_DEBUG_DATA_ID'];
        if ($cookie_id) {
            $cookie_id = trim($cookie_id);
            if ($cookie_id !== '') {
                $arr = explode('|', $cookie_id);
                if (trim($arr[0]) == $this->datatype) {
                    $cookie_id = $arr[1];
                } else {
                    $cookie_id = '';
                }
            }
        } else {
            $cookie_id = '';
        }
        return $cookie_id;
    }

    public function getData($tmpl) {}

    /**
     * 获取选定的数据文件路径
     * @param $tmpl
     * @return bool|string
     */
    protected function getFile($tmpl) {
        $id = $this->getId($tmpl);
        $info = pathinfo($id);
        $filepath = '';
        //特定数据
        if ($cookie_id = $this->getCookieId()) {
            $tmp_id = $info['dirname'] . '/' .$info['filename'] .'/'. $cookie_id;
            $filepath = $this->existDataFile($tmp_id);
        } else if (($list = $this->getDataList($tmpl))) {
            //当前提供多份数据
            $filepath = current($list); //first
        }
        if (!$filepath) {
            //没有多份数据时，默认数据路径
            $filepath = Util::normalizePath(WWW_ROOT . '/test/' . preg_replace('/\.[a-z]{2,6}$/i', '.' . $this->datatype, $id));
        }
        return $filepath;
    }

    /**
     * 多份测试数据
     * @param $tmpl
     * @return array
     */
    public function getDataList($tmpl) {
        $id = $this->getId($tmpl);
        $info = pathinfo($id);
        $test_dir = Util::normalizePath(WWW_ROOT . '/test/' . $info['dirname'] . '/' . $info['filename']);
        $files = Util::find($test_dir, '/' . $info['filename'] . '_\d+\.'.$this->datatype.'/i');
        if ($files) {
            foreach ($files as $k => $filepath) {
                $files[str_replace($test_dir . '/', '', $filepath)] = $filepath;
                unset($files[$k]);
            }
        }
        return $files;
    }

    public function get($post) {
        $filepath = $post['path'];
        if (!is_file($filepath)) {
            echo "";
            return;
        }
        echo file_get_contents($filepath);
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
        echo '{"message": "保存成功", "code": 0}';
    }

    public function getCurrentFilePath($tmpl) {
        //以后支持多份测试数据
        return $this->getFile($tmpl);
    }

}
