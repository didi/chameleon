<?php

require_once(dirname(__FILE__).'/genConf.php');
require_once(dirname(__FILE__).'/genLog.php');

class genValue
{
 	private $note = "";
 	private $type = "";
 	public function __construct($nt,$ty)
 	{
		Json_Log::init();//Json_Log::fatal("in genvalue",__FILE__,__LINE__);
 		$this->note = $nt;
 		$this->type = $ty;
 		//echo "NOTE: " . mb_convert_encoding($nt, "GBK", "UTF-8") . "\n";
 		//echo "TYPE: ".$ty."\n";
 	}

 	//目前只针对int string 类型的注释
 	public function getValue($value)
 	{
 		$reStr = "";//返回结果
 		$tmpValue = "";//临时的value值
 		//echo $this->note;
 		//$arrNote = explode('/',$this->note);
 		$strNote = trim($this->note);
 		$strNote = substr($strNote, 2);
 		//echo "strNote: $strNote\n";
 		$arrNote = array();
 		$arrNote[] = $strNote;
 		//var_dump($arrNote);

 		$arrNoteCount=count($arrNote);
 		for($i=0;$i<$arrNoteCount;$i++)
 		{
 			if(substr($arrNote[$i],0,1) == "<")//枚举
 			{
 				$arrNote[$i] = trim($arrNote[$i]);//过滤]之后的空格
 				$strEnum = substr($arrNote[$i],1,strlen($arrNote[$i])-2);
 				$arrEnum = explode(",",$strEnum);
 				//var_dump($arrEnum);

 				//去掉空格
 				foreach ($arrEnum as $arrEnumKey => $arrEnumValue)
 				{
 					$arrEnum[$arrEnumKey] = trim($arrEnumValue);
 				}

 				$arrEnumCount=count($arrEnum);
 				for($j=0;$j<$arrEnumCount;$j++)//遍历所有枚举内容
 				{
 					//获取单个枚举内容
 					if($arrEnum[$j]{0} == "'" || $arrEnum[$j]{0} == '"')
 					{
						$tmpValue = substr($arrEnum[$j],1,strlen($arrEnum[$j])-2);
 					}
 					else
 					{
 						$tmpValue = $arrEnum[$j];
 					}
 					//压入返回字符串中
 					if($reStr == "")
 					{
 						$reStr .= $tmpValue;
 						//echo $reStr."\n";
 					}
 					else
 					{
 						$reStr .= ",".$tmpValue;
 						//echo $reStr."\n";
 					}

 				}
 			}
 			else if(substr($arrNote[$i],0,1) == "[")//范围
 			{
 				$arrNote[$i] = trim($arrNote[$i]);//过滤]之后的空格
 				$strBord = substr($arrNote[$i],1,strlen($arrNote[$i])-2);
 				$arrBord = explode(",",$strBord);

 				//去掉空格
 				foreach ($arrBord as $arrBordKey => $arrBordValue)
 				{
 					$arrBord[$arrBordKey] = trim($arrBordValue);
 				}

 				if($this->type == "string")
 				{
 					//echo $reStr."\n";
 					$this->putString($arrBord,$reStr,$value);
 				}
 				else if($this->type == "int")
 				{
 					$this->putInt($arrBord,$reStr);
 				}
 			}
 			else if(substr($arrNote[$i],0,11) == "(messycode)")//乱码测试
 			{
 				$mess_string=$this->getMessStr();
 				//在这里添加乱码测试使用的内容。
				if($reStr == "")
				{
					$reStr .= $mess_string;
					//echo $reStr;
				}
				else
				{
					$reStr .= ",".$mess_string;
					//echo $reStr;
				}
 			}
 			else if(substr($arrNote[$i],0,1) == "(")//范围
 			{
 				$arrNote[$i] = trim($arrNote[$i]);//过滤]之后的空格
 				$strBord = substr($arrNote[$i],1,strlen($arrNote[$i])-2);
                $strnum = intval($strBord);

                $reStr = "";
                foreach(range(1,4) as $v){
                    $tmp = ',';
                    for($i = 1; $i <=$strnum;$i++){
                        do{
                            $n = mt_rand(35, 126);
                        }while(92 == $n || 60 == $n || 62 == $n || 44 == $n);
                        $tmp .= chr($n);
                    }
                    $reStr .= $tmp;
                }
                $reStr = substr($reStr, 1);
 			}
 		}

 		//用于value值去重
 		$arrTerminal = explode(",",$reStr);
 		$reStr = "";
 		for($i=0;$i<count($arrTerminal);$i++)
 		{
 			if($reStr == "")
 			{
 				$reStr .= $arrTerminal[$i];
 			}
 			else
 			{
 				$tmpBool = false;
 				for($j=0;$j<$i;$j++)
 				{
 					if($arrTerminal[$j] == $arrTerminal[$i])
 					{
 						$tmpBool = true;
 					}
 				}
 				if($tmpBool)
 				{
 					//有重复则不入库
 				}
 				else
 				{
 					$reStr .= ",".$arrTerminal[$i];
 				}
 			}
 		}
 		//返回去重后的结果 以","分割
 		//echo "RESTR: $reStr\n";
 		return $reStr;
 	}

 	private function getMessStr()
 	{
		$mess_arr = Config::$mess_arr;
		$mess_str="";#必定包含的部分放在这里
		foreach ( $mess_arr as $case )
		{
			//$mess_char = array_rand(str_split($case),1);
       		$mess_str=$mess_str.$case;
		}
 		return $mess_str;
 	}

 	public function putString($arrBord,&$reStr,$value)
 	{
 		if(is_numeric($arrBord[0]) && is_numeric($arrBord[1]))
 		{
 			//echo "aaaaaaaaaa $arrBord[0] $arrBord[1] \n";
 			//空串
 			if($reStr == "")
	 		{
	 			$reStr .= $this->getString($arrBord[0]-1,$value);
	 		}
	 		else
	 		{
	 			$reStr .= ",".$this->getString($arrBord[0]-1,$value);
	 		}

 			$reStr .= ",".$this->getString($arrBord[0],$value);
 			$reStr .= ",".$this->getString(($arrBord[0]+$arrBord[1])/2,$value);
 			$reStr .= ",".$this->getString($arrBord[1],$value);
 			$reStr .= ",".$this->getString($arrBord[1]+1,$value);
 		}
 	}

 	public function putInt($arrBord,&$reStr)
 	{
 		//echo "before $arrBord[0] $arrBord[1] \n";
	 	if(is_numeric($arrBord[0]) && is_numeric($arrBord[1]))
 		{
 			//echo "aaaaaaaaaa $arrBord[0] $arrBord[1] \n";
 			if($reStr == "")
 			{
 				$reStr .= $this->getNum($arrBord[0]-1);
 			}
 			else
 			{
 				$reStr .= ",".$this->getNum($arrBord[0]-1);
 			}
 			$reStr .= ",".$this->getNum($arrBord[0]);
 			$reStr .= ",".$this->getNum(($arrBord[0]+$arrBord[1])/2);
 			$reStr .= ",".$this->getNum($arrBord[1]);
 			$reStr .= ",".$this->getNum($arrBord[1]+1);
	 	}
 	}

	public function getString($strLength,$value)
	{
	    $tmpStr = "";
	    $strLength = intval(floor($strLength));
	    if ($strLength <= 0) {
	    	$strLength = 1;
	    }
	    for($i=0;$i<$strLength;$i++)
	    {
	       $tmpStr .= $value;
	    }
	    return $tmpStr;
	}

	public function getNum($numLength)
	{
	    $tmpStr = 0;
	    /*for($i=0;$i<$numLength;$i++)
	    {
	       $tmpStr = $tmpStr * 10 + 1;
	    }*/
	    $tmpStr = floor($numLength);
		$tmpStr = intval($tmpStr);

	    return $tmpStr;
	}

}

?>
