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
var addStream = require('add-stream');
gulp.task('sample', function() {
    var files = gulp.src(['dist/**/zconnected.js'])
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
    root: '/templates',
    module: 'ngZconnected.templates',
    standalone: true
};
gulp.task('compile', function() {
    var templates = gulp.src('src/templates/*.html')
        .pipe(angularTemplatecache('templates.tpl.js', templateOptions));
    return gulp.src(jsFiles)
        .pipe(concat('zconnected.js'))
        .pipe(addStream.obj(templates))
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
gulp.task('serve', ['compile', 'sample', 'watch'], function() {
    connect.server({
        root: ['.tmp/dist', '.'],
        livereload: true,
        port: 9002
    });
});

gulp.task('default', ['clean', 'compile']);
