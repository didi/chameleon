const gulp = require('gulp');
const uglify = require('gulp-uglify-es')["default"];
const through = require('through2');

gulp.task('build', function () {
  gulp.src('src/**/**.js')
    .pipe(through.obj(function (file, encode, cb) {
      var result = file.contents.toString()
      result = result.replace(/@didi\/chameleon\-loader\/lib\//g, 'chameleon-loader/src/');

      // // 再次转为Buffer对象，并赋值给文件内容
      file.contents = new Buffer(result)
      // 以下是例行公事
      this.push(file)
      cb()
    }))
    .pipe(uglify({
      parse: {
        bare_returns: true

      },
      mangle: {
        toplevel: true
      },
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }))
    .pipe(gulp.dest('dist/'));
    
});
