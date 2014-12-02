var gulp       = require('gulp'),
    rename     = require('gulp-rename'),
    uglify     = require('gulp-uglify'),
    // plumber    = require('gulp-plumber'),
    complexity = require('gulp-complexity'),
    header     = require('gulp-header'),
    pkg        = require('./package.json');

// Banner for building
var banner = ['/**',
              ' * <%= pkg.name %> - <%= pkg.description %>',
              ' * @version <%= pkg.version %>',
              ' * @link <%= pkg.homepage %>',
              ' * @license <%= pkg.license %>',
              ' */',
              ''].join('\n');

gulp.task('minify', function() {
    return gulp.src('satellizer.js')
    // .pipe(plumber())
    .pipe(uglify())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('copy', ['minify'], function() {
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

gulp.task('default', ['copy', 'watch']);
