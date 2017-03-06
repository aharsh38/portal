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
			'angularMoment'
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
				.state('in_tc.verifyCoordinator', {
					url: '/verifyCoordinator',
					templateUrl: '/templates/pages/in/verifyCoordinator.html',
					controller: 'VerifyCoordinatorController',
					controllerAs: 'vcc'
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
					url: '/addEvent',
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
			console.log("response rejection", rejection);
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
	    addEvent: addEvent
	  };

	  return service;

	  function addEvent(event) {
			alert(JSON.stringify(event));
			// return $http.post('/api/event/events', event)
			// 	.then(resolveFunc)
			// 	.catch(rejectFunc);
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
			confirmRegistration: confirmRegistration
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

		function editStudentCoordinator(students) {
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
			getColleges: getColleges
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

	}
})();

(function () {
	'use strict';

	angular
		.module('fct.api')
		.factory('memberService', memberService);

	memberService.$inject = ['$http'];

	function memberService($http) {
		var service = {
			getAllFacultyCoordinators: getAllFacultyCoordinators,
			verifyFaculty: verifyFaculty
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

		function confirmRegistration(registration) {

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
					var changePasswordLink = "/api/member/settings/changePassword";
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
              eventdata : '='
          },
          controller: 'EventCardController',
          controllerAs: 'ecc'
      };

      return directive;

      function linkFunc($scope, $element, $attributes) {
          $scope.openCard = false;
          $scope.caret = 'expand_less';
          $scope.toggleCard = toggleCard;
          console.log($scope.userdata);

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

	angular
    .module('fct.core')
    .controller('EventCardController', EventCardController);

  EventCardController.$inject = ['$scope'];

  function EventCardController($scope) {

  }

})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('AddStudentController', AddStudentController);

	AddStudentController.$inject = ['$http','facultyAuthService', '$rootScope', 'fctToast'];

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
            edit:edit
		});

		activate();

		function activate() {
            if(!$rootScope.faculty.studentCoordinator){
                vm.editInfo = true;
            }else{
                vm.coordinator = $rootScope.faculty.studentCoordinator;
            }
		}

		function update(event) {
            vm.updateButtonClicked = true;
            return facultyAuthService.updateStudentCoordinator(vm.coordinator)
                .then(updateStudentCoordinatorSuccess)
                .catch(updateStudentCoordinatorFailure);
		}

		function edit() {
            vm.editInfo = true;
		}

		function addStudentCoordinator(event) {
            vm.addButtonClicked = true;
            return facultyAuthService.updateStudentCoordinator(vm.coordinator)
                .then(addStudentCoordinatorSuccess)
                .catch(updateStudentCoordinatorFailure);
		}

        function addStudentCoordinatorSuccess(response) {
            vm.preInfo = true;
            vm.editInfo = false;
            vm.addButtonClicked = false;
            fctToast.showToast('Student Coordinator Details Added Successfuly',true);
        }

        function updateStudentCoordinatorSuccess(response) {
            vm.editInfo = false;
            vm.updateButtonClicked = false;
            fctToast.showToast('Student Coordinator Details Updated Successfuly',true);
        }

        function updateStudentCoordinatorFailure(error) {
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
			console.log(vm.faculties);
			if (vm.limitFaculty <= vm.faculties.length) {
				vm.nomoreFaculty = false;
			}
		}

		function getAllFacultyCoordinatorsFailure(error) {
			//State go to Add Events
			//Dashboard
			console.log(error);
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
				// $scope.status = 'You decided to keep your debt.';
			});


		}

		function verifyFacultySuccess(response) {
			vm.faculties[vm.verifyingIndex].verified = true;
		}

		function verifyFacultyFailure(error) {
			//fctToast.show('FAilure');
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
      .controller('AddEventController', AddEventController);

    AddEventController.$inject = ['$stateParams', 'eventService', '$rootScope'];

    function AddEventController(stateParams, eventService, $rootScope) {
        var vm = this;
        vm.myEvent = {};

        angular.extend(vm, {
            register: register
        });

        activate();

        function activate() {
          initializeCKEditor();
        }

        function register() {alert(JSON.stringify(vm.myEvent));
          //eventService.addEvent(vm.myEvent);
        }

    		$rootScope.$on('registerSuccess', registerSuccess);
        $rootScope.$on('registerFailure', registerFailure);

    		function registerSuccess(event) {
            asToast.showToast("Registered",true);

        }

        function registerFailure(event, error) {
            asToast.showToast(error.data.message);
        }

        function initializeCKEditor() {
          if(stateParams.editData !== undefined &&
              stateParams.editData !== null) {
            vm.myEvent = stateParams.editData;
            vm.myEvent.event = "Insert";
          } else {
            vm.myEvent.event = "Update";
          }

          if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
          	CKEDITOR.tools.enableHtml5Elements( document );

          // The trick to keep the editor in the sample quite small
          // unless user specified own height.
          CKEDITOR.config.height = 150;
          CKEDITOR.config.width = 'auto';

          var initSample = ( function() {
          	var wysiwygareaAvailable = isWysiwygareaAvailable();

          	return function() {
          		var editorElement = CKEDITOR.document.getById( 'editor' );

          		// Depending on the wysiwygare plugin availability initialize classic or inline editor.
          		if ( wysiwygareaAvailable ) {
          			CKEDITOR.replace( 'editorRules' );
          			CKEDITOR.replace( 'editorSpecification' );
          			CKEDITOR.replace( 'editorJudgingCriteria' );
          		} else {
          			editorElement.setAttribute( 'contenteditable', 'true' );
          			CKEDITOR.inline( 'editorRules' );
          			CKEDITOR.inline( 'editorSpecification' );
          			CKEDITOR.inline( 'editorJudgingCriteria' );

          			// TODO we can consider displaying some info box that
          			// without wysiwygarea the classic editor may not work.
          		}

          		//CKEDITOR.instances["editor"].getData()
          		//to get the data
          	};

          	function isWysiwygareaAvailable() {
          		// If in development mode, then the wysiwygarea must be available.
          		// Split REV into two strings so builder does not replace it :D.
          		if ( CKEDITOR.revision == ( '%RE' + 'V%' ) ) {
          			return true;
          		}

          		return !!CKEDITOR.plugins.get( 'wysiwygarea' );
          	}
          } )();
          initSample();
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
      .controller('ShowEventController', ShowEventController);

    ShowEventController.$inject = [];
    
    function ShowEventController() {
        var vm = this;

        activate();
        var joinedDate = "ab";

        function activate() {

          vm.dummyEvents = [{
            teamId: '32049',
            teamName: 'Mona Lisa',
            leaderName: 'Monit',
            contactNumber: '9329239499',
            eventName: 'Scrabble+',
            email: 'abc@123.com',
            eventSection: 'IT Department'
          },
          {
            teamId: '32048',
            teamName: 'Mango',
            leaderName: 'Monit',
            contactNumber: '9329239499',
            eventName: 'Scrabble+',
            email: 'abc@123.com',
            eventSection: 'IT Department'
          },
          {
            teamId: '32047',
            teamName: 'Rascals',
            leaderName: 'Monit',
            contactNumber: '9329239499',
            eventName: 'Scrabble+',
            email: 'abc@123.com',
            eventSection: 'IT Department'
          },
          {
            teamId: '32046',
            teamName: 'Rockerstar',
            leaderName: 'Monit',
            contactNumber: '9329239499',
            eventName: 'Scrabble+',
            email: 'abc@123.com',
            eventSection: 'IT Department'
          },];

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



		function submit() {
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
				return (college.name.toLowerCase().trim().indexOf(lowercaseQuery) === 0);
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

		function submit() {
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
