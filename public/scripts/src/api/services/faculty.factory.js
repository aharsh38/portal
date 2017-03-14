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
			getFacultyRegistrations: getFacultyRegistrations
		};

		return service;

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

		function resolveFunc(response) {
			return response;
		}

		function errorFunc(error) {
			return error;
		}
	}
})();
