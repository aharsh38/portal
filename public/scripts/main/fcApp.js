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


(function () {
	'use strict';

	angular
		.module('fct.api')
		.factory('authService', authService);

	authService.$inject = ['$http'];

	function authService($http) {
		var service = {
			facultyLogin: facultyLogin,
			facultyRegister: facultyRegister
		};

		return service;

		function facultyLogin(user) {
			return $http.post('/api/auth/faculty/login', user)
				.then(resolveFunc)
				.catch(rejectFunc);
		}

		function facultyRegister(user) {
			return $http.post('/api/auth/faculty/register', user)
				.then(resolveFunc)
				.catch(rejectFunc);
		}

		function resolveFunc(response) {
			return response;
		}

		function rejectFunc(error) {
			return error;
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

		function checkLoggedIn() {
			var token = getToken();
			var payload;
			if (token) {
				payload = token.split('.')[1];
				payload = $window.atob(payload);
				payload = JSON.parse(payload);
				$rootScope.user = {};
				$rootScope.user.email = payload.email;
				$rootScope.user.mobileno = payload.mobileno;
				$rootScope.user.name = payload.name;
				$rootScope.user.id = payload._id;
				return (payload.exp > Date.now() / 1000);
			} else {
				return false;
			}
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
		.controller('LoginController', LoginController);

	LoginController.$inject = ['authService'];

	function LoginController(authService) {
		var vm = this;
		vm.user = {};

		angular.extend(vm, {
			login: login
		});

		activate();

		function activate() {

		}

		function login() {
			if (vm.user !== null) {
				return authService.login(vm.user);
			}
		}
	}
})();

(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('FacultyRegistrationController', FacultyRegistrationController);

	FacultyRegistrationController.$inject = ['authService', '$scope', 'asToast', '$rootScope', '$state'];

	function FacultyRegistrationController(authService, $scope, asToast, $rootScope, $state) {
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
			authService.register(newUser);
		}

		$rootScope.$on('SuccessRegister', registerSuccess);
		$rootScope.$on('ErrorRegister', registerFailure);

		function registerSuccess(event) {
			asToast.showToast("Succefully Registered", true);
			vm.registerButtonClicked = false;
			resetForm();
			$state.go('inapp.orders');
		}

		function registerFailure(event, error) {
			var msg = error.data.errMsg.toString();
			vm.registerButtonClicked = false;
			asToast.showToast(msg);
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
