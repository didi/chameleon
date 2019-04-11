
const CMLNode = require('./cmlNode.js');
const path = require('path');
const MvvmCompiler = require('./compiler.js');

class mvvmGraphPlugin {
  constructor() {
    this.moduleRule = [ // 文件后缀对应module信息
      {
        test: /\.css|\.less$/,
        moduleType: 'style',
        attrs: {
          lang: 'less'
        }
      },
      {
        test: /\.stylus|\.styls$/,
        moduleType: 'style',
        attrs: {
          lang: 'stylus'
        }
      },
      {
        test: /\.js|\.interface$/,
        moduleType: 'script'
      },
      {
        test: /\.json$/,
        moduleType: 'json'
      },
      {
        test: /\.(png|jpe?g|gif|svg|mp4|webm|ogg|mp3|wav|flac|aac|woff|woff2?|eot|ttf|otf)(\?.*)?$/,
        moduleType: 'asset'
      }
    ]
  }
  apply(compiler) {
    let mvvmCompiler = new MvvmCompiler();
    
    compiler.plugin('should-emit', function(compilation) {
      mvvmCompiler.run(compilation.modules);
      // 返回false 不进入emit阶段
      return false;      
    })
    
  }
}

module.exports = mvvmGraphPlugin;