(function () {
	'use strict';

	angular
		.module('fct.core')
		.config(configName);

	configName.$inject = ['$mdThemingProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider'];

	function configName($mdThemingProvider, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
		var themePalette = {
			primary: "blue",
			accent: "amber",
			warn: "red"
		};

		activate();

		function activate() {
			setTheme();
			setRoutes();
			addInterceptors();
		}

		function addInterceptors() {
			$httpProvider.interceptors.push('authInterceptor');
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
					templateUrl: '/templates/layouts/in_fc.html',
					controller: 'FacultyLayoutController',
					controllerAs: 'flayc',
					resolve: {
						redirectFacultyNotLoggedIn: redirectFacultyNotLoggedIn
					}
				})
				.state('in_tc', {
					controller: 'TeamLayoutController',
					controllerAs: 'tlac',
					templateUrl: '/templates/layouts/in_tc.html'
				})
				.state('out.login', {
					url: '/login',
					templateUrl: '/templates/pages/out/login.html',
					controller: 'FacultyLoginController',
					controllerAs: 'flc'
				})
				.state('out.register', {
					url: '/register',
					templateUrl: '/templates/pages/out/register.html',
					controller: 'FacultyRegistrationController',
					controllerAs: 'frc'
				})
				.state('out.forgotPasswordApply', {
					url: '/forgotPasswordApply',
					templateUrl: '/templates/pages/out/forgotPasswordApply.html',
					controller: 'FacultyForgotPasswordApplyController',
					controllerAs: 'ffpac'
				})
				.state('out.forgotPasswordSet', {
					url: '/forgotPasswordSet?token',
					templateUrl: '/templates/pages/out/forgotPasswordSet.html',
					controller: 'FacultyForgotPasswordSetController',
					controllerAs: 'ffpsc'
				})
				.state('out.member_login', {
					url: '/member/login',
					templateUrl: '/templates/pages/out/member/login.html',
					controller: 'MemberLoginController',
					controllerAs: 'mlc'
				})
				.state('out.member_register', {
					url: '/member/register',
					templateUrl: '/templates/pages/out/member/register.html',
					controller: 'MemberRegistrationController',
					controllerAs: 'mrc'
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
				.state('in_tc.eventRegistrations', {
					url: '/eventRegistration',
					templateUrl: '/templates/pages/in/eventRegistration.html'
				})
				.state('in_tc.addEvent', {
					url: '/team/addEvent',
					templateUrl: '/templates/pages/in/addEvent.html',
					controller: 'AddEventController',
					controllerAs: 'aec',
					params: {
						editData: null,
					}
				})
				.state('in_tc.showEvent', {
					url: '/team/showEvent',
					templateUrl: '/templates/pages/in/showEvent.html',
					controller: 'ShowEventController',
					controllerAs: 'sec'
				})
				.state('in_fc.guidelines', {
					url: '/guidelines',
					templateUrl: '/templates/pages/in/guidelines.html'
				})
				.state('in_fc.settings', {
					url: '/settings',
					templateUrl: '/templates/pages/in/facultySettings.html',
					controller: 'FacultySettingsController',
					controllerAs: 'fsc'
				});
		}
	}

	redirectFacultyNotLoggedIn.$inject = ['facultyAuthService', '$q', '$state', '$timeout', '$rootScope'];

	function redirectFacultyNotLoggedIn(facultyAuthService, $q, $state, $timeout, $rootScope) {
		var defer = $q.defer();
		var authenticate = facultyAuthService.checkFacultyLoggedIn();
		if (authenticate) {
			if ($rootScope.faculty.verified !== true) {
				$timeout(function () {
					$state.go('in_fc.guidelines');
				});
			}

			defer.resolve();
		} else {
			$timeout(function () {
				$state.go('out.login');
			});
			defer.reject();
		}

		return defer.promise;
	}

	redirectTeamNotLoggedIn.$inject = ['memberAuthService', '$q', '$state', '$timeout', '$rootScope'];

	function redirectTeamNotLoggedIn(memberAuthService, $q, $state, $timeout, $rootScope) {
		var defer = $q.defer();
		var authenticate = memberAuthService.checkMemberLoggedIn();
		if (authenticate) {
			defer.resolve();
		} else {
			$timeout(function () {
				$state.go('out.login');
			});
			defer.reject();
		}

		return defer.promise;
	}

})();
