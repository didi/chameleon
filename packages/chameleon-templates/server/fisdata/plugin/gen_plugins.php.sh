#!/usr/bin/env sh

d=`pwd`

cd $d && ls -1 | grep 'class' | awk 'BEGIN{content="<?php\n"} {
    content = content "require_once(PLUGIN_ROOT . \""  $1  "\");\n"
} END { print content > "plugins.php" }'