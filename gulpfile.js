var async = require('async');
var gulp = require('gulp');
var runsequence = require('run-sequence');
var del = require('del');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');

// Global Config
var config = {
    fontName: 'aviaticons',
    cssClassPrefix: 'ai',
    formats: ['svg', 'ttf', 'eot', 'woff']
}

// Build the WebFont and copy it to dist Folder including the css needed.
gulp.task('BuildFont', function (done) {
    var iconStream = gulp.src(['src/svg/*.svg'])
        .pipe(iconfont({
            fontName: config.fontName,
            formats: config.formats,
            fontHeight: 1000,
            normalize: true
        }));

    async.parallel([
    function handleGlyphs(cb) {
            iconStream.on('glyphs', function (glyphs, options) {
                var replacementOptions = {
                    glyphs: glyphs,
                    fontPath: './',
                    fontName: config.fontName,
                    className: config.cssClassPrefix
                };

                gulp.src('src/css/aviaticons.css')
                    .pipe(consolidate('lodash', replacementOptions))
                    .pipe(gulp.dest('dist/aviaticons/'));

                gulp.src('src/demo.html')
                    .pipe(consolidate('lodash', replacementOptions))
                    .pipe(gulp.dest('dist/'))
                    .on('finish', cb);
            });
    },

    function handleFonts(cb) {
            iconStream
                .pipe(gulp.dest('dist/aviaticons/'))
                .on('finish', cb);
    }
  ], done);
});

// Copy all demo related files into Dist
gulp.task('BuildDemo', function () {
    gulp.src(['./src/demo-files/**/*'])
        .pipe(gulp.dest('./dist/demo-files'));
});

//clean dest folder
gulp.task('clean', function () {
    return del(['dist/**/*']);
});

gulp.task('watch', function () {
    gulp.watch(['./src/demo-files/**/*'], ['BuildDemo']);
    gulp.watch(['./src/svg/**/*', './src/demo.html'], ['BuildFont']);
});

gulp.task('build', function (cb) {
    runsequence('clean', 'BuildFont', 'BuildDemo', cb);
});

gulp.task('default', ['build', 'watch']);