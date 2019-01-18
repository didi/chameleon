const gulp = require('gulp');
const uglify = require('gulp-uglify-es').default;
const through = require('through2');
const path = require('path');
const devPath = path.join(__dirname,'../chameleon-cli/node_modules/chameleon-loader/src')
const distPathMap = {
  build: {
    dist: 'dist',
    interface: 'dist/interface-check'
  },
  dev: {
    dist: devPath,
    interface: path.join(devPath,'interface-check')
  }
}

let EntryTask = gulp.env._[0];
gulp.task('before', function () {
  gulp.src([
    'lib/**/**.js',
    '!lib/interface-check/**/**.js'
  ])
  .pipe(through.obj(function (file, encode, cb) {
    var result = file.contents.toString()
    result = result.replace(/@didi\/chameleon\-loader\/lib\//g,'chameleon-loader/src/');

    // // 再次转为Buffer对象，并赋值给文件内容
    file.contents = new Buffer(result)
    // 以下是例行公事
    this.push(file)
    cb()
  }))
  .pipe(uglify({
    parse: {
      bare_returns: true,

    },
    mangle: {
      toplevel: true
    },
    compress: {
      drop_console: true,
      drop_debugger: true
    }
  }))
  .pipe(gulp.dest(distPathMap[EntryTask].dist));

});

gulp.task('build', ['before'],function () {
  gulp.src('lib/interface-check/**/**.js')
  .pipe(gulp.dest(distPathMap[EntryTask].interface));
});


gulp.task('dev', ["build"], function() {
  gulp.watch('lib/**/**.js',['build']);
})

