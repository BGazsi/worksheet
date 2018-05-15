var gulp = require('gulp'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass');

gulp.task('sass', function () {
    return gulp.src('./public/src/scss/**/init.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./public/dist/css/'));
});

gulp.task('watch', function () {
    gulp.watch('./public/src/scss/**/*.scss', ['sass']);
});

gulp.task('default', ['sass']);