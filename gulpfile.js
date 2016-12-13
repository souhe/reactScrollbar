var gulp = require('gulp');
var webpack = require('webpack-stream');
var concat = require('gulp-concat');
var less = require('gulp-less');
var babel = require('gulp-babel');
var connect = require('gulp-connect');
var merge = require('merge-stream');
var runSequence = require('run-sequence');

var webpackDevConf = require('./webpack.dev.config.js');
var webpackProductionConf = require('./webpack.production.config.js');
var webpackExamplesConf = require('./webpackExamples.config.js');

gulp.task('build', function() {
    return gulp.src('src/js/ScrollAreaWithCss.js')
        .pipe(webpack(webpackDevConf))
        .pipe(concat('scrollArea.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build-nocss', function() {
    return gulp.src('src/js/ScrollAreaWithoutCss.js')
        .pipe(webpack(webpackDevConf))
        .pipe(concat('no-css.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build-production', function() {
    return gulp.src('src/js/ScrollAreaWithCss.js')
        .pipe(webpack(webpackProductionConf))
        .pipe(concat('scrollArea.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build-production-nocss', function() {
    return gulp.src('src/js/ScrollAreaWithoutCss.js')
        .pipe(webpack(webpackProductionConf))
        .pipe(concat('no-css.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('less', function(){
    return gulp.src('./src/less/scrollArea.less')
        .pipe(less())
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('build-examples', function(){
    return gulp.src('examples/js/main.js')
        .pipe(webpack(webpackExamplesConf))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('examples'))
        .pipe(connect.reload());
});

gulp.task("connect", function(){
    connect.server({
        root: 'dist',
        livereload: true,
        port: 8003
      });
});

gulp.task('less-examples', function(){
    return gulp.src('./examples/less/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('examples'))
        .pipe(connect.reload());
});

gulp.task('default', function(callback){
    runSequence('build', 'build-nocss', 'less', ['build-examples', 'less-examples'], callback);
});

gulp.task('production', function(callback){
    runSequence('build-production', 'build-production-nocss', 'less', callback);
});

gulp.task('watch', function() {
    connect.server({
       root: 'examples',
       livereload: true,
       port: 8003
     });

    gulp.watch(['src/**/*.js', 'src/**/*.jsx', 'src/**/*.less'], ['default']);
    gulp.watch(['examples/**/js/**/*.js', 'examples/**/*.jsx'], ['build-examples']);
    gulp.watch('examples/**/*.less', ['less-examples']);
});
