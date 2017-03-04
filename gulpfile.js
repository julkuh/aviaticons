var async = require('async');
var gulp = require('gulp');
var runsequence = require('run-sequence');
var del = require('del');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');

// Build the WebFont and copy it to dist Folder including the css needed.
gulp.task('BuildFont', function (done) {
    var iconStream = gulp.src(['src/svg/*.svg'])
        .pipe(iconfont({
            fontName: 'aviaticons',
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2']
        }));

    async.parallel([
    function handleGlyphs(cb) {
            iconStream.on('glyphs', function (glyphs, options) {
                gulp.src('src/css/aviaticons.css')
                    .pipe(consolidate('lodash', {
                        glyphs: glyphs,
                        fontName: 'aviaticons',
                        fontPath: './',
                        className: 'ai'
                    }))
                    .pipe(gulp.dest('dist/aviaticons/font/'))
                    .on('finish', cb);
            });
    },
    function handleFonts(cb) {
            iconStream
                .pipe(gulp.dest('dist/aviaticons/font/'))
                .on('finish', cb);
    }
  ], done);
});

// Copy all demo related files into Dist
gulp.task('BuildDemo', function () {
    gulp.src(['./src/demo-files**/*', 'src/demo.html'])
        .pipe(gulp.dest('./dist'));
});

//clean dest folder
gulp.task('clean', function () {
    return del(['dist/**/*']);
});

gulp.task('watch', function () {
    gulp.watch(['./src/demo.html', './src/demo-files/demo.css'], ['BuildDemo']);
    gulp.watch(['./src/svg/**/*'], ['BuildFont']);
});

gulp.task('build', function (cb) {
    runsequence('clean', 'BuildFont', 'BuildDemo', cb);
});

gulp.task('default', ['build', 'watch']);