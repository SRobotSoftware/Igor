'use strict'

const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')

gulp.task('default', ['watch'], () => { })

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: 'www',
    },
  })
})

gulp.task('sass', () => {
  gulp.src('www/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('www/css'))
    .pipe(browserSync.stream())
})

gulp.task('watch', ['browserSync', 'sass'], () => {
  gulp.watch('www/**/*.html', browserSync.reload())
  gulp.watch('www/**/*.js', browserSync.reload())
  gulp.watch('www/scss/**/*.scss', ['sass'])
})
