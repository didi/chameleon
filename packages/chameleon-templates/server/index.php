<?php
ini_set('display_errors', 1);
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

$root = dirname(__FILE__) . DIRECTORY_SEPARATOR;
require_once $root . "rewrite" . DIRECTORY_SEPARATOR . "Rewrite.php";
require_once $root . "fisdata" . DIRECTORY_SEPARATOR . "TestData.class.php";

class CITpl {
	private $assignData = array();
	public function display($candidate_tmpl){
		foreach ($this->assignData as $test_data) {
			extract($test_data);
	    }
		ob_start();
		echo eval('?>'.preg_replace('/;*\s*\?>/', '; ?>', str_replace('<?=', '<?php echo ', file_get_contents($candidate_tmpl))));
		ob_end_flush();
	}

	public function assign( $data ){
		$this->assignData[] = $this->object_to_array($data);
	}
	function object_to_array($object)
	{
		return is_object($object) ? get_object_vars($object) : $object;
	}
}


TestData::init();
/**
* 先匹配server-conf/rewrite.conf里面匹配
* 例如rewrite.conf里面写了：
* template ^\/hao123$ index/page/hao123_home.tpl
* 则因为使用了
* Rewrite::addRewriteRule('template', 'fis_debug_template_rewrite_rule');
* 用户访问/hao123则命中fis_debug_template_rewrite_rule函数处理
* 
* 固定如果是/static开头的则读取static目录的静态文件返回
*
* 其他情况则用 fis_debug_template_rewrite_rule 取自动匹配
*
*
* 失败则返回错误
*/
$path = $_SERVER['REQUEST_URI'];
function fis_debug_render_smarty($tpl = null, $data = array()) {
	$root = dirname(__FILE__) . DIRECTORY_SEPARATOR;
	require_once $root . 'smarty/Smarty.class.php';
	$smarty = new Smarty();
	$default_conf = array(
		'template_dir' => 'template',
		'config_dir' => 'config',
		'plugins_dir' => array('plugin'),
		'left_delimiter' => '{%',
		'right_delimiter' => '%}',
	);
	if (file_exists($root . 'smarty.conf')) {
		$user_conf = parse_ini_file($root . 'smarty.conf');
		if (!empty($user_conf)) {
			$default_conf = array_merge($default_conf, $user_conf);
		}
	}
	$smarty->setTemplateDir($root . $default_conf['template_dir']);
	$smarty->setConfigDir($root . $default_conf['config_dir']);
	foreach ($default_conf['plugins_dir'] as $dir) {
		$smarty->addPluginsDir($root . $dir);
	}
	$smarty->setLeftDelimiter($default_conf['left_delimiter']);
	$smarty->setRightDelimiter($default_conf['right_delimiter']);
	TestData::renderHelper($smarty, $tpl);
	// $smarty->assign($data);
	// $smarty->display($tpl);
}

function fis_debug_template_rewrite_rule($rewrite, $url, $root, $matches) {
	if (file_exists($root . 'template/' . $rewrite)) {
		header('Content-Type: text/html');
		fis_debug_render_smarty($rewrite);
	} else {
		Rewrite::header(404);
	}
}

function fis_debug_render_php_older($tpl = null, $data = array()){
	$root = dirname(__FILE__) ;//. DIRECTORY_SEPARATOR;
	$path = str_replace($root, '', $tpl);
	if (!$tpl) {
		$path = $_SERVER['REQUEST_URI'];
		$split = explode('/', $path);
		$last = array_pop($split);
		$len = count($split);
		if (($pos = strpos($path, '?')) !== false) {
			$path = substr($path, 0, $pos);
		}
		if ($path[strlen($path) - 1] === '/') {
			$path = substr($path, 0, -1);
		}
		if (1 === $len) {
			$path .= '/index.html';
		} else {
			$path .= '.html';
		}
		$tpl = $root  . $path;
	}

	if(file_exists($root . 'test' . $testDataFile . 'php')){
		require($root . 'test' . $testDataFile . 'php');
	}
	if( file_exists($tpl) ){
		require($tpl);
	}else{
		$pathbefore = explode('.html',$tpl );
		require( $pathbefore[0].'.php' );	
	}
}
function fis_debug_render_php($tpl = null, $data = array()) {
	$root = dirname(__FILE__) . DIRECTORY_SEPARATOR;
	$path = str_replace($root, '', $tpl);
	if (!$tpl) {
		$path = $_SERVER['REQUEST_URI'];
		$split = explode('/', $path);
		$last = array_pop($split);
		$len = count($split);
		if (($pos = strpos($path, '?')) !== false) {
			$path = substr($path, 0, $pos);
		}
		if ($path[strlen($path) - 1] === '/') {
			$path = substr($path, 0, -1);
		}
		if (1 === $len) {
			$path .= '/index.html';
		} else {
			$path .= '.html';
		}
		$tpl = $root . 'page' . $path;
	}
	$template_instance = new CITpl();
	if(file_exists($tpl)){
		TestData::renderHelper($template_instance , $tpl);
	}else{
		die('Not found page '.$tpl);
	}
}


// Rewrite::addRewriteRule('php', 'fis_debug_php_rewrite_rule');
// Rewrite::addRewriteRule('template', 'fis_debug_template_rewrite_rule');
// if (!Rewrite::match($path)) {
	$projectName = TestData::$_chameleon_data->getProjectName();
	$tpl = $root . 'template/' . $projectName . '.tpl';	
	fis_debug_render_smarty($tpl);

// }
