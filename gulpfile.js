var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var complexity = require('gulp-complexity');
var header = require('gulp-header');
var pkg = require('./package.json');

var banner = ['/**',
  ' * Satellizer <%= pkg.version %>',
  ' * (c) 2016 <%= pkg.author.name %>',
  ' * License: <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('minify', function() {
  return gulp.src('satellizer.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('.'));
});

gulp.task('copy', ['minify'], function() {
  return gulp.src('satellizer.js')
    .pipe(gulp.dest('examples/client/vendor'))
    .pipe(gulp.dest('examples/ionic/www/lib'));
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
});

gulp.task('default', ['copy', 'php', 'watch']);
