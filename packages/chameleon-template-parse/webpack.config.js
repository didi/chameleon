var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackDevServer = require('webpack-dev-server');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
  mode:'production',
  entry:{
    app:path.resolve(__dirname,'./old-test/index.js')
  },
  output:{
    path:path.resolve(__dirname,'distdev'),
    filename:'[name].js',
  },
  resolve:{
    extensions: [ '.js','.vue'],
  },
  devtool: 'inline-source-map',//方便调试的时候定位到源码，而不是经过打包压缩之后的代码；
  plugins:[
    new HtmlWebpackPlugin({
      title:'webpack-base-learn',
      filename:'index.html',
      template:'./index.html',
      inject: true

    }),
    new CleanWebpackPlugin(path.resolve(__dirname,'distdev')),
  ],
  devServer:{
    contentBase:path.join(__dirname,'distdev'),
    compress:true,
    port:9000,
  },
}