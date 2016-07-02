var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var gulpBowerFiles = require('gulp-bower-files');
var _if = require('gulp-if');
var angularFilesort = require('gulp-angular-filesort');
var connect = require('gulp-connect');
var wiredep = require('wiredep').stream;
var jsFiles = 'src/**/*.js';
var jsDest = 'dist';
var jsDeps = './lib';
var inject = require('gulp-inject');
var del = require('del');
var angularTemplatecache = require('gulp-angular-templatecache');
gulp.task('sample', function() {
    var files = gulp.src(['src/**/*.js', 'src/**/*.css', 'src/**/*.less', 'dist/**/*.min.js', 'dist/**/*.tpl.js'])
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
    root: './src',
    module: 'ngZconnected'
};

gulp.task('templates', function() {
    return gulp.src('src/**/*.html')
        .pipe(angularTemplatecache('templates.tpl.js', templateOptions))
        .pipe(gulp.dest('dist'));
});
gulp.task('compile', function() {
    return gulp.src(jsFiles)
        .pipe(concat('zconnected.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('zconnected.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});
gulp.task('clean', function(cb) {
    del(['dist', '.tmp'], cb);
});

gulp.task('watch', function() {
    gulp.watch(['src/**'], ['sample']);
});
gulp.task('serve', ['compile', 'templates', 'sample', 'watch'], function() {
    connect.server({
        root: ['.tmp/dist', '.'],
        livereload: true,
        port: 9002
    });
});

gulp.task('default', ['clean', 'compile', 'templates']);
