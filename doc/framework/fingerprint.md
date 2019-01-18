# 文件指纹

文件指纹是文件的唯一标识，以文件的内容生成hash值作为文件名称的一部分。在开启强缓存的情况下，如果文件的 URL 不发生变化，无法刷新浏览器缓存。文件指纹用于更新浏览器的缓存。通过`hash`字段[配置](./config.html#文件指纹)。 默认图片资源开启hash，build模式开启hash。下图为web端开启文件指纹的打包结果。
<img src="../assets/fingerprint.jpg" width="600px" />
