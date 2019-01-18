<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>FIS - 本地测试数据</title>
    <link rel="stylesheet" href="/fisdata/static/style.css" />
    <script type="text/javascript" src="/fisdata/static/jquery-2.0.0.min.js"></script>
</head>
<body>
<div id="container">
    <div id="nav">
    </div>
    <div id="main">
        <div id="top-toolbar" class="toolbar">
            <div id="datatype-choice-toolbar">
                {%foreach $datatypes as $datatype%}
                <label for="{%$datatype%}">
                    <input type="radio" id="{%$datatype%}" name="datatype" value="{%$datatype%}" {%if $default.datatype == $datatype %}checked="checked"{%/if%} /> {%$datatype%}
                </label>
                {%/foreach%}
            </div>
            <div id="render-toolbar">
                <a href="/" id="render-btn">Render</a>
            </div>
            <div id="data-choice-toolbar">
                {%if (count($default.list) > 0) and ($default.datatype !== 'adoc')%}
                <select name="data_id">
                    {%foreach $default.list as $k => $filepath%}
                        <option value="{%$k%}" filepath="{%$filepath%}" {%if $default.list_default == $k%}selected="selected"{%/if%}>{%$k%}</option>
                    {%/foreach%}
                </select>
                {%elseif (count($default.list) > 0)%}
                    {%foreach $default.list as $key => $data%}
                    <div class="adoc-data-box">
                        <div class="adoc-data-box-title">
                            <input type="radio" value="{%$key%}" name="data-id" value="{%$key%}" {%if $default.list_default == $key %}checked="checked"{%/if%} />&nbsp;&nbsp;数据{%$key%}
                        </div>
                        <div class="adoc-data-box-content">
                            {%$data%}
                        </div>
                    </div>
                    {%/foreach%}
                {%/if%}
            </div>
        </div>
        <div id="editor">{%$default.data%}</div>
        <div id="bottom-toolbar" class="toolbar">
            <input type="text"  id="save-path" default-value="{%$default.path%}" value="{%$default.path%}"/>
            <button type="submit" id="save-btn">Save</button>
        </div>
        <script type="text/javascript" src="/fisdata/static/ace.js"></script>
        <script>
            function save() {
                $.post('/fisdata/save', {
                    'data': editor.getValue(),
                    'path': $('#save-path').val()
                }, function(res) {
                    //reload
                    res = eval('(' + res + ')');
                    if (res.code != 0) {
                        alert(res.message);
                    } else {
                        window.location.reload();
                    }
                });
            }
            var editor = ace.edit("editor");
            editor.setTheme("ace/theme/textmate");
            editor.getSession().setMode("ace/mode/{%$default.datatype%}");

            $('#datatype-choice-toolbar input[type="radio"]').each(function() {
                $(this).click(function() {
                    editor.getSession().setMode("ace/mode/" + $(this).val());
                    //set datatype
                    document.cookie = 'FIS_DEBUG_DATATYPE=' + $(this).val() + '; path=/';
                    //reload
                    window.location.reload();
                });
            });

            $('#data-choice-toolbar input[type="radio"]').each(function() {
                $(this).click(function() {
                    var val = $(this).val();
                    document.cookie = 'FIS_DEBUG_DATA_ID={%$default.datatype%}|' + val + '; path=' + location.href + ';';
                });
            });

            $('#save-btn').click(function(){
                save();
            });

            $('#render-btn').click(function(event) {
                event.preventDefault();
                document.cookie = 'FIS_DEBUG_DATA=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
                save();
            });

            $('#data-choice-toolbar select').change(function() {
                var val = $(this).val();
                $('option', this).each(function() {
                    if (this.selected) {
                        $('#save-path').attr('default-value', $(this).attr('filepath')).val($(this).attr('filepath'));
                    }
                });
                document.cookie = 'FIS_DEBUG_DATA_ID={%$default.datatype%}|' + val + '; path=' + location.href + ';';
                $('#save-path').val();
                $.post('/fisdata/get', {
                    'path': $('#save-path').val()
                }, function(res) {
                    console.log(res);
                    editor.setValue(res);
                });
            });
        </script>
    </div>
</div>
</body>
</html>
