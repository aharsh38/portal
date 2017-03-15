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
			console.log(response);
			replaceToken(response.data.token);
		}

		function checkVerifiedFailure(error) {
			console.log(error);
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
