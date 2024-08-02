import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import squoosh from 'gulp-libsquoosh';
import del from 'del';
import browser from 'browser-sync';
import { stacksvg } from 'gulp-stacksvg';

// Styles
export const styles = () => {
return gulp.src('source/sass/style.scss', { sourcemaps: true })
.pipe(plumber())
.pipe(sass().on('error', sass.logError))
.pipe(postcss([
autoprefixer(),
csso()
]))
.pipe(rename('style.css'))
.pipe(gulp.dest('build/css', { sourcemaps: '.' }))
.pipe(browser.stream());
}

// HTML
const html = () => {
return gulp.src('source/*.html')
.pipe(gulp.dest('build'));
}
/*
// Scripts
const scripts = () => {
return gulp.src('source/js/script.js')
.pipe(gulp.dest('build/js'))
.pipe(browser.stream());
}
*/
// Images
const optimizeImages = () => {
return gulp.src('source/img/**/*.{png,jpg}')
.pipe(squoosh())
.pipe(gulp.dest('build/img'))
}
const copyImages = () => {
return gulp.src('source/img/**/*.{png,jpg}')
.pipe(gulp.dest('build/img'))
}

// WebP
const createWebp = () => {
return gulp.src('source/img/**/*.{png,jpg}')
.pipe(squoosh({
webp: {}
}))
.pipe(gulp.dest('build/img'))
}

// Stack
export function stack() {
  return gulp.src('source/img/icons/*.svg')
    .pipe(stacksvg())
    .pipe(gulp.dest('build/img/icons'));
}

// Copy
const copy = (done) => {
gulp.src([
'source/fonts/**/*.{woff2,woff}',
'source/*.ico',
'source/*.webmanifest'
], {
base: 'source'
})
.pipe(gulp.dest('build'))
done();
}

// Clean
const clean = () => {
return del('build');
};

// Server
const server = (done) => {
browser.init({
server: {
baseDir: 'build'
},
cors: true,
notify: false,
ui: false,
});
done();
}

// Reload
const reload = (done) => {
browser.reload();
done();
}

// Watcher
const watcher = () => {
gulp.watch('source/sass/**/*.scss', gulp.series(styles));
gulp.watch('source/*.html', gulp.series(html, reload));
}

// Build
export const build = gulp.series(
clean,
copy,
optimizeImages,
gulp.parallel(
styles,
html,
createWebp
),
);

// Default
export default gulp.series(
clean,
copy,
copyImages,
gulp.parallel(
styles,
html,
createWebp
),
gulp.series(
server,
watcher
));
