var gulp = require('gulp'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  babel = require('gulp-babel')

gulp.task('scss', function () {
  return gulp.src('./public/src/scss/**/init.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./public/dist/css/'))
})

gulp.task('js', function () {
  return gulp.src('./public/src/js/**/*.js')
    .pipe(babel())
    .pipe(rename('script.js'))
    .pipe(gulp.dest('./public/dist/js/'))
})

gulp.task('watch', function () {
  gulp.watch('./public/src/scss/**/*.scss', ['scss'])
  gulp.watch('./public/src/js/**/*.js', ['js'])
})

gulp.task('default', ['scss', 'js'])
