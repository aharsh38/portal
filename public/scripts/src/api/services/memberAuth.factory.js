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
