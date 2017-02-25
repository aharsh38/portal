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
