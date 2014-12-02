var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var complexity = require('gulp-complexity');

gulp.task('minify', function() {
  return gulp.src('satellizer.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename('satellizer.min.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('copy', function() {
  return gulp.src(['satellizer.js', 'satellizer.min.js'])
    .pipe(gulp.dest('examples/client/vendor'));
});

gulp.task('complexity', function() {
  return gulp.src('satellizer.js')
    .pipe(complexity());
});

gulp.task('watch', function() {
  gulp.watch('src/*.js', ['concat', 'copy', 'minify']);
});

gulp.task('default', ['concat', 'copy', 'minify', 'watch']);