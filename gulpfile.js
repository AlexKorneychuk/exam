const   gulp                = require('gulp'),
        sass                = require('gulp-sass'),
        browserSync         = require('browser-sync'),
        concat              = require('gulp-concat'),
        uglify              = require('gulp-uglifyjs'),
        cssnano             = require('gulp-cssnano'),
        rename              = require('gulp-rename'),
        del                 = require('del'),
        jshint              = require('gulp-jshint'),
        imagemin            = require('gulp-imagemin'),
        pngquant            = require('imagemin-pngquant'),
        cache               = require('gulp-cache'),
        autoprefixer        = require('gulp-autoprefixer');
        babel               = require("gulp-babel");

gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.+(sass|scss)')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(concat('style.css'))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(cssnano())
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('scripts', function() {
    return gulp.src('app/js/components/**/*.js')
        .pipe(babel())
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({stream: true})) // Обновляем JS
});

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
       notify: false
    });
});

gulp.task('watch', function() {
    gulp.watch('app/scss/**/*.+(sass|scss)', ['sass']); // Наблюдение за scss файлами в папке scss
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', ['scripts'], browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});



gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {

    let buildCss = gulp.src('app/css/*.css')
        .pipe(gulp.dest('dist/css'))

    let buildJs = gulp.src('app/js/*.js') // Переносим скрипты в продакшен
        .pipe(gulp.dest('dist/js'))

    let buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
        .pipe(gulp.dest('dist/fonts'))

    let buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
        .pipe(gulp.dest('dist'));

});

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('default', ['browser-sync', 'sass', 'watch', 'scripts']);