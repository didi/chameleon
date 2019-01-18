<?php

require_once(dirname(__FILE__).'/genArray.php');

/*
 * Created on 2012-4-6
 * Created by Guo Xubin.
 * 这个类用于解析adoc文件内容。
 */

 class AdocParser
 {

 	//从adoc解析出需要动态生成值的字段及其可选的值
 	public function getJsonNotes($adocFilePath)
 	{
 	//	$this->getInheritNewAdoc($jsonFileContent);
	//	$newAdocArray = $this->getNewAdocArray($jsonFileContent);
 		$newAdocArray = $this->getJsonInheritNewAdoc($adocFilePath);
 		//var_dump($newAdocArray);

		$posNote = array();
		$this->array_all("", $newAdocArray, "", $posNote);
		file_put_contents(Config::$strPath."/./tmp/PosNote.php", print_r($posNote, true));

 		//首先去掉无用的注释，无用的注释指非范围标识的注释
 	//	$adocAfterStep1 = preg_replace('/\/\/[\s]*[\((.*)\)/]', '', $jsonFileContent);
 	//	file_put_contents(dirname(__FILE__)."/./tmp/adocAfterStep1.php", $adocAfterStep1);
	//	return $arrPosNote;
		return $posNote;
 	}

  	public function getPhpNotes($adocFilePath)
 	{
 	//	$this->getInheritNewAdoc($jsonFileContent);
	//	$newAdocArray = $this->getNewAdocArray($jsonFileContent);
 		$newAdocArray = $this->getPhpInheritNewAdoc($adocFilePath);
 		//var_dump($newAdocArray);

		$posNote = array();
		$this->array_all("", $newAdocArray, "", $posNote);
		file_put_contents(Config::$strPath."/./tmp/PosNote.php", print_r($posNote, true));

 		//首先去掉无用的注释，无用的注释指非范围标识的注释
 	//	$adocAfterStep1 = preg_replace('/\/\/[\s]*[\((.*)\)/]', '', $jsonFileContent);
 	//	file_put_contents(dirname(__FILE__)."/./tmp/adocAfterStep1.php", $adocAfterStep1);
	//	return $arrPosNote;
		return $posNote;
 	}

 	//从adoc解析出需要动态生成值的字段及其可选的值




 //将注释"na=>me" => "network"中的双引号中的'=>'转变为"||ArRoW_In_StR||"
	public function changeArrowInNote($note)
	{
			$notelen = strlen($note);
		// $idxFront = strpos($note, '"') -1;
		// $idxRear = strpos($note, '"') + 1;
		 $i = 0;
		 $bInString = false;
		 while($i != $notelen)
		 {
			$oneChar = substr($note, $i, 1);
			$twoChar = substr($note, $i, 2);
			$frontChar = "";
			if($i > 1)
			{
				$frontChar = substr($note, $i - 1, 1);
			}
			//echo "oneChar: $oneChar, frontChar: $frontChar\n";
			if($oneChar == '"')
			{
				if(!$bInString)
				{
					$bInString = true;
				}
				else
				{
					$bInString = false;
				}
			}
			if($bInString && $twoChar == '=>')
			{
				$strFront = substr($note, 0, $i);
				$strRear = substr($note, ($i + 2));
				$note = $strFront."||ArRoW_In_StR||".$strRear;
				//echo "$note\n";
				$notelen = strlen($note);
			}
			$i ++;
		}
		//file_put_contents(dirname(__FILE__)."/./tmp/note.php", "NOTE: $note\n");
		return $note;
	}


 //将字符串中的"||ArRoW_In_StR||"变回"=>"
	function changeArrowBack($value)
	{
		$trans = array("||ArRoW_In_StR||" => "=>");
		$value = strtr($value, $trans);
		//file_put_contents(dirname(__FILE__)."/./tmp/note.php", "BACK: $value\n");
		return $value;
	}


 	//将注释//<"st,r1", "str2">中的双引号中的','转变为"||CoMmA_In_StR||"
	public function changeCommaInNote($note)
	{
		// $note = '//<"点,心1","饼干1">';
		 //echo "NOTE: $note\n";
		 $notelen = strlen($note);
		// $idxFront = strpos($note, '"') -1;
		// $idxRear = strpos($note, '"') + 1;
		 $i = 0;
		 $bInString = false;
		 while($i != $notelen)
		 {
			$oneChar = substr($note, $i, 1);
			$frontChar = "";
			if($i > 1)
			{
				$frontChar = substr($note, $i - 1, 1);
			}
			//echo "oneChar: $oneChar, frontChar: $frontChar\n";
			if($oneChar == '"' && $frontChar != '\\')
			{
				if(!$bInString)
				{
					$bInString = true;
				}
				else
				{
					$bInString = false;
				}
			}
			if($bInString && $oneChar == ',')
			{
				$strFront = substr($note, 0, $i);
				$strRear = substr($note, ($i + 1));
				$note = $strFront."||CoMmA_In_StR||".$strRear;
				//echo "$note\n";
				$notelen = strlen($note);
			}
			$i ++;
		}
		//file_put_contents(dirname(__FILE__)."/./tmp/note.php", "NOTE: $note\n");
		return $note;
	}

 	//由 修改后的adoc文档生成的数组$newAdocArray 生成范围数组
 	//$key 传入的element的key
 	//$arrSrc 传入的element的value
 	//$parentKey 传入的element的路径
 	//$posNote 记录用的数组
 	public function array_all($key, $arrSrc, $parentKey, &$posNote)
	{
		if (is_array($arrSrc))
		{
			if($parentKey == "")
			{
				$parentKey = $key;
			}
			else
			{
				$parentKey .= ",$key";
			}
			foreach($arrSrc as $k=>$v)
			{
				$this->array_all($k, $v, $parentKey, $posNote);
			}
		}
		else
		{
			$elementPath = "";
			$elementValue = "";
			$elementType = "";
			//获取$elementPath
			if($parentKey == "")
			{
				//echo "$key $arrSrc\n";
				//echo "$key\n";
				$elementPath = $key;
			}
			else
			{
				//echo "$parentKey,$key $arrSrc\n";
				//echo "$parentKey,$key\n";
				$elementPath = $parentKey.",".$key;
			}
			//获取$elementValue
			$elementValue = $arrSrc;
			$tmpValueStrArray = explode(":", $elementValue);
			$tmpValueStr = $tmpValueStrArray[0];
			$colonPos = strpos($elementValue, ":");
			if($tmpValueStr == "STRsHoUlDbE")
			{
			//	$elementValue = $tmpValueStrArray[1];
				$elementValue = substr($elementValue, $colonPos + 1);
				$elementType = "string";
			}
			else if($tmpValueStr == "INTsHoUlDbE")
			{
			//	$elementValue = $tmpValueStrArray[1];
				$elementValue = substr($elementValue, $colonPos + 1);
				$elementType = "int";
			}
			else if($tmpValueStr == "ArRaYrEpEaTe")
			{
				$elementPath = $this->popJsonPos($elementPath);
				//$elementPath = $this->popJsonPos($elementPath);

				$elementValue = substr($elementValue, $colonPos + 1);
				$elementValue = trim($elementValue);
				$elementValue = "/...".$elementValue;
				$elementType = "object";
			}
			else
			{
				$elementValue = $arrSrc;
			//	//var_dump($elementValue);
				//echo "NIMA!!!\n";
				if(is_int($elementValue))
				{
					$elementType = "int";
				}
				else if(is_string($elementValue))
				{
					$elementType = "string";
				}
				else if(is_bool($elementValue))
				{
					$elementType = "string";
				}
				else if(is_array($elementValue))
				{
					//echo "NIMEI???\n";
				}
				$elementValue = "";
			}
		//	//echo "posNote\n";
		//	//var_dump($posNote);
			//echo "key: $elementPath; value: $elementValue; type: $elementType\n";
			$elementArray = array();
			array_push($elementArray, $elementPath);
			array_push($elementArray, $elementValue);
			array_push($elementArray, $elementType);
			array_push($posNote, $elementArray);
		//	return $posNote;
		}

	}

 	//从adoc文件中解析出json部分。
 	public function getJsonBlock($adocPath)
 	{
 		$contant=$this->getDataBlock($adocPath,"main");
 		//echo "ctctctctct".$contant."END";
 		return  $contant;

 		//return $this->getDataBlock($adocPath,"main");
 	}

    public function getDefineBlock($adocPath){
 		$contant=$this->getDataBlock($adocPath,"define");
 		return  $contant;
    }

 	//从adoc中解析出url内容。
 	public function getUrlBlock($adocPath)
 	{

 		$contant=$this->getDataBlock($adocPath,"url");
 		//echo "ctctctctct".$contant."END";
 		return $contant;

 	}


 	//从adoc文件中解析出adoctype部分。
 	public function getAdocTypeBlock($adocPath)
 	{
 		$contant=$this->getDataBlock($adocPath,"adoctype");
 		//echo "contant:$contant\n";
 		return  $contant;

 		//return $this->getDataBlock($adocPath,"main");
 	}
 	//从adoc中解析出ref内容,即异步数据文件的相对路径。
 	public function getRefPathArr($adocPath)
 	{
 		$asyncPathString=$this->getDataBlock($adocPath,"ref");
 		return explode(",",$asyncPathString);
 	}

  	public function getParentAdocPath($adocPath)
 	{
 		//echo "getParentAdocPath\n";
		$content=$this->getDataBlock($adocPath,"parent");
		//echo "content:$content\n";
		return $content;
 	}

  	//从aodc中解析出addon内容，即模板组件的相对路径
 	public function getAddonArr($adocPath)
 	{
 		$addonString=$this->getDataBlock($adocPath,"addon");
 		//echo "addonString: ".$addonString."\n";
 		if($addonString == "")
 		{
	 		$addonString = trim($addonString);
 			return null;
 		}
 		return explode(",",$addonString);
 	}

 	/*
	 *由Adoc文档路径
	 *提取json和url串并返回
	 */
	private function getDataBlock($adocPath,$blockName)
	{
		$fOpen = fopen($adocPath,"r");

		$content = "";
		$isJsonStr = false;
		while(!feof($fOpen))
		{
			$line = fgets($fOpen);
			//echo $line."\n";
			if(preg_match('/^\s*\#\#\#\#'.$blockName.'$/',trim($line)))
			{
				$isJsonStr = true;
				continue;
			}
			else if(preg_match('/\#\#\#\#/i',trim($line)) && $isJsonStr)
			{
				break;
			}

			if(!$isJsonStr || (trim($line) == "") || (trim($line) == ":::javascript"))
			{
				continue;
			}
			else
			{
				if ($blockName=="main")
				{
					//we need the \n at the end of line.
					$content = $content.$line;
				}
				elseif ( $blockName=="url" )
				{
					$content = $content.trim($line);
				}
				elseif ( $blockName=="parent" )
				{
					$content = $content.trim($line);
				}
				elseif ($blockName=="ref")
				{
					$content = $content.trim($line).",";
				}
				elseif ($blockName == "addon")
				{
					$content = $content.trim($line).",";
				}
				elseif ($blockName=="define")
				{
					//we need the \n at the end of line.
					$content = $content.$line;
				}
				elseif ($blockName == "adoctype")
				{
					$content = $content.trim($line);
					//echo $content;
				}
			}
		}
		fclose($fOpen);
		//echo $content;
		return $content;
	}

	//拼接处json中的所有需要改值的key。
	private function pushJsonPos($arrPos,$key)
	{
		$inStr = "";//最终入串的字符串
		$reStr = "";
		//echo "push json pos function param: ".$key."  line:".__LINE__."<br />";
		if(substr($key,0,1) == "'" || substr($key,0,1) == '"')
		{
			//去掉引号
			$inStr = substr($key,1,strlen($key)-2);
			//echo $inStr."\n";
		}
		else
		{
			//不带引号的，直接添加。
			$inStr = $key;
		}
		if($arrPos != "")
		{
			$reStr = $arrPos.",".$inStr;
		}
		else
		{
			$reStr = $inStr;
		}
	//	//echo "push json pos function return: ".$reStr."<br />\n";
		return $reStr;
	}

	private function popJsonPos($arrPos)
	{
		//echo "before pop: ".$arrPos." line:".__LINE__."\n";
		$arr = explode(",",$arrPos);
		$reStr = "";

		if(is_array($arr))
		{
			//var_dump($arr);
			$tmpPop = array_pop($arr);
			//var_dump($tmpPop);
			if(is_int($tmpPop))
			{
				$this->strPop = $tmpPop;
				//echo "pop array no ".$this->strPop." line:".__LINE__;
			}
			$lastNum = count($arr) - 1;
			$arr[$lastNum] = $arr[$lastNum] - 1;

			for($i=0;$i<count($arr);$i++)
			{
				if($i != 0)
				{
					$reStr .= ",".$arr[$i];
				}
				else
				{
					$reStr = $arr[0];
				}
			}
		}
		else
		{
			$reStr = "";
		}
	//	//echo "after pop: ".$reStr." line:".__LINE__."\n";
		return $reStr;
	}

 	//拼接arrIndexQue。
	private function pushArrIndex($arrIndex,$key)
	{
		if($arrIndex == "") {
			$reStr = "".$key;
		} else {
			$reStr = $arrIndex.",".$key;
		}
	//	//echo "pushArrIndex return: ".$reStr."<br />\n";
		return $reStr;
	}

	private function popArrIndex($arrIndex)
	{
		//echo "before pop: ".$arrIndex." line:".__LINE__."\n";
		$arr = explode(",",$arrIndex);
		$reStr = "";

		if(is_array($arr))
		{
			$tmpPop = array_pop($arr);

			for($i=0;$i<count($arr);$i++)
			{
				if($i != 0)
				{
					$reStr .= ",".$arr[$i];
				}
				else
				{
					$reStr = $arr[0];
				}
			}
		}
		else
		{
		//	//echo "reStr = null!\n";
			$reStr = "";
		}
	//	//echo "popArrIndex return: " . $reStr . "\n";
		return $reStr;
	}

	private function getTopArrIndex($arrIndex)
	{
		$arr = explode(",",$arrIndex);
		$reStr = "";

		if(is_array($arr))
		{
			$reStr = array_pop($arr);
		}
		else
		{
			$reStr = "";
		}
	//	//echo "getTopArrIndex return: " . $reStr . "\n";
		return $reStr;
	}

	//对adoc文档进行处理，找到带有范围注释的可变元素，用范围替换可变元素的值。
	//然后去掉所有的注释，生成新的adoc文档。再将这个文档转化成php数组$newAdocArray
	//输入：$jsonFileContent adoc文档的main部分
	//返回：$newAdocArray
 	public function getJsonNewAdocArray($jsonFileContent)
 	{
 		$genArray = new genArray();
 		//CommonHelper::makeDir(dirname(__FILE__)."/./tmp");
 		CommonHelper::makeDir(Config::$strPath."/./tmp");

 		//将adoc文档另外存一个文件
 		file_put_contents(Config::$strPath."/./tmp/AdocFile2.php", $jsonFileContent);
 		//按行读入文件，匹配处理
 		$file_handle = fopen(Config::$strPath."/./tmp/AdocFile2.php", "r");
 		$newAdoc = "";
 		$commaMark = 0; // 后续用于判断是否要加逗号
		while (!feof($file_handle)) {
		   $line = fgets($file_handle);
		   $matchs = array();

		   // 判断是否要在...[]后加逗号
		   	if ($commaMark == 1)
		   	{
		   		$lineTem = $genArray->reduce_string($line);
		   		if ($lineTem != "") {
		   			$commaMark = 0;
		   			if ( substr($lineTem, 0, 1) != "]") {
						$newAdoc = trim($newAdoc);
						$newAdoc .= ",\n";
		   			}
		   		}
		   	}

		    //preg_match执行一个正则表达式匹配“枚举类型”
			if(preg_match('/\/\/[\s]*<(.*)>[\s]*/', $line, $matchs) || preg_match('/\/\/[\s]*\[(.*)\][\s]*/', $line, $matchs) || preg_match('/\/\/[\s]*\((.*)\)[\s]*/', $line, $matchs))
			{
				//echo $line;
				//获取范围注释内容
				$note = $matchs[0];
				//echo "note: $note\n";
				//将注释//<"st,r1", "str2">中的双引号中的','转变为"||CoMmA_In_StR||"
				$note = $this->changeCommaInNote($note);
				//echo "note: $note\n";


				//将$line中的"key":"value"的value用可选的值$strNote替换
				$line = $genArray->reduce_string($line);//删除所有注释
			//	$line = $genArray->trim_string($line);
				$lastSymbol = substr($line, -1);//
				//echo "lastSymbol: ".$lastSymbol."\n";
				$hasComos = false;
				if(',' == $lastSymbol)
				{
					$line = substr($line, 0, strlen($line)-1);
					$hasComos = true;
				}
				$line = "{".$line."}";
				//echo "line:".$line."\n";


				$lineArray = json_decode($line);
				//var_dump($lineArray);
				$key = "";
				$value = "";
				//var_dump($lineArray);
				foreach ($lineArray as $k => $v)
				{
					$key = $k;
					$value = $v;
				}
				//echo "type: ".gettype($value)."\n";


				//获取value要改成的字符串$strNote
				//获取$line中"key":"value"的value的类型，写入$strValueType
				$strValueType = gettype($value);
				if($strValueType != "string")
				{
					$strValueType = "int";
				}
				//echo "strValueType : $strValueType\n";
				//根据注释内容$note和类型$strValueType生成可选的值$strNote
				require_once(dirname(__FILE__).'/genValue.php');
				$genValue = new genValue($note,$strValueType);
				$strNote = $genValue->getValue($value);
				if($strValueType == "string")
				{
					$strNote = "STRsHoUlDbE:".$strNote;
				}
				else
				{
					$strNote = "INTsHoUlDbE:".$strNote;
				}
				//echo "note : $note\n";
                //echo "strNote : $strNote\n";


				$lineArray = array(urlencode($key) => urlencode($strNote));
				//var_dump($lineArray);
				$line = json_encode($lineArray);
				$line = urldecode($line);
				$line = substr($line, 1, strlen($line)-2);
				if($hasComos)
					$line .= ",";
				$line .= "\n";
				//echo "newline: $line";
			}
			//匹配//(messycode)

			if(preg_match('/\/\/\(messycode\)[\s]*$/', $line, $matchs))
			{
				//echo "55555555555555555555555555555555555\n";
				//echo $line;
				//获取注释内容
				$note = $matchs[0];
				//获取$line中"key":"value"的value的类型，写入$strValueType
				$strValueType = "string";
				//echo "$note\n";
				require_once(dirname(__FILE__).'/genValue.php');
				$genValue = new genValue($note,$strValueType);
				$value="";
				$strNote = $genValue->getValue($value);
				$strNote = "STRsHoUlDbE:".$strNote;


				//将$line中的"key":"value"的value用可选的值$strNote替换
				$line = $genArray->reduce_string($line);
			//	$line = $genArray->trim_string($line);
				$lastSymbol = substr($line, -1);
				$hasComos = false;
				if(',' == $lastSymbol)
				{
					$line = substr($line, 0, strlen($line)-1);
					$hasComos = true;
				}
				$line = "{".$line."}";
				$lineArray = json_decode($line);
				//var_dump($lineArray);
				$key = "";
				foreach ($lineArray as $k => $v)
				{
					$key = $k;
				}
				$lineArray = array(urlencode($key) => urlencode($strNote));
				//var_dump($lineArray);
				$line = json_encode($lineArray);
				$line = urldecode($line);
				$line = substr($line, 1, strlen($line)-2);
				if($hasComos)
					$line .= ",";
				$line .= "\n";
				//echo "newline: $line";
			}
		   	if(preg_match('/\/\/...\[(.*)\][\s]*$/', $line))
		   	{
		   		//echo $line;
		   		$line = trim($line);
		   		$line = substr($line, 5);
		   		$line = "{\"arrayRepeate\" :\"ArRaYrEpEaTe: $line\"}\n";
		   		$commaMark = 1; // 后续用于判断是否要加逗号
		   		//echo "newline: $line\n";
		   		//判断是否给上一行补","
		   		$newAdoc = trim($newAdoc);
		   		if (substr($newAdoc, -1) != ",") {
		   			$newAdoc .= ",\n";
		   		}else {
		   			$newAdoc .= "\n";
		   		}
		   	}
		  	$newAdoc .= $line;
		}
		fclose($file_handle);
	//	//echo "newAdoc: $newAdoc\n";
		//echo "\n\n\n\n\n\n\n\n";
		//错误，getArray()传入参数是路径
	//	$newAdocArray = $genArray->getArray($newAdoc);

		//读取json数据,并进行替换写回

		$fileStr = $genArray->reduce_string($newAdoc);
		$tmpPath = Config::$strPath."/./tmp/AdocAfterStep1.php";
		file_put_contents($tmpPath,$fileStr);

		//逐行trim decode 获得array
		$jsonStr = $genArray->trim_string($tmpPath);
		//$jsonStr = iconv("GBK","UTF-8",$jsonStr);
		//echo "encoding".mb_detect_encoding($jsonStr)."\n";
		//echo "before".$jsonStr;
        //echo "jsonStr: $jsonStr\n";
		$newAdocArray = json_decode($jsonStr,true);
        //print_r($newAdocArray);

		return $newAdocArray;
 	}


 public function getPhpNewAdocArray($jsonFileContent)
 	{
 		//echo "jsonFileContent:$jsonFileContent\n";
 		$genArray = new genArray();
 		//CommonHelper::makeDir(dirname(__FILE__)."/./tmp");
 		CommonHelper::makeDir(Config::$strPath."/./tmp");

 		//将adoc文档另外存一个文件
 		file_put_contents(Config::$strPath."/./tmp/AdocFile2.php", $jsonFileContent);
 		//按行读入文件，匹配处理
 		$file_handle = fopen(Config::$strPath."/./tmp/AdocFile2.php", "r");
 		$newAdoc = "";
 		$commaMark = 0; // 后续用于判断是否要加逗号
		while (!feof($file_handle)) {
		   $line = fgets($file_handle);
		   $matchs = array();

			// 判断是否要在...[]后加逗号
		   	if ($commaMark == 1)
		   	{
		   		$lineTem = $genArray->reduce_string($line);
		   		if ($lineTem != "") {
		   			$commaMark = 0;
		   			if ( substr($lineTem, 0, 1) != ")") {
						$newAdoc = trim($newAdoc);
						$newAdoc .= ",\n";
						//echo "a";
		   			}
		   		}
		   	}

		    //preg_match执行一个正则表达式匹配
			if(preg_match('/\/\/[\s]*<(.*)>[\s]*/', $line, $matchs) || preg_match('/\/\/[\s]*\[(.*)\][\s]*/', $line, $matchs))
			{
				//获取范围注释内容
				$note = $matchs[0];
				//echo "note: $note\n";
				//将注释//<"st,r1", "str2">中的双引号中的','转变为"||CoMmA_In_StR||"
				$note = $this->changeCommaInNote($note);
				//echo "note: $note\n";


				//将$line中的"key":"value"的value用可选的值$strNote替换
				$line = $genArray->reduce_string($line);//删除所有注释
				//echo $line;
				$lastSymbol = substr($line, -1);//
				//echo "lastSymbol: ".$lastSymbol."\n";
				$hasComos = false;
				if(',' == $lastSymbol)
				{
					$line = substr($line, 0, strlen($line)-1);
					$hasComos = true;
				}

				$line=$this->changeArrowInNote($line);
				//var_dump($line);
				$lineArray = explode(" => ", $line);

				//将字符串中的"||ArRoW_In_StR||"变回"=>"
				$lineArray[0]=$this->changeArrowBack($lineArray[0]);
				$lineArray[1]=$this->changeArrowBack($lineArray[1]);
				//var_dump($lineArray);


				//----------change by xumeng02----------------
				if('"'==substr($lineArray[1],0,1)) {
					$strValueType="string";
					$value = substr($lineArray[1],1,strlen($lineArray[1])-2);
					//var_dump($value);
				}else {
					$strValueType = "int";
					$value = intval($lineArray[1]);
				}
				//--end-----change by xumeng02----------------

				//echo "strValueType : $strValueType\n";
				//根据注释内容$note和类型$strValueType生成可选的值$strNote
				require_once(dirname(__FILE__).'/genValue.php');
				$genValue = new genValue($note,$strValueType);
				$strNote = $genValue->getValue($value);
				if($strValueType == "string")
				{
					$strNote = "STRsHoUlDbE:".$strNote;
				}
				else
				{
					$strNote = "INTsHoUlDbE:".$strNote;
				}

				$line=$lineArray[0]."=>\"".$strNote."\"";
				//echo "newline:".$line."\n";

				if($hasComos)
					$line .= ",";
				$line .= "\n";
			}
			//匹配//(messycode)
			if(preg_match('/\/\/\(messycode\)[\s]*$/', $line, $matchs))
			{
				//获取注释内容
				$note = $matchs[0];
				//获取$line中"key":"value"的value的类型，写入$strValueType
				$strValueType = "string";
				//echo "$note\n";
				require_once(dirname(__FILE__).'/genValue.php');
				$genValue = new genValue($note,$strValueType);
				$value = "";
				$strNote = $genValue->getValue($value);
				$strNote = "STRsHoUlDbE:".$strNote;


				//将$line中的"key":"value"的value用可选的值$strNote替换
				$line = $genArray->reduce_string($line);
				$lastSymbol = substr($line, -1);
				$hasComos = false;
				if(',' == $lastSymbol)
				{
					$line = substr($line, 0, strlen($line)-1);
					$hasComos = true;
				}

				$line=$this->changeArrowInNote($line);

				$lineArray=explode(" => ", $line);

				$lineArray[0]=$this->changeArrowBack($lineArray[0]);
				$lineArray[1]=$this->changeArrowBack($lineArray[1]);

				$line=$lineArray[0]." => \"".$strNote."\"";
				//$line = urldecode($line);


				if($hasComos)
					$line .= ",";
				$line .= "\n";
				//echo "newline: $line";
			}
		   	if(preg_match('/\/\/...\[(.*)\][\s]*$/', $line))
		   	{
		   		//echo $line;

		   		$line = trim($line);
		   		$line = substr($line, 5);
		   		$commaMark = 1;

		   		//判断范围注释前是否有逗号，如果没有，加上逗号
		   		$comos_test = substr(trim($newAdoc),-1,1);
		   		if($comos_test != ",")
		   			$newAdoc=trim($newAdoc).","."\n";
		   		$line = "array(\n\"arrayRepeate\" => \"ArRaYrEpEaTe: $line\")\n";
		   	}

		  	$newAdoc .= $line;
		  	//echo $newAdoc;


		}
		fclose($file_handle);


		//读取json数据,并进行替换写回

		$fileStr = $genArray->reduce_string($newAdoc);
		//echo "fileStr:$fileStr\n";
		$tmpPath = Config::$strPath."/./tmp/AdocAfterStep1.php";
		file_put_contents($tmpPath,$fileStr);

		eval($newAdoc);
		//print_r($newAdocArray);

		return $newAdocArray;
 	}

 	public function getJsonInheritNewAdoc($adocFilePath)
	{
		$jsonFileContent = $this->getJsonBlock($adocFilePath);//得到main中的json数据块
		//echo $jsonFileContent;
		//获取  父adoc的内容，传入参数是  子adoc的本地地址;如果没有父adoc则返回""
		$parentContent = $this->getParentContent($adocFilePath);
		if($parentContent == "")
		{
			$inheritNewAdoc = $this->getJsonNewAdocArray($jsonFileContent);
		}
		else
		{
			file_put_contents(Config::$strPath."/./Parent.php", $parentContent);
			$parentJson = $this->getJsonBlock(Config::$strPath."/./Parent.php");
			//echo "parentJson:\n".$parentJson."\n";
			$parentNewAdocArray = $this->getJsonNewAdocArray($parentJson);
			//echo "\n\n\nparentNewAdocArray:\n";
			//var_dump($parentNewAdocArray);
			file_put_contents(Config::$strPath."/./tmp/ParentNewAdocArray.php",print_r($parentNewAdocArray,true));

			//echo "childJson:\n$jsonFileContent\n";
			$childNewAdocArray = $this->getJsonNewAdocArray($jsonFileContent);
			//echo "\n\n\nchildNewAdocArray:\n";
			//var_dump($childNewAdocArray);
			file_put_contents(Config::$strPath."/./tmp/ChildNewAdocArray.php",print_r($childNewAdocArray,true));
			$inheritNewAdoc = $this->getInheritResult($parentNewAdocArray, $childNewAdocArray);
			file_put_contents(Config::$strPath."/./tmp/InheritNewAdoc.php",print_r($inheritNewAdoc,true));
		}

		return $inheritNewAdoc;
	}
 public function getPhpInheritNewAdoc($adocFilePath)
	{
		$jsonFileContent = $this->getJsonBlock($adocFilePath);//得到main中的json数据块
		//echo $jsonFileContent;

		//获取  父adoc的内容，传入参数是  子adoc的本地地址;如果没有父adoc则返回""
		$parentContent = $this->getParentContent($adocFilePath);
		//echo "parentContent:$parentContent\n";
		if($parentContent == "")
		{
			$inheritNewAdoc = $this->getPhpNewAdocArray($jsonFileContent);
		}
		else
		{
			file_put_contents(Config::$strPath."/./Parent.php", $parentContent);
			$parentJson = $this->getJsonBlock(Config::$strPath."/./Parent.php");
			//echo "parentJson:\n".$parentJson."\n";
			$parentNewAdocArray = $this->getPhpNewAdocArray($parentJson);
			//echo "\n\n\nparentNewAdocArray:\n";
			//var_dump($parentNewAdocArray);
			file_put_contents(Config::$strPath."/./tmp/ParentNewAdocArray.php",print_r($parentNewAdocArray,true));

			//echo "childJson:\n$jsonFileContent\n";
			$childNewAdocArray = $this->getPhpNewAdocArray($jsonFileContent);
			//echo "\n\n\nchildNewAdocArray:\n";
			//var_dump($childNewAdocArray);
			file_put_contents(Config::$strPath."/./tmp/ChildNewAdocArray.php",print_r($childNewAdocArray,true));

			$inheritNewAdoc = $this->getInheritResult($parentNewAdocArray, $childNewAdocArray);
			file_put_contents(Config::$strPath."/./tmp/InheritNewAdoc.php",print_r($inheritNewAdoc,true));
		}
		//echo $inheritNewAdoc;
		return $inheritNewAdoc;
	}

	public function getInheritResult($parentNewAdocArray, $childNewAdocArray)
	{
		$inheritResult = $parentNewAdocArray;
		//遍历$childNewAdocArray，当
		foreach ($childNewAdocArray as $childKey => $childValue)
		{
			//echo "childKey: $childKey\n";
		//	$inheritResult[$childKey] = $childValue;	//替换已有内容，或添加没有的内容
			if(array_key_exists($childKey, $inheritResult))
			{
				//echo "Exists, ";
				if(is_array($childValue))
				{
					//echo "but is array!\n";
					$inheritResult[$childKey] = $this->getInheritResult($inheritResult[$childKey], $childValue);
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

	//获取  父adoc的内容，传入参数是  子adoc的本地地址
	//如果没有父adoc则返回""
	public function getParentContent($adocFilePath)
	{
		$parentAdocPath = $this->getParentAdocPath($adocFilePath);
		//echo "parentAdocPath:$parentAdocPath\n";
		//var_dump($parentAdocPath);
		if(trim($parentAdocPath) == "")
		{
			return "";
		}
		//echo "asyncBasePath: ".Config::$asyncBasePath."\n";
		$parentAdocPath = Config::$asyncBasePath.trim($parentAdocPath).".text";
		//echo $parentAdocPath;
		$parentContent = file_get_contents($parentAdocPath);
		//echo "parentContent: ".$parentContent."\n";
		return $parentContent;
	}
 }

?>
