<?php
	require_once('./genInterface.php');
	
	//通过svn获取adoc文档内容，IDE单独实现
	//$adocFile = "http://fe.baidu.com/repos/doc/iknow/fetest/home/home.text";
	//$adocFile = "http://fe.baidu.com/repos/doc/tieba/i18n/data/demo/index.text";
//	$adocFile = "http://fe.baidu.com/repos/doc/iknow/fetest/home/home.text";
//	$adocFile = "http://fe/repos/doc/iknow/exp/api/list/index.text";
//	$adocFile = "http://fe.baidu.com/repos/doc/tieba/i18n/module/frs/index.text";

	$adocFile = dirname(__FILE__)."/./data/json_Adoc.php";
	//$adocFile = dirname(__FILE__)."/./data/php_Adoc.php";
	
	//$adocFile = "http://127.0.0.1:8080/static/en/list/fisApi/list/tmp.text";
	//$adocFile = "http://fe.baidu.com/repos/doc/iknow/exp/api/fisApi/php/list/index.text";
	//$adocFile = "http://localhost/php/index.text";
	
	$Content = file_get_contents($adocFile);
	//$Content = file_get_contents($AdocFile);
	
	
	//echo "JsonContent:$JsonContent\n";
	//echo "phpContent:$phpContent\n";
	
	//三个接口演示，以类的方式调用
	$demo = new genInterface();
	
	/*接口1 设置路径
	 * 输入：参数是保存的case文档的绝对路径
	 * 		  默认参数为 /工具的绝对路径/JsonPro/data/
	 * 返回：true or false 提示设置成功或失败
	 */
	$demo->setPath();
	
	/*
	 * 接口2 生成测试数据，并将数据保存至接口1设置的位置
	 * 输入：adoc文档的内容
	 * 返回： true or false 提示生成成功或失败
	 */
	//$demo->genCaseData($Content,"http://fe.baidu.com/repos/doc/iknow/exp/api/fisApi/php");
	$demo->genCaseData($Content,"D:/build20120809/sample01/list/test/adoc/");
	  //$demo->genCaseData($Content);
	  
	  
	/*
	 * 接口3 测试数据case获取
	 * 输入：uri，不包含地址及参数
	 * 返回：json格式的case内容，包含多份case数据
	 */
	$testCase = $demo->getCaseData("list");
	
	//echo $testJsonCase;

	file_put_contents(Config::$strPath.'/./tmp/Terminal.php',print_r($testCase, true));

	$testHtmlCase = $demo->getHtmlCaseData("list");
//	echo "".$testHtmlCase;
	file_put_contents(Config::$strPath.'/./tmp/TerminalHtml.php',print_r($testHtmlCase, true));
/*	$aa=$testCase[1];
	
	foreach ( $aa as $key=>$value ) 
	{
    	echo "key=".$key." and value=".$value."<br />";   
	}
	//echo $testCase;*/
	echo "OK";

?>
