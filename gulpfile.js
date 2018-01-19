const gulp = require('gulp');
const webpack = require('webpack-stream');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
// const less = require('gulp-less');
const connect = require('gulp-connect');
const runSequence = require('run-sequence');
const babel = require('gulp-babel');

const webpackDevConf = require('./webpack.dev.config.js');
const webpackProductionConf = require('./webpack.production.config.js');
const webpackExamplesConf = require('./webpackExamples.config.js');

gulp.task('build', () => {
  return gulp.src('src/js/ScrollAreaWithCss.js')
    .pipe(webpack(webpackDevConf))
    .pipe(concat('scrollArea.js'))
    .pipe(babel({
      presets: ['env'],
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('build-nocss', () => {
  return gulp.src('src/js/ScrollAreaWithoutCss.js')
    .pipe(webpack(webpackDevConf))
    .pipe(concat('no-css.js'))
    .pipe(babel({
      presets: ['env'],
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('build-production', () => {
  return gulp.src('src/js/ScrollAreaWithCss.js')
    .pipe(webpack(webpackProductionConf))
    .pipe(concat('scrollArea.js'))
    .pipe(babel({
      presets: ['env'],
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('build-production-nocss', () => {
  return gulp.src('src/js/ScrollAreaWithoutCss.js')
    .pipe(webpack(webpackProductionConf))
    .pipe(concat('no-css.js'))
    .pipe(babel({
      presets: ['env'],
    }))
    .pipe(gulp.dest('dist'));
});

// gulp.task('less', () => {
//   return gulp.src('./src/less/scrollArea.less')
//     .pipe(less())
//     .pipe(gulp.dest('./dist/css/'));
// });

gulp.task('css', () => {
  return gulp.src('./src/css/scrollArea.css')
    .pipe(postcss())
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('build-examples', () => {
  return gulp.src('examples/js/main.js')
    .pipe(webpack(webpackExamplesConf))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('examples'))
    .pipe(connect.reload());
});

gulp.task('connect', () => {
  connect.server({
    root: 'dist',
    livereload: true,
    port: 8003,
  });
});

// gulp.task('less-examples', () => {
//   return gulp.src('./examples/less/**/*.less')
//     .pipe(less())
//     .pipe(gulp.dest('examples'))
//     .pipe(connect.reload());
// });

gulp.task('default', (callback) => {
  runSequence('build', 'build-nocss', 'less', ['build-examples', 'less-examples'], callback);
});

gulp.task('production', (callback) => {
  runSequence('build-production', 'build-production-nocss', 'less', callback);
});

gulp.task('watch', () => {
  connect.server({
    root: 'examples',
    livereload: true,
    port: 8003,
  });

  gulp.watch(['src/**/*.js', 'src/**/*.jsx', 'src/**/*.less'], ['default']);
  gulp.watch(['examples/**/js/**/*.js', 'examples/**/*.jsx'], ['build-examples']);
  gulp.watch('examples/**/*.less', ['less-examples']);
});
