(function () {
	'use strict';

	angular
		.module('fct.core')
		.config(configName);

	configName.$inject = ['$mdThemingProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider'];

	function configName($mdThemingProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
		var themePalette = {
			primary: "blue",
			accent: "amber",
			warn: "red"
		};

		activate();

		function activate() {
			setTheme();
			setRoutes();
			// addInterceptors();
		}

		function setTheme() {
			$mdThemingProvider.theme('default')
				.primaryPalette(themePalette.primary)
				.accentPalette(themePalette.accent)
				.warnPalette(themePalette.warn);
		}

		function setRoutes() {
			$locationProvider.html5Mode(true);
			$urlRouterProvider.when('/', '/login');
			$urlRouterProvider.otherwise('/login');
			$stateProvider
				.state('out', {
					templateUrl: '/templates/layouts/out.html'
				})
				.state('in_fc', {
					templateUrl: '/templates/layouts/in_fc.html'
				})
				.state('in_tc', {
					templateUrl: '/templates/layouts/in_tc.html'
				})
				.state('out.login', {
					url: '/login',
					templateUrl: '/templates/pages/out/login.html'
					// controller: 'LoginController',
					// controllerAs: 'lc'
				})
				.state('out.register', {
					url: '/register',
					templateUrl: '/templates/pages/out/register.html',
					controller: 'FacultyRegistrationController',
					controllerAs: 'frc'
				})
				.state('in_tc.verifyFaculty', {
					url: '/team/login',
					templateUrl: '/templates/pages/out/login.html'
				})
				.state('in_tc.verifyCoordinator', {
					url: '/verifyCoordinator',
					templateUrl: '/templates/pages/in/verifyCoordinator.html',
					controller: 'VerifyCoordinatorController'
				})
				.state('in_tc.collegeList', {
					url: '/collegeList',
					templateUrl: '/templates/pages/in/collegeList.html'
				})
				.state('in_tc.eventRegistration', {
					url: '/eventRegistration',
					templateUrl: '/templates/pages/in/eventRegistration.html'
				})
				.state('in_tc.addEvent', {
					url: '/team/addEvent',
					templateUrl: '/templates/pages/in/addEvent.html',
					controller: 'AddEventController',
					controllerAs: 'aec',
					params : { editData: null, }
				})
				.state('in_tc.showEvent', {
					url: '/team/showEvent',
					templateUrl: '/templates/pages/in/showEvent.html',
					controller: 'ShowEventController',
					controllerAs: 'sec'
				});
		}
	}
})();
