// General Deps

const {src, watch, series, dest} = require ('gulp');
const browserSync = require ('browser-sync').create();
const del = require ('del');

// Compiler Deps

const pug = require ('gulp-pug');
const scss = require ('gulp-sass');
const babel = require ('gulp-babel');

// Extension Deps

const concat = require ('gulp-concat');
const groupMedia = require ('gulp-group-css-media-queries');
const autoprefixer = require ('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

// Compressing Deps

const imagemin = require ('gulp-imagemin');
const terser = require ('gulp-terser');

/*----------------------------------------------------------------------------*/

// Dev.

const html = () => {
    return src('source/pug/index.pug')
        .pipe(pug())
        .pipe(concat('index.html'))
        .pipe(dest('source/'))
}

const styles = () => {
    return src(['node_modules/normalize.css/normalize.css', 'source/scss/**/*.scss'])
        .pipe(scss({
            onError: browserSync.notify
        }))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            cascade: false,
            grid: true
        }))
        .pipe(groupMedia())
        .pipe(cleanCSS())
        .pipe(dest('source/css'))
        .pipe(browserSync.stream());
}

const uglify = () => {
    return src(['source/js/**/*.js','!source/js/main.min.js'])
        .pipe(concat('main.min.js'))
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(terser())
        .pipe(dest('source/js/'))
        .pipe(browserSync.stream());
}

const sWatch = () => {
    browserSync.init({
        server: 'source',
    });
    watch('source/*.html').on('change', browserSync.reload);
    watch('source/pug/**/*.pug', html);
    watch('source/scss/**/*.scss', styles);
    watch(['source/js/**/*.js', '!source/js/main.min.js'], uglify);
}

exports.dev = sWatch;

/*----------------------------------------------------------------------------*/

// Build

const clear = () => {
    return del('build')
}

const build = () => {
    src([
        'source/*.html',
        'source/css/style.min.css',
        'source/js/main.min.js',
        'source/fonts/**/*',
        'source/videos/**/*'
    ], {base: 'source'})
        .pipe(dest('build'))
}

const imgmin = () => {
    return src('source/images/**/*', {base: 'source'})
        .pipe(imagemin())
        .pipe(dest('build/images'))
}

exports.build = series (clear, build, imgmin);



