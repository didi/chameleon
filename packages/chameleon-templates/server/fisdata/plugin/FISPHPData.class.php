<?php

class FISPHPData extends FISData {
    public function __construct() {
        $this->datatype = 'php';
    }

    public function getData($tmpl) {
        $file = $this->getFile($tmpl);
        $ret = array();
        if (is_file($file)) {            
            require($file);
            
            $ret = $chameleon;
        }
        return $ret;
    }
}
