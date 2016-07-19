var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var gulpBowerFiles = require('gulp-bower-files');
var _if = require('gulp-if');
var minifyCss = require('gulp-minify-css');
var headerfooter = require('gulp-headerfooter');
var ngAnnotate = require('gulp-ng-annotate');
var replace = require('gulp-replace');
var angularFilesort = require('gulp-angular-filesort');
var connect = require('gulp-connect');
var wiredep = require('wiredep').stream;
var jsFiles = 'src/**/*.js';
var cssFiles = 'src/**/*.css';
var jsDest = 'dist';
var jsDeps = './lib';
var inject = require('gulp-inject');
var del = require('del');
var angularTemplatecache = require('gulp-angular-templatecache');
var addStream = require('add-stream');
var pkg = require('./bower.json');
var annotateOptions = {
    remove: true,
    add: true,
    single_quotes: true
};
gulp.task('sample', function() {
    var files = gulp.src(['dist/**/' + pkg.name + '.js', 'dist/**/' + pkg.name + '.css'])
        .pipe(_if('*.js', angularFilesort()));
    gulp.src('sample/index.html')
        .pipe(wiredep({
            directory: './bower_components/',
            bowerJson: require('./bower.json'),
            devDependencies: true,
            dependencies: true
        }))
        .pipe(inject(files))
        .pipe(gulp.dest('.tmp/dist'))
        .pipe(connect.reload());
});
var templateOptions = {
    root: '/',
    module: 'ngZconnected.templates',
    standalone: true
};
gulp.task('compile', ['css', 'js']);
gulp.task('css', function() {
    gulp.src(['src/**/*.css', 'src/**/*.less'])
        .pipe(concat(pkg.name + '.css'))
        .pipe(gulp.dest('dist'))
        .pipe(rename(pkg.name + '.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('dist'));
});
gulp.task('js', function() {
    gulp.src(['src/**/*.js', 'src/**/*.html'])
        .pipe(_if('*.html', minifyHtml()))
        .pipe(_if('*.html', angularTemplatecache(pkg.name + '.tpl.js', templateOptions)))
        .pipe(angularFilesort())
        .pipe(_if('*.js', replace(/'use strict';/g, '')))
        .pipe(concat(pkg.name + '.js'))
        .pipe(ngAnnotate(annotateOptions))
        .pipe(gulp.dest('dist'))
        .pipe(rename(pkg.name + '.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});
gulp.task('clean', function(cb) {
    del(['dist', '.tmp'], cb);
});

gulp.task('watch', function() {
    gulp.watch(['src/**'], ['compile', 'sample']);
});
gulp.task('serve', ['compile', 'sample', 'watch'], function() {
    connect.server({
        root: ['.tmp/dist', '.'],
        livereload: true,
        port: 9002
    });
});

gulp.task('default', ['clean', 'compile']);
