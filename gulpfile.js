var gulp = require('gulp');
var webpack = require('gulp-webpack');
var concat = require('gulp-concat');
var less = require('gulp-less');
var webpackConf = require('./webpack.config.js');
var babel = require('gulp-babel');
var connect = require('gulp-connect');

gulp.task("webpack", function() {
    return gulp.src('./example/js/main.js')
        .pipe(webpack( webpackConf ))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('example'))
        .pipe(connect.reload());
});

gulp.task('build-less', function(){
    return gulp.src('./src/less/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('./dist/css'))
        .pipe(connect.reload());
});

gulp.task('build-less-example', function(){
    return gulp.src('./example/less/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('./example'))
        .pipe(connect.reload());
});

gulp.task("connect", function(){
    connect.server({
        root: 'dist',
        livereload: true,
        port: 8003
      });
});

gulp.task('babel', function(){
    return gulp.src('src/js/*.*')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['build-less', 'copy']);

gulp.task('default', ['build-less', 'babel', 'build-less-example', 'webpack']);

gulp.task('watch', function() {
    connect.server({
       root: 'example',
       livereload: true,
       port: 8003
     });
    gulp.watch('src/**/*.less', ['build-less']);
    gulp.watch(['src/**/*.js', 'src/**/*.jsx'], ['babel', 'webpack']);
    gulp.watch(['example/js/**/*.js', 'example/**/*.jsx'], ['webpack']);
    gulp.watch('example/**/*.less', ['build-less-example']);
});
