<?php
/**
 * 数据管理，包括展示，保存，选择默认数据等
 * Class Manager
 */
class Manager {

    private $_data_arr = array();
    private $_tmpl;

    /**
     * @param $data_arr array('php' => <Object FISData>, 'json' => <Object FISData>...)
     * @param $tmpl 当前展示页面的模板路径
     */
    public function __construct($data_arr, $tmpl) {
        $this->_data_arr = $data_arr;
        $this->_tmpl = $tmpl;
    }

    public function getDefault() {
        $default_arr = array();
        $default =  $this->_data_arr[$this->getCurrentDatatype()];
        $default_arr['datatype'] = $default->getDatatype();
        $default_arr['path'] = $default->getCurrentFilepath($this->_tmpl);
        $default_arr['data'] = htmlspecialchars(file_get_contents($default->getCurrentFilepath($this->_tmpl)));
        $default_arr['list'] = $default->getDataList($this->_tmpl);
        //默认选定
        $default_arr['list_default'] = $default->getCookieId();
        return $default_arr;
    }

    public function getCurrentDatatype() {
        $datatype = trim($_COOKIE['FIS_DEBUG_DATATYPE']);
        if (!$datatype) {
            $datatype = 'php';
        }
        return $datatype;
    }

    public function getRenderData() {
        $datatypes = array();
        foreach ($this->_data_arr as $data_instance) {
            $datatypes[] = $data_instance->getDatatype();
        }

        return array(
            'datatypes' => $datatypes,
            'default' => $this->getDefault(),
        );
    }

    public function render() {
        require_once (WWW_ROOT . 'smarty/Smarty.class.php');
        $smarty = new Smarty();
        $smarty->setPluginsDir(array(
            WWW_ROOT . 'smarty/plugins'
        ));
        $smarty->setLeftDelimiter('{%');
        $smarty->setRightDelimiter('%}');
        $smarty->assign($this->getRenderData());
        $smarty->display(dirname(__FILE__) . '/index.tpl');
        exit();
    }
}
