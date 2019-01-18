<?php
	class Json_Log
	{
		const LOG_LEVEL_FATAL   = 0x01;
	    const LOG_LEVEL_WARNING = 0x02;
	    const LOG_LEVEL_NOTICE  = 0x04;
	    const LOG_LEVEL_TRACE   = 0x08;
	    const LOG_LEVEL_DEBUG   = 0x10;
    
		public static $arrLogLevels = array(
	        self::LOG_LEVEL_FATAL   => 'FATAL',
	        self::LOG_LEVEL_WARNING => 'WARNING',
	        self::LOG_LEVEL_NOTICE  => 'NOTICE',
	        self::LOG_LEVEL_TRACE   => 'TRACE',
	        self::LOG_LEVEL_DEBUG   => 'DEBUG',
    	);
    	
    	protected static $strLogFile = "";
    	private static $instance = null;
    	
		private function __construct($logFile)
	    {
	        self::$strLogFile = $logFile;
	    }
	    
		public static function init($logFile="")
	    {
	        if(self::$instance == null)
	        {
	        	if($logFile == "")
	        	{
	        		$logFile = dirname(__FILE__)."/./log/jsonPro.log";
	        		self::$instance = new Json_Log($logFile);
	        	}
	        	else 
	        	{
	        		self::$instance = new Json_Log($logFile);
	        	}
	            
	        }
	    }
	    
		public static function debug($str,$file="",$line="")
	    {
	        return self::$instance->writeLog(self::LOG_LEVEL_DEBUG, $str,$file,$line);
	    }
	
	    public static function trace($str,$file="",$line="")
	    {
	        return self::$instance->writeLog(self::LOG_LEVEL_TRACE, $str,$file,$line);
	    }
	
	    public static function notice($str,$file="",$line="")
	    {
	        return self::$instance->writeLog(self::LOG_LEVEL_NOTICE, $str,$file,$line);
	    }
	
	    public static function warning($str,$file="",$line="")
	    {
	        return self::$instance->writeLog(self::LOG_LEVEL_WARNING, $str,$file,$line);
	    }
	
	    public static function fatal($str,$file="",$line="")
	    {
	        return self::$instance->writeLog(self::LOG_LEVEL_FATAL, $str,$file,$line);
	    }
	    
	    public static function writeLog($intLevel,$str,$file,$line)
	    {
	    	$strLevel = self::$arrLogLevels[$intLevel];
		    $strLogFile = self::$strLogFile;
	        if(self::LOG_LEVEL_WARNING || self::LOG_LEVEL_FATAL)
	        {
	            $strLogFile .= '.wf';
	        }
	        
	        $str = sprintf("%s:%s print_word[%s],file[%s],line[%s] \n",
	        	$strLevel,
	        	date('m-d H:i:s:',time()),
	        	$str,
	        	$file,
	        	$line);
	        return file_put_contents($strLogFile,$str,FILE_APPEND);
	    }
	}
	
    
    
