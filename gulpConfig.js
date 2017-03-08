module.exports = {
	"develop": {
		"srcPath": "./public/scripts/src",
		"mainPath": "./public/scripts/main",
		"distPath": "./public/scripts/dist",
		"name": "fct_app.min.js",
		"watch_src": ['./public/scripts/src/**/*.js', './**/*.html', './public/sass/**/*.scss', './api/**/*.js'],
		"angular_files_order": ['module', 'config', 'service', 'factory', 'filter', 'directive', 'controller', 'animation']
	},
	"vendors": {
		"vendorPath": "./public/scripts/vendors",
		"destPath": "./public/scripts/dist",
		"basePath": "./bower_components/",
		"name": "vendor.min.js",
		"files": [
			'underscore-min.js',
			'TimelineMax.min.js',
			'TweenMax.min.js',
			'EasePack.min.js',
			'moment-with-locales.min.js',
			'moment-timezone-with-data.min.js',
			// 'svg-morpheus.js',
			'angular.min.js',
			'angular-animate.min.js',
			'angular-aria.min.js',
			'angular-messages.min.js',
			'angular-route.min.js',
			'angular-material.min.js',
			'angular-ui-router.min.js',
			'angular-underscore-module.js',
			'ng-file-upload.min.js',
			'angular-validation-match.min.js',
			'angular-material-icons.min.js',
			'angular-moment.min.js',
			'ckeditor.js'
		]
	},
	"sass": {
		"srcPath": "./public/sass/**/*.scss",
		"destPath": "./public/css"
	}


};
