var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var ngAnnotate = require('gulp-ng-annotate')
var sourcemaps = require('gulp-sourcemaps')
var jshint = require('gulp-jshint');

gulp.task('js', function() {
  gulp.src(['ng/module.js', 'ng/**/*.js'])
//    .pipe(sourcemaps.init())
      .pipe(concat('app.js'))
//      .pipe(ngAnnotate())
//      .pipe(uglify())
//    .pipe(sourcemaps.write())
    .pipe(gulp.dest('assets'))
})

gulp.task('images', function() {
  gulp.src(['images/*'])
    .pipe(gulp.dest('assets'))
})

gulp.task('css', function() {
  gulp.src(['app.css'])
    .pipe(gulp.dest('assets'))
})

gulp.task('lint', function() {
  return gulp.src('./**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
});

gulp.task('bootstrap', function() {
  gulp.src(['node_modules/angular-ui-bootstrap/dist/*'])
    .pipe(gulp.dest('assets'))
})

gulp.task('watch:js', ['js'], function() {
  gulp.watch('ng/**/*.js', ['js'])
})

gulp.task('build', ['lint', 'js', 'css', 'images', 'bootstrap'])
