(function () {
	'use strict';

	angular
		.module('fct.api')
		.factory('authService', authService);

	function authService($http) {
		var service = {
			login: login,
            register: register
		};

		return service;

		function login(user) {
			return $http.post('techfest.ldce.ac.in/api/auth/login', user)
				.then(resolveFunc)
				.catch(rejectFunc);
		}

        function register() {

        }

		function resolveFunc(response) {
			return response;
		}

		function rejectFunc(error) {
			return error;
		}
	}
})();
