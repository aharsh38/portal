(function () {
	'use strict';

	angular
		.module('fct.api', []);
})();

(function () {
	'use strict';

	angular
		.module('fct_app', [
			'fct.api',
			'fct.core'
		]);
})();

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
						templateUrl: '/templates/pages/in/dashboard.html'
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

(function () {
	'use strict';

	angular
		.module('fct.api')
		.factory('authInterceptor', authInterceptor);

	authInterceptor.$inject = ['$window', '$q', '$location'];

	function authInterceptor($window, $q, $location) {
		var service = {
			request: request,
			requestError: requestError,
			response: response,
			responseError: responseError
		};

		return service;

		function getToken() {
			if ($window.localStorage['auth-token']) {
				return $window.localStorage['auth-token'];
			} else {
				return null;
			}
		}

		function request(config) {
			var token = getToken();
			if (token !== null) {
				var authHead = 'Bearer ' + token;
				config.headers['Authorization'] = authHead;
			}
			// console.log(config);
			return config;
		}

		function requestError(rejection) {
			// console.log("Request Rejection",rejection);
			return $q.reject(rejection);
		}

		function response(response) {
			// console.log("response",response);
			return response || $q.when(response);
		}

		function responseError(rejection) {
			// console.log("response rejection", rejection);
			if (rejection.status == 403) {
				$location.path('/login');
			}
			return $q.reject(rejection);
		}
	}
})();

(function () {
	'use strict';

	angular
	  .module('fct.core')
	  .factory('eventService', eventService);

	eventService.$inject = ['$http'];

	function eventService($http) {
	  var service = {
	    addEvent: addEvent,
			getEvent: getEvent,
			updateEvent: updateEvent,
			getSingleEvent: getSingleEvent,
			deleteEvent: deleteEvent,
	  };

	  return service;

	  function addEvent(eventData) {
			return $http.post('/api/members/events', eventData)
				.then(resolveFunc)
				.catch(rejectFunc);
	  }

	  function getEvent() {
			return $http.get('/api/members/events')
				.then(resolveFunc)
				.catch(rejectFunc);
	  }

	  function getSingleEvent(id) {
			return $http.get('/api/members/events/' + id)
				.then(resolveFunc)
				.catch(rejectFunc);
	  }

	  function updateEvent(eventId, eventData) {
			return $http.put('/api/members/events/' + eventId, eventData)
				.then(resolveFunc)
				.catch(rejectFunc);
	  }

	  function deleteEvent(eventId) {
			return $http.delete('/api/members/events/' + eventId)
				.then(resolveFunc)
				.catch(rejectFunc);
	  }

		function resolveFunc(response) {
			return response;
		}

		function rejectFunc(error) {
			return error;
		}
	}
})();

(function () {
	'use strict';

	angular
		.module('fct.api')
		.factory('facultyService', facultyService);

	facultyService.$inject = ['$http', '$rootScope'];

	function facultyService($http, $rootScope) {
		var baseLink = '/api/faculty/' + $rootScope.faculty.id;

		var service = {
			confirmRegistration: confirmRegistration,
			getFacultyRegistrations: getFacultyRegistrations
		};

		return service;

		function confirmRegistration(registration) {
			var link = baseLink + '/registrations/confirm';
			return $http.post(link, registration)
				.then(resolveFunc)
				.catch(errorFunc);
		}

		function getFacultyRegistrations() {
			var link = baseLink + '/registrations';
			return $http.get(link)
				.then(resolveFunc)
				.catch(errorFunc);
		}



		function get(students) {
			var link = baseLink + '/studentCoordinator';
			return $http.put(link, students)
				.then(resolveFunc)
				.catch(errorFunc);
		}

		function resolveFunc(response) {
			return response;
		}

		function errorFunc(error) {
			return error;
		}
	}
})();

(function () {
	'use strict';

	angular
		.module('fct.api')
		.factory('facultyAuthService', facultyAuthService);

	facultyAuthService.$inject = ['$http', '$window', '$rootScope'];

	function facultyAuthService($http, $window, $rootScope) {
		var service = {
			facultyLogin: facultyLogin,
			facultyRegister: facultyRegister,
			checkFacultyLoggedIn: checkFacultyLoggedIn,
			changeFacultyPassword: changeFacultyPassword,
			logout: logout,
			facultyForgotPasswordApply: facultyForgotPasswordApply,
			facultyForgotPasswordSet: facultyForgotPasswordSet,
			getColleges: getColleges,
			checkVerified: checkVerified,
			editStudentCoordinator: editStudentCoordinator
		};

		return service;

		function checkFacultyLoggedIn() {
			var token = getToken();
			var payload;
			if (token) {
				payload = token.split('.')[1];
				payload = $window.atob(payload);
				payload = JSON.parse(payload);

				if (angular.isDefined(payload.registrations_count)) {
					$rootScope.faculty = {};
					$rootScope.faculty.email = payload.email;
					$rootScope.faculty.mobileno = payload.mobileno;
					$rootScope.faculty.name = payload.name;
					$rootScope.faculty.verified = payload.verified;
					$rootScope.faculty.rejected = payload.rejected;
					$rootScope.faculty.forgot_password = payload.forgot_password;
					$rootScope.faculty.id = payload._id;
					$rootScope.faculty.registrations_count = payload.registrations_count;
					$rootScope.faculty.collected_amount = payload.collected_amount;
					$rootScope.faculty.student_coordinator = payload.student_coordinator;
					return (payload.exp > Date.now() / 1000);
					console.log($rootScope.faculty);
				} else {
					return false;
				}

			} else {
				return false;
			}
		}

		function replaceToken(token) {
			removeToken();
			saveToken(token);
		}


		function saveToken(token) {
			$window.localStorage['auth-token'] = token;
		}

		function getToken() {
			if ($window.localStorage['auth-token']) {
				return $window.localStorage['auth-token'];
			} else {
				return null;
			}
		}

		function removeToken() {
			$window.localStorage.removeItem('auth-token');
		}


		function facultyLogin(user) {
			return $http.post('/api/auth/faculty/login', user)
				.then(facultyLoginSuccess)
				.catch(facultyLoginFailure);
		}

		function facultyRegister(user) {
			return $http.post('/api/auth/faculty/register', user)
				.then(facultyRegisterSuccess)
				.catch(facultyRegisterFailure);
		}

		function facultyRegisterSuccess(response) {
			saveToken(response.data.token);
			$rootScope.$broadcast('SuccessFacultyRegister');
		}

		function facultyRegisterFailure(error) {
			$rootScope.$broadcast('ErrorFacultyRegister', error);
		}


		function facultyLoginSuccess(response) {
			saveToken(response.data.token);
			$rootScope.$broadcast('SuccessFacultyLogin');
			// checkFacultyLoggedIn();
		}

		function facultyLoginFailure(error) {
			$rootScope.$broadcast('ErrorFacultyLogin', error);
		}

		function getColleges() {
			return $http.get('/api/college/getAllCollege')
				.then(getCollegesSuccess)
				.catch(getCollegesFailure);
		}

		function getCollegesSuccess(response) {
			return response;
		}

		function getCollegesFailure(error) {
			return error;
		}

		function changeFacultyPassword(passwordObject) {
			if (checkFacultyLoggedIn()) {
				if ($rootScope.faculty) {
					passwordObject.facultyId = $rootScope.faculty.id;
					var changePasswordLink = "/api/faculty/settings/changePassword";
					$http.patch(changePasswordLink, passwordObject)
						.then(changePasswordSuccess)
						.catch(changePasswordFailure);
				}
			}
		}

		function changePasswordSuccess(response) {
			$rootScope.$broadcast('FacultyChangePasswordSuccess');
		}

		function changePasswordFailure(error) {
			$rootScope.$broadcast('FacultyChangePasswordFailure', error);
		}

		function facultyForgotPasswordApply(faculty) {
			$http.post('/api/auth/faculty/forgotPasswordApply', faculty)
				.then(facultyForgotPasswordApplySuccess)
				.catch(facultyForgotPasswordApplyFailure);
		}

		function facultyForgotPasswordApplySuccess(response) {
			$rootScope.$broadcast('SuccessFacultyForgotPasswordApply');
		}

		function facultyForgotPasswordApplyFailure(error) {
			$rootScope.$broadcast('ErrorFacultyForgotPasswordApply', error);
		}

		function facultyForgotPasswordSet(faculty, id) {
			var link = '/api/auth/faculty/' + id + '/forgotPasswordSet';
			$http.post(link, faculty)
				.then(facultyForgotPasswordSetSuccess)
				.catch(facultyForgotPasswordSetFailure);
		}

		function facultyForgotPasswordSetSuccess(response) {
			$rootScope.$broadcast('SuccessFacultyForgotPasswordSet');
		}

		function facultyForgotPasswordSetFailure() {
			$rootScope.$broadcast('ErrorFacultyForgotPasswordSet', error);
		}

		function logout() {
			removeToken();
			$rootScope.$broadcast('logoutSuccessful');
		}

		function checkVerified() {
			console.log($rootScope.faculty);
			$http.get('/api/faculty/check')
				.then(checkVerifiedSuccess)
				.catch(checkVerifiedFailure);
		}

		function checkVerifiedSuccess(response) {
			// console.log(response);
			replaceToken(response.data.token);
		}

		function checkVerifiedFailure(error) {
			// console.log(error);
		}

		function editStudentCoordinator(students) {
			var link = '/api/faculty/' + $rootScope.faculty.id + '/addStudentCoordinator';
			return $http.post(link, students)
				.then(editStudentCoordinatorSuccess)
				.catch(editStudentCoordinatorFailure);
		}

		function editStudentCoordinatorSuccess(response) {
			replaceToken(response.data.token);
			return response;
		}

		function editStudentCoordinatorFailure(error) {
			return error;
		}

		function functionName(error) {
			return error;
		}
	}
})();

(function () {
	'use strict';

	angular
		.module('fct.api')
		.factory('memberService', memberService);

	memberService.$inject = ['$http', '$mdDialog'];

	function memberService($http, $mdDialog) {
		var service = {
			getAllFacultyCoordinators: getAllFacultyCoordinators,
			verifyFaculty: verifyFaculty,
			rejectFaculty: rejectFaculty,
			getTotalRegistrations: getTotalRegistrations,
			getDeleteModal: getDeleteModal,
			initializeCKEditor: initializeCKEditor,
		};

		return service;

		function getAllFacultyCoordinators() {
			return $http.get('/api/members/faculty')
				.then(responseFunc)
				.catch(errorFunc);
		}

		function verifyFaculty(id) {
			return $http.patch('/api/members/faculty/verify/' + id)
				.then(responseFunc)
				.catch(errorFunc);
		}

		function rejectFaculty(id) {
			return $http.patch('/api/members/faculty/reject/' + id)
				.then(responseFunc)
				.catch(errorFunc);
		}

		function getTotalRegistrations() {
			return $http.get('/api/members/registrations')
				.then(responseFunc)
				.catch(errorFunc);
		}

		function confirmRegistration(registration) {

		}

		function initializeCKEditor() {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
				CKEDITOR.tools.enableHtml5Elements( document );
				CKEDITOR.config.height = 150;
				CKEDITOR.config.width = 'auto';
				var initSample = ( function() {
					var wysiwygareaAvailable = isWysiwygareaAvailable();
					return function() {
						var editorElement = CKEDITOR.document.getById( 'editor' );
						if ( wysiwygareaAvailable ) {
							CKEDITOR.replace( 'editorRules' );
							CKEDITOR.replace( 'editorSpecification' );
							CKEDITOR.replace( 'editorJudgingCriteria' );
						} else {
							editorElement.setAttribute( 'contenteditable', 'true' );
							CKEDITOR.inline( 'editorRules' );
							CKEDITOR.inline( 'editorSpecification' );
							CKEDITOR.inline( 'editorJudgingCriteria' );
						}
					};

				function isWysiwygareaAvailable() {
					if ( CKEDITOR.revision == ( '%RE' + 'V%' ) ) {
						return true;
					}
					return !!CKEDITOR.plugins.get( 'wysiwygarea' );
				}
			} )();
			initSample();
		}

		function getDeleteModal() {
			var confirm = $mdDialog.confirm()
				.title('Delete')
				.textContent('Are you sure you want to delete this record?')
				.ok('Confirm')
				.cancel('Cancel');
			return $mdDialog.show(confirm).then(responseFunc, errorFunc);
		}

		function responseFunc(response) {
			return response;
		}

		function errorFunc(error) {
			return error;
		}

	}
})();

(function () {
	'use strict';

	angular
		.module('fct.api')
		.factory('memberAuthService', memberAuthService);

	memberAuthService.$inject = ['$http', '$window', '$rootScope'];

	function memberAuthService($http, $window, $rootScope) {
		var service = {
			memberLogin: memberLogin,
			memberRegister: memberRegister,
			checkMemberLoggedIn: checkMemberLoggedIn,
			logout: logout,
			changeMemberPassword: changeMemberPassword,
			memberForgotPasswordApply: memberForgotPasswordApply,
			memberForgotPasswordSet: memberForgotPasswordSet
		};

		return service;

		function checkMemberLoggedIn() {
			var token = getToken();
			var payload;
			if (token) {
				payload = token.split('.')[1];
				payload = $window.atob(payload);
				payload = JSON.parse(payload);

				if (angular.isUndefined(payload.registrations_count)) {
					$rootScope.member = {};
					$rootScope.member.email = payload.email;
					$rootScope.member.mobileno = payload.mobileno;
					$rootScope.member.name = payload.name;
					$rootScope.member.forgot_password = payload.forgot_password;
					$rootScope.member.id = payload._id;
					return (payload.exp > Date.now() / 1000);
				} else {
					return false;
				}
			} else {
				return false;
			}
		}

		function saveToken(token) {
			$window.localStorage['auth-token'] = token;
		}

		function getToken() {
			return $window.localStorage['auth-token'];
		}

		function removeToken() {
			$window.localStorage.removeItem('auth-token');
		}

		function memberLogin(user) {
			return $http.post('/api/auth/member/login', user)
				.then(memberLoginSuccess)
				.catch(memberLoginFailure);
		}

		function memberRegister(user) {
			return $http.post('/api/auth/member/register', user)
				.then(memberRegisterSuccess)
				.catch(memberRegisterFailure);
		}

		function memberRegisterSuccess(response) {
			saveToken(response.data.token);
			$rootScope.$broadcast('SuccessMemberRegister');
		}

		function memberRegisterFailure(error) {
			$rootScope.$broadcast('ErrorMemberRegister', error);
		}

		function memberLoginSuccess(response) {
			saveToken(response.data.token);
			$rootScope.$broadcast('SuccessMemberLogin');
		}

		function memberLoginFailure(error) {
			$rootScope.$broadcast('ErrorMemberLogin', error);
		}

		function memberForgotPasswordApply(member) {
			$http.post('/api/auth/member/forgotPasswordApply', member)
				.then(memberForgotPasswordApplySuccess)
				.catch(memberForgotPasswordApplyFailure);
		}

		function memberForgotPasswordApplySuccess(response) {
			$rootScope.$broadcast('SuccessMemberForgotPasswordApply');
		}

		function memberForgotPasswordApplyFailure(error) {
			$rootScope.$broadcast('ErrorMemberForgotPasswordApply', error);
		}

		function memberForgotPasswordSet(member, id) {
			var link = '/api/auth/member/' + id + '/forgotPasswordSet';
			$http.post(link, member)
				.then(memberForgotPasswordSetSuccess)
				.catch(memberForgotPasswordSetFailure);
		}

		function memberForgotPasswordSetSuccess(response) {
			$rootScope.$broadcast('SuccessMemberForgotPasswordSet');
		}

		function memberForgotPasswordSetFailure() {
			$rootScope.$broadcast('ErrorMemberForgotPasswordSet', error);
		}

		function changeMemberPassword(passwordObject) {
			if (checkMemberLoggedIn()) {
				if ($rootScope.member) {
					passwordObject.memberId = $rootScope.member.id;
					var changePasswordLink = "/api/members/settings/changePassword";
					$http.patch(changePasswordLink, passwordObject)
						.then(changePasswordSuccess)
						.catch(changePasswordFailure);
				}
			}
		}

		function changePasswordSuccess(response) {
			$rootScope.$broadcast('MemberChangePasswordSuccess');
		}

		function changePasswordFailure(error) {
			console.log(error);
			$rootScope.$broadcast('MemberChangePasswordFailure', error);
		}

		function logout() {
			removeToken();
			$rootScope.$broadcast('logoutSuccessful');
		}
	}
})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.factory('fctToast', fctToast);

	fctToast.$inject = ['$mdToast'];

	function fctToast($mdToast) {
		var service = {
			showToast: showToast
		};

		return service;

		function showToast(data, success) {
			var toasterClass = 'md-toast-warn';

			if (success) {
				toasterClass = 'md-toast-success';
			}

			var toaster = $mdToast.simple()
				.textContent(data)
				.position('bottom right')
				.hideDelay(3000)
				.toastClass(toasterClass);
			$mdToast.show(toaster);
		}
	}
})();

(function () {
  'use strict';

  angular
    .module('fct.core')
    .directive('eventCard', eventCard);

  eventCard.$inject = [];

  function eventCard() {
    var directive = {
          restrict: 'E',
          templateUrl: '/templates/components/cards/eventCard.html',
          link: linkFunc,
          scope: {
              eventdata : '=',
              reload : '&'
          },
          controller: 'EventCardController',
          controllerAs: 'ecc'
      };

      return directive;

      function linkFunc($scope) {
          $scope.openCard = false;
          $scope.caret = 'expand_less';
          $scope.toggleCard = toggleCard;

          function toggleCard() {
              $scope.openCard = !($scope.openCard);
              if($scope.openCard === true){
                  $scope.caret = 'expand_more';
              }
              else {
                  $scope.caret = 'expand_less';
              }
          }
      }

  }

})();

(function () {
	'use strict';

	angular
	.module('fct.core')
	.directive('fileUpload', fileUpload);

	fileUpload.$inject = ['$timeout'];

	function fileUpload($timeout) {
        return {
            restrict: 'E',
            template: '<div ng-transclude></div>',
            replace: true,
            transclude: true,
            scope: {
                headers: '=',
                ngModel: '=',
                disabled: '='
            },
            require: 'ngModel',
            link: function (scope, el, attr) {
                var fileName,
                    shareCredentials,
                    withPreview,
                    fileSelector,
                    resize,
                    maxWidth,
                    maxHeight,
                    sel;

                fileName = attr.name || 'userFile';
                shareCredentials = attr.credentials === 'true';
                withPreview = attr.preview === 'true';
                resize = attr.resize === 'true';
                maxWidth = angular.isDefined(attr.maxWidth) ? parseInt(attr.maxWidth) : false;
                maxHeight = angular.isDefined(attr.maxHeight) ? parseInt(attr.maxHeight) : false;
                fileSelector = angular.isDefined(attr.fileSelector) ? attr.fileSelector : false;

                el.append('<input style="display: none !important;" type="file" ' + (attr.multiple == 'true' ? 'multiple' : '') + ' accept="' + (attr.accept ? attr.accept : '') + '" name="' + fileName + '"/>');

                function Resize(file, index, type) {
                    var canvas = document.createElement("canvas");
                    var img = document.createElement("img");
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        img.src = e.target.result;
                        draw();
                    };
                    reader.readAsDataURL(file);

                    function b64toBlob(b64Data, contentType, sliceSize) {
                        contentType = contentType || '';
                        sliceSize = sliceSize || 512;

                        var byteCharacters = atob(b64Data);
                        var byteArrays = [];

                        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                            var slice = byteCharacters.slice(offset, offset + sliceSize);

                            var byteNumbers = new Array(slice.length);
                            for (var i = 0; i < slice.length; i++) {
                                byteNumbers[i] = slice.charCodeAt(i);
                            }

                            var byteArray = new Uint8Array(byteNumbers);

                            byteArrays.push(byteArray);
                        }

                        var blob = new Blob(byteArrays, {type: contentType});
                        return blob;
                    }

                    function draw() {
                        var width = img.width;
                        var height = img.height;
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);

                        if (width > 0 && height > 0) {
                            if (width > height) {
                                if (width > maxWidth) {
                                    height *= maxWidth / width;
                                    width = maxWidth;
                                }
                            } else {
                                if (height > maxHeight) {
                                    width *= maxHeight / height;
                                    height = maxHeight;
                                }
                            }

                            canvas.width = width;
                            canvas.height = height;
                            ctx.drawImage(img, 0, 0, width, height);
                            var b64 = canvas.toDataURL(type).split(',')[1];
                            file = b64toBlob(b64, type, 512);
                        }

                        uploadFile(file, index);
                    }
                }

                function upload(fileProperties, index, file) {
                    if (resize && maxWidth && maxHeight && (file.type.indexOf('image/') !== -1)) {
                        Resize(file, index, file.type);
                    } else {
                        uploadFile(file, index);
                    }
                    return angular.extend(scope.ngModel[index], {
                        name: fileProperties.name,
                        size: fileProperties.size,
                        type: fileProperties.type,
                        status: {},
                        percent: 0,
                        preview: null
                    });
                }

                function uploadFile(file, index) {
                    var xhr = new XMLHttpRequest(),
                        fd = new FormData(),
                        progress = 0,
                        uri = attr.uri || '/upload/upload';
                    xhr.open('POST', uri, true);
                    xhr.withCredentials = shareCredentials;
                    if (scope.headers) {
                        scope.headers.forEach(function (item) {
                            xhr.setRequestHeader(item.header, item.value);
                        });
                    }
                    xhr.onreadystatechange = function () {
                        scope.ngModel[index].status = {
                            code: xhr.status,
                            statusText: xhr.statusText,
                            response: xhr.response
                        };
                        scope.$apply();
                    };
                    xhr.upload.addEventListener("progress", function (e) {
                        progress = parseInt(e.loaded / e.total * 100);
                        scope.ngModel[index].percent = progress;
                        scope.$apply();
                    }, false);

                    fd.append(fileName, file);
                    xhr.send(fd);

                    if (withPreview) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            scope.ngModel[index].preview = e.target.result;
                            scope.$apply();
                        };
                        reader.readAsDataURL(file);
                    }
                }

                $timeout(function () {
                    sel = fileSelector ? angular.element(el[0].querySelectorAll(fileSelector)[0]) : el;
                    sel.bind('click', function () {
                        if (!scope.disabled) {
                            scope.$eval(el.find('input')[0].click());
                        }
                    });
                });

                angular.element(el.find('input')[0]).bind('change', function (e) {
                    var files = e.target.files;
                    if (!angular.isDefined(scope.ngModel) || attr.multiple === 'true') {
                        scope.ngModel = [];
                    }
                    var f;
                    for (var i = 0; i < files.length; i++) {
                        f = {
                            name: files[i].name,
                            size: files[i].size,
                            type: files[i].type,
                            status: {},
                            percent: 0,
                            preview: null
                        };
                        scope.ngModel.push(f);
                        upload(f, i, files[i]);
                    }
                    scope.$apply();
                });
            }
        };
    }
})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('AddStudentController', AddStudentController);

	AddStudentController.$inject = ['$http', 'facultyAuthService', '$rootScope', 'fctToast'];

	function AddStudentController($http, facultyAuthService, $rootScope, fctToast) {
		var vm = this;
		vm.coordinator = {};
		vm.editInfo = false;
		vm.preInfo = false;
		vm.updateButtonClicked = false;
		vm.addButtonClicked = false;

		angular.extend(vm, {
			update: update,
			addStudentCoordinator: addStudentCoordinator,
			edit: edit
		});

		activate();

		function activate() {
			if (!$rootScope.faculty.student_coordinator.name) {
				vm.editInfo = true;
			} else {
				vm.coordinator = $rootScope.faculty.student_coordinator;
				vm.preInfo = true;
			}
		}

		function update(event) {
			vm.updateButtonClicked = true;
			return facultyAuthService.editStudentCoordinator({
					student_coordinator: vm.coordinator
				})
				.then(editStudentCoordinatorSuccess)
				.catch(editStudentCoordinatorFailure);
		}

		function edit() {
			vm.editInfo = true;
		}

		function addStudentCoordinator(event) {
			vm.addButtonClicked = true;
			return facultyAuthService.editStudentCoordinator({
					student_coordinator: vm.coordinator
				})
				.then(addStudentCoordinatorSuccess)
				.catch(editStudentCoordinatorFailure);
		}

		function addStudentCoordinatorSuccess(response) {
			vm.preInfo = true;
			vm.editInfo = false;
			vm.addButtonClicked = false;
			fctToast.showToast('Student Coordinator Details Added Successfuly', true);
		}

		function editStudentCoordinatorSuccess(response) {
			vm.editInfo = false;
			vm.updateButtonClicked = false;
			fctToast.showToast('Student Coordinator Details Updated Successfuly', true);
		}

		function editStudentCoordinatorFailure(error) {
			vm.editInfo = false;
			vm.addButtonClicked = false;
			vm.updateButtonClicked = false;
			fctToast.showToast('Error!! Try Again');
		}
	}
})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('ConfirmRegistrationsController', ConfirmRegistrationsController);

	ConfirmRegistrationsController.$inject = ['memberService', '$mdDialog', 'fctToast', '$scope'];

	function ConfirmRegistrationsController(memberService, $mdDialog, fctToast, $scope) {
		var vm = this;
		vm.registration = {};
		vm.registrationButtonClicked = false;
		angular.extend(vm, {
			confirmRegistration: confirmRegistration
		});

		activate();

		function activate() {

		}

		function getFacultyRegistrationData() {

		}

		function confirmRegistration(event) {
			if (vm.registrationButtonClicked) {
				event.preventDefault();
			} else {
				vm.registrationButtonClicked = true;
			}

			// return
			var confirm = $mdDialog.prompt()
				.title('Enter SERIAL ID')
				.textContent('Enter the serial id provided in ther Registration Slip')
				.placeholder('Serial Id')
				.ariaLabel('Serial Id')
				.targetEvent(event)
				.theme('normal')
				.ok('Submit')
				.cancel('Cancel');

			$mdDialog.show(confirm).then(function (result) {
				vm.registration.serialId = result;
				return memberService.confirmRegistration(vm.registration)
					.then(confirmRegistrationSuccess)
					.catch(confirmRegistrationFailure);
			}, function () {
				vm.registrationButtonClicked = false;
			});
		}

		function confirmRegistrationSuccess(response) {
			vm.registrationButtonClicked = false;
			vm.registration = {};
			$scope.confirmRegistrationForm.$setPristine();
			$scope.confirmRegistrationForm.$setUntouched();
			fctToast.showToast('Registration Successful', true);
		}

		function confirmRegistrationFailure(error) {
			var msg;

			if (error.status == 500) {
				msg = 'Internal server error, try again !!';
			} else {
				msg = error.data.error.for;
			}

			vm.registrationButtonClicked = false;
			fctToast.showToast(msg);
		}

	}
})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('FacultySettingsController', FacultySettingsController);

	FacultySettingsController.$inject = ['facultyAuthService', 'fctToast', '$scope', '$rootScope', '$timeout'];

	function FacultySettingsController(facultyAuthService, fctToast, $scope, $rootScope, $timeout) {
		var vm = this;
		vm.updateInfo = false;
		$scope.changePasswordForm = {};
		vm.user = {};

		angular.extend(vm, {
			changePassword: changePassword
		});

		activate();

		function activate() {

		}

		function changePassword(event) {
			if (vm.updateInfo) {
				event.preventDefault();
			} else {
				vm.updateInfo = true;
				facultyAuthService.changeFacultyPassword(vm.user);
			}
		}

		$rootScope.$on('FacultyChangePasswordSuccess', FacultyChangePasswordSuccess);
		$rootScope.$on('FacultyChangePasswordFailure', FacultyChangePasswordFailure);

		function FacultyChangePasswordSuccess(event) {
			fctToast.showToast("Password Changed Successfully", true);
			$timeout(function () {
				resetForm();
			});

		}

		function FacultyChangePasswordFailure(event, error) {
			fctToast.showToast(error.data.message);
			$timeout(function () {
				resetForm();
			});
		}

		function resetForm() {
			vm.user = {};
			vm.updateInfo = false;
			$scope.changePasswordForm.$setPristine();
			$scope.changePasswordForm.$setUntouched();
		}
	}
})();


(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('RegistrationDetailsController', RegistrationDetailsController);

	RegistrationDetailsController.$inject = ['fctToast', '$rootScope', 'facultyService'];

	function RegistrationDetailsController(fctToast, $rootScope, facultyService) {
		var vm = this;

		activate();

		function activate() {
			if ($rootScope.faculty.registrations_count > 0) {
				return facultyService.getFacultyRegistrations()
					.then(getRegistrationsSuccess)
					.catch(getRegistrationsFailure);
			}
		}

		function getRegistrationsSuccess(response) {
			vm.registrations = response.data;
		}

		function getRegistrationsFailure(error) {
			console.log(error);
			fctToast.showToast('Internal Server Error');
		}
	}
})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('VerifyCoordinatorController', VerifyCoordinatorController);

	VerifyCoordinatorController.$inject = ['$scope', 'memberService', '$mdDialog'];

	function VerifyCoordinatorController($scope, memberService, $mdDialog) {
		var vm = this;
		vm.limitFaculty = 5;
		vm.nomoreFaculty = true;

		angular.extend(vm, {
			verifyFaculty: verifyFaculty,
			rejectFaculty: rejectFaculty,
			loadmore: loadmore
		});

		activate();

		function activate() {
			return memberService.getAllFacultyCoordinators()
				.then(getAllFacultyCoordinatorsSuccess)
				.catch(getAllFacultyCoordinatorsFailure);
		}


		function getAllFacultyCoordinatorsSuccess(response) {
			vm.faculties = response.data;
			// console.log(vm.faculties);
			if (vm.limitFaculty <= vm.faculties.length) {
				vm.nomoreFaculty = false;
			}
		}

		function getAllFacultyCoordinatorsFailure(error) {
			//State go to Add Events
			//Dashboard
			// console.log(error);
		}

		function verifyFaculty(id, index, event) {
			vm.verifyingIndex = index;
			var confirm = $mdDialog.confirm()
				.title('Are you sure?')
				.textContent('You will be Verifying ' + vm.faculties[index].name + ' as a Faculty Coordinator')
				.ariaLabel('FCVER')
				.targetEvent(event)
				.ok('Confirm Verification')
				.theme('normal')
				.cancel('No, not now !!!');
			$mdDialog.show(confirm).then(function () {
				return memberService.verifyFaculty(id)
					.then(verifyFacultySuccess)
					.catch(verifyFacultyFailure);
			}, function () {
				//failed
			});
		}

		function verifyFacultySuccess(response) {
			vm.faculties[vm.verifyingIndex].verified = true;
		}

		function verifyFacultyFailure(error) {
			//fctToast.show('FAilure');
		}

		function rejectFaculty(id, index, event) {
			vm.verifyingIndex = index;
			var confirm = $mdDialog.confirm()
				.title('Are you sure?')
				.textContent('You will be Rejecting ' + vm.faculties[index].name + ' as a Faculty Coordinator')
				.ariaLabel('FCVER')
				.targetEvent(event)
				.ok('Confirm Rejection')
				.theme('normal')
				.cancel('No, not now !!!');
			$mdDialog.show(confirm).then(function () {
				return memberService.rejectFaculty(id)
					.then(rejectFacultySuccess)
					.catch(rejectFacultyFailure);
			}, function () {
				//failed
			});
		}

		function rejectFacultySuccess(response) {
			vm.faculties[vm.verifyingIndex].rejected = true;
			console.log(response);
		}

		function rejectFacultyFailure(error) {
			//fctToast.show('FAilure');
			console.log(error);
		}

		function loadmore() {
			vm.limitFaculty += 5;
			if (vm.limitFaculty >= vm.faculties.length) {
				vm.nomoreFaculty = true;
			}
		}
	}
})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('FacultyLayoutController', FacultyLayoutController)
		.controller('ContactDialogController', ContactDialogController);

	FacultyLayoutController.$inject = ['facultyAuthService', '$mdSidenav', '$rootScope', 'fctToast', '$state', '$mdDialog', '$mdMedia', '$scope'];

	function FacultyLayoutController(facultyAuthService, $mdSidenav, $rootScope, fctToast, $state, $mdDialog, $mdMedia, $scope) {
		var vm = this;

		$scope.$watch(function () {
			return $mdMedia('xs') || $mdMedia('sm');
		});

		angular.extend(vm, {
			logout: logout,
			openLeftSidenav: openLeftSidenav,
			isOpenLeftSidenav: isOpenLeftSidenav,
			closeLeftSidenav: closeLeftSidenav,
			contact: contact
		});

		activate();

		function activate() {

		}

		function logout() {
			facultyAuthService.logout();
		}

		$rootScope.$on('logoutSuccessful', logoutSuccessful);

		function logoutSuccessful(event) {
			fctToast.showToast("Succesfully Logged out", true);
			$state.go('out.login');
		}

		function openLeftSidenav() {
			$mdSidenav('left').open();
		}

		function isOpenLeftSidenav() {
			return $mdSidenav('left').isOpen();
		}

		function closeLeftSidenav() {
			$mdSidenav('left').close();
		}

		function contact(ev) {
			var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
			$mdDialog.show({
				controller: 'ContactDialogController',
				templateUrl: '/templates/components/dialogs/contact.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
				fullscreen: useFullScreen // Only for -xs, -sm breakpoints.
			});
		}
	}

	ContactDialogController.$inject = ['$scope', '$mdDialog'];

	function ContactDialogController($scope, $mdDialog) {
		$scope.cancel = function () {
			$mdDialog.cancel();
		};

		$scope.hide = function () {
			$mdDialog.hide();
		};
	}
})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('MemberLayoutController', MemberLayoutController);

	MemberLayoutController.$inject = ['memberAuthService', '$mdSidenav', '$rootScope', 'fctToast', '$state', '$scope'];

	function MemberLayoutController(memberAuthService, $mdSidenav, $rootScope, fctToast, $state, $scope) {
		var vm = this;

		angular.extend(vm, {
			logout: logout,
			openLeftSidenav: openLeftSidenav,
			isOpenLeftSidenav: isOpenLeftSidenav,
			closeLeftSidenav: closeLeftSidenav,
		});

		activate();

		function activate() {

		}

		function logout() {
			memberAuthService.logout();
		}

		$rootScope.$on('logoutSuccessful', logoutSuccessful);

		function logoutSuccessful(event) {
			fctToast.showToast("Succesfully Logged out", true);
			$state.go('out.member_login');
		}

		function openLeftSidenav() {
			$mdSidenav('left').open();
		}

		function isOpenLeftSidenav() {
			return $mdSidenav('left').isOpen();
		}

		function closeLeftSidenav() {
			$mdSidenav('left').close();
		}
	}

})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('AddEventController', AddEventController);

	AddEventController.$inject = ['$stateParams', 'eventService', '$rootScope', '$timeout', 'Upload', '$state', 'fctToast', '$filter', 'memberService'];

	function AddEventController(stateParams, eventService, $rootScope, $timeout, Upload, $state, fctToast, $filter, memberService) {
		var vm = this;
		vm.isUpdate = false;
		vm.myEvent = {
			'managers': [],
			'event': "Add",
		};

		vm.myEvent.attachments = [];
		vm.files = [];
		vm.image = '';

		angular.extend(vm, {
			save: save,
			openManagersModal: openManagersModal,
			uploadFiles: uploadFiles,
			feeTypeChanged: feeTypeChanged
		});

		activate();

		function activate() {
			memberService.initializeCKEditor();
		}

		function openManagersModal(total) {
			vm.myEvent.managers = [];
			while (total > 0) {
				var each = {
					"index": 1
				};
				vm.myEvent.managers.push(each);
				total--;
			}
		}

		function feeTypeChanged() {
			switch (vm.myEvent.fees_type) {
			case "no_payment":
				vm.myEvent.fees = 0;
				vm.feeDisabled = true;
				vm.myEvent.do_payment = false;
				break;
			case "do_payment":
				vm.myEvent.do_payment = true;
				break;
			case "late_payment":
				vm.myEvent.do_payment = false;
				break;
			}
		}

		function save() {
			vm.myEvent.rules = CKEDITOR.instances["editorRules"].getData();
			vm.myEvent.specification = CKEDITOR.instances["editorSpecification"].getData();
			vm.myEvent.judging_criteria = CKEDITOR.instances["editorJudgingCriteria"].getData();
			console.log(vm.myEvent);
			if (vm.myEvent.isUpdate) {
				return eventService.updateEvent(vm.myEvent).then(registerSuccess).catch(registerFailure);
			} else {
				return eventService.addEvent(vm.myEvent).then(registerSuccess).catch(registerFailure);
			}
		}

		function registerSuccess(event) {
			fctToast.showToast("Event Registered.", true);
			$timeout(function () {
				$state.go('in_tc.showEvent');
			});
		}

		function registerFailure(event, error) {
			fctToast.showToast(error.data.message);
		}

		function uploadFiles(files, errFiles) {
			angular.forEach(files, function (file) {
				vm.files.push(file);
				file.upload = Upload.upload({
					url: '/api/members/upload',
					data: {
						file: file
					}
				});
				file.upload.then(function (response) {
					$timeout(function () {
						file.result = response.data;
						var attach = {
							doc_name: file.name,
							link: file.result.path,
						};
						vm.myEvent.attachments.push(attach);
					});
				}, function (response) {
					if (response.status > 0)
						vm.errorMsg = response.status + ': ' + response.data;
				}, function (evt) {
					file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
				});
			});
		}
	}
})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$rootScope', 'memberService'];

	function DashboardController($rootScope, memberService) {
		var vm = this;

		angular.extend(vm, {
			func: func
		});

		activate();

		function activate() {

		}

		function func() {

		}
	}
})();

(function () {
    'use strict';

    angular
      .module('fct.core')
      .controller('EachEventController', EachEventController);

    EachEventController.$inject = ['$stateParams', 'eventService', '$sce'];

    function EachEventController(stateParams, eventService, $sce) {
        var vm = this;

        activate();

        function activate() {
          if(stateParams.eventId !== undefined && stateParams.eventId !== null) {
            vm.eventId = stateParams.eventId;
            getEvent();
          }
		    }

        function getEvent() {
          return eventService.getSingleEvent(vm.eventId)
            .then(getEventSuccess)
            .catch(getEventFailure);
        }

        function getEventSuccess(response) {
          console.log(response);
          vm.myEvent = response.data;
          vm.rules = $sce.trustAsHtml(vm.myEvent.rules);
          vm.judging_criteria = $sce.trustAsHtml(vm.myEvent.judging_criteria);
          vm.specification = $sce.trustAsHtml(vm.myEvent.specification);
        }

        function getEventFailure(error) {
          console.log(error);
        }
    }
})();

(function () {
    'use strict';

    angular
      .module('fct.core')
      .controller('EventCardController', EventCardController);

    EventCardController.$inject = ['eventService', '$mdDialog', 'memberService', '$scope'];

    function EventCardController(eventService, $mdDialog, memberService, $scope) {
        var vm = this;
        vm.openCard = false;
        vm.caret = 'expand_less';

        angular.extend(vm, {
            deleteEvent: deleteEvent,
        });

        activate();

        function activate() {

        }

        function deleteEvent(id) {
          if(id !== undefined && id !== null) {
            vm.deleteId = id;
            return memberService.getDeleteModal()
              .then(confirmedDelete)
              .catch(unconfirmedDelete);
          }
          return null;
        }

        function confirmedDelete() {
          return eventService.deleteEvent(vm.deleteId)
            .then(deleteEventSuccess)
            .catch(deleteEventFailure);
        }

        function unconfirmedDelete() {
          //
        }

        function deleteEventSuccess(response) {
          console.log(response);
          $scope.reload();
          // vm.reload();
        }

        function deleteEventFailure(error) {
          console.log(error);
          //redirect
        }
    }
})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('EventRegistrationController', EventRegistrationController);

	EventRegistrationController.$inject = ['memberService'];

	function EventRegistrationController(memberService) {
		var vm = this;

		// angular.extend(vm, {
		// 	func: func
		// });

		activate();

		function activate() {
			console.log(JSON.stringify(getRegistration()));
		}

		function getRegistration() {
			return memberService.getTotalRegistrations();
		}
	}
})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('MemberSettingsController', MemberSettingsController);

	MemberSettingsController.$inject = ['memberAuthService', 'fctToast', '$scope', '$rootScope', '$timeout'];

	function MemberSettingsController(memberAuthService, fctToast, $scope, $rootScope, $timeout) {
		var vm = this;
		vm.updateInfo = false;
		$scope.changePasswordForm = {};
		vm.user = {};

		angular.extend(vm, {
			changePassword: changePassword
		});

		activate();

		function activate() {

		}

		function changePassword(event) {
			if (vm.updateInfo) {
				event.preventDefault();
			} else {
				vm.updateInfo = true;
				memberAuthService.changeMemberPassword(vm.user);
			}
		}

		$rootScope.$on('MemberChangePasswordSuccess', MemberChangePasswordSuccess);
		$rootScope.$on('MemberChangePasswordFailure', MemberChangePasswordFailure);

		function MemberChangePasswordSuccess(event) {
			fctToast.showToast("Password Changed Successfully", true);
			$timeout(function () {
				resetForm();
			});

		}

		function MemberChangePasswordFailure(event, error) {
			fctToast.showToast(error.data.message);
			$timeout(function () {
				resetForm();
			});
		}

		function resetForm() {
			vm.user = {};
			vm.updateInfo = false;
			$scope.changePasswordForm.$setPristine();
			$scope.changePasswordForm.$setUntouched();
		}
	}
})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('ParticipantRegistrationController', ParticipantRegistrationController);

	ParticipantRegistrationController.$inject = ['$http'];

	function ParticipantRegistrationController($http) {
		var vm = this;
		vm.myParticipant = {
			eventObject: {
				event_id: 123123,
				event_shortcode: 'EVET'
			},
			other_participants: []
		};
    vm.otherParticipants = [];
		vm.myParticipant.other_participants = [];
    vm.maxParticipants = 4;
    vm.eventPrice = 50;
    vm.esflag = false;
    vm.nopflag = false;

		angular.extend(vm, {
      getParticipantLength : getParticipantLength,
      save : save,
      openParticipantModule : openParticipantModule,
		});

		activate();

		function activate() {
			var x = '{"eventObject": {"event_id": "123123","event_shortcode": "EVET","event_section": "1","event_name": "1"},"other_participants": [{"title": "Team Member","leaderFlag": false,"$$hashKey": "object:68","name": "cl","email": "d@ddc.c","college_name": "1","branch": "2","semester": "6","mobileno": "43223443223","enrollment": "322342342342343"}],"total_amount": 100,"numberOfParticipant": "2","do_payment": true,"team_leader": {"title": "Team Leader","leaderFlag": true,"$$hashKey": "object:67","name": "fd","email": "s@sd.3","mobileno": "12341232133","college_name": "1","branch": "1","semester": "2","enrollment": "231312312332333"}}';
			return $http.post('/api/registration/create', x)
				.then(resolveFunc)
				.catch(rejectFunc);
		}

    function openParticipantModule(total) {
      vm.nopflag = true;
      var first = true;
      vm.myParticipant.other_participants = [];
      while(total > 0) {
        var each = {"title": (first) ? "Team Leader" : "Team Member",
                    "leaderFlag": first};
        vm.myParticipant.other_participants.push(each);
        first = false;
        total--;
      }
    }

    function getParticipantLength() {
      return vm.myParticipant.other_participants.length;
    }

		function save() {
			vm.myParticipant.do_payment = true;
			console.log(JSON.stringify(vm.myParticipant));
			vm.myParticipant.team_leader = vm.myParticipant.other_participants[0];
			vm.myParticipant.other_participants.splice(0, 1);
			console.log(JSON.stringify(vm.myParticipant));
			return $http.post('/api/registration/create', vm.myParticipant)
				.then(resolveFunc)
				.catch(rejectFunc);
		}

		function resolveFunc(response) {
			console.log(response);
		}

		function rejectFunc(error) {
			console.log(error);
		}
	}
})();

(function () {
    'use strict';

    angular
      .module('fct.core')
      .controller('ShowEventController', ShowEventController);

    ShowEventController.$inject = ['eventService'];

    function ShowEventController(eventService) {
        var vm = this;

        angular.extend(vm, {
            getEvents: getEvents,
        });

        activate();

        function activate() {
          getEvents();
        }

        function getEvents() {
            return eventService.getEvent()
              .then(getEventSuccess)
              .catch(getEventFailure);
        }

        function getEventSuccess(response) {
          console.log(response);
          vm.dummyEvents = response.data;
        }

        function getEventFailure(error) {
          console.log(error);
        }
    }
})();


(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('UpdateEventController', UpdateEventController);

	UpdateEventController.$inject = ['$stateParams', 'eventService', '$rootScope', '$state', 'fctToast', 'memberService'];

	function UpdateEventController(stateParams, eventService, $rootScope, state, fctToast, memberService) {
		var vm = this;
		vm.isUpdate = true;
		vm.myEvent = {
			'managers': [],
		};
		vm.myEvent.attachments = [];
		vm.files = [];
		vm.feeDisabled = false;
		vm.myEvent.do_payment = false;

		angular.extend(vm, {
			save: save,
			openManagersModal: openManagersModal,
			uploadFiles: uploadFiles,
			feeTypeChanged: feeTypeChanged
		});

		activate();

		function activate() {
			memberService.initializeCKEditor();
			checkEventId();
		}

		function openManagersModal(total) {
			vm.myEvent.managers = [];
			while (total > 0) {
				var each = {
					"index": 1
				};
				vm.myEvent.managers.push(each);
				total--;
			}
		}

		function checkEventId() {
			if (stateParams.eventId !== undefined && stateParams.eventId !== null) {
				vm.eventId = stateParams.eventId;
				return eventService.getSingleEvent(vm.eventId)
					.then(onEventGetSuccess)
					.catch(onEventGetFailure);

			}
			return null;
		}

		function onEventGetSuccess(eventData) {
			console.log(eventData);
			vm.myEvent = eventData.data;
			vm.myEvent.event = "Update";
			vm.myEvent.totalManager = vm.myEvent.managers.length;
			vm.files = vm.myEvent.attachments;
			return [CKEDITOR.instances['editorRules'].setData(vm.myEvent.rules),
				CKEDITOR.instances['editorSpecification'].setData(vm.myEvent.specification),
				CKEDITOR.instances['editorJudgingCriteria'].setData(vm.myEvent.judging_criteria)
			];
		}

		function onEventGetFailure(error) {
			console.log(error);

		}

		function feeTypeChanged() {
			switch (vm.myEvent.fees_type) {
			case "no_payment":
				vm.myEvent.fees = 0;
				vm.feeDisabled = true;
				vm.myEvent.do_payment = false;
				break;
			case "do_payment":
				vm.myEvent.do_payment = true;
				break;
			case "late_payment":
				vm.myEvent.do_payment = false;
				break;
			}
		}

		function save() {
			vm.myEvent.rules = CKEDITOR.instances['editorRules'].getData();
			vm.myEvent.specification = CKEDITOR.instances['editorSpecification'].getData();
			vm.myEvent.judging_criteria = CKEDITOR.instances['editorJudgingCriteria'].getData();
			console.log(JSON.stringify(vm.myEvent));
			return eventService.updateEvent(vm.eventId, vm.myEvent)
				.then(onUpdateSuccess)
				.catch(onUpdateFailure);
		}

		function onUpdateSuccess(response) {
			console.log(response);
			fctToast.showToast("Update Success.", true);
			state.go('in_tc.showEvent');
		}

		function onUpdateFailure(error) {
			console.log(error);
			fctToast.showToast("Please try again later.");
		}

		function uploadFiles(files, errFiles) {
			angular.forEach(files, function (file) {
				vm.files.push(file);
				file.upload = Upload.upload({
					url: '/api/members/upload',
					data: {
						file: file
					}
				});
				file.upload.then(function (response) {
					$timeout(function () {
						file.result = response.data;
						var attach = {
							doc_name: file.name,
							link: file.result.path,
						};
						vm.myEvent.attachments.push(attach);
					});
				}, function (response) {
					if (response.status > 0)
						vm.errorMsg = response.status + ': ' + response.data;
				}, function (evt) {
					file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
				});
			});
		}
	}
})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('FacultyForgotPasswordApplyController', FacultyForgotPasswordApplyController);

	FacultyForgotPasswordApplyController.$inject = ['$scope', 'fctToast', 'facultyAuthService', '$state', '$rootScope'];

	function FacultyForgotPasswordApplyController($scope, fctToast, facultyAuthService, $state, $rootScope) {
		var vm = this;

		vm.user = {};
		vm.submitButtonClicked = false;
		vm.applied = false;
		$scope.forgotPasswordApplyForm = {};

		angular.extend(vm, {
			submit: submit
		});

		console.log("HHHIII");

		function submit(event) {
			console.log("222");
			if (vm.submitButtonClicked) {
				event.preventDefault();
			} else {
				vm.submitButtonClicked = true;
			}
			var newUser = angular.copy(vm.user);
			facultyAuthService.facultyForgotPasswordApply(newUser);
		}



		$rootScope.$on('SuccessFacultyForgotPasswordApply', facultyForgotPasswordApplySuccess);
		$rootScope.$on('ErrorFacultyForgotPasswordApply', facultyForgotPasswordApplyFailure);

		function facultyForgotPasswordApplySuccess(event) {
			vm.submitButtonClicked = false;
			resetForm();
		}

		function facultyForgotPasswordApplyFailure(event, error) {
			vm.submitButtonClicked = false;
			resetForm(error);
		}

		function resetForm(error) {
			if (angular.isUndefined(error)) {
				vm.user = {};
				$scope.forgotPasswordApplyForm.$setPristine();
				$scope.forgotPasswordApplyForm.$setUntouched();
				vm.applied = true;
			} else {
				$scope.forgotPasswordApplyForm.email.$error.not_registered = true;
			}
		}
	}
})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('FacultyForgotPasswordSetController', FacultyForgotPasswordSetController);

	FacultyForgotPasswordSetController.$inject = ['$scope', 'fctToast', 'facultyAuthService', '$state', '$rootScope', '$stateParams'];

	function FacultyForgotPasswordSetController($scope, fctToast, facultyAuthService, $state, $rootScope, $stateParams) {
		var vm = this;


		vm.token = Boolean($stateParams.token);
		// console.log("token", vm.token);
		vm.user = {};
		vm.changePasswordButtonClicked = false;
		vm.set = false;
		$scope.forgotPasswordSetForm = {};

		angular.extend(vm, {
			changePassword: changePassword
		});

		function changePassword() {
			if (vm.changePasswordButtonClicked) {
				event.preventDefault();
			} else {
				vm.changePasswordButtonClicked = true;
			}
			var newUser = angular.copy(vm.user);
			newUser.token = $stateParams.token;
			var uid = $stateParams.id;

			facultyAuthService.facultyForgotPasswordSet(newUser, uid);
		}

		$rootScope.$on('SuccessFacultyForgotPasswordSet', facultyForgotPasswordSetSuccess);
		$rootScope.$on('ErrorFacultyForgotPasswordSet', facultyForgotPasswordSetFailure);

		function facultyForgotPasswordSetSuccess(event) {
			vm.changePasswordButtonClicked = false;
			resetForm();
		}

		function facultyForgotPasswordSetFailure(event, error) {
			vm.changePasswordButtonClicked = false;
			resetForm(error);
		}

		function resetForm(error) {
			if (angular.isUndefined(error)) {
				vm.user = {};
				$scope.forgotPasswordSetForm.$setPristine();
				$scope.forgotPasswordSetForm.$setUntouched();
				vm.set = true;
			} else {
				vm.error = true;
				vm.errorMsg = error.data.error.for;
				vm.set = true;
			}
		}
	}
})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('FacultyLoginController', FacultyLoginController);

	FacultyLoginController.$inject = ['$scope', 'fctToast', 'facultyAuthService', '$state', '$rootScope'];

	function FacultyLoginController($scope, fctToast, facultyAuthService, $state, $rootScope) {
		var vm = this;
		vm.user = {};
		vm.loginButtonClicked = false;
		$scope.loginForm = {};

		angular.extend(vm, {
			login: login
		});


		function login() {
			if (vm.loginButtonClicked) {
				event.preventDefault();
			} else {
				vm.loginButtonClicked = true;
			}
			var newUser = angular.copy(vm.user);
			facultyAuthService.facultyLogin(newUser);
		}

		$rootScope.$on('SuccessFacultyLogin', loginSuccess);
		$rootScope.$on('ErrorFacultyLogin', loginFailure);

		function loginSuccess(event) {
			fctToast.showToast("Succefully Logged In", true);
			vm.loginButtonClicked = false;
			resetLogin();
			$state.go('in_fc.guidelines');
		}

		function loginFailure(event, error) {
			var msg = error.data.error.message.message.toString();
			vm.loginButtonClicked = false;
			fctToast.showToast(msg);
			resetLogin(error);
		}

		function resetLogin(error) {
			if (angular.isUndefined(error)) {
				vm.user = {};
				$scope.loginForm.$setPristine();
				$scope.loginForm.$setUntouched();
			} else {
				if (error.data.error.message.errorState.faculty) {
					vm.user.email = null;
					$scope.loginForm.password.$error.incorrect = false;
					$scope.loginForm.email.$error.not_registered = true;
				} else {
					vm.user.password = null;
					$scope.loginForm.password.$error.incorrect = true;
				}
			}
		}

	}
})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('FacultyRegistrationController', FacultyRegistrationController);

	FacultyRegistrationController.$inject = ['facultyAuthService', '$scope', 'fctToast', '$rootScope', '$state', '$timeout', '$q'];

	function FacultyRegistrationController(facultyAuthService, $scope, fctToast, $rootScope, $state, $timeout, $q) {
		var vm = this;
		vm.user = {};
		vm.registerButtonClicked = false;

		// vm.states = loadAll();
		vm.selectedItem = null;
		vm.searchText = null;
		vm.querySearch = querySearch;

		angular.extend(vm, {
			register: register
		});

		activate();

		function activate() {
			return facultyAuthService.getColleges()
				.then(getCollegesSuccess)
				.catch(getCollegesError);
		}

		function getCollegesSuccess(response) {
			vm.colleges = response.data;
		}

		function getCollegesError(error) {
			fctToast.showToast('Error in getting colleges');
		}

		function register() {
			if (vm.registerButtonClicked) {
				event.preventDefault();
			} else {
				vm.registerButtonClicked = true;
			}
			var newUser = angular.copy(vm.user);
			facultyAuthService.facultyRegister(newUser);
		}

		$rootScope.$on('SuccessFacultyRegister', registerSuccess);
		$rootScope.$on('ErrorFacultyRegister', registerFailure);

		function registerSuccess(event) {
			fctToast.showToast("Succefully Registered", true);
			vm.registerButtonClicked = false;
			resetForm();
			$state.go('in_fc.guidelines');
		}

		function registerFailure(event, error) {
			var msg = 'Email already registered';
			vm.registerButtonClicked = false;
			fctToast.showToast(msg);
			resetForm();
		}

		function resetForm() {
			vm.user = {};
			$scope.registerForm.$setPristine();
			$scope.registerForm.$setUntouched();
		}



		function querySearch(query) {
			var results = query ? vm.colleges.filter(createFilterFor(query)) : vm.colleges;
			var deferred = $q.defer();
			console.log(results);
			$timeout(function () {
				deferred.resolve(results);
			}, Math.random() * 1000, false);
			return deferred.promise;
		}

		// function loadAll() {
		// 	var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana';
		//
		// 	return allStates.split(/, +/g).map(function (state) {
		// 		return {
		// 			value: state.toLowerCase(),
		// 			display: state
		// 		};
		// 	});
		// }


		function createFilterFor(query) {
			var lowercaseQuery = angular.lowercase(query);
			return function filterFn(college) {
				var matches = college.name.match(/\b(\w)/g);
				var acronym = matches.join('');
				acronym = acronym.toLowerCase();
				return (college.name.toLowerCase().trim().indexOf(lowercaseQuery) === 0 ||
					acronym.indexOf(lowercaseQuery) === 0);
			};
		}
	}
})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('MemberForgotPasswordApplyController', MemberForgotPasswordApplyController);

	MemberForgotPasswordApplyController.$inject = ['$scope', 'fctToast', 'memberAuthService', '$state', '$rootScope'];

	function MemberForgotPasswordApplyController($scope, fctToast, memberAuthService, $state, $rootScope) {
		var vm = this;

		vm.user = {};
		vm.submitButtonClicked = false;
		vm.applied = false;
		$scope.forgotPasswordApplyForm = {};

		angular.extend(vm, {
			submit: submit
		});

		function submit(event) {
			console.log("HIII");
			if (vm.submitButtonClicked) {
				event.preventDefault();
			} else {
				vm.submitButtonClicked = true;
			}
			var newUser = angular.copy(vm.user);
			memberAuthService.memberForgotPasswordApply(newUser);
		}

		$rootScope.$on('SuccessMemberForgotPasswordApply', memberForgotPasswordApplySuccess);
		$rootScope.$on('ErrorMemberForgotPasswordApply', memberForgotPasswordApplyFailure);

		function memberForgotPasswordApplySuccess(event) {
			vm.submitButtonClicked = false;
			resetForm();
		}

		function memberForgotPasswordApplyFailure(event, error) {
			vm.submitButtonClicked = false;
			resetForm(error);
		}

		function resetForm(error) {
			if (angular.isUndefined(error)) {
				vm.user = {};
				$scope.forgotPasswordApplyForm.$setPristine();
				$scope.forgotPasswordApplyForm.$setUntouched();
				vm.applied = true;
			} else {
				$scope.forgotPasswordApplyForm.email.$error.not_registered = true;
			}
		}
	}
})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('MemberForgotPasswordSetController', MemberForgotPasswordSetController);

	MemberForgotPasswordSetController.$inject = ['$scope', 'fctToast', 'memberAuthService', '$state', '$rootScope', '$stateParams'];

	function MemberForgotPasswordSetController($scope, fctToast, memberAuthService, $state, $rootScope, $stateParams) {
		var vm = this;


		vm.token = Boolean($stateParams.token);
		// console.log("token", vm.token);
		vm.user = {};
		vm.changePasswordButtonClicked = false;
		vm.set = false;
		$scope.forgotPasswordSetForm = {};

		angular.extend(vm, {
			changePassword: changePassword
		});

		function changePassword() {
			if (vm.changePasswordButtonClicked) {
				event.preventDefault();
			} else {
				vm.changePasswordButtonClicked = true;
			}
			var newUser = angular.copy(vm.user);
			newUser.token = $stateParams.token;
			var uid = $stateParams.id;

			memberAuthService.memberForgotPasswordSet(newUser, uid);
		}

		$rootScope.$on('SuccessMemberForgotPasswordSet', memberForgotPasswordSetSuccess);
		$rootScope.$on('ErrorMemberForgotPasswordSet', memberForgotPasswordSetFailure);

		function memberForgotPasswordSetSuccess(event) {
			vm.changePasswordButtonClicked = false;
			resetForm();
		}

		function memberForgotPasswordSetFailure(event, error) {
			vm.changePasswordButtonClicked = false;
			resetForm(error);
		}

		function resetForm(error) {
			if (angular.isUndefined(error)) {
				vm.user = {};
				$scope.forgotPasswordSetForm.$setPristine();
				$scope.forgotPasswordSetForm.$setUntouched();
				vm.set = true;
			} else {
				vm.error = true;
				vm.errorMsg = error.data.error.for;
				vm.set = true;
			}
		}
	}
})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('MemberLoginController', MemberLoginController);

	MemberLoginController.$inject = ['$scope', 'fctToast', 'memberAuthService', '$state', '$rootScope'];

	function MemberLoginController($scope, fctToast, memberAuthService, $state, $rootScope) {
		var vm = this;
		vm.user = {};
		vm.loginButtonClicked = false;
		$scope.loginForm = {};

		angular.extend(vm, {
			login: login
		});


		function login() {
			if (vm.loginButtonClicked) {
				event.preventDefault();
			} else {
				vm.loginButtonClicked = true;
			}
			var newUser = angular.copy(vm.user);
			memberAuthService.memberLogin(newUser);
		}

		$rootScope.$on('SuccessMemberLogin', loginSuccess);
		$rootScope.$on('ErrorMemberLogin', loginFailure);

		function loginSuccess(event) {
			fctToast.showToast("Succefully Logged In", true);
			vm.loginButtonClicked = false;
			resetLogin();
			$state.go('in_tc.verifyCoordinator');
		}

		function loginFailure(event, error) {
			var msg = error.data.error.message.message.toString();
			// console.log(error);
			vm.loginButtonClicked = false;
			fctToast.showToast(msg);
			resetLogin(error);
		}

		function resetLogin(error) {
			if (angular.isUndefined(error)) {
				vm.user = {};
				$scope.loginForm.$setPristine();
				$scope.loginForm.$setUntouched();
			} else {
				if (error.data.error.message.errorState.member) {
					vm.user.email = null;
					$scope.loginForm.password.$error.incorrect = false;
					$scope.loginForm.email.$error.not_registered = true;
				} else {
					vm.user.password = null;
					$scope.loginForm.password.$error.incorrect = true;
				}
			}
		}

	}
})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('MemberRegistrationController', MemberRegistrationController);

	MemberRegistrationController.$inject = ['memberAuthService', '$scope', 'fctToast', '$rootScope', '$state'];

	function MemberRegistrationController(memberAuthService, $scope, fctToast, $rootScope, $state) {
		var vm = this;
		vm.user = {};
		vm.registerButtonClicked = false;

		angular.extend(vm, {
			register: register
		});

		activate();

		function activate() {

		}

		function register() {
			if (vm.registerButtonClicked) {
				event.preventDefault();
			} else {
				vm.registerButtonClicked = true;
			}
			var newUser = angular.copy(vm.user);
			console.log(newUser);
			memberAuthService.memberRegister(newUser);
		}

		$rootScope.$on('SuccessMemberRegister', registerSuccess);
		$rootScope.$on('ErrorMemberRegister', registerFailure);

		function registerSuccess(event) {
			fctToast.showToast("Succefully Registered", true);
			vm.registerButtonClicked = false;
			resetForm();
			$state.go('in_tc.verifyCoordinator');
		}

		function registerFailure(event, error) {
			var msg = error.data.errMsg.toString();
			vm.registerButtonClicked = false;
			fctToast.showToast(msg);
			resetForm();
		}

		function resetForm() {
			vm.user = {};
			$scope.registerForm.$setPristine();
			$scope.registerForm.$setUntouched();
		}
	}
})();

(function() {

    angular.module('fct.core')
      .animation('.slide-vertical', slideVertical);

    slideVertical.$inject = ['TweenMax'];

    function slideVertical(TweenMax) {
        return {
            addClass: addHideClass,
            removeClass: removeHideClass
        };
    }

    function addHideClass(element, className, done) {
      if (className == 'ng-hide') {
        // var timeline = new TimelineMax();
        TweenMax.set(element,{height:"auto", opacity:0});
        TweenMax.from(element, 0.3, {opacity: 1, ease: Power0.easeNone});
        TweenMax.to(element, 0.4, {height:0, ease:  Power2.easeOut, onComplete: done}).delay(0.25);
      }
      else {
        done();
      }

    }

    function removeHideClass(element, className, done) {
      if (className == 'ng-hide') {
        element.removeClass('ng-hide');
        TweenMax.set(element,{height:"auto", opacity:0});
        TweenMax.from(element, 0.4, {height:0, ease: Power2.easeIn});
        TweenMax.to(element, 0.3, {opacity: 1, ease: Power2.easeIn, onComplete:done}).delay(0.35);
      }
      else {
        done();
      }
    }
})();
