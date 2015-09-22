var gulp = require('gulp');
var webpack = require('gulp-webpack');
var concat = require('gulp-concat');
var less = require('gulp-less');
var babel = require('gulp-babel');
var connect = require('gulp-connect');

var webpackConf = require('./webpack.config.js');
var webpackExamplesConf = require('./webpackExamples.config.js');

gulp.task('build', function() {
    return gulp.src('src/js/scrollArea.jsx')
        .pipe(webpack(webpackConf))
        .pipe(concat('scrollArea.js'))
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

gulp.task('build-examples', function(){
    return gulp.src('./examples/**/js/main.js')
        .pipe(webpack( webpackExamplesConf ))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('../'))
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
    return gulp.src('./examples/**/less/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('../'))
        .pipe(connect.reload());
});

gulp.task('default', ['build', 'less-examples']);

gulp.task('watch', function() {
    connect.server({
       root: 'examples/basic',
       livereload: true,
       port: 8003
     });
    gulp.watch(['src/**/*.js', 'src/**/*.jsx', 'src/**/*.less'], ['build']);
    gulp.watch(['examples/**/js/**/*.js', 'examples/**/*.jsx'], ['build-examples']);
    gulp.watch('examples/**/*.less', ['less-examples']);
});