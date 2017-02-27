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
