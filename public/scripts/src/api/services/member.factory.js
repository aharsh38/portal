(function () {
	'use strict';

	angular
		.module('fct.api')
		.factory('memberService', memberService);

	memberService.$inject = ['$http'];

	function memberService($http) {
		var service = {
			getAllFacultyCoordinators: getAllFacultyCoordinators,
			verifyFaculty: verifyFaculty
		};

		return service;

		function getAllFacultyCoordinators() {
			return $http.get('/api/members/faculty')
				.then(responseFunc)
				.catch(errorFunc);
		}

		function verifyFaculty(id) {
			return $http.patch('/api/members/faculty/verify/' + id)
				.then(responseFunc)
				.catch(errorFunc);
		}

		function confirmRegistration(registration) {

		}

		function responseFunc(response) {
			return response;
		}

		function errorFunc(error) {
			return error;
		}

	}
})();
