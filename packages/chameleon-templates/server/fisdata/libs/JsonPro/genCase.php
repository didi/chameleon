<?php

require_once(dirname(__FILE__).'/genLog.php');
require_once(dirname(__FILE__).'/genArray.php');

class genCase
{
	private $arrNormal =null;
	private $arrCase =null;
	
	
	
	public function __construct($standJson,$arrC)
	{
		Json_Log::init();//Json_Log::fatal("in genCase",__FILE__,__LINE__);
		$this->arrCase = $arrC;          //范围数组$arrPosNote
		$this->arrNormal = $standJson;   //标准数组$standJson
	}
	
	//注多数组重复构造在此处进行 ，需要传入位置及数组边界值提条件
	public function getCase()
	{		
		$arrReCase = array();
		$maxCaseNo = 0;//最大case数
		$tmpCaseNo = 0;//接口字段的case数
		
		$randomInfoArray = array();	//记录需要重复的数组的可变元素的信息
		
		//$arrCase[$i][0] 位置 [1]所有可能值[2]类型
		for($i=0;$i<count($this->arrCase);$i++)
		{
			$tmpArr = explode(",",$this->arrCase[$i][1]);
			$tmpCaseNo = count($tmpArr);
			if($tmpCaseNo > $maxCaseNo)
			{
				$maxCaseNo = $tmpCaseNo;
			}
		}
		
		$randomInfoArray = $this->getRandomInfoArray();	
		//var_dump($randomInfoArray);
		//echo "MAX_CASE_NO: $maxCaseNo\n";
        if($maxCaseNo > 1)
        {
        	array_push($arrReCase,$this->arrNormal);    //标准数组是  最终数组  中的第一个数组
        }
        
		for($i=0;$i<$maxCaseNo+1;$i++)	//将循环次数上限加1，用来生成最后一个所有数组重复都是中间值的数据
		{
		//	//echo "\ni: $i  maxCaseNo: $maxCaseNo\n";
			$tmpArrNormal = $this->arrNormal;
			$arrCaseCount = count($this->arrCase);
			//总共进行$maxCaseNo次大循环，当$arrValueCount<$maxCaseNo的情况，会求余$i%$arrValueCount
			for($j=0;$j<$arrCaseCount;$j++)
			{
				$arrKey = explode(",",$this->arrCase[$j][0]);//拆分后的位置信息
				//$arrKey 是 $arrPosNote的一个条目的key
				$arrValue = explode(",",$this->arrCase[$j][1]);
				//$arrValue 是 $arrPosNote的一个条目的所有可能value
				//将可选取值数组中的","变回来
				foreach ($arrValue as $keyInArrValue => $valueInArrValue)
				{
					// ---add by xumeng change string to int---
					if ($this->arrCase[$j][2]=="int") {
						$arrValue[$keyInArrValue] = intval($valueInArrValue);
					} else {
						$arrValue[$keyInArrValue] = $this->changeCommaBack($valueInArrValue);
					}
					// ---end---
				}
				//var_dump($arrValue);
				$arrKeyCount = count($arrKey);
				$arrValueCount = count($arrValue);
				$t = $arrKey[$arrKeyCount-1];   // add by xumeng02
				if($arrValueCount == 1 && $arrValue[$i%$arrValueCount] == "")
				{
					continue;
				}
				
				$assign_cmd = "\$tmpArrNormal";   //下面都是拼装命令的，会在eval()中执行
				for ( $c=0;$c<$arrKeyCount;$c++) 
				{
					$assign_cmd=$assign_cmd."[\"$arrKey[$c]\"]";
				}
				if(substr($assign_cmd,-4)=="[\"\"]")
				{
					//去掉类似这种key：$tmpArrNormal["index_show_movie_hot"]["videos"]["0"][""]
					continue;
				}
				
				//如果是数组 则特殊处理
				if(substr($this->arrCase[$j][1],0,4) == "/...")
				{
					$change_cmd = "\$tmpArrNormal";
					for ( $c=0;$c<$arrKeyCount-1;$c++) 
					{
						$change_cmd=$change_cmd."[\"$arrKey[$c]\"]";
					}
					//echo $assign_cmd;
					$start = stripos($this->arrCase[$j][1],"[",0);
					$end = stripos($this->arrCase[$j][1],"]",0);
					$strArray = substr($this->arrCase[$j][1],$start+1,$end - $start-1);
					$arrArray = explode(",",$strArray);
					//var_dump($arrArray);
					$arrArrayCount = array();
					
					// 数组的个数策略：lowBorder-1, lowBorder, mid, highBorder, highBorder+1
					$numTem = intval($arrArray[0]-1);
					if ($numTem < 1) {
						array_push($arrArrayCount,1); 
					}else {
						array_push($arrArrayCount,$numTem); 
					}
					$numTem = intval($arrArray[0]);
					if ($numTem < 1) {
						array_push($arrArrayCount,1); 
					}else {
						array_push($arrArrayCount,$numTem); 
					}
					$numTem = intval(floor( ($arrArray[0]+$arrArray[1])/2 ));
					if ($numTem < 1) {
						array_push($arrArrayCount,1); 
					}else {
						array_push($arrArrayCount,$numTem); 
					}
					$numTem = intval($arrArray[1]);
					if ($numTem < 1) {
						array_push($arrArrayCount,1); 
					}else {
						array_push($arrArrayCount,$numTem); 
					}
					$numTem = intval($arrArray[1]+1);
					if ($numTem < 1) {
						array_push($arrArrayCount,1); 
					}else {
						array_push($arrArrayCount,$numTem); 
					}		
					//var_dump($arrArrayCount);
					
					//当$maxCaseNo比数组的变化次数少的话，将$maxCaseNo设为$arrArrayCount
					if($maxCaseNo < count($arrArrayCount))
					{
					//	//echo "\nSET maxCaseNo to NEW NUM!!!\n";
						$maxCaseNo = count($arrArrayCount);
					}
					
					//计算数组的重复次数索引 $repeateIdx
					//如果不是最后一个，即$i<$maxCaseNo，则$repeateIdx = $i%count($arrArrayCount)
					//如果是最后一个，即$i=$maxCaseNo，则$repeateIdx = count($arrArrayCount)/2
					$repeateIdx = $i%count($arrArrayCount);
					if($i == $maxCaseNo)	//count($arrArrayCount)只有4和5两种情况
					{
						if(count($arrArrayCount) == 5)
						{
							$repeateIdx = 2;
						}
						else if (count($arrArrayCount) == 4)
						{
							$repeateIdx = 1;
						}
					}
					//echo "i: $i; repeateIdx: $repeateIdx; $arrArrayCount[$repeateIdx]\n";
					
				//	$repeate = $arrArrayCount[$i%count($arrArrayCount)];
				//	//echo "Repeate: $repeate\n";
				//	for($k=1;$k<$arrArrayCount[$i%count($arrArrayCount)];$k++)   //用$i余count($arrArrayCount)，这里$arrArrayCount应该是5吧。如果 $maxCaseNo<5 呢？
			
					//------ 改变序列，防止覆盖------
					//if ($i==4)var_dump($this->arrCase[$j][0]);
					$tmpArrNormal = $this->changeIndex($tmpArrNormal,$arrArrayCount[$repeateIdx],$this->arrCase[$j][0]);
					//------end---------------------
					//if ($i==4) var_dump($tmpArrNormal);
					for($k=1;$k<$arrArrayCount[$repeateIdx];$k++)   //用$i余count($arrArrayCount)，这里$arrArrayCount应该是5吧。如果 $maxCaseNo<5 呢？
					{
						//echo $k."\n";
						//Like this: $tmpArrNormal["obj"][0][1][$k]=$tmpArrNormal["obj"][0][1][0];
						$tem = $t + $k;
						$result_cmd=$change_cmd."[\"".$tem."\"]=".$assign_cmd.";"; 
						//echo $result_cmd."\n";
						//上面是 让后面重复的数组和第一个数组内容一样。如果数组里的条目有多个选项呢？重复的是数组处理前的赋值，这个每次都不同的
						//echo $result_cmd."\n";
						eval($result_cmd);
						//if ($i==4) var_dump($tmpArrNormal);
						//除数组的第一个重复外，其余的重复里的 可变元素的值 随机改变
						if(array_key_exists($this->arrCase[$j][0], $randomInfoArray))
						{
							$randomInfo = $randomInfoArray[$this->arrCase[$j][0]];
							$arrayNameLength = strlen($this->arrCase[$j][0]);
							foreach ($randomInfo as $key => $value) 
							{
								$inArray_cmd = $change_cmd."[\"".$tem."\"]";//$assign_cmd."[\$k]";
								//echo $inArray_cmd."\n";
								$tempArrKey = substr($value[0], ($arrayNameLength + 1));
								//echo "tempArrKey: $tempArrKey\n";
								$arrKey = explode(",",$tempArrKey);//拆分后的位置信息
								//unset($arrKey[0]);
								//var_dump($arrKey);
								//$arrKey 是 $arrPosNote的一个条目的key
								$arrValue = explode(",",$value[1]);
								
								//-----------xumeng02--------------
								if ($value[2]=="int") {
									foreach ($arrValue as $kk => $vv) {
										$arrValue[$kk] = intval($vv);
									}
									//var_dump($arrValue);
								}
								//-----------end-------------------
								
								//$arrValue 是 $arrPosNote的一个条目的所有可能value
								$arrKeyCount = count($arrKey);
								$arrValueCount = count($arrValue);
								//准备赋值语句的前半段
								foreach ($arrKey as $arrKeyElement) 
								{
									$inArray_cmd=$inArray_cmd."[\"$arrKeyElement\"]";
								}
								$inArray_cmd .= "=";
								//准备要赋的值，给出的值是从可选范围中随机选出的
								$randonValue = $arrValue[rand(0, $arrValueCount - 1)];
								if (!is_int($randonValue)) {
									$randonValue = $this->changeCommaBack($randonValue);
								}
								//var_dump($randonValue);
								//当要赋的值是异常字符时，使这个值只有1/4的概率是异常字符，让fe看的舒服些
								if($randonValue == "&#1234%璎玥£123丂 亐 儈 凗 狛 癄 鳌 煪 伄  骺牛肩猪肉 ")
								{
									//echo "11111\n";
									$randomRlt = rand(0, 3);
									//echo "i: $i, maxCaseNo: $maxCaseNo\n";
									if($randomRlt != 3 || $i == $maxCaseNo)	//如果是最后一个数组使用原值
									{
										$specialStr_cmd = "\$randonValue = \$arrReCase[0]";
										$speicalKey = $value[0];
										$arrSpecialKey = explode(",", $speicalKey);
										foreach ($arrSpecialKey as $arrSpecialKeyElement) 
										{
											$specialStr_cmd = $specialStr_cmd."[\"$arrSpecialKeyElement\"]";
										}
										$specialStr_cmd .= ";";
										//echo $specialStr_cmd."\n";
										eval($specialStr_cmd);
									}
									$inArray_cmd .= "\$randonValue;";	//遇到异常字符使用了原值时不飘红
								}
								else
								{
									$inArray_cmd .= "\$randonValue;";
								}
								//var_dump($tmpArrNormal);
								eval($inArray_cmd);
							}
						}
						
					}
				}
				else 
				{
					//如果是最后一个数组，替换掉所有的异常字符
					if($arrValue[$i%$arrValueCount] === "&#1234%璎玥£123丂 亐 儈 凗 狛 癄 鳌 煪 伄  骺牛肩猪肉 " && $i == $maxCaseNo)
					{
						//echo "11111\n";
						$randonValue1 = "";
						//echo "i: $i, maxCaseNo: $maxCaseNo\n";
						$specialStr_cmd1 = "\$randonValue1 = \$arrReCase[0]";
						$arrSpecialKey1 = $arrKey;
						foreach ($arrSpecialKey1 as $arrSpecialKeyElement) 
						{
							$specialStr_cmd1 = $specialStr_cmd1."[\"$arrSpecialKeyElement\"]";
						}
						$specialStr_cmd1 .= ";";
						//echo $specialStr_cmd."\n";
						eval($specialStr_cmd1);
						//echo "randonValue1: $randonValue1\n";
						$assign_cmd = $assign_cmd."=\$randonValue1;";	
					}
					else
					{
						//Like this:$tmpArrNormal["obj"][0][1]=$arrValue[$i%$arrValueCount];
						$assign_cmd=$assign_cmd."=\$arrValue[$i%$arrValueCount];";
						//echo $assign_cmd."\n";
					}
					//echo "result1: $assign_cmd\n";
					eval($assign_cmd);
				}	
			}
			//if ($i == 4)var_dump($tmpArrNormal);
			
			// 自动计数
			$dfssubstr="ImageIndexNumber";
			$dfsindex=0;
			$dfsi=0;
			//var_dump($arrFinalCase[0]);
			$this->dfs($tmpArrNormal,$dfssubstr,$dfsindex,0,$dfsi);
			
			array_push($arrReCase,$tmpArrNormal);
		}
		
		
		return $arrReCase;
	}
	
	
	public function getHtmlCase($srcArrReCase)
	{		
		$arrReCase = array();
		$maxCaseNo = 0;//最大case数
		$tmpCaseNo = 0;//接口字段的case数
		
		$randomInfoArray = array();	//记录需要重复的数组的可变元素的信息
		
		//$arrCase[$i][0] 位置 [1]所有可能值[2]类型
		for($i=0;$i<count($this->arrCase);$i++)
		{
			$tmpArr = explode(",",$this->arrCase[$i][1]);
			$tmpCaseNo = count($tmpArr);
			if($tmpCaseNo > $maxCaseNo)
			{
				$maxCaseNo = $tmpCaseNo;
			}
		}
		
		$randomInfoArray = $this->getRandomInfoArray();	
		
		//echo "MAX_CASE_NO: $maxCaseNo\n";
        if($maxCaseNo > 1)
        {
        	array_push($arrReCase,$this->arrNormal);    //标准数组是  最终数组  中的第一个数组
        }
        
		for($i=0;$i<$maxCaseNo+1;$i++)	//将循环次数上限加1，用来生成最后一个所有数组重复都是中间值的数据
		{
		//	//echo "\ni: $i  maxCaseNo: $maxCaseNo\n";
			$tmpArrNormal = $this->arrNormal;
			$arrCaseCount = count($this->arrCase);
			//总共进行$maxCaseNo次大循环，当$arrValueCount<$maxCaseNo的情况，会求余$i%$arrValueCount
			for($j=0;$j<$arrCaseCount;$j++)
			{
				$arrKey = explode(",",$this->arrCase[$j][0]);//拆分后的位置信息
				//$arrKey 是 $arrPosNote的一个条目的key
				$arrValue = explode(",",$this->arrCase[$j][1]);
				//$arrValue 是 $arrPosNote的一个条目的所有可能value
				//将可选取值数组中的","变回来
				foreach ($arrValue as $keyInArrValue => $valueInArrValue)
				{
					// ---add by xumeng change string to int---
					if ($this->arrCase[$j][2]=="int") {
						$arrValue[$keyInArrValue] = intval($valueInArrValue);
					} else {
						$arrValue[$keyInArrValue] = $this->changeCommaBack($valueInArrValue);
					}
					// ---end---
				}
				//var_dump($arrValue);
				$arrKeyCount = count($arrKey);
				$arrValueCount = count($arrValue);
				$t = $arrKey[$arrKeyCount-1];   // add by xumeng02
				if($arrValueCount == 1 && $arrValue[$i%$arrValueCount] == "")
				{
					continue;
				}
				
				$assign_cmd = "\$tmpArrNormal";   //下面都是拼装命令的，会在eval()中执行
				for ( $c=0;$c<$arrKeyCount;$c++) 
				{
					$assign_cmd=$assign_cmd."[\"$arrKey[$c]\"]";
				}
				if(substr($assign_cmd,-4)=="[\"\"]")
				{
					//去掉类似这种key：$tmpArrNormal["index_show_movie_hot"]["videos"]["0"][""]
					continue;
				}
				
				//如果是数组 则特殊处理
				if(substr($this->arrCase[$j][1],0,4) == "/...")
				{
					$change_cmd = "\$tmpArrNormal";
					for ( $c=0;$c<$arrKeyCount-1;$c++) 
					{
						$change_cmd=$change_cmd."[\"$arrKey[$c]\"]";
					}
					//echo $assign_cmd;
					$start = stripos($this->arrCase[$j][1],"[",0);
					$end = stripos($this->arrCase[$j][1],"]",0);
					$strArray = substr($this->arrCase[$j][1],$start+1,$end - $start-1);
					$arrArray = explode(",",$strArray);
					//var_dump($arrArray);
					$arrArrayCount = array();
					
					// 数组的个数策略：lowBorder-1, lowBorder, mid, highBorder, highBorder+1
					$numTem = intval($arrArray[0]-1);
					if ($numTem < 1) {
						array_push($arrArrayCount,1); 
					}else {
						array_push($arrArrayCount,$numTem); 
					}
					$numTem = intval($arrArray[0]);
					if ($numTem < 1) {
						array_push($arrArrayCount,1); 
					}else {
						array_push($arrArrayCount,$numTem); 
					}
					$numTem = intval(floor( ($arrArray[0]+$arrArray[1])/2 ));
					if ($numTem < 1) {
						array_push($arrArrayCount,1); 
					}else {
						array_push($arrArrayCount,$numTem); 
					}
					$numTem = intval($arrArray[1]);
					if ($numTem < 1) {
						array_push($arrArrayCount,1); 
					}else {
						array_push($arrArrayCount,$numTem); 
					}
					$numTem = intval($arrArray[1]+1);
					if ($numTem < 1) {
						array_push($arrArrayCount,1); 
					}else {
						array_push($arrArrayCount,$numTem); 
					}		
					//var_dump($arrArrayCount);
					
					//当$maxCaseNo比数组的变化次数少的话，将$maxCaseNo设为$arrArrayCount
					if($maxCaseNo < count($arrArrayCount))
					{
					//	//echo "\nSET maxCaseNo to NEW NUM!!!\n";
						$maxCaseNo = count($arrArrayCount);
					}
					
					//计算数组的重复次数索引 $repeateIdx
					//如果不是最后一个，即$i<$maxCaseNo，则$repeateIdx = $i%count($arrArrayCount)
					//如果是最后一个，即$i=$maxCaseNo，则$repeateIdx = count($arrArrayCount)/2
					$repeateIdx = $i%count($arrArrayCount);
					if($i == $maxCaseNo)	//count($arrArrayCount)只有4和5两种情况
					{
						if(count($arrArrayCount) == 5)
						{
							$repeateIdx = 2;
						}
						else if (count($arrArrayCount) == 4)
						{
							$repeateIdx = 1;
						}
					}
					//echo "i: $i; repeateIdx: $repeateIdx; $arrArrayCount[$repeateIdx]\n";
					
				//	$repeate = $arrArrayCount[$i%count($arrArrayCount)];
				//	//echo "Repeate: $repeate\n";
				//	for($k=1;$k<$arrArrayCount[$i%count($arrArrayCount)];$k++)   //用$i余count($arrArrayCount)，这里$arrArrayCount应该是5吧。如果 $maxCaseNo<5 呢？
					
					//------ 改变序列，防止覆盖------
					//var_dump($this->arrCase[$j][0]);
					$tmpArrNormal = $this->changeIndex($tmpArrNormal,$arrArrayCount[$repeateIdx],$this->arrCase[$j][0]);
					//------end---------------------				
					for($k=1;$k<$arrArrayCount[$repeateIdx];$k++)   //用$i余count($arrArrayCount)，这里$arrArrayCount应该是5吧。如果 $maxCaseNo<5 呢？
					{
						//Like this: $tmpArrNormal["obj"][0][1][$k]=$tmpArrNormal["obj"][0][1][0];
						$tem = $t + $k;
						$result_cmd=$change_cmd."[\"".$tem."\"]=".$assign_cmd.";"; 
						//上面是 让后面重复的数组和第一个数组内容一样。如果数组里的条目有多个选项呢？重复的是数组处理前的赋值，这个每次都不同的
						//echo "result2: $result_cmd\n";
						eval($result_cmd);
						//除数组的第一个重复外，其余的重复里的 可变元素的值 随机改变
						if(array_key_exists($this->arrCase[$j][0], $randomInfoArray))
						{
							//var_dump($randomInfoArray);
							$randomInfo = $randomInfoArray[$this->arrCase[$j][0]];
							$arrayNameLength = strlen($this->arrCase[$j][0]);
							foreach ($randomInfo as $key => $value) 
							{

								//echo "arrName: ".$this->arrCase[$j][0]."\n";
								//echo "randomElement : $value[0]\n";
								$inArray_cmd = $change_cmd."[\"".$tem."\"]";//$assign_cmd."[\$k]";
								$tempArrKey = substr($value[0], ($arrayNameLength + 1));
								//echo "tempArrKey: $tempArrKey\n";
								$arrKey = explode(",",$tempArrKey);//拆分后的位置信息
								//unset($arrKey[0]);
								//var_dump($arrKey);
								//$arrKey 是 $arrPosNote的一个条目的key
								$arrValue = explode(",",$value[1]);
								
								//-----------xumeng02--------------
								if ($value[2]=="int") {
									foreach ($arrValue as $kk => $vv) {
										$arrValue[$kk] = intval($vv);
									}
									//var_dump($arrValue);
								}
								//-----------end-------------------
								
								//var_dump($arrValue);
								//$arrValue 是 $arrPosNote的一个条目的所有可能value
								$arrKeyCount = count($arrKey);
								$arrValueCount = count($arrValue);
								//准备赋值语句的前半段
								foreach ($arrKey as $arrKeyElement) 
								{
									$inArray_cmd=$inArray_cmd."[\"$arrKeyElement\"]";
								}
								//echo $inArray_cmd."\n";
								$orgArray_cmd  = substr($inArray_cmd, 13);
								$orgArray_cmd = "\$srcArrReCase[\$i+1]".$orgArray_cmd;	//拼装原case用对应的值的位置
								$inArray_cmd .= "=";
								//从getCase()产生的数据拿值
								$randonValue = "";
								$orgArray_cmd = "\$randonValue = ".$orgArray_cmd.";";
								//echo "orgArray_cmd: $orgArray_cmd  i:$i k: $k\n";
								eval($orgArray_cmd);

								//echo "randonValue: $randonValue\n";
								if ($value[2] == "int") {
									$inArray_cmd .= "\"****<span style='background-color:#FF9797;'>\".\$randonValue.\"</span>****\";";
								}else {
									$inArray_cmd .= "\"<span style='background-color:#FF9797;'>\".\$randonValue.\"</span>\";";
								}
								//echo $inArray_cmd."\n";
								eval($inArray_cmd);
								
								
							}
						}
						
					}
				}
				else 
				{	
					//如果是最后一个数组，替换掉所有的异常字符
					if($arrValue[$i%$arrValueCount] === "&#1234%璎玥£123丂 亐 儈 凗 狛 癄 鳌 煪 伄  骺牛肩猪肉 " && $i == $maxCaseNo)
					{
						//echo "11111\n";
						$randonValue1 = "";
						//echo "i: $i, maxCaseNo: $maxCaseNo\n";
						$specialStr_cmd1 = "\$randonValue1 = \$arrReCase[0]";
						$arrSpecialKey1 = $arrKey;
						foreach ($arrSpecialKey1 as $arrSpecialKeyElement) 
						{
							$specialStr_cmd1 = $specialStr_cmd1."[\"$arrSpecialKeyElement\"]";
						}
						$specialStr_cmd1 .= ";";
						//echo $specialStr_cmd."\n";
						eval($specialStr_cmd1);
						//echo "randonValue1: $randonValue1\n";
						$assign_cmd=$assign_cmd."=\"<span style='background-color:#FF9797;'>\".\$randonValue1.\"</span>\";";
					}
					else
					{
						//Like this:$tmpArrNormal["obj"][0][1]=$arrValue[$i%$arrValueCount];
						if ($this->arrCase[$j][2] == "int") {
							$assign_cmd=$assign_cmd."=\"****<span style='background-color:#FF9797;'>\".\$arrValue[$i%$arrValueCount].\"</span>****\";";
						} else {
							$assign_cmd=$assign_cmd."=\"<span style='background-color:#FF9797;'>\".\$arrValue[$i%$arrValueCount].\"</span>\";";
						}
						//var_dump($arrValue[$i%$arrValueCount]);
					}
					eval($assign_cmd);
					//echo "result1: $assign_cmd\n";
				}
			}
			
			// 自动计数
			$dfssubstr="ImageIndexNumber";
			$dfsindex=0;
			$dfsi=0;
			//var_dump($arrFinalCase[0]);
			$this->dfs($tmpArrNormal,$dfssubstr,$dfsindex,0,$dfsi);
			
			array_push($arrReCase,$tmpArrNormal);
		}
		
		
		return $arrReCase;
	}
	
	
	//填充$randomInfoArray（记录需要重复的数组的可变元素的信息）
	public function getRandomInfoArray()
	{
		//填充$randomInfoArray
		$randomInfoArray = array();
		$arrCaseCount = count($this->arrCase);
		for($idx=0; $idx<$arrCaseCount; $idx++)
		{
			if(substr($this->arrCase[$idx][1],0,4) == "/...")
			{
				//echo $this->arrCase[$idx][0]."\n";
				//获取范围数组$this->arrCase中需要随机的element
				$elementToRandom = array();
				$objectName = $this->arrCase[$idx][0];
				if(!array_key_exists($objectName, $randomInfoArray))
				{
					$nameLength = strlen($objectName);
					foreach($this->arrCase as $element)
					{
					//	//echo "currName: $element[0]\n";
						$currNameLength = strlen($element[0]);
						if($currNameLength < $nameLength)
						{
							continue;
						}
						$tmpNameStr = substr($element[0], 0, ($nameLength));
					//	//echo "tmpNameStr: $tmpNameStr\n";
						if($tmpNameStr == $objectName)
						{
							if(substr($element[1],0,4) == "/..." && $objectName == $element[0])
							{
								if(count($elementToRandom) > 0)
								{
									$randomInfoArray[$objectName] = $elementToRandom;
								}
								break;
							}
							//如果发现子数组，把已经记录下来的子数组的可变元素的信息都unset掉
							else if(substr($element[1],0,4) == "/..." && $objectName != $element[0])
							{
								//echo "has child array!!!\n";
								$childArrayName = $element[0];
								//echo "childArrayName: $childArrayName\n";
								$childArrayNameLength = strlen($childArrayName);
								$elementCount = count($elementToRandom);
								//echo "elementCount: $elementCount\n";
								if($elementCount != 0)
								{
									foreach ($elementToRandom as $key => $randomElement)
									{
										$randElementName = $randomElement[0];
										$currRandEleNameLen = strlen($randElementName);
										//echo "randElementName: $randElementName\n";
										if($currRandEleNameLen < $childArrayNameLength)
										{
											continue;
										}
										$tmpRandEleNameStr = substr($randElementName, 0, ($childArrayNameLength));
										//echo "tmpRandEleNameStr: $tmpRandEleNameStr\n";
										if($tmpRandEleNameStr == $childArrayName)
										{
											//echo "key: $key\n";
											unset($elementToRandom[$key]);
										//	array_pop($elementToRandom);
											//var_dump($elementToRandom);
										}
									}
								}
								continue;
							}
							else if($element[1] != "")
							{
								//echo "currName: $element[0]\n";
								//echo "push in.\n";
								array_push($elementToRandom, $element);
							}
						}
					}
				}
			}
		}
		//var_dump($randomInfoArray);
		return $randomInfoArray;
	}
	
	//将字符串中的"||CoMmA_In_StR||"变回","
	function changeCommaBack($value)
	{
		$trans = array("||CoMmA_In_StR||" => ",");
		$value = strtr($value, $trans);
		//file_put_contents(dirname(__FILE__)."/./tmp/note.php", "BACK: $value\n");
		return $value;
	}
	
	function dfs(&$arr,$substr,&$index,$flag,&$i)
	{
		
		$n=count($arr);
		//echo $flag;
		foreach($arr as $k => &$v)
		{
			if(is_array($v) && $i==0)
			{
				$this-> dfs($v,$substr,$index,0,$i);
			}
			else if(is_array($v))
			{
				$this-> dfs($v,$substr,$index,1,$i);
			}
			else if($k==$substr)
			{
				$i++;
				if($flag==0)
				{
					//echo "a";
					$index=$v;
					$index=$index+1;
				}
				else if($flag==1)
				{
					//echo "b";
					$v=$index;
					$index=$index+1;
				}
				return;
			}
		}
		
	}
	
	// 在需要重复的数组后面插入模板数据，防止最后的原始数据被覆盖
	function changeIndex($tmpArrNormal,$n,$keys)
	{
		$Arr = array();
		unset($Arr);
		//var_dump($tmpArrNormal);
		
		$tmpArr = explode(",",$keys);
		$tmpNum = count($tmpArr);
		$index = intval( $tmpArr[$tmpNum-1] );
		//var_dump($index);
		$count = 0;
		$parent = array();
		$this->searchIndex($count, $Arr, $tmpArrNormal, $tmpArr, $parent, $n);
		//var_dump($Arr);
		return $Arr;
	}
	
	function searchIndex(&$count, &$Arr, $ArrNormal, $tmpArr, $parent, $n)
	{
		$tmpNum = count($tmpArr);
		$cmd = "\$Arr";   //下面都是拼装命令的，会在eval()中执行
		for ($c = 0; $c < count($parent); $c++) {
			$cmd = $cmd."[\"".$parent[$c]."\"]";
		}
		if ($count < $tmpNum) {
			$count++;
			$sign = 0;
			if(is_array($ArrNormal)) {
				foreach ($ArrNormal as $k => $v) {
					if ($sign == 1) {
						$kTmp = intval($k) + $n - 1;
					}else {
						$kTmp = $k;
					}
					$cmdTmp = $cmd."[\"".$kTmp."\"]=\$v;";
					//echo $kTmp."\n";
					eval($cmdTmp);
					if ($kTmp == $tmpArr[$count-1]) {
						array_push($parent, $kTmp);
						$this->searchIndex($count, $Arr, $v, $tmpArr, $parent, $n);
						if (count == $tmpNum) {
							$sign = 1;
						}
					}
				}
			}
			$count--;
		}else {
			$cmd = "\$Arr";   //下面都是拼装命令的，会在eval()中执行
			for ($c = 0; $c < count($parent)-1; $c++) {
				$cmd = $cmd."[\"".$parent[$c]."\"]";
			}
			for ($j = 1; $j < $n; $j++) {
				$jmp = $parent[$c]+$j;
				$emptyArr = array();
				$cmdTmp = $cmd."[\"".$jmp."\"]=\$emptyArr;";
				eval($cmdTmp);
				//echo $cmdTmp."\n";
			}
		}
		return;
	}
	
}
?>