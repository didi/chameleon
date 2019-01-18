const gulp = require('gulp');
const uglify = require('gulp-uglify-es')["default"];

gulp.task('build', function () {
  gulp.src('src/**/**.js')
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
