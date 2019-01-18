<?php
/*
 * Created on 2012-4-11
 * Created by Guo Xubin.
 */
class CommonHelper
{
	public static function makeDir($dirPath)
	{
		if($dirPath==null or trim($dirPath)=="") return;//·��Ϊ�յĻ���ֱ�ӷ���
		if (is_dir($dirPath)) return ;//Ŀ¼�Ѿ�����
		
		if (!mkdir($dirPath, 0777, true)) 
		{
    		die("����Ŀ¼ʧ�ܣ�".$dirPath);
		}
	}
	
	public static function json_format($json) 
	{ 
		//echo $json;
	    $tab = "  "; 
	    $new_json = ""; 
	    $indent_level = 0; 
	    $in_string = false; 
		//var_dump($json);
	    $json_obj = json_decode($json); 
		//var_dump($json_obj);
	    if($json_obj === false) 
	        return false; 
	
	    $json = json_encode($json_obj); 
	    $len = strlen($json); 
	
	    for($c = 0; $c < $len; $c++) 
	    { 
	        $char = $json[$c]; 
	        switch($char) 
	        { 
	            case '{': 
	            case '[': 
	                if(!$in_string) 
	                { 
	                    $new_json .= $char . "\n" . str_repeat($tab, $indent_level+1); 
	                    $indent_level++; 
	                } 
	                else 
	                { 
	                    $new_json .= $char; 
	                } 
	                break; 
	            case '}': 
	            case ']': 
	                if(!$in_string) 
	                { 
	                    $indent_level--; 
	                    $new_json .= "\n" . str_repeat($tab, $indent_level) . $char; 
	                } 
	                else 
	                { 
	                    $new_json .= $char; 
	                } 
	                break; 
	            case ',': 
	                if(!$in_string) 
	                { 
	                    $new_json .= ",\n" . str_repeat($tab, $indent_level); 
	                } 
	                else 
	                { 
	                    $new_json .= $char; 
	                } 
	                break; 
	            case ':': 
	                if(!$in_string) 
	                { 
	                    $new_json .= ": "; 
	                } 
	                else 
	                { 
	                    $new_json .= $char; 
	                } 
	                break; 
	            case '"': 
	                if($c > 0 && $json[$c-1] != '\\') 
	                { 
	                    $in_string = !$in_string; 
	                } 
	            default: 
	                $new_json .= $char; 
	                break;                    
	        } 
	    } 
		//echo $new_json;
	    return $new_json; 
	} 
	
	public static function json_Html_format($json) 
	{ 
	    //echo $json;
		$tab = "  "; 
	    $new_json = ""; 
	    $indent_level = 0; 
	    $in_string = false; 
	
	    $json_obj = json_decode($json); 
	
	    if($json_obj === false) 
	        return false; 
	
	//	$json = json_encode($json_obj); 
	    $len = strlen($json); 
	
	    $strBlank = "";
	    for($c = 0; $c < $len; $c++) 
	    { 
	        $char = $json[$c]; 
	        switch($char) 
	        { 
	            case '{': 
	            case '[': 
	                if(!$in_string) 
	                { 
	                	$strBlank .= "&nbsp;&nbsp;&nbsp;";
	                    $new_json .= $char . "<br>\n $strBlank" . str_repeat($tab, $indent_level+1); 
	                    $indent_level++; 
	                } 
	                else 
	                { 
	                    $new_json .= $char; 
	                } 
	                break; 
	            case '}': 
	            case ']': 
	                if(!$in_string) 
	                { 
	                	$strBlank = substr($strBlank, 0, (strlen($strBlank) - 18));
	                    $indent_level--; 
	                    $new_json .= "<br>\n $strBlank" . str_repeat($tab, $indent_level) . $char; 
	                } 
	                else 
	                { 
	                    $new_json .= $char; 
	                } 
	                break; 
	            case ',': 
	                if(!$in_string) 
	                { 
	                    $new_json .= ",<br>\n $strBlank" . str_repeat($tab, $indent_level); 
	                } 
	                else 
	                { 
	                    $new_json .= $char; 
	                } 
	                break; 
	            case ':': 
	                if(!$in_string) 
	                { 
	                    $new_json .= ": "; 
	                } 
	                else 
	                { 
	                    $new_json .= $char; 
	                } 
	                break; 
	            case '"': 
	                if($c > 0 && $json[$c-1] != '\\') 
	                { 
	                    $in_string = !$in_string; 
	                } 
	            default: 
	                $new_json .= $char; 
	                break;                    
	        } 
	    } 
	
	    return $new_json; 
	} 
	
	//û�õ�
	public static function remove_redundant_backslash($json) //ɾ��������json_encode()����Ķ���ķ�б�� 
	{ 
	//	$trans = array('\\\/' => '/', '\"' => '"', '\/\/' => '//');
		$trans = array('\\\/' => '/');
	    $new_json = strtr($json, $trans);
	
	    return $new_json; 
	} 
	
	
	//�������е������ַ���utf8����     ���õݹ�
	public static function array_utf8_encode($arrSrc)
	{
		if (is_array($arrSrc))
		{
		//	echo "111111111111\n";
			foreach($arrSrc as $k=>$v)
			{
				if (is_array($v))
				{
					$arrSrc[$k] = CommonHelper::array_utf8_encode($v);
				}
				else if(is_string($v))
				{
					$v = urlencode($v);
					$arrSrc[$k] = $v;
	    		//	echo "22222222222".$v."\n";
				}
			}
		}
		else if(is_string($arrSrc))
		{
			$arrSrc = urlencode($arrSrc);
    	//	echo "33333333".$arrSrc."\n";
		}
	    return $arrSrc;
	}

}
 
 
?>
