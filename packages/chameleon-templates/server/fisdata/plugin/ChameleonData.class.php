<?php

class ChameleonData {
    public function __construct() {
    }

    public function getData($file) {
        $ret = array();
        if (is_file($file)) {
            $ret = json_decode(file_get_contents($file), true);
            if ($ret === null) {
                $ret = array();
            }
        }
        return $ret;
    }
    //获取项目的名称 模板的名称,SPA 固定渲染一个模板
    public function getProjectName() {
      $jsonFile = WWW_ROOT . "json/project.json";
      $content = $this->getData($jsonFile);
      return $content[projectName];
    }

     //根据url，从配置的router.json中获取模拟php文件的数据
     public function getMockContent() {
        $jsonFile = WWW_ROOT . "json/router.config.json";
        $content = $this->getData($jsonFile);
        $path = $_SERVER['REQUEST_URI'];
        if (($pos = strpos($path, '?')) !== false) {
            $path = substr($path, 0, $pos);
        }

        $mockFileName;

        if($content[mode] === "history") {
            foreach ($content[routes] as $item) {
                if($item[url] === $path) {
                $mockFileName = $item[mock];
                }
            }
        } else if ($content[mode] === "hash") {
            $mockFileName = $this->getProjectName() . ".php";
        }
        
        if($mockFileName) {
            $mockPath = WWW_ROOT . 'test/' . $mockFileName;
        
            if (is_file($mockPath)) {  
            
                require($mockPath);
                $ret = $chameleon;
                return $ret;
            }
        }

      
    
    }
}