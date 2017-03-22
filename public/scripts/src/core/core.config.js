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
							redirectLoggedIn: redirectLoggedIn
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
					.state('in_tc.dashboard', {
						url: '/dashboard',
						templateUrl: '/templates/pages/in/dashboard.html',
						controller: 'DashboardController',
						controllerAs: 'dc'
					})
					.state('in_tc.eventRegistrations', {
						url: '/eventRegistration',
						templateUrl: '/templates/pages/in/eventRegistration.html',
						controller: 'EventRegistrationController',
						controllerAs: 'erc'
					})
					.state('in_tc.addEvent', {
						url: '/member/events/create',
						templateUrl: '/templates/pages/in/addEvent.html',
						controller: 'AddEventController',
						controllerAs: 'ec',
					})
					.state('in_tc.settings', {
						url: '/member/settings',
						templateUrl: '/templates/pages/in/memberSettings.html',
						controller: 'MemberSettingsController',
						controllerAs: 'msc'
					})
					.state('in_tc.updateEvent', {
						url: '/member/events/:eventId/update',
						templateUrl: '/templates/pages/in/addEvent.html',
						controller: 'UpdateEventController',
						controllerAs: 'ec'
					})
					.state('in_tc.showEvent', {
						url: '/member/events',
						templateUrl: '/templates/pages/in/showEvent.html',
						controller: 'ShowEventController',
						controllerAs: 'sec'
					})
					.state('in_tc.eachEvent', {
						url: '/member/events/:eventId',
						templateUrl: '/templates/pages/in/eachEvent.html',
						controller: 'EachEventController',
						controllerAs: 'eec'
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
						templateUrl: '/templates/pages/in/faculty/confirmRegistration1.html',
						controller: 'ConfirmRegistrationsController1',
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
					})
					.state('in_fc.participant_registration', {
						url: '/participantRegistration',
						templateUrl: '/templates/pages/in/faculty/participantRegistration.html',
						controller: 'ParticipantRegistrationController',
						controllerAs: 'prc'
					});
			}
		}

		redirectFacultyNotLoggedIn.$inject = ['facultyAuthService', 'memberAuthService', '$q', '$state', '$timeout', '$rootScope'];

		function redirectFacultyNotLoggedIn(facultyAuthService, memberAuthService, $q, $state, $timeout, $rootScope) {
			var defer = $q.defer();
			var facultyAuthenticate = facultyAuthService.checkFacultyLoggedIn();
			if (facultyAuthenticate) {
				if ($rootScope.faculty.verified !== true && !$rootScope.alreadyRedirected) {
					$timeout(function () {
						$rootScope.alreadyRedirected = true;
						$state.go('in_fc.guidelines');
					});
				}

				defer.resolve();
			} else {
				var memberAuthenticate = memberAuthService.checkMemberLoggedIn();
				if (memberAuthenticate && !$rootScope.alreadyRedirected) {
					$timeout(function () {
						$rootScope.alreadyRedirected = true;
						$state.go('in_tc.dashboard');
					});
					defer.resolve();
				} else {
					$timeout(function () {
						$rootScope.alreadyRedirected = true;
						$state.go('out.login');
					});
					defer.reject();
				}
			}
			return defer.promise;
		}

		redirectTeamNotLoggedIn.$inject = ['memberAuthService', 'facultyAuthService', '$q', '$state', '$timeout', '$rootScope'];

		function redirectTeamNotLoggedIn(memberAuthService, facultyAuthService, $q, $state, $timeout, $rootScope) {
			var defer = $q.defer();
			var memberAuthenticate = memberAuthService.checkMemberLoggedIn();
			if (memberAuthenticate) {
				defer.resolve();
			} else {
				var facultyAuthenticate = facultyAuthService.checkFacultyLoggedIn();
				if (facultyAuthenticate && !$rootScope.alreadyRedirected) {
					$timeout(function () {
						$rootScope.alreadyRedirected = true;
						$state.go('in_fc.guidelines');
					});
					defer.resolve();
				} else {
					$timeout(function () {
						$rootScope.alreadyRedirected = true;
						$state.go('out.login');
					});
					defer.reject();
				}


			}

			return defer.promise;
		}


		redirectLoggedIn.$inject = ['facultyAuthService', 'memberAuthService', '$state', '$q', '$timeout', '$rootScope'];

		function redirectLoggedIn(facultyAuthService, memberAuthService, $state, $q, $timeout, $rootScope) {
			var defer = $q.defer();
			var facultyAuthenticate = facultyAuthService.checkFacultyLoggedIn();
			if (facultyAuthenticate && !$rootScope.alreadyRedirected) {
				defer.reject();
				$timeout(function () {
					$rootScope.alreadyRedirected = true;
					$state.go('in_fc.guidelines');
				});
			} else {
				var memberAuthenticate = memberAuthService.checkMemberLoggedIn();
				if (memberAuthenticate && !$rootScope.alreadyRedirected) {
					defer.reject();
					$timeout(function () {
						$rootScope.alreadyRedirected = true;
						$state.go('in_tc.dashboard');
					});
				} else {
					defer.resolve();
				}

			}
			return defer.promise;
		}

		// redirectTeamLoggedIn.$inject = ['memberAuthService','facultyAuthService', '$state', '$q', '$timeout'];
		//
		// function redirectTeamLoggedIn(memberAuthService, facultyAuthService, $state, $q, $timeout) {
		// 	// if(angular.isDefined($rootScope.faculty)){
		// 	//
		// 	// }
		//
		// 	var defer = $q.defer();
		// 	var authenticate = memberAuthService.checkMemberLoggedIn();
		// 	if (authenticate) {
		// 		defer.reject();
		// 		$timeout(function () {
		// 			$state.go('in_tc.verifyCoordinator');
		// 		});
		// 	} else {
		// 		defer.resolve();
		// 	}
		// 	return defer.promise;
		// }

	})();
