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
					templateUrl: '/templates/layouts/out.html',
					resolve: {
						redirectFacultyLoggedIn: redirectFacultyLoggedIn,
						redirectTeamLoggedIn: redirectTeamLoggedIn
					}
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
					controller: 'MemberLayoutController',
					controllerAs: 'mlayc',
					templateUrl: '/templates/layouts/in_tc.html',
					resolve: {
						redirectTeamNotLoggedIn: redirectTeamNotLoggedIn
					}
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
					url: '/forgotPasswordSet?token&id',
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
				.state('out.member_forgotPasswordSet', {
					url: '/member/forgotPasswordSet?token&id',
					templateUrl: '/templates/pages/out/member/forgotPasswordSet.html',
					controller: 'MemberForgotPasswordSetController',
					controllerAs: 'mfpsc'
				})
				.state('out.member_forgotPasswordApply', {
					url: '/member/forgotPasswordApply',
					templateUrl: '/templates/pages/out/member/forgotPasswordApply.html',
					controller: 'MemberForgotPasswordApplyController',
					controllerAs: 'mfpac'
				})
				.state('in_tc.verifyCoordinator', {
					url: '/member/verifyCoordinator',
					templateUrl: '/templates/pages/in/verifyCoordinator.html',
					controller: 'VerifyCoordinatorController',
					controllerAs: 'vcc'
				})
				.state('in_tc.collegeList', {
					url: '/member/collegeList',
					templateUrl: '/templates/pages/in/collegeList.html'
				})
				.state('in_tc.eventRegistrations', {
					url: '/member/eventRegistration',
					templateUrl: '/templates/pages/in/eventRegistration.html'
				})
				.state('in_tc.addEvent', {
					url: '/member/addEvent',
					templateUrl: '/templates/pages/in/addEvent.html',
					controller: 'AddEventController',
					controllerAs: 'aec',
					params: {
						editData: null,
					}
				})
				.state('in_tc.settings', {
					url: '/member/settings',
					templateUrl: '/templates/pages/in/memberSettings.html',
					controller: 'MemberSettingsController',
					controllerAs: 'msc'
				})
				.state('in_tc.showEvent', {
					url: '/showEvent',
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
				})
				.state('in_fc.confirm_registration', {
					url: '/confirm/registrations',
					templateUrl: '/templates/pages/in/faculty/confirmRegistration.html',
					controller: 'ConfirmRegistrationsController',
					controllerAs: 'crc'
				})
				.state('in_fc.registration_details', {
					url: '/registrations',
					templateUrl: '/templates/pages/in/faculty/registrationDetails.html',
					controller: 'RegistrationDetailsController',
					controllerAs: 'rdc'
				})
				.state('in_fc.student_coordinator', {
					url: '/studentCoordinator',
					templateUrl: '/templates/pages/in/faculty/addStudentCordinator.html',
					controller: 'AddStudentController',
					controllerAs: 'ascc'
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

	redirectTeamNotLoggedIn.$inject = ['memberAuthService', '$q', '$state', '$timeout'];

	function redirectTeamNotLoggedIn(memberAuthService, $q, $state, $timeout) {
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


	redirectFacultyLoggedIn.$inject = ['facultyAuthService', '$state', '$q', '$timeout', '$rootScope'];

	function redirectFacultyLoggedIn(facultyAuthService, $state, $q, $timeout, $rootScope) {
		var defer = $q.defer();
		var authenticate = facultyAuthService.checkFacultyLoggedIn();
		if (authenticate) {
			defer.reject();
			$timeout(function () {
				$state.go('in_fc.guidelines');
			});
		} else {
			defer.resolve();
		}
		return defer.promise;
	}

	redirectTeamLoggedIn.$inject = ['memberAuthService', '$state', '$q', '$timeout', '$rootScope'];

	function redirectTeamLoggedIn(memberAuthService, $state, $q, $timeout, $rootScope) {
		// if(angular.isDefined($rootScope.faculty)){
		//
		// }

		var defer = $q.defer();
		var authenticate = memberAuthService.checkMemberLoggedIn();
		if (authenticate) {
			defer.reject();
			$timeout(function () {
				$state.go('in_tc.verifyCoordinator');
			});
		} else {
			defer.resolve();
		}
		return defer.promise;
	}

})();
