<?php

class FISJSONData extends FISData {
    public function __construct() {
        $this->datatype = 'json';
    }

    public function getData($tmpl) {
        $file = $this->getFile($tmpl);
        $ret = array();
        if (is_file($file)) {
            $ret = json_decode(file_get_contents($file), true);
            if ($ret === null) {
                $ret = array();
            }
        }
        return $ret;
    }
}