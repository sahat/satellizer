var gulp = require('gulp');
var ngmin = require('gulp-ngmin');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');

gulp.task('default', function () {
  return gulp.src('angular-auth.js')
    .pipe(ngmin())
    .pipe(uglify())
    .pipe(rename('angular-auth.min.js'))
    .pipe(gulp.dest('.'));
});