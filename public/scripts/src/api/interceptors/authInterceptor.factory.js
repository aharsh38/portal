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
			// //console.log(config);
			return config;
		}

		function requestError(rejection) {
			// //console.log("Request Rejection",rejection);
			return $q.reject(rejection);
		}

		function response(response) {
			// //console.log("response",response);
			return response || $q.when(response);
		}

		function responseError(rejection) {
			// //console.log("response rejection", rejection);
			if (rejection.status == 403) {
				$location.path('/login');
			}
			return $q.reject(rejection);
		}
	}
})();
