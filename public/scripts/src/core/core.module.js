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
			'ckeditor'
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

	initializeCore.$inject = ['$rootScope', '$interval'];

	function initializeCore($rootScope, $interval) {
		active();

		function active() {
			preloader();
		}

		$rootScope.alreadyRedirected = false;
			
	
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
