(function () {
	'use strict';

	angular
		.module('fct.core', [
			'ngAnimate',
			'ngMessages',
			'ngMaterial',
			'ui.router',
			'underscore',
			'ngFileUpload',
			'validation.match',
			'ngMdIcons',
			'angularMoment',
			// 'fct.api'
		]);

	angular
		.module('fct.core')
		.constant('TweenMax', TweenMax)
		.constant('TimelineMax', TimelineMax);
	//
	angular
		.module('fct.core')
		.run(initializeCore);

	initializeCore.$inject = ['$rootScope', '$interval', 'facultyAuthService'];

	function initializeCore($rootScope, $interval, facultyAuthService) {
		active();

		function active() {
			preloader();
			return check();
		}

		$rootScope.alreadyRedirected = false;

		function check() {
			if (facultyAuthService.checkFacultyLoggedIn()) {
				return facultyAuthService.checkVerified();
			}
		}

		function preloader() {
			$rootScope.$on('$viewContentLoading', startPreloader);
			$rootScope.$on('$viewContentLoaded', stopPreloader);
		}

		function startPreloader() {
			$rootScope.pageTransition = true;
		}


		function stopPreloader() {
			if ($rootScope.pageTransition) {
				$interval(function () {
					$rootScope.pageTransition = false;
				}, 1000);
			}
		}
	}
})();
