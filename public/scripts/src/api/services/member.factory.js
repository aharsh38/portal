(function () {
	'use strict';

	angular
		.module('fct.api')
		.factory('memberService', memberService);

	memberService.$inject = ['$http', '$mdDialog'];

	function memberService($http, $mdDialog) {
		var service = {
			getAllFacultyCoordinators: getAllFacultyCoordinators,
			verifyFaculty: verifyFaculty,
			getTotalRegistrations: getTotalRegistrations,
			getDeleteModal: getDeleteModal,
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

		function getTotalRegistrations() {
			return $http.get('/api/members/registrations')
				.then(responseFunc)
				.catch(errorFunc);
		}

		function confirmRegistration(registration) {

		}

		function uploadFiles() {

		}

		function getDeleteModal() {
			var confirm = $mdDialog.confirm()
				.title('Delete')
				.textContent('Are you sure you want to delete this record?')
				.ok('Confirm')
				.cancel('Cancel');
			return $mdDialog.show(confirm).then(responseFunc, errorFunc);
		}

		function responseFunc(response) {
			return response;
		}

		function errorFunc(error) {
			return error;
		}

	}
})();
