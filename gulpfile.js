var gulp = require('gulp');
var webpack = require('webpack-stream');
var concat = require('gulp-concat');
var less = require('gulp-less');
var babel = require('gulp-babel');
var connect = require('gulp-connect');
var merge = require('merge-stream');

var webpackConf = require('./webpack.config.js');
var webpackExamplesConf = require('./webpackExamples.config.js');

gulp.task('build', function() {
    return gulp.src('src/js/scrollArea.jsx')
        .pipe(webpack(webpackConf))
        .pipe(concat('scrollArea.js'))
        .pipe(gulp.dest('dist'));
});

var folders = ['basic', 'changingChildren'];
gulp.task('build-examples', function(){
    var tasks = folders.map(function(folder){
        return gulp.src('examples/' + folder + '/js/main.js', {base: './'}) 
            .pipe(webpack( webpackExamplesConf ))
            .pipe(concat('main.js'))
            .pipe(gulp.dest('examples/' + folder ));
    });
    
    return merge(tasks)
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

gulp.task('default', ['build', 'build-examples', 'less-examples']);

gulp.task('watch', function() {
    connect.server({
       root: 'examples/basic',
       livereload: true,
       port: 8003
     });
     
    gulp.watch(['src/**/*.js', 'src/**/*.jsx', 'src/**/*.less'], ['build', 'build-examples']);
    gulp.watch(['examples/**/js/**/*.js', 'examples/**/*.jsx'], ['build-examples']);
    gulp.watch('examples/**/*.less', ['less-examples']);
});