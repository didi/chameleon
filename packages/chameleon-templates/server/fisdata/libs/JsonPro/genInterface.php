<?php
require_once(dirname(__FILE__).'/adocParser.php');
require_once(dirname(__FILE__).'/genCase.php');
require_once(dirname(__FILE__).'/genFile.php');
require_once(dirname(__FILE__).'/genLog.php');
require_once(dirname(__FILE__).'/genConf.php');
require_once(dirname(__FILE__).'/CommonHelper.php');

class genInterface
{
	private $parser=null;
	private $tmpDataPath = "";
	public function __construct()
	{
		$this->parser = new AdocParser();
		Json_Log::init();
	//	$this->tmpDataPath = dirname(__FILE__)."/tmp/";
		$this->tmpDataPath = WWW_ROOT ."/tmp/data/";
		CommonHelper::makeDir($this->tmpDataPath);

		//如果没有通过setPath方法设置存放路径的话，默认的case存放路径
	//	Config::$strPath = dirname(__FILE__)."/data/";
		Config::$strPath = WWW_ROOT ."/test/data/";
		if(substr(Config::$strPath,-1)!="/")
		{
			Config::$strPath.="/";//保证最后一个字符是"/",以免拼接路径出错
		}
		CommonHelper::makeDir(Config::$strPath);
		CommonHelper::makeDir(Config::$strPath."/./tmp");
	}

	/*
	 * 输入$strAdoc 输入是adoc文档内容
	 * 输出 生成指定文件
	 */

	public function genCaseData($adocFileContent,$asyncBasePath="")
	{
		Config::$asyncBasePath = $asyncBasePath;
		//echo  Config::$asyncBasePath."\n";
		if($adocFileContent==null) return false;
		$adocFilePath = $this->tmpDataPath.'adocFile.php';
		//echo $adocFileContent;
		//echo $adocFilePath;
		file_put_contents($adocFilePath,$adocFileContent);//将用户传过来的content保存到本地
		$adocType=$this->parser->getAdocTypeBlock($adocFilePath);

		$adocType=strtolower($adocType);
		//echo $adocType."\n";
		if($adocType=="json")
			$this->genJsonCaseData($adocFileContent,$asyncBasePath);
		else if($adocType=="php")
			$this->genPhpCaseData($adocFileContent,$asyncBasePath);

	}
	public function genJsonCaseData($adocFileContent,$asyncBasePath)
	{
		if($adocFileContent==null) return false;
		//echo $this->tmpDataPath."\n";
		$adocFilePath = $this->tmpDataPath.'AdocFile.php';
		//echo $adocFileContent;
		//echo $adocFilePath;
		file_put_contents($adocFilePath,$adocFileContent);//将用户传过来的content保存到本地

		$localAdocPathArr=array();//存放本地adoc文件路径的数组
		//先生成同步数据case及其飘红数据，和addon数据以及飘红数据
		$mainFisFileName = $this->translateJsonAdocToCase($adocFilePath);
		//echo $mainFisFileName;
		//保存同步数据和异步数据的关联关系
		$caseRelationArray=array();
		$caseRelationArray[$mainFisFileName]=array();

		//获取异步adoc数据的本地路径数组
		$asyncPathArr=$this->parser->getRefPathArr($adocFilePath);
		//var_dump($asyncPathArr);
		$asyncLocalAdocPathArr=$this->getAsyncLocalAdocPaths($asyncPathArr,$asyncBasePath);
		//var_dump($asyncLocalAdocPathArr);
		//逐个生成异步数据case

		foreach ( $asyncLocalAdocPathArr as $asynUrl=>$asynAdocPath )
		{
			//echo "dealing:".$asynAdocPath."<br />";
       		$asynFisFileName = $this->translateJsonAdocToCase($asynAdocPath);
       		$caseRelationArray[$mainFisFileName][$asynUrl]=$asynFisFileName;
		}
	//	var_dump($caseRelationArray);

		if(count($caseRelationArray[$mainFisFileName])>0)
		{
			$this->saveAsyncFileNames($caseRelationArray,$mainFisFileName);
			$this->saveHtmlAsyncFileNames($caseRelationArray,$mainFisFileName);
		}
		return true;
	}
public function genPhpCaseData($adocFileContent,$asyncBasePath)
	{
		//echo  Config::$asyncBasePath."\n";
		if($adocFileContent==null) return false;

		$adocFilePath = $this->tmpDataPath.'AdocFile.php';


		//echo $adocFilePath;
		file_put_contents($adocFilePath,$adocFileContent);//将用户传过来的content保存到本地
		//echo $adocFileContent;
		$localAdocPathArr=array();//存放本地adoc文件路径的数组
		//先生成同步数据case
		$mainFisFileName = $this->translatePhpAdocToCase($adocFilePath);
		//echo $mainFisFileName;
		//保存同步数据和异步数据的关联关系
		$caseRelationArray=array();
		$caseRelationArray[$mainFisFileName]=array();

		//获取异步adoc数据的本地路径数组
		$asyncPathArr=$this->parser->getRefPathArr($adocFilePath);
		//var_dump($asyncPathArr);
		$asyncLocalAdocPathArr=$this->getAsyncLocalAdocPaths($asyncPathArr,$asyncBasePath);
		//echo "1243124132413245213432\n";
		//var_dump($asyncLocalAdocPathArr);
		//逐个生成异步数据case

		foreach ( $asyncLocalAdocPathArr as $asynUrl=>$asynAdocPath )
		{
			//echo "dealing:".$asynAdocPath."<br />";
       		$asynFisFileName = $this->translatePhpAdocToCase($asynAdocPath);
       		//echo "dealing:".$asynAdocPath."<br />";
       		$caseRelationArray[$mainFisFileName][$asynUrl]=$asynFisFileName;
		}
	//	var_dump($caseRelationArray);

		if(count($caseRelationArray[$mainFisFileName])>0)
		{
			$this->saveAsyncFileNames($caseRelationArray,$mainFisFileName);
			$this->saveHtmlAsyncFileNames($caseRelationArray,$mainFisFileName);
		}

		return true;
	}

	//保存同步case所对应的异步数据文件名到文件中，以备后续使用。
	//文件命名方式为同步数据文件名_async.php.如user.php对用的异步数据关系文件名为user_async.php。
	//
	private function saveAsyncFileNames($caseRelationArray,$mainFisFileName)
	{
		if($caseRelationArray==null or $mainFisFileName==null)
		{
			return null;
		}
		//echo "main fis file name=".$mainFisFileName."<br />";

		$pathArr=explode("/",$mainFisFileName);
		$fileName=end($pathArr);//取出最后一个元素
		//echo "file name=".$fileName."<br />";

		//拼接处新的文件名
		$newFileName=substr($fileName,0,-4)."_async.php";
		$caseRelationFile=Config::$strPath.$newFileName;

		$asyncNameStr = "";
		foreach ( $caseRelationArray[$mainFisFileName] as $url=>$name )
		{
			$name = end(explode("/",$name));//单纯出去文件名，不带路径
   			$asyncNameStr.=$url."=".$name."\n";//home/demo=demo.php的形式
		}
		file_put_contents($caseRelationFile,$asyncNameStr);
	}

	//保存Html版本同步case所对应的异步数据文件名到文件中，以备后续使用。
	//文件命名方式为同步数据文件名_async.php.如user.php对用的异步数据关系文件名为user_async.php。
	//
	private function saveHtmlAsyncFileNames($caseRelationArray,$mainFisFileName)
	{
		if($caseRelationArray==null or $mainFisFileName==null)
		{
			return null;
		}
		//echo "main fis file name=".$mainFisFileName."<br />";

		$pathArr=explode("/",$mainFisFileName);
		$fileName=end($pathArr);//取出最后一个元素
		//echo "file name=".$fileName."<br />";

		//拼接处新的文件名
		$newFileName=substr($fileName,0,-4)."_asyncHtml.php";
		$caseRelationFile=Config::$strPath.$newFileName;

		$asyncNameStr = "";
		foreach ( $caseRelationArray[$mainFisFileName] as $url=>$name )
		{
			$name = end(explode("/",$name));//单纯出去文件名，不带路径
			$nameArr = explode(".",$name);
			$name = $nameArr[0]."Html.".$nameArr[1];
   			$asyncNameStr.=$url."=".$name."\n";//home/demo=demo.php的形式
		}
		file_put_contents($caseRelationFile,$asyncNameStr);
		//echo "asyncNameStr: $asyncNameStr\n";
	}

	//将所有待转化的adoc文档内容存储到本地，并且返回这些本地adoc文档的文件路径
	private function getAsyncLocalAdocPaths($asyncPathArr,$asyncBasePath="")
	{
		$localAdocPathArr=array();
		//echo "asyncBasePath:$asyncBasePath\n\n\n";
		$fileIndex=0;
		foreach ( $asyncPathArr as $path )
		{
			if(trim($path)=="") continue;
			$fullAsyncPath=$asyncBasePath.$path.".text";
			//echo "before exist check:".$fullAsyncPath."<br />";

			//如果远端异步数据文件不存在，则跳过它，不转化
			if($this->url_file_exists($fullAsyncPath)===false) continue;
			//echo "lalalal\n\n\n";
			$tempDocFile=$this->tmpDataPath.$fileIndex.".php";//异步数据本地临时文件名
			$tmpContent = file_get_contents($fullAsyncPath);//读取远端数据
			file_put_contents($tempDocFile,$tmpContent);//写入本地文件
			if(file_exists($tempDocFile))
			{
				//写成功，一个新的本地adoc文档，加入待转化数组
				$localAdocPathArr[$path]=$tempDocFile;
			}
			$fileIndex+=1;
		}
		return $localAdocPathArr;
	}

	//将指定路径下的adoc文档转换成case。
	private function translatePhpAdocToCase($phpAdocFilePath)
	{
		//echo "translatePhpAdocToCase\n";
		//先取出adoc中的json数据
 		$jsonFileContent = $this->parser->getJsonBlock($phpAdocFilePath);

 		//echo $adocFilePath."=====".$jsonFileContent."<br />";
 		if (trim($jsonFileContent)=="" or $jsonFileContent==null)
 		{
 			return false;
 		}

 		//将解析出的json内容单独存放到临时文件中
		$jsonFilePath = $this->tmpDataPath."File.php";
		//echo "jsonFilePath:$jsonFilePath\n";
		file_put_contents($jsonFilePath,$jsonFileContent);
		//解析json中需要变动的字段值
	//	$arrPosNote=$this->parser->getNotes($jsonFileContent);
		$arrPhpPosNote=$this->parser->getPhpNotes($phpAdocFilePath);
		//var_dump($arrPhpPosNote);
		if($arrPhpPosNote==null or trim($arrPhpPosNote)=="")
		{
			return false;
		}
		file_put_contents(Config::$strPath."/./tmp/PosNote.php",print_r($arrPhpPosNote,true));
	//	//echo "arrPosNote: ";
	//	var_dump($arrPosNote);

		//调用array生成类 genArray 生成php array
		$genArray = new genArray();
	//	$standJosn = $genArray->getArray($jsonFilePath);#这是一个得到的标准数组
		$standJosn = $genArray->getPhpInheritStandArray($jsonFilePath, $phpAdocFilePath);#这是一个得到的标准数组
		//var_dump($standJosn);
		if($standJosn == null) {
			//	//echo "\n standJosn is null!\n";
		}

		//调用case组织类 genCase 原则是 case数=max(接口可能值)
		//返回的是一个大的数组 $arr[0] 为case0以此类推
		$genCase = new genCase($standJosn,$arrPhpPosNote);
		$arrFinalCase = $genCase->getCase();//最终所有case均保存在该数组中
		//var_dump($arrFinalCase);
		$arrFinalHtmlCase = $genCase->getHtmlCase($arrFinalCase);//最终所有Html case均保存在该数组中

		$arrFinalCase = $this->adjustCaseOrder($arrFinalCase);
//		$substr="imageIndexNumber";
//		$index=0;
//		$i = 0;
//		$genCase->dfs($arrFinalCase,$substr,$index,0,$i);
		file_put_contents(Config::$strPath."/./tmp/ArrFinalCase.php",print_r($arrFinalCase,true));

		$arrFinalHtmlCase = $this->adjustCaseOrder($arrFinalHtmlCase);
//		$i = 0;
//		$genCase->dfs($arrFinalHtmlCase,$substr,$index,0,$i);
		file_put_contents(Config::$strPath."/./tmp/ArrFinalHtmlCase.php",print_r($arrFinalHtmlCase,true));

		//调用文件生成类 用于FIS、百科、其他产品线文件调用
		//该内容可以从配置文件中读,保存adoc中所写的url
		$fileUrl=$this->parser->getUrlBlock($phpAdocFilePath);
		//将case信息生成为文件
		$genFile = new genFile($arrFinalCase);
		//$genFile->getFile();
		$fisFileName=$genFile->getFISFile($fileUrl);
		//echo "fisFileName:$fisFileName\n";

		$genHtmlFile = new genFile($arrFinalHtmlCase);
		$tmpArrFinalHtmlCase = $arrFinalHtmlCase; //保存记录$arrFinalHtmlCase
		$genHtmlFile->getFISHtmlFile($fileUrl); //产生html case的文件///////////////////////////////////////

		//add by zs 解析addon数据获取数组
		$addonArr = $this->parser->getAddonArr($phpAdocFilePath);
		//var_dump($addonArr);
		if($addonArr != null)
		{
			foreach($addonArr as $addonPath)
			{
				//todo change widget file name
				if(trim($addonPath) != "")
				{
					$addonPath = "/widget".$addonPath;
					$genFile->getFISFile($addonPath);
					$genAddFromHtmlFile = new genFile($tmpArrFinalHtmlCase);
					$genAddFromHtmlFile->getFISHtmlFile($addonPath);
				}
			}
		}
		return $fisFileName;//暫時返回生成的case文件全路径。
	}


private function translateJsonAdocToCase($jsonAdocFilePath)
	{
		//先取出adoc中的json数据
 		$jsonFileContent = $this->parser->getJsonBlock($jsonAdocFilePath);

 		//echo $adocFilePath."=====".$jsonFileContent."<br />";
 		if (trim($jsonFileContent)=="" or $jsonFileContent==null)
 		{
 			return false;
 		}

 		//将解析出的json内容单独存放到临时文件中
		$jsonFilePath = $this->tmpDataPath."File.php";
		file_put_contents($jsonFilePath,$jsonFileContent);

		//解析json中需要变动的字段值
	//	$arrPosNote=$this->parser->getNotes($jsonFileContent);
		$arrJsonPosNote=$this->parser->getJsonNotes($jsonAdocFilePath);
		if($arrJsonPosNote==null or empty($arrJsonPosNote))
		{
			return false;
		}
		file_put_contents(Config::$strPath."/./tmp/PosNote.php",print_r($arrJsonPosNote,true));
	//	//echo "arrPosNote: ";
        //var_dump($arrJsonPosNote);

		//调用array生成类 genArray 生成php array
		$genArray = new genArray();
	//	$standJosn = $genArray->getArray($jsonFilePath);#这是一个得到的标准数组
		$standJosn = $genArray->getjsonInheritStandArray($jsonFilePath, $jsonAdocFilePath);#这是一个得到的标准数组
		if($standJosn == null) {
			//	//echo "\n standJosn is null!\n";
		}

		//调用case组织类 genCase 原则是 case数=max(接口可能值)
		//返回的是一个大的数组 $arr[0] 为case0以此类推
		$genCase = new genCase($standJosn,$arrJsonPosNote);
		$arrFinalCase = $genCase->getCase();//最终所有case均保存在该数组中

        //define start
        $defineContent = $this->parser->getDefineBlock($jsonAdocFilePath);
         if(!empty($jsonFileContent) && trim($defineContent)!=""){
            $defineFilePath = $this->tmpDataPath."define.php";
            file_put_contents($defineFilePath,$defineContent);
            $defineArr = $this->parser->getJsonNewAdocArray($defineContent);

            if(!function_exists('_define_replace')){
                function _define_replace($str, $map, $case){
                    $tmp = array();
                    if(preg_match_all("/\[(.+?)\]/", $str, $tmp)){
                        $params = $tmp[1];
                        foreach($params as $v){
                            // search case vars
                            $case_params = array();
                            if(preg_match_all("/#(.+?)#/", $v, $case_params)){
                                $case_tmp = $case;
                                foreach($case_params[1] as $vv){
                                    if(isset($case_tmp[$vv])) $case_tmp = $case_tmp[$vv];
                                    else return '$' . $str . '$';
                                }
                                $v = $case_tmp;
                            }
                            // search case vars end
                            if(isset($map[$v])) $map = $map[$v];
                            else return '$' . $str . '$';
                        }
                        return $map;
                    }
                    return '$' . $str . '$';
                }
            }

            if(!function_exists('_define_replace_deep')){
                function _define_replace_deep(&$arr, &$map, &$case){
                    foreach($arr as &$v){
                        if(is_string($v)){
                            $ret = array();
                            if(preg_match_all('/\$([^$]*?)\$/', $v, $ret)){
                                foreach($ret[1] as $k => $var){
                                    $ttt = _define_replace($var, $map, $case);
                                    if(is_string($ttt) || is_numeric($ttt))
                                        $v = str_replace($ret[0][$k], $ttt, $v);
                                    else
                                        $v = $ttt;
                                }
                            }
                        }elseif(is_array($v)){
                            _define_replace_deep($v, $map, $case);
                        }
                    }
                }
            }
        }
        //define end
        //var_dump($arrFinalCase);

		$arrFinalHtmlCase = $genCase->getHtmlCase($arrFinalCase);//最终所有Html case均保存在该数组中
        if(!empty($jsonFileContent) && trim($defineContent)!=""){
            foreach($arrFinalCase as &$v){
                _define_replace_deep($v, $defineArr, $v);
            }
            foreach($arrFinalHtmlCase as $k=>&$v){
                _define_replace_deep($v, $defineArr, $arrFinalCase[$k]);
            }
        }
        //var_dump($arrFinalCase);
		//var_dump($arrFinalHtmlCase);
        //exit();
		$arrFinalCase = $this->adjustCaseOrder($arrFinalCase);
		//var_dump($arrFinalCase);
//		$substr="imageIndexNumber";
//		$index=0;
//		$i=0;
//		//var_dump($arrFinalCase[0]);
//		$genCase->dfs($arrFinalCase,$substr,$index,0,$i);
		file_put_contents(Config::$strPath."/./tmp/ArrFinalCase.php",print_r($arrFinalCase,true));
//		$i=0;
		$arrFinalHtmlCase = $this->adjustCaseOrder($arrFinalHtmlCase);
//		$genCase->dfs($arrFinalHtmlCase,$substr,$index,0,$i);
		//var_dump($arrFinalHtmlCase);
		file_put_contents(Config::$strPath."/./tmp/ArrFinalHtmlCase.php",print_r($arrFinalHtmlCase,true));

		//调用文件生成类 用于FIS、百科、其他产品线文件调用
		//该内容可以从配置文件中读,保存adoc中所写的url
		$fileUrl=$this->parser->getUrlBlock($jsonAdocFilePath);
		//将case信息生成为文件
		$genFile = new genFile($arrFinalCase);
		//$genFile->getFile();
		$fisFileName=$genFile->getFISFile($fileUrl);

		$genHtmlFile = new genFile($arrFinalHtmlCase);
		$tmpArrFinalHtmlCase = $arrFinalHtmlCase; //保存记录$arrFinalHtmlCase
		$genHtmlFile->getFISHtmlFile($fileUrl); //产生html case的文件///////////////////////////////////////

		//add by zs 解析addon数据获取数组
		$addonArr = $this->parser->getAddonArr($jsonAdocFilePath);
		//var_dump($addonArr);
		if($addonArr != null)
		{
			foreach($addonArr as $addonPath)
			{
				//todo change widget file name
				if(trim($addonPath) != "")
				{
					$addonPath = "/widget".$addonPath;
					$genFile->getFISFile($addonPath);
					$genAddFromHtmlFile = new genFile($tmpArrFinalHtmlCase);
					$genAddFromHtmlFile->getFISHtmlFile($addonPath);
				}
			}
		}
		return $fisFileName;//暫時返回生成的case文件全路径。
	}


	//判断一个url格式的文件是否存在，如http://fe.baidu.com/data/demo/list.text
	private function url_file_exists($url)
	{
	    $url = trim($url);
	    if(substr($url,0,7)=="http://")
	    {
		    $http_headers = @get_headers($url,1);
		    $exist_stat = "200";
		    $string_pieces = explode(" ",$http_headers[0]);
		    for ($i = 0; $i < count($string_pieces);$i++)
		    {
				if (strcmp($exist_stat,$string_pieces[$i]) == 0)
				{
				    return true;
				}
		    }
		    return false;
	    }
	    else
	    {
	    	$contents=file_get_contents($url);
	    	//echo "contents:$contents\n\n\n";
	    	if($contents=="")
	    		return false;
	    	else
	    		return true;
	    }
	}

	/*
	 * 輸入url
	 * 輸出返回 文件內容
	 */
	public function getCaseData($url = "")
	{
		if($url==null or $url == "")
		{
			return array();
		}

		$localFilePath=$this->getLocalFilePath($url);
		//echo "localFilePath: $localFilePath\n";

		$resultArray=array();//返回值数组
		//读取同步case中的数据并放入返回值数组中。
		//echo Config::$strPath."\n";
		$mainFileName = Config::$strPath.$localFilePath.".php";
		//echo $mainFileName."\n";
		$mainCaseContent = file_get_contents($mainFileName);
		//将异步数据文件名放入返回值数组中。
		$resultArray[]=$mainCaseContent;
		$resultArray[]=$this->getAsyncFileArray($localFilePath);
		//var_dump($resultArray);

		return $resultArray;
	}

	/*
	 * 輸入url
	 * 輸出返回 Html文件內容
	 */
	public function getHtmlCaseData($url = "")
	{
		if($url==null or $url == "")
		{
			return array();
		}
		$localFilePath=$this->getLocalFilePath($url);
		//echo "localFilePath:$localFilePath\n";
		//读取同步case中的数据并放入返回值数组中。
		$mainFileName = Config::$strPath.$localFilePath."Html.php";
		//echo $mainFileName."\n";
		$htmlCaseContent = file_get_contents($mainFileName);
		//echo $htmlCaseContent;
		//将异步数据文件名放入返回值数组中。
		$resultArray[] = $htmlCaseContent;
		$resultArray[] = $this->getHtmlAsyncFileArray($localFilePath);
	//	var_dump($resultArray);

		return $resultArray;
	}

	//将用户输入的url转换成本地文件名，如用户输入的是/user/tim,那么本地存储tim数据的文件名为./data/user_tim.php.
	private function getLocalFilePath($url)
	{
		$arrTmp = explode("/",$url);
		$path = "";
		foreach ($arrTmp as $key)
		{
			if(trim($key) == "")
			{
				continue;
			}

			if($path != "")
			{
				$path .= "_".$key;
			}
			else
			{
				$path .= $key;
			}

		}
		return $path;
	}

	//获取同步数据所对应的异步文件的文件路径
	private function getAsyncFileArray($dataPath)
	{
		$asyncFileName=Config::$strPath.$dataPath."_async.php";
	//	//echo "11222222222222222222223333333333333\n";
	//	//echo "asyncFileName: $asyncFileName\n";
		$asyncFilesArr=array();
		if(file_exists($asyncFileName))
		{
			$asyncFile = fopen($asyncFileName, "r");
			while(!feof($asyncFile))
  			{
				$line = fgets($asyncFile);
				if($line!=null and trim($line)!="")
				{
					$url_path_array=explode("=",$line);
					$url = $url_path_array[0];
					$path = $url_path_array[1];
					$asyncFilesArr[$url]=Config::$strPath.$path;
				}
			}
			fclose($asyncFile);
		}
	//	var_dump($asyncFilesArr);
		return $asyncFilesArr;
	}

	//获取Html版本同步数据所对应的异步文件的文件路径
	private function getHtmlAsyncFileArray($dataPath)
	{
		$asyncFileName=Config::$strPath.$dataPath."_asyncHtml.php";
	//	//echo "11222222222222222222223333333333333\n";
	//	//echo "asyncFileName: $asyncFileName\n";
		$asyncFilesArr=array();
		if(file_exists($asyncFileName))
		{
			$asyncFile = fopen($asyncFileName, "r");
			while(!feof($asyncFile))
  			{
				$line = fgets($asyncFile);
				if($line!=null and trim($line)!="")
				{
					$url_path_array=explode("=",$line);
					$url = $url_path_array[0];
					$path = $url_path_array[1];
					$asyncFilesArr[$url]=Config::$strPath.$path;
				}
			}
			fclose($asyncFile);
		}
	//	var_dump($asyncFilesArr);
		return $asyncFilesArr;
	}

	/*
	 * 设置数据文件的存放位置
	 * 默认存放在jsonPro/data下
	 */
	public function setPath($caseFilePath = "")
	{
		if($caseFilePath == "") return ;//直接返回，使用构造函数中默认的path。

		if(substr($caseFilePath,-1)!="/")
		{
			$caseFilePath.="/";//保证最后一个字符是"/",以免拼接路径出错
		}
		Config::$strPath = $caseFilePath;
		//创建case路径，确保case有地方存放
		CommonHelper::makeDir(Config::$strPath);

		return true;
	}

	//调整case的顺序，把case数组中的最后一个case（优化case）提到第一个case
	//其余case依次后移
	//输入是要调整次序的case数组
	//返回是调整后的数组
	public function adjustCaseOrder($arrCase)
	{
		$arrNewCase = array();
		$lastElement = end($arrCase);
		$arrNewCase[] = $lastElement;
		for ($i = 0; $i < count($arrCase)-1; $i++)
		{
			$arrNewCase[] = $arrCase[$i];
		}
		return $arrNewCase;
	}
}
?>
