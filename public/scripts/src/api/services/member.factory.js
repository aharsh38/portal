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
			rejectFaculty: rejectFaculty,
			getTotalRegistrations: getTotalRegistrations,
			getDeleteModal: getDeleteModal,
			getVerifyFacultyStudent: getVerifyFacultyStudent,
			getUnverifiedFaculty: getUnverifiedFaculty,
			getUnconfirmedRegistration: getUnconfirmedRegistration,
			getRegistrationsByEvent: getRegistrationsByEvent,
			getEventRegistrationExcel: getEventRegistrationExcel,
			getConfirmedRegistrationCount: getConfirmedRegistrationCount,
			exportParticipantList: exportParticipantList,
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

		function rejectFaculty(id) {
			return $http.patch('/api/members/faculty/reject/' + id)
				.then(responseFunc)
				.catch(errorFunc);
		}

		function getTotalRegistrations() {
			return $http.get('/api/members/registrations')
				.then(responseFunc)
				.catch(errorFunc);
		}

		function getRegistrationsByEvent() {
			return $http.get('/api/members/registration/eventRegistrationData')
				.then(responseFunc)
				.catch(errorFunc);
		}

		function getVerifyFacultyStudent() {
			return $http.get('/api/members/exportVFSList')
				.then(responseFunc)
				.catch(errorFunc);
		}

		function getUnverifiedFaculty() {
			return $http.get('/api/members/exportUVFList')
				.then(responseFunc)
				.catch(errorFunc);
		}

		function getUnconfirmedRegistration() {
			return $http.get('/api/members/registration/exportUnconfirmedRegistration')
				.then(responseFunc)
				.catch(errorFunc);
		}

		function getEventRegistrationExcel(request) {
			return $http.post('/api/members/registrations/export', request)
				.then(responseFunc)
				.catch(errorFunc);
		}

		function getConfirmedRegistrationCount() {
			return $http.get('/api/members/registration/confirmRegistrationCount')
				.then(responseFunc)
				.catch(errorFunc);
		}

		function exportParticipantList() {
			return $http.get('/api/members/registration/exportParticipantList')
				.then(responseFunc)
				.catch(errorFunc);
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
