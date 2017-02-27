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
			$http.post('/api/auth/faculty/forgotPasswofacultyForgetPasswordSetrdApply', faculty)
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
