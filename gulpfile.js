var gulp = require('gulp');
var webpack = require('webpack-stream');
var concat = require('gulp-concat');
var less = require('gulp-less');
var babel = require('gulp-babel');
var connect = require('gulp-connect');
var merge = require('merge-stream');
var runSequence = require('run-sequence');

var webpackConf = require('./webpack.config.js');

gulp.task('build', function() {
    return gulp.src('js/main.js')
        .pipe(webpack(webpackConf))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('less-examples', function(){
    return gulp.src('./examples/**/less/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('../'))
        .pipe(connect.reload());
});

gulp.task('default', function(callback){
    runSequence('build', callback);
});

gulp.task('watch', function() {
    connect.server({
       root: './',
       livereload: true,
       port: 8003
     });

    gulp.watch(['js/**/*.js', 'js/**/*.jsx', 'js/**/*.less'], ['default']);
});
