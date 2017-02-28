(function () {
	'use strict';

	angular
		.module('fct.api', []);
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
	// angular
	// 	.module('fct.core')
	// 	.run(initializeCore);
	//
	// initializeCore.$inject = ['$rootScope', '$interval'];
	//
	// function initializeCore($rootScope, $interval) {
	// 	active();
	//
	// 	function active() {
	// 		preloader();
	// 	}
	//
	// 	function preloader() {
	// 		$rootScope.$on('$viewContentLoading', startPreloader);
	// 		$rootScope.$on('$viewContentLoaded', stopPreloader);
	// 	}
	//
	// 	function startPreloader() {
	// 		$rootScope.pageTransition = true;
	// 	}
	//
	//
	// 	function stopPreloader() {
	// 		$interval(function () {
	// 			$rootScope.pageTransition = false;
	// 		}, 2000);
	// 	}
	// }
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
					// controller: 'TeamLayoutController',
					// controllerAs: 'tlac',
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
				.state('in_tc.eachEvent', {
					url: '/team/eachEvent',
					templateUrl: '/templates/pages/in/eachEvent.html',
					controller: 'EachEventController',
					controllerAs: 'eec',
					params: {
						showData: null,
					}
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
	    addEvent: addEvent,
			getEvent: getEvent,
	  };

	  return service;

	  function addEvent(eventData) {
			return $http.post('/api/event/events', eventData)
				.then(resolveFunc)
				.catch(rejectFunc);
	  }

	  function getEvent() {
			return $http.get('/api/event/events')
				.then(resolveFunc)
				.catch(rejectFunc);
	  }

	  function updateEvent(eventData) {
			return $http.put('/api/event/events/' + eventData.id, eventData)
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
			facultyForgotPasswordSet: facultyForgotPasswordSet
		};

		return service;

		function checkFacultyLoggedIn() {
			var token = getToken();
			var payload;
			if (token) {
				payload = token.split('.')[1];
				payload = $window.atob(payload);
				payload = JSON.parse(payload);
				$rootScope.faculty = {};
				$rootScope.faculty.email = payload.email;
				$rootScope.faculty.mobileno = payload.mobileno;
				$rootScope.faculty.name = payload.name;
				$rootScope.faculty.verified = payload.verified;
				$rootScope.faculty.rejected = payload.rejected;
				$rootScope.faculty.forgot_password = payload.forgot_password;
				$rootScope.faculty.id = payload._id;
				console.log($rootScope.faculty);
				return (payload.exp > Date.now() / 1000);
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


		// function updateUser(user) {
		// 	var link = "/api/faculty/" + user.id;
		// 	$http.put(link, user)
		// 		.then(updateUserSuccess)
		// 		.catch(updateUserFailure);
		// }
		//
		// function updateUserSuccess(response) {
		// 	removeToken();
		// 	saveToken(response.data.token);
		// 	$rootScope.$broadcast('updateUserSuccess');
		// }
		//
		// function updateUserFailure(error) {
		// 	$rootScope.$broadcast('updateUserFailure', error);
		// }
		//

		function changeFacultyPassword(passwordObject) {
			if (checkFacultyLoggedIn()) {
				if ($rootScope.user) {
					var faculty = $rootScope.faculty;
					var changePasswordLink = "/api/faculty/settings/" + faculty.id + "/changePassword";
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
		.factory('memberAuthService', memberAuthService);

	memberAuthService.$inject = ['$http', '$window', '$rootScope'];

	function memberAuthService($http, $window, $rootScope) {
		var service = {
			memberLogin: memberLogin,
			memberRegister: memberRegister,
			checkMemberLoggedIn: checkMemberLoggedIn,
			logout: logout
		};

		return service;

		function checkMemberLoggedIn() {
			var token = getToken();
			var payload;
			if (token) {
				payload = token.split('.')[1];
				payload = $window.atob(payload);
				payload = JSON.parse(payload);
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
	.directive('ngFileModel', fileUpload);

	fileUpload.$inject = ['$parse'];

	function fileUpload($parse) {

		var directive = {
			restrict: 'A',
			scope: {
			  filesdata : '='
			},
			link: linkFunc,
		};

		return directive;

		function linkFunc ($scope, $element, $attributes) {
			var model = $parse($attributes.ngFileModel);
			var isMultiple = $attributes.multiple;
			var modelSetter = model.assign;
			var values = [];
			var i = 0;
			$element.bind('change', function () {//console.log($scope.filesdata);
				angular.forEach($element[0].files, function (item) {
					var value = {
						name: item.name,
						progress: 0,
						response: item,
					};
					values.push(value);
					if (isMultiple) {
						modelSetter($scope, values);
					} else {
						modelSetter($scope, values[0]);
					}
					var fd = new FormData();
					fd.append("uploaded_file", item);
					var xhr = new XMLHttpRequest();
					(function(i) {
						xhr.upload.onprogress = function (event) {
							$scope.$apply(function(){
								if (event.lengthComputable) {
									$scope.files[i].progress = Math.round(event.loaded * 100 / event.total);
								} else {
									$scope.files[i].progress = 'unable to compute';
								}
							});
						};
						xhr.onload = function (event) {
							if(!angular.isNumber(event.target.responseText)) {
								$scope.images.push(event.target.responseText);
							}
						};
						xhr.onabort = function (event) {
							$scope.$apply(function(){
								$scope.progressVisible = false;
							});
							alert('canceled');
						};
						xhr.onerror = function (event) {
							$scope.$apply(function(){
								$scope.progressVisible = false;
							});
							alert('failed');
						};
					})(i);
					xhr.open("POST", "/api/event/events", true);
					$scope.progressVisible = true;
					xhr.send(fd);
					i++;
				});
			});
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
		.controller('VerifyCoordinatorController', VerifyCoordinatorController);

    VerifyCoordinatorController.$inject = [ '$scope'];

    function VerifyCoordinatorController($scope){


  $scope.details=[{name:'ABC',mobileno:'1234567890',city:'Ahmedabad',collegename:'ldce',email:'abc@gmail.com',verified:'yes'},
  {name:'ABC',mobileno:'1234567890',city:'Ahmedabad',collegename:'ldce',email:'abc@gmail.com',verified:'no'},
  {name:'ABC',mobileno:'1234567890',city:'Ahmedabad',collegename:'ldce',email:'abc@gmail.com',verified:'no'}];
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
        vm.myEvent = {
          'managers':[],
        };
        vm.files = [];
        vm.images = [];

        angular.extend(vm, {
            register: register,
            openManagersModal: openManagersModal,
        });

        activate();

        function activate() {
          initializeCKEditor();
          checkEventData();
        }

        function checkEventData() {
          if(stateParams.editData !== undefined && stateParams.editData !== null) {
            vm.myEvent = stateParams.editData;
            vm.myEvent.event = "Update";
			vm.myEvent.isUpdate = true;
            CKEDITOR.document.getById("editorRules").setHtml(vm.myEvent.rules);
            CKEDITOR.document.getById("editorSpecification").setHtml(vm.myEvent.specification);
            CKEDITOR.document.getById("editorJudgingCriteria").setHtml(vm.myEvent.judging_criteria);
          } else {
            vm.myEvent.event = "Insert";
			vm.myEvent.isUpdate = false;
          }
        }

        function register() {
          console.log(JSON.stringify(vm.myEvent));
          vm.myEvent.rules = CKEDITOR.instances["editorRules"].getData();
          vm.myEvent.specification = CKEDITOR.instances["editorSpecification"].getData();
          vm.myEvent.judging_criteria = CKEDITOR.instances["editorJudgingCriteria"].getData();
		  if(vm.myEvent.update) {
			return eventService.updateEvent(vm.myEvent).then(onRegisterSuccess).catch(onRegisterFailure);
		  } else {
			return eventService.addEvent(vm.myEvent).then(onRegisterSuccess).catch(onRegisterFailure);
		  }
        }

        function onRegisterSuccess(response) {
          console.log(response);
        }

        function onRegisterFailure(error) {
          console.log(error);
        }

        function openManagersModal(total) {
          vm.myEvent.managers = [];
          while(total > 0) {
            var each = {"index":1};
            vm.myEvent.managers.push(each);
            total--;
          }
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
    }
})();

(function () {
    'use strict';

    angular
      .module('fct.core')
      .controller('EachEventController', EachEventController);

    EachEventController.$inject = ['$stateParams'];

    function EachEventController(stateParams) {
        var vm = this;

        activate();

        function activate() {
          vm.myEvent = (stateParams.showData !== undefined && stateParams.showData !== null) ?
            stateParams.showData
            : false;
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

        activate();
        var joinedDate = "ab";

        function activate() {
          getEvents();
        }

        function getEvents() {
            return eventService.getEvent().then(getEventSuccess).catch(getEventFailure);
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

		vm.states = loadAll();
		vm.selectedItem = null;
		vm.searchText = null;
		vm.querySearch = querySearch;

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
			var results = query ? vm.states.filter(createFilterFor(query)) : vm.states;
			var deferred = $q.defer();
			$timeout(function () {
				deferred.resolve(results);
			}, Math.random() * 1000, false);
			return deferred.promise;
		}

		function loadAll() {
			var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana';

			return allStates.split(/, +/g).map(function (state) {
				return {
					value: state.toLowerCase(),
					display: state
				};
			});
		}


		function createFilterFor(query) {
			var lowercaseQuery = angular.lowercase(query);

			return function filterFn(state) {
				return (state.value.indexOf(lowercaseQuery) === 0);
			};

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
			// $state.go('inapp.orders');
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
			// $state.go('in_fc.guidelines');
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
