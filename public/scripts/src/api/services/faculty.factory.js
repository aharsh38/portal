(function () {
	'use strict';

	angular
		.module('fct.api')
		.factory('facultyService', facultyService);

	facultyService.$inject = ['$http', '$rootScope'];

	function facultyService($http, $rootScope) {
		var baseLink = '/api/faculty/' + $rootScope.faculty.id;

		var service = {
			confirmRegistration: confirmRegistration,
			getFacultyRegistrations: getFacultyRegistrations,
			getStudentCoordinator: getStudentCoordinator,
			editStudentCoordinator: editStudentCoordinator,
			getEachFaculty: getEachFaculty,
			updateFaculty: updateFaculty,
		};

		return service;

		function getEachFaculty() {
			var link = baseLink + '/getEachFaculty';
			return $http.get(link)
				.then(resolveFunc)
				.catch(errorFunc);
		}

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

		function get(students) {
			var link = baseLink + '/studentCoordinator';
			return $http.put(link, students)
				.then(resolveFunc)
				.catch(errorFunc);
		}

		function editStudentCoordinator(student) {
			var link = baseLink + '/studentCoordinator';
			return $http.post(link, student)
				.then(editStudentCoordinatorSuccess)
				.catch(editStudentCoordinatorFailure);
		}

		function getStudentCoordinator() {
			var link = baseLink + '/studentCoordinator';
			return $http.get(link)
				.then(resolveFunc)
				.catch(errorFunc);
		}

		function updateFaculty(data) {
			var link = baseLink + '/updateFaculty/';
			return $http.post(link, data)
				.then(resolveFunc)
				.catch(errorFunc);
		}

		function editStudentCoordinatorSuccess(response) {
			// replaceToken(response.data.token);
			return response;
		}

		function editStudentCoordinatorFailure(error) {
			return error;
		}



		function resolveFunc(response) {
			return response;
		}

		function errorFunc(error) {
			return error;
		}


	}
})();
