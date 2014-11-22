var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var complexity = require('gulp-complexity');

gulp.task('concat', function() {
  gulp.src([
    'src/index.js',
    'src/config.js',
    'src/shared.js',
    'src/auth.js',
    'src/popup.js',
    'src/local.js',
    'src/oauth.js',
    'src/oauth1.js',
    'src/oauth2.js',
    'src/utils.js',
    'src/base64.js'
  ])
    .pipe(concat('satellizer.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify', function() {
  return gulp.src('dist/satellizer.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename('satellizer.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('copy', function() {
  return gulp.src(['dist/satellizer.js', 'dist/satellizer.min.js'])
    .pipe(gulp.dest('examples/client/vendor'));
});

gulp.task('complexity', function() {
  return gulp.src('dist/satellizer.js')
    .pipe(complexity());
});

gulp.task('watch', function() {
  gulp.watch('src/*.js', ['concat', 'copy', 'minify']);
});

gulp.task('php', function() {
  return gulp.src('examples/client/**/*.*')
    .pipe(gulp.dest('examples/server/php/public'));
});

gulp.task('java', function() {
  return gulp.src('examples/client/**/*.*')
    .pipe(gulp.dest('examples/server/java/src/main/resources/assets'));
});

gulp.task('default', ['concat', 'copy', 'minify', 'watch']);