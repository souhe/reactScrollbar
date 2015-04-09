var gulp = require('gulp');
var webpack = require('gulp-webpack');
var concat = require('gulp-concat');
var less = require('gulp-less');
var webpackConf = require('./webpack.config.js');
var connect = require('gulp-connect');

gulp.task("webpack", function() {
    return gulp.src('src/js/main.js')
        .pipe(webpack( webpackConf ))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
});

gulp.task("connect", function(){
    connect.server({
        root: 'dist',
        livereload: true,
        port: 8003
      });
});

gulp.task('build-less', function(){
    return gulp.src('./src/less/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('./dist/css'))
        .pipe(connect.reload());
});

gulp.task('copy', function() {
    gulp.src('src/index.html')
      .pipe(gulp.dest('dist'));

    gulp.src('src/font/*.*')
      .pipe(gulp.dest('./dist/font'));
});

gulp.task('default', ['build-less', 'webpack', 'copy']);

gulp.task('watch', function() {
    connect.server({
       root: 'dist',
       livereload: true,
       port: 8003
     });
    gulp.watch('src/**/*.less', ['build-less']);
    gulp.watch(['src/**/*.js', 'src/**/*.jsx'], ['webpack']);
});
