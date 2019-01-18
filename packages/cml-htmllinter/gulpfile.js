var gulp = require('gulp'),
    coveralls = require('gulp-coveralls'),
    eslint = require('gulp-eslint'),
    jscs = require('gulp-jscs'),
    istanbul = require('gulp-istanbul'),
    mocha = require('gulp-mocha'),
    publish = require('gulp-gh-pages');

var paths = {
    src: ['./lib/**/*.js'],
    testUnit: './test/unit/*.js',
    testFunc: './test/functional/*.js',
    site: ['./site/**/*']
};
paths.test = [].concat(paths.testUnit, paths.testFunc);

gulp.task('jscs', function () {
    gulp.src(paths.src
             .concat(paths.test))
        .pipe(jscs())
        .pipe(jscs.reporter());
});

// lints javascript files with eslint
// edit .eslintrc for configuration
gulp.task('lint', ['jscs'], function () {
    return gulp.src(paths.src
             .concat(paths.test)
             .concat('./gulpfile.js'))
        .pipe(eslint())
        .pipe(eslint.format());
});

// instruments js source code for coverage reporting
gulp.task('istanbul', function (done) {
    gulp.src(paths.src)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .on('finish', done);
});

// runs mocha tests
gulp.task('test', ['istanbul'], function (done) {
    // expose globals here for now
    // move these into their own file if they grow
    global.chai = require('chai');
    global.chai.use(require('chai-as-promised'));
    global.expect = global.chai.expect;

    gulp.src(paths.test, {read:false})
        .pipe(mocha({
            reporter: 'list'
        }))
        .pipe(istanbul.writeReports())
        .on('end', done);
});

// plato report
// TODO: think bout this a bit more
gulp.task('plato', function () {
    var plato = require('plato');
    gulp.src(paths.src)
        .pipe(plato('report', {}));
});

// jsdoc generation
gulp.task('jsdoc', function () {
    var jsdoc = require('gulp-jsdoc');
    gulp.src(paths.src.concat('README.md'))
        .pipe(jsdoc.parser({
            plugins: [
                'plugins/escapeHtml',
                'plugins/markdown'
            ],
            markdown: {
                parser: 'gfm',
                githubRepoOwner: 'htmllint',
                githubRepoName: 'htmllint'
            }
        }))
        .pipe(jsdoc.generator('./site/api', {
            // template
            path: 'ink-docstrap',
            theme: 'cerulean',
            systemName: 'htmllint',
            navType: 'vertical',
            linenums: true,
            inverseNav: true,
            outputSourceFiles: true
        }));
});

gulp.task('doc:gen', ['jsdoc']);

gulp.task('doc:pub', ['doc:gen'], function () {
    gulp.src(paths.site)
        .pipe(publish({
            cacheDir: '.tmp'
        }));
});

// runs on travis ci (lints, tests, and uploads to coveralls)
gulp.task('travis', ['lint', 'test'], function () {
    gulp.src('coverage/**/lcov.info')
        .pipe(coveralls());
});

gulp.task('default', [
    'lint',
    'test'
]);
