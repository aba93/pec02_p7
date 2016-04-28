/**
 * Created by AlvaroBelmonte on 16/04/2016.
 */
var gulp        = require('gulp'),
    del         = require('del'),
    browserSync = require('browser-sync').create(),
    concat      = require('gulp-concat'),
    jshint      = require('gulp-jshint'),
    stylish     = require('jshint-stylish'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify');


// Definición de directorios origen
var srcPaths = {
    scripts:  'src/js/',
    styles:   'src/sass/',
    data:     'src/data/',
    files:    'src/'
};


// Definición de directorios destino
var distPaths = {
    scripts:  'dist/js/',
    styles:   'dist/css/',
    data:     'dist/data/',
    files:    'dist/'
};


// Limpieza del directorio dist
gulp.task('clean', function(cb) {
    del([ distPaths.files+'*.html', distPaths.data+'**/*', distPaths.scripts+'*.js', distPaths.styles+'*.css'], cb);
});


// Copia de los cambios en los ficheros html en el directorio dist.
gulp.task('html', function() {
    return gulp.src([srcPaths.files+'*.html'])
        .pipe(gulp.dest(distPaths.files))
        .pipe(browserSync.stream());
});

gulp.task('json', function() {
    return gulp.src([srcPaths.data+'*.json'])
        .pipe(gulp.dest(distPaths.data))
        .pipe(browserSync.stream());
});


/*
 * Procesamiento de ficheros SCSS para la generación de los ficheros
 * CSS correspondientes. Los sourcemaps en este caso se generan dentro
 * del propio fichero.
 */
gulp.task('css', function() {
    return gulp.src([srcPaths.styles+'**/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(distPaths.styles))
        .pipe(browserSync.stream());
});


/*
 * Procesamiento de ficheros JS mediante JSHint para detección de errores.
 * Este proceso es previo al tratamiento de los ficheros JS para la
 * obtención del fichero concatenado y minificado.
 */
gulp.task('lint', function() {
    return gulp.src([srcPaths.scripts+'**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});


/*
 * Procesamiento de ficheros JS para la generación de un fichero
 * final único y minificado. Los sourcemaps se generan en una
 * carpeta independiente en vez de en el propio fichero.
 */
gulp.task('js', ['lint'], function() {
    return gulp.src([srcPaths.scripts+'app.js', srcPaths.scripts+'extra.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(distPaths.scripts))
        .pipe(browserSync.stream());
});


/*
 * Tarea para lanzar el proceso de servidor mediante BrowserSync.
 * Antes de comenzar la propia tarea ejecuta las tareas de las que tiene
 * dependencia: html, imagemin, css y js necesarias para disponer
 * del proyecto en dist, ya que cada vez que se lanza gulp, se hace una
 * limpieza de dicho directorio.
 *
 * En este caso se trabaja con un servidor local mediante un proxy
 * y se define la ruta de partida, así como los navegadores a lanzar
 * en caso de estar disponibles en el equipo.
 *
 * Adicionalmente se crean los watchers para procesar los cambios que se
 * puedan producir en los archivos sensibles para el proyecto.
 */
gulp.task('serve', ['html', 'css', 'json', 'js'], function() {
    browserSync.init({
        logLevel: "info",
        browser: ["google chrome"],
        proxy: "localhost:80",
        startPath: "/PEC02_P7/dist/"
    });

    gulp.watch(srcPaths.files+'*.html', ['html']);
    gulp.watch(srcPaths.styles+'**/*.scss', ['css']);
    gulp.watch(srcPaths.data+'**/*.json', ['json']);
    gulp.watch(srcPaths.scripts+'**/*.js', ['js']);
});

/*
 * Definción de la tarea por defecto que en este caso limpia el directorio destino
 * y lanza la tarea de servidor.
 */
gulp.task('default', ['clean', 'serve'], function() {});