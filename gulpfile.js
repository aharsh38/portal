var gulp = require('gulp');
var config = require('./gulpConfig.js');
var clc = require('cli-color');
var path = require('path');
var runSequence = require('run-sequence');

var plugins = require("gulp-load-plugins")({
	pattern: ['gulp-*', 'gulp.*'],
	replaceString: /\bgulp[\-.]/,
	camelize: true,
	lazy: true
});

var watch = false;

var gulp_src = gulp.src;
gulp.src = function () {
	return gulp_src.apply(gulp, arguments)
		.pipe(plugins.plumber(function (error) {
			plugins.util.log(clc.red.bold('Error (' + error.plugin + '): ' + error.message));
			plugins.util.log(clc.yellow.bold('Error File:' + error.fileName));
			plugins.util.log(clc.blue.bold('Error Cause: ' + error.cause));
			this.emit('end');
		}));
};

gulp.task('scripts::vendors', function () {
	var vendorScriptsArray = [];
	var basePath = config.vendors.basePath;
	config.vendors.files.map(function (fileName) {
		vendorScriptsArray.push(basePath + '**/' + fileName);
	});

	gulp.src(vendorScriptsArray)
		.pipe(gulp.dest(config.vendors.vendorPath))
		.pipe(plugins.concat(config.vendors.name))
		.pipe(gulp.dest(config.vendors.destPath));
});

gulp.task('sass::build', function () {
	gulp.src(config.sass.srcPath)
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.sass({
			outputStyle: 'compressed'
		}))
		.pipe(plugins.autoprefixer('last 2 versions'))
		.pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest(config.sass.destPath));
});

gulp.task('scripts::build', function () {
	var src_ang_path = [];
	config.develop.angular_files_order.map(function (el) {
		var endString = '/**/*.' + el + '.js';
		src_ang_path.push(path.join(config.develop.srcPath, endString));
	});

	return gulp.src(src_ang_path)
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.concat('fcApp.js'))
		.pipe(gulp.dest(config.develop.mainPath))
		.pipe(plugins.rename('fcApp.min.js'))
		.pipe(plugins.uglify())
		.pipe(plugins.sourcemaps.write('./'))
		.pipe(gulp.dest(config.develop.distPath));
});

function isChanged(file) {
	if (file.extname == '.js') {
		return runSequence(
			'scripts::build'
		);
	} else if (file.extname == '.scss') {
		return runSequence(
			'sass::build'
		);
	}
}

var watchFilter = plugins.filter(isChanged);

gulp.task('watch', ['scripts::build', 'sass::build'], function () {
	watch = true;

	return gulp.src('*', {
			read: false
		})
		.pipe(plugins.watch(config.develop.watch_src, {
			read: false
		}))
		.pipe(watchFilter);
});

gulp.task('node', function () {
	plugins.nodemon({
			script: 'server.js',
			ext: 'js',
			watch: './api',
			ignore: ['./node_modules/**']
		})
		.on('start', ['watch'])
		.on('change', ['watch'])
		.on('restart', function () {
			console.log('Restarting');
		});
});


gulp.task('default', ['node']);
