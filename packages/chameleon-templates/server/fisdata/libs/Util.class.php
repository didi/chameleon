<?php

class Util {
    /**
     * 格式化路径字符串
     *
     * * replace "\" to "/"
     * * replace contiguous "/" to one "/"
     * * replace "a/b/../c" to "a/c"
     * * remove "/./"
     * * remove "/" at the end.
     *
     * @static
     * @param string $path 路径字符串（路径存在与否）
     * @return string
     */
    public static function normalizePath($path) {
        $normal_path = preg_replace(
            array('/[\/\\\\]+/', '/\/\.\//', '/^\.\/|\/\.$/', '/\/$/'),
            array('/', '/', '', ''),
            $path
        );
        $path = $normal_path;
        do {
            $normal_path = $path;
            $path = preg_replace('/[^\\/\\.]+\\/\\.\\.(?:\\/|$)/', '', $normal_path);
        } while ($path != $normal_path);
        $path = preg_replace('/\/$/', '', $path);
        return $path;
    }

    /**
     * 判断给定文件路径是否符合include和exclude规则
     * @static
     * @param string $file 路径字符串
     * @param null $include 包含文件的正则
     * @param null $exclude 排除文件的正则
     * @param null $m 从这个值可以获取包含正则的匹配分组
     * @return bool
     */
    public static function filter($file, $include = null, $exclude = null, &$m = null) {
        return !(($include && preg_match($include, $file, $m) == 0) || ($exclude && preg_match($exclude, $file) != 0));
    }

    /**
     * 查找指定目录下的文件或目录
     * @static
     * @param string $path 目录路径
     * @param null $include 要包含的文件正则，如果设置了，则只有符合这个正则的文件才能被请求到
     * @param null $exclude  要排除的文件正则，如果设置了，即使是包含的文件，也会被排除
     * @param bool $recursion 是否递归查找，默认是true
     * @param bool $include_dir 找到的结果是否包含目录，默认为false，不包含
     * @param array $files 递归用的存储容器，不应该被用到
     * @return array 数组
     */
    public static function find($path, $include = null, $exclude = null, $recursion = true, $include_dir = false, &$files = array()) {
        $path = realpath($path);
        if (is_dir($path)) {
            $path .= '/';
            $dir = dir($path);
            while (false !== ($entry = $dir->read())) {
                if ($entry == '.' || $entry == '..' || ($entry{0} == '.' && is_dir($path . $entry))) {
                    continue;
                }
                $entry = $path . $entry;
                if (is_dir($entry)) {
                    if ($include_dir && self::filter($entry, $include, $exclude)) {
                        $files[] = $entry;
                    }
                    if ($recursion) {
                        self::find($entry, $include, $exclude, true, $include_dir, $files);
                    }
                } else {
                    if (!self::filter($entry, $include, $exclude)) {
                        continue;
                    }
                    $files[] = $entry;
                }
            }
            $dir->close();
            return $files;
        } else if (is_file($path) && self::filter($path, $include, $exclude)) {
            $files[] = $path;
        }
        return $files;
    }

}