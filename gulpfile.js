var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    pngquant = require('imagemin-pngquant')
    autoprefixer = require('gulp-autoprefixer'),
    concatJS = require('gulp-concat'),
    concatCSS = require('gulp-concat-css'),
    browserSync = require('browser-sync'),
    rimraf = require('rimraf'),
    reload = browserSync.reload;


// создадим переменную с настройками нашего dev сервера:
  var config = {
      server: {
          baseDir: "./app"
      },
      // tunnel: true,
      // host: 'localhost',
      // port: 9000,
      logPrefix: "web-rendel",
      notify: true
  };

//подключение библитотек css и js
  var requirences = {
    css: [
      './src/libs/bootstrap/bootstrap.css',
      // './bower_components/animate.css/animate.min.css',
      './src/libs/font-awesome/css/font-awesome.css'
    ],
    js: [
      './node_modules/jquery/dist/jquery.min.js',
      './src/libs/modernizr/modernizr.js',
      // './bower_components/respond/dest/respond.min.js'
    ]
  }

// пути для дальнейшей сборки
  var path = {
    build:{ //тут мы укажем куда складывать готовые после сборки файлы
      pug: 'app/',
      sass: 'app/css/',
      js: 'app/js/',
      img: 'app/img/',
      fonts: 'app/fonts/'
    },
    src:{ //Пути откуда брать исходники
      pug: 'src/pug/*.pug',
      sass: 'src/sass/*.sass',
      js: 'src/js/*.js',
      img: 'src/img/**/*.*',
      fonts: 'src/fonts/**/*.*'
    },
    watch:{ //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
      pug: 'src/pug/*.pug',
      sass: 'src/sass/*.sass',
      js: 'src/js/*.js',
      img: 'src/img/**/*.*',
      fonts: 'src/fonts/**/*.*'
    },
    clean: './app'
  }

// собираем библиотеки js и css
  gulp.task('build-requirences-css', function(){
    gulp.src(requirences.css)
      .pipe(concatCSS('style.css'))
      // .pipe(cssmin())
      .pipe(gulp.dest(path.build.sass))
      .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
  });

  gulp.task('biuld-requirences-js', function(){
    gulp.src(requirences.js)
      .pipe(concatJS('scripts.js'))
      // .pipe(uglify())
      .pipe(gulp.dest(path.build.js))
       .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
  });

// собираем pug и компилим в html
  gulp.task('pug:build', function(){
    gulp.src(path.src.pug) //Выберем файлы по нужному пути
      .pipe(pug({ // компилим их в html
        clients:true,
        pretty: true
      }))
      .pipe(gulp.dest(path.build.pug)) //билдим их в папку app
      .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
  });

// собираем cass и компилим в css
  gulp.task('sass:build', function(){
      gulp.src(path.src.sass)
        .pipe(sourcemaps.init()) // инициализируем sourcemap
        .pipe(sass({includePaths: require('node-bourbon').includePaths }).on('error', sass.logError))
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) // посмотреть вместо expanded -compressed
        .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
        //.pipe(cssmin()) // сжимаем наш sass
        .pipe(sourcemaps.write()) // пропишем карты
        .pipe(gulp.dest(path.build.sass)) // билдим файл в папку app
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
  });

// собираем js
  gulp.task('js:build', function(){
    gulp.src(path.src.js)
      .pipe(sourcemaps.init()) // инициализируем sourcemap
      .pipe(uglify()) // сжимаем наш js
      .pipe(sourcemaps.write()) // пропишем карты
      .pipe(gulp.dest(path.build.js)) // билдим файл в папку app
      .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
  });

  //собираем картинки
  gulp.task('image:build', function(){
    gulp.src(path.src.img) // выюираем наши картинки
      .pipe(imagemin({ // сжимаем их
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()],
        interlaced: true
      }))
      .pipe(gulp.dest(path.build.img)) // бросаем их в папку app
      .pipe(reload({stream:true}));
  });

// собираем шрифты
  gulp.task('fonts:build', function(){
    gulp.src(path.src.fonts)
      .pipe(gulp.dest(path.build.fonts))
  })

// соберем все таски в один
  gulp.task('build', [
    'pug:build',
    'sass:build',
    'js:build',
    'image:build',
    'fonts:build',
    'build-requirences-css',
    'biuld-requirences-js'
  ])

// web-server
gulp.task('webserver',['build'], function () {
  browserSync(config);
});

// очистка
gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

// watch за всеми тасками
  gulp.task('watch', function(){
    gulp.watch(path.watch.pug, ['pug:build']);
    gulp.watch(path.watch.sass, ['sass:build']);
    gulp.watch(path.watch.js,   ['js:build']);
  });

gulp.task('default', ['build', 'webserver', 'watch']);
