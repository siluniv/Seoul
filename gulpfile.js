(function () {
    'use strict';

    // Include Gulp & Plugins
    let gulp = require('gulp');
    let sass = require('gulp-sass')(require('sass'));
    let rtlcss = require('gulp-rtlcss');
    let cleanCSS = require('gulp-clean-css');
    let autoprefixer = require('gulp-autoprefixer');
    let concat = require('gulp-concat');
    let rename = require('gulp-rename');
    let uglify = require('gulp-uglify');
    let jshint = require('gulp-jshint');
    let plumber = require('gulp-plumber');
    let gutil = require('gulp-util');
    let replace = require('gulp-replace');
    let size = require('gulp-size');
    let zip = require('gulp-zip');
    let fs = require('fs');

    // Set the compiler to use Dart Sass instead of Node Sass
    sass.compiler = require('dart-sass');

    let onError = function (err) {
        console.log('An error occurred:', gutil.colors.magenta(err.message));
        gutil.beep();
        this.emit('end');
    };

    // SASS
    gulp.task('sass', function (done) {
        return gulp.src('./assets/sass/*.scss')
            .pipe(plumber({errorHandler: onError}))
            .pipe(sass())
            .pipe(autoprefixer())
            .pipe(rename({suffix: '-min'}))
            .pipe(cleanCSS())
            .pipe(gulp.dest('./assets/css'))
            .pipe(rtlcss()) // Convert to RTL
            .pipe(rename({suffix: '-rtl'})) // Rename style.css to 'style-rtl.css'
            .pipe(gulp.dest('./assets/css')) // Output RTL stylesheets
            .pipe(size());
        done();
    });

    // inlineCSS
    gulp.task('inlinecss', function (done) {
        return gulp.src(['partials/inline-css.hbs'])
            .pipe(replace('@@compiled_css', fs.readFileSync('assets/css/style-min.css')))
            .pipe(gulp.dest('partials/compiled'));
        done();
    });

    // inlineCSS-RTL
    gulp.task('inlinecss-rtl', function (done) {
        return gulp.src(['partials/inline-css-rtl.hbs'])
            .pipe(replace('@@compiled_css_rtl', fs.readFileSync('assets/css/style-min-rtl.css')))
            .pipe(gulp.dest('partials/compiled'));
        done();
    });

    // JavaScript
    gulp.task('js', function (done) {
        return gulp.src([
            './bower_components/jquery/dist/jquery.js',
            './bower_components/bootstrap-transition/scripts/transition.js',
            './bower_components/zoom.js/dist/zoom.js',
            './bower_components/jquery.fitvids/jquery.fitvids.js',
            './bower_components/dragscroll/dragscroll.js',
            './node_modules/lazysizes/lazysizes.min.js',
            './node_modules/headroom.js/dist/headroom.js',
            './node_modules/headroom.js/dist/jQuery.headroom.js',
            './node_modules/evil-icons/assets/evil-icons.min.js',
            './node_modules/clipboard/dist/clipboard.js',
            './node_modules/prismjs/prism.js',
            './node_modules/lunr/lunr.js',
            './node_modules/lunr-languages/lunr.stemmer.support.js',
            './node_modules/lunr-languages/lunr.ru.js',
            './node_modules/lunr-languages/lunr.fr.js',
            './node_modules/lunr-languages/lunr.de.js',
            './node_modules/lunr-languages/lunr.es.js',
            './node_modules/lunr-languages/lunr.pt.js',
            './node_modules/lunr-languages/lunr.it.js',
            './node_modules/lunr-languages/lunr.fi.js',
            './node_modules/lunr-languages/lunr.nl.js',
            './node_modules/lunr-languages/lunr.da.js',
            './node_modules/lunr-languages/lunr.multi.js',
            './assets/js/ghosthunter.js',
            './assets/js/app.js'])
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(concat('app.js'))
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify())
            .pipe(gulp.dest('./assets/js'))
            .pipe(size());
        done();
    });

    // Watch
    gulp.task('watch', function () {
        gulp.watch('assets/sass/**/*.scss', gulp.series('build_css'));
        gulp.watch(['./assets/js/app.js', './assets/js/ghosthunter.js'], gulp.series('js'));
    });

    gulp.task(
        'build_css',
        gulp.series('sass', 'inlinecss', 'inlinecss-rtl')
    );

    gulp.task(
        'build',
        gulp.series('build_css', 'js')
    );

    gulp.task('zip', function () {
        return gulp.src([
            './**',
            '!node_modules/**',
            '!bower_components/**',
            '!.git/**',
            '!.DS_Store'
        ], {dot: true})
            .pipe(zip('seoul.zip'))
            .pipe(gulp.dest('../'));
        done();
    });

    gulp.task(
        'default',
        gulp.series('build', 'watch')
    );
})();