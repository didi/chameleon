<?php
	require_once(dirname(__FILE__).'/genLog.php');
	
	class genArray
	{
		public function __construct()
		{
			Json_Log::init();//Json_Log::fatal("in genarray",__FILE__,__LINE__);
		}
		
		public function getJsonInheritStandArray($jsonFilePath, $adocFilePath)
		{
			//echo "getInheritStandArray\n";
			//存储父adoc文档的main部分到/tmp/parentJsonFile.php
			$adocParser = new AdocParser();
			$parentContent = $adocParser->getParentContent($adocFilePath);
			//echo $parentContent;
			if($parentContent == "")
			{
				$inheritStandArray = $this->getJsonArray($jsonFilePath);
				//echo $inheritStandArray;
			}
			else {
				$parentJsonFileContent = $adocParser->getJsonBlock(Config::$strPath."/./Parent.php");
				$parentJsonFilePath = Config::$strPath."/./tmp/parentFile.php";
				file_put_contents($parentJsonFilePath,$parentJsonFileContent);
				
				//分别获取 子adoc文档的标准数组  和  父adoc文档的标准数组
				$childStandArr = $this->getJsonArray($jsonFilePath);
				//echo "childStandArr:\n";
				//var_dump($childStandArr);
				$parentStandArr = $this->getJsonArray($parentJsonFilePath);
				//echo "parentStandArr:\n";
				//var_dump($parentStandArr);
				
				//合并 子adoc文档的标准数组  和  父adoc文档的标准数组，得到$inheritStandArray
				$inheritStandArray = $this->getInheritStand($parentStandArr, $childStandArr);
				//var_dump($inheritStandArray);
			}
			return $inheritStandArray;
			
		}
	public function getPhpInheritStandArray($jsonFilePath, $adocFilePath)
		{
			//echo "getInheritStandArray\n";
			//存储父adoc文档的main部分到/tmp/parentJsonFile.php
			$adocParser = new AdocParser();
			$parentContent = $adocParser->getParentContent($adocFilePath);
			if($parentContent == "")
			{
				$inheritStandArray = $this->getPhpArray($jsonFilePath);
			}
			else {
				$parentJsonFileContent = $adocParser->getJsonBlock(Config::$strPath."/./Parent.php");
				$parentJsonFilePath = Config::$strPath."/./tmp/parentFile.php";
				file_put_contents($parentJsonFilePath,$parentJsonFileContent);
				
				//分别获取 子adoc文档的标准数组  和  父adoc文档的标准数组
				$childStandArr = $this->getPhpArray($jsonFilePath);
				//echo "childStandArr:\n";
				//var_dump($childStandArr);
				$parentStandArr = $this->getPhpArray($parentJsonFilePath);
				//echo "parentStandArr:\n";
				//var_dump($parentStandArr);
				
				//合并 子adoc文档的标准数组  和  父adoc文档的标准数组，得到$inheritStandArray
				$inheritStandArray = $this->getInheritStand($parentStandArr, $childStandArr);
				//var_dump($inheritStandArray);
			}
			return $inheritStandArray;
			
		}
		
		public function getInheritStand($parentStandArr, $childStandArr)
		{
			$inheritResult = $parentStandArr;
			//遍历$childNewAdocArray，当
			foreach ($childStandArr as $childKey => $childValue)
			{
				//echo "childKey: $childKey\n";
			//	$inheritResult[$childKey] = $childValue;	//替换已有内容，或添加没有的内容
				if(array_key_exists($childKey, $inheritResult))
				{
					//echo "Exists, ";
					if(is_array($childValue))
					{
						//echo "but is array!\n";
						$inheritResult[$childKey] = $this->getInheritStand($inheritResult[$childKey], $childValue);
					}
					else
					{
						//echo "and is not array!\n";
						$inheritResult[$childKey] = $childValue;
					}
				}
				else
				{
					//echo "Not exists!\n";
					$inheritResult[$childKey] = $childValue;
				}
			}
			//var_dump($inheritResult);
			return $inheritResult;
		}
		
		public function getJsonArray($jsonFilePath)
		{
			//读取adoc文档，获取json串
			/*$fileAdoc = dirname(__FILE__)."/./home.text";//home5.text、home.text
			$path = dirname(__FILE__)."/./jsonData.json";
			$fileAdoc = $this->gen_JsonData($fileAdoc);
			file_put_contents($path,$fileAdoc);*/
			
			//读取json数据,并进行替换写回 
			$fileStr = file_get_contents($jsonFilePath);
			
			$fileStr = $this->reduce_string($fileStr);
			$tmpPath = dirname($jsonFilePath)."/StanStr.php";
			file_put_contents($tmpPath,$fileStr);

			//逐行trim decode 获得array
			$jsonStr = $this->trim_string($tmpPath);
			//$jsonStr = iconv("GBK","UTF-8",$jsonStr);
			//echo "encoding".mb_detect_encoding($jsonStr)."\n";
			//echo "before".$jsonStr;
			$jsonArr = json_decode($jsonStr,true);
		//	if($jsonArr == null) {
		//		echo "\n stanArr is null!\n";
		//	}
			file_put_contents(dirname($jsonFilePath)."/Standard.php",print_r($jsonArr,true));

			return $jsonArr;	
		}
		
		
		
	public function getPhpArray($jsonFilePath)
		{
			//echo "getArray\n";

			//读取adoc文档，获取json串
			/*$fileAdoc = dirname(__FILE__)."/./home.text";//home5.text、home.text
			$path = dirname(__FILE__)."/./jsonData.json";
			$fileAdoc = $this->gen_JsonData($fileAdoc);
			file_put_contents($path,$fileAdoc);*/
			
			//读取json数据,并进行替换写回 
			$fileStr = file_get_contents($jsonFilePath);
			//echo "fileStr: $fileStr\n";
			$fileStr = $this->reduce_string($fileStr);

			//echo "jsonFilePath:$jsonFilePath\n\n";
			//jsonFilePath:GAEA_TEMP_PATHdata/File.php
			//jsonFilePath:GAEA_TEMP_PATHdata//./tmp/parentFile.php
			//jsonFilePath:GAEA_TEMP_PATHdata/File.php
			//jsonFilePath:GAEA_TEMP_PATHdata//./tmp/parentFile.php
			$tmpPath = dirname($jsonFilePath)."/StanStr.php";
			file_put_contents($tmpPath,$fileStr);

			//逐行trim decode 获得array
		//	$jsonStr = $this->trim_string($tmpPath);
			//$jsonStr = iconv("GBK","UTF-8",$jsonStr);
			//echo "encoding".mb_detect_encoding($jsonStr)."\n";
			//echo "before".$jsonStr;
		//	$jsonArr = json_decode($jsonStr,true);
			eval($fileStr);
			//echo "newAdocArray:\n";
			//print_r($newAdocArray);
		//	if($jsonArr == null) {
		//		echo "\n stanArr is null!\n";
		//	}
		//	file_put_contents(dirname($jsonFilePath)."/standard.php",print_r($jsonArr,true));
			file_put_contents(dirname($jsonFilePath)."/Standard.php",print_r($newAdocArray,true));
			return $newAdocArray;	
		}
		
		
    
		function gen_JsonData($pathAdoc,$keyStartAdoc="main")
		{
			$fOpen = fopen($pathAdoc,"r");
			$content = "";
			$isJsonStr = false;
			while(!feof($fOpen))
			{
				$line = fgets($fOpen);
				//if(preg_match('/^\s*\#\#\#\#'.$keyStartAdoc.'(.+)$/',$line))
				if(preg_match('/^\s*\#\#\#\#'.$keyStartAdoc.'$/',$line) || preg_match('/^\s*\#\#\#\#'.$keyStartAdoc.'(.+)$/',$line))
				{
					$isJsonStr = true;
					continue;
				}
				else if(preg_match('/\#\#\#\#/i',$line))
				{
					$isJsonStr = false;
				}
				
				if(!$isJsonStr || (trim($line) == "") || (trim($line) == ":::javascript"))
				{
					continue;
				}
				
				if(content != "")
				{
					$content = $content.$line;		
				}
				else
				{
					$content = $line;
				}
			}   
			fclose($fOpen);
			return $content;
		}
	   /*
	    * 匹配正则，删除// 等注释语句（包括范围注释）
	    * @param    string  $str    json string
	    * @return   string  $str    去除注释后的语句                 
	    * @access   public
	    */
	     function reduce_string($str)
	    {
	        $str = preg_replace(array(
	
	        	//m 则^、$针对行的开始和结尾
	        	//s 匹配多行
	                // eliminate single line comments in '// ...' form
	                '#\s*(?<!:)//(.+)$#m',
	
	                // eliminate multi-line comments in '/* ... */' form, at start of string
	                '#^\s*/\*(.+)\*/#m',
	
	                // eliminate multi-line comments in '/* ... */' form, at end of string
	                '#/\*(.+)\*/\s*$#m',
	        
	        		'#^\s*/\*(.+)\*/\s*$#ms',
	
	            ), array('','',''), $str);
	
	        // eliminate extraneous space
	        //echo trim($str);
	        return trim($str);
	    }
	    
	    /*
	    * 读取文件内容，返回trim后的string串
	    * @param    string  $filePath   文件路径（中间文件或ADOC文档）
	    * @return   string  $content    标准json串或字符串                 
	    * @access   public
	    */
	    function trim_string($filePath,$split = "")
	    {
	    	$fOpen = fopen($filePath,"r");
			$content = "";
			while(!feof($fOpen))
			{
				$line = fgets($fOpen);
				$line = trim($line);
				//todo 在key值添加双引号 便于被json_decode解析
			//	$line = $this->process_json($line);
				if(content != "")
				{
					$content = $content.$split.$line;		
				}
				else
				{
					$content = $line;
				}
			}   
			fclose($fOpen);
			return $content;
	    }
	    
	    /*
	     * 用于json标准化处理
	     * 1 key值添加双引号
	     * 2 value值如果是单引号变成双引号
	     * 输入 $line 一行数据
	     * 输出 $reStr 
	     */
	    function process_json($line)
	    {
	    	//source: {url:'#',name:'奇艺'}
	    	//{name:'词条/关系名',semanticName:'义项名', 
	    	$bInString = false;
	    	$strS = "";
	    	$strKey = "";
	    	$reStr = "";
	    	for($i=0;$i<strlen($line);$i++)
	    	{
	    		$oneChar = substr($line,$i,1);
	    		if($oneChar == "'")
	    		{
	    			$reStr = $reStr.'"';
	    		}
	    		else 
	    		{
	    			$reStr = $reStr.$oneChar;
	    		}
	    		
	    		if(!$bInString && ($oneChar == "'" || $oneChar == '"'))
	    		{
	    			$bInString = true;
	    			$strS = $oneChar;
	    			continue;
	    		}
	    		else if($bInString && $oneChar == $strS)
	    		{
	    			$bInString = false;
	    			$strS = "";
	    			continue;
	    		}
	    		
	    		if(!$bInString && $oneChar == ":" && trim($strKey) != "")
	    		{
	    			$reStr = substr($reStr,0,strlen($reStr)-strlen($strKey)-1);
	    			$reStr = $reStr.'"'.trim($strKey).'"'." :";
	    			$strKey = "";
	    		}
	    		if(!$bInString && ($oneChar == "," || $oneChar == "{"))
	    		{
	    			$strKey = "";
	    		}
	    		
	    		if(!$bInString && 
	    		   $oneChar != "'" &&
	    		   $oneChar != '"' &&
	    		   $oneChar != "{" &&
	    		   $oneChar != "}" &&
	    		   $oneChar != "," &&
	    		   $oneChar != "[" &&
	    		   $oneChar != "]" &&
	    		   $oneChar != "")
	    		   {
	    		   		$strKey = $strKey.$oneChar;
	    		   }
	    			
	    	}
	    	
	    	return  $reStr;
	    }
	    
	    /*
	     * 全半角转换函数
	     * 输入$str 
	     */
	 	function sbc2dbc($str)
		{               
        	$arrWordMap = array('！'=>'!', '＂'=>'"', '＃'=>'#', '￥'=>'$', '％'=>'%', '＆'=>'&', '＇'=>"'", '（'=>'(', '）'=>')', '＊'=>'*', '＋'=>'+', '，'=>',', '－'=>'-', '．'=>'.', '／'=>'/', '０'=>'0', '１'=>'1', '２'=>'2', '３'=>'3', '４'=>'4', '５'=>'5', '６'=>'6', '７'=>'7', '８'=>'8', '９'=>'9', '：'=>':', '；'=>';', '＜'=>'<', '＝'=>'=', '＞'=>'>', '？'=>'?', '＠'=>'@', 'Ａ'=>'A', 'Ｂ'=>'B', 'Ｃ'=>'C', 'Ｄ'=>'D', 'Ｅ'=>'E', 'Ｆ'=>'F', 'Ｇ'=>'G', 'Ｈ'=>'H', 'Ｉ'=>'I', 'Ｊ'=>'J', 'Ｋ'=>'K', 'Ｌ'=>'L', 'Ｍ'=>'M', 'Ｎ'=>'N', 'Ｏ'=>'O', 'Ｐ'=>'P',  'Ｑ'=>'Q', 'Ｒ'=>'R', 'Ｓ'=>'S', 'Ｔ'=>'T', 'Ｕ'=>'U', 'Ｖ'=>'V', 'Ｗ'=>'W', 'Ｘ'=>'X', 'Ｙ'=>'Y', 'Ｚ'=>'Z', '［'=>'[', '＼'=>'\\','］'=>']', '＾'=>'^', '＿'=>'_', '｀'=>'`', 'ａ'=>'a', 'ｂ'=>'b', 'ｃ'=>'c', 'ｄ'=>'d', 'ｅ'=>'e', 'ｆ'=>'f', 'ｇ'=>'g', 'ｈ'=>'h', 'ｉ'=>'i', 'ｊ'=>'j', 'ｋ'=>'k', 'ｌ'=>'l', 'ｍ'=>'m', 'ｎ'=>'n', 'ｏ'=>'o', 'ｐ'=>'p', 'ｑ'=>'q', 'ｒ'=>'r', 'ｓ'=>'s', 'ｔ'=>'t', 'ｕ'=>'u', 'ｖ'=>'v', 'ｗ'=>'w', 'ｘ'=>'x', 'ｙ'=>'y', 'ｚ'=>'z',  '｛'=>'{', '｜'=>'|', '｝'=>'}', '、'=>',', '。'=>'.', '∶'=>':','＄'=>'$'); 
			return strtr($str,$arrWordMap);
		}
	}

		
    
?>
