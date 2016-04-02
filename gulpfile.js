var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var complexity = require('gulp-complexity');
var header = require('gulp-header');
var pkg = require('./package.json');
var ts = require('gulp-typescript');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var browserify = require('browserify');
var watchify = require('watchify');

var banner = ['/**',
  ' * Satellizer <%= pkg.version %>',
  ' * (c) 2016 <%= pkg.author.name %>',
  ' * License: <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('ts', function () {
  return gulp.src('src/**/*.ts')
    .pipe(ts({ noImplicitAny: true, out: 'output.js' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify', function() {
  return gulp.src('satellizer.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('.'));
});

// gulp.task('copy', ['minify'], function() {
//   return gulp.src('satellizer.js')
//     .pipe(gulp.dest('examples/client/vendor'))
//     .pipe(gulp.dest('examples/ionic/www/lib'));
// });


gulp.task('copy-es6', function() {
  return gulp.src('dist/bundle.js')
    .pipe(gulp.dest('examples/client/vendor'))
});

gulp.task('php', function() {
  return gulp.src('examples/client/**/*.*')
    .pipe(gulp.dest('examples/server/php/public'));
});

gulp.task('complexity', function() {
  return gulp.src('satellizer.js')
    .pipe(complexity());
});

gulp.task('watch', function() {
  gulp.watch('satellizer.js', ['copy', 'php', 'minify']);
  gulp.watch('src/**/*.js', ['browserify']);
});

gulp.task('browserify', function() {
  return browserify({ entries: 'src/ng1.js', externalHelpers: true })
    .transform(babelify, { presets: ['es2015'], plugins: ["external-helpers"] })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['browserify', 'copy', 'copy-es6', 'php', 'watch']);
