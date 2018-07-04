const gulp = require('gulp')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const concat = require('gulp-concat')

function styles() {
    return gulp.src('./public/src/scss/**/init.scss')
        .pipe(sass()).on('error', sass.logError)
        .pipe(rename({
            basename: 'style'
        }))
        .pipe(gulp.dest('./public/dist/css/'))
}

function scripts() {
    const jquery = './node_modules/jquery/dist/jquery.js'
    const util = './node_modules/bootstrap/js/dist/util.js'
    const modal = './node_modules/bootstrap/js/dist/modal.js'
    const portalJs = './public/src/js/**/*.js'

    return gulp.src([jquery, util, modal, portalJs])
    .pipe(concat('script.js'))
    .pipe(babel())
    .pipe(rename({
        basename: 'script',
        extname: '.js'
    }))
    .pipe(gulp.dest('./public/dist/js/'))
}

function watch() {
    gulp.watch('./public/src/scss/**/*.scss', styles)
    gulp.watch('./public/src/js/**/*.js', scripts)
}

exports.scripts = scripts
exports.watch = watch
exports.styles = styles

const build = gulp.series(gulp.parallel(styles, scripts));
gulp.task('default', build);