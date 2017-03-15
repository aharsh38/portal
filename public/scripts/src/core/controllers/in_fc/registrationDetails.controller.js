(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('RegistrationDetailsController', RegistrationDetailsController);

	RegistrationDetailsController.$inject = ['fctToast', '$rootScope', 'facultyService'];

	function RegistrationDetailsController(fctToast, $rootScope, facultyService) {
		var vm = this;

		activate();

		function activate() {
			// if ($rootScope.faculty.registrations_count > 0) {
			//
			// }
			return facultyService.getFacultyRegistrations()
				.then(getRegistrationsSuccess)
				.catch(getRegistrationsFailure);
		}

		function getRegistrationsSuccess(response) {
			if (response.data.length !== 0) {
				vm.registrations = response.data;
				vm.noregistration = false;
			} else {
				vm.noregistration = true;
			}

		}

		function getRegistrationsFailure(error) {
			console.log(error);
			fctToast.showToast('Internal Server Error');
		}
	}
})();
