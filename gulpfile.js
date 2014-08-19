var gulp = require('gulp');
var rename = require("gulp-rename");
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var complexity = require('gulp-complexity');

gulp.task('default', function() {
  return gulp.src('satellizer.js')
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(rename('satellizer.min.js'))
    .pipe(gulp.dest('.'))
    .pipe(gulp.dest('examples/client/vendor'));
});

gulp.task('copy', function() {
  return gulp.src('./satellizer.js')
    .pipe(gulp.dest('./examples/client/vendor'));
});

gulp.task('complexity', function() {
  return gulp.src('satellizer.js')
    .pipe(complexity());
});

