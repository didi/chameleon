<?php
	require_once(dirname(__FILE__).'/genLog.php');
	require_once(dirname(__FILE__).'/genConf.php');
	require_once(dirname(__FILE__).'/CommonHelper.php');
	
	class genFile
	{
		private $arrFinal = array();
		public function __construct($arr)
		{
			Json_Log::init();//Json_Log::fatal("in genfile",__FILE__,__LINE__);
			$this->arrFinal = $arr;
		}
		
		public function getFISFile($strUrl)
		{
			//echo $strUrl."\n";
			$arrTmp = explode("/",$strUrl);
			$strFileName = "";
			$nameArray = array();
			foreach($arrTmp as $key)
			{
				if(trim($key) != "")
				{
					if($strFileName == "")
					{
						$strFileName .= $key;
					}
					else 
					{
						$strFileName .= "_".$key;
					}
					array_push($nameArray, $key);
				}
			}
			//var_dump($nameArray);
			$tmpJson = json_encode($this->arrFinal);
			$strJson = CommonHelper::json_format($tmpJson);
			if($nameArray[0] == "widget" && array_key_exists(1, $nameArray))
			{
				$strModule = $nameArray[1];
			//	$fisFileName=Config::$strPath."../$strModule/".$strFileName.".php";
				$fisFileName=Config::$strPath.$strFileName.".php";
			//	CommonHelper::makeDir(Config::$strPath."../$strModule");
			}
			else
			{
				$fisFileName=Config::$strPath.$strFileName.".php";
			}
			//echo "fisFileName:" . $fisFileName . "\n";
			//echo "strJson:" . $strJson . "\n";
			file_put_contents($fisFileName,$strJson);
			
			return $fisFileName;
		}
		
		public function getFISHtmlFile($strUrl)
		{
		//	echo $strUrl."\n";
			$arrTmp = explode("/",$strUrl);
			$strFileName = "";
			$nameArray = array();
			foreach($arrTmp as $key)
			{
				if(trim($key) != "")
				{
					if($strFileName == "")
					{
						$strFileName .= $key;
					}
					else 
					{
						$strFileName .= "_".$key;
					}
					array_push($nameArray, $key);
				}
			}
			
			$tmpJson = "[\n";
			$tmpElementJson = "";
			$strElementJson = "";
			$arrWholeTmp = array();
			$wholeTmpElementJson = "";
			//1、utf8编码
			//var_dump($this->arrFinal);
			$this->arrFinal = CommonHelper::array_utf8_encode($this->arrFinal);
			//var_dump($this->arrFinal);
			foreach ($this->arrFinal as $k => $arrElement)
			{
				$tmpElementJson = json_encode($arrElement); //2、Json编码
				//3、utf8解码。得到的字符串中 中文正常
				$tmpElementJson = urldecode($tmpElementJson);
				//var_dump($tmpElementJson);
				$wholeTmpElementJson .= $tmpElementJson."\n";
			//	echo "tmpElementJson: ".$tmpElementJson."\n";
				$strElementJson = CommonHelper::json_Html_format($tmpElementJson);
				array_push($arrWholeTmp, $strElementJson);
			}
			
			file_put_contents(Config::$strPath."/tmp/".$strFileName."WTJson.php",$wholeTmpElementJson);
			$tmpJson = json_encode($arrWholeTmp);
			//var_dump($tmpJson);

			$tmpJson = CommonHelper::json_format($tmpJson);
			
			
			//-----解决int显示时带引号的问题-xumeng02----
			//var_dump($tmpJson);
			$patterns = array();
			$patterns[0] = '#."\*\*\*\*#m';
			$patterns[1] = '#\*\*\*\*."#m';
			$replacements = array();
			$replacements[0] = '';
			$replacements[1] = '';
			$tmpJson =  preg_replace($patterns, $replacements, $tmpJson);
			
			//-----end----------------
				
		//	$strJson = CommonHelper::remove_redundant_backslash($strJson);
			
			if($nameArray[0] == "widget" && array_key_exists(1, $nameArray))
			{
				$strModule = $nameArray[1];
			//	$fisFileName=Config::$strPath."../$strModule/".$strFileName."Html.php";
				$fisFileName=Config::$strPath.$strFileName."Html.php";
			//	CommonHelper::makeDir(Config::$strPath."../$strModule");
			}
			else
			{
				$fisFileName=Config::$strPath.$strFileName."Html.php";
			}
			//echo "fisHtmlFileName:" . $fisFileName . "\n";
			file_put_contents($fisFileName,$tmpJson);

			//打印测试信息
			$arrDecode = json_decode($tmpJson);
			file_put_contents(Config::$strPath."/tmp/".$strFileName."HtmlTest.php",$arrDecode[0]);  //utf8解码
			
			/*
			//测试array_utf8_encode方法
			$arrTest = array('video_num' => 5, 'videos' => array(0 => array(title => '暮光之城', 'imgh_url' => 'http://t1.baidu.com/it/u=3490919773,988116911&fm=20')));
			print_r($arrTest);
			$arrTest = CommonHelper::array_utf8_encode($arrTest);
		//	CommonHelper::array_utf8_encode($arrTest);
			print_r($arrTest);
			$strTest = json_encode($arrTest);
			$strTest = urldecode($strTest);
			echo mb_convert_encoding("strTest: $strTest\n", "GBK", "UTF-8");
			*/
			
			return $fisFileName;
		}
		
		public function getFile()
		{
			$strReFile = "";
			$strReFile .=  "//@fileOverview";
			$strReFile .= "\n";
			
			for($i=0;$i<count($this->arrFinal);$i++)
			{
				$strJson = json_encode($this->arrFinal[$i]);
				/*$tmpJson = "";
				for($j=0;$j<strlen($strJson);$j++)
				{
					$tmpJson.=$strJson{$j};
					if($strJson{$j} == "{" || $strJson{})
					{
						
					}
				}*/
				$strJson = $this->json_format($strJson);
				$tmpReFile = $strReFile.$strJson;
				file_put_contents(Config::$strPath.'/./data/testcase'.$i,$tmpReFile);

			}			
		}
	}
?>