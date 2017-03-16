(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('RegistrationDetailsController', RegistrationDetailsController);

	RegistrationDetailsController.$inject = ['fctToast', '$rootScope', 'facultyService'];

	function RegistrationDetailsController(fctToast, $rootScope, facultyService) {
		var vm = this;
		vm.noregistration = true;
		activate();

		function activate() {
			return facultyService.getFacultyRegistrations()
				.then(getRegistrationsSuccess)
				.catch(getRegistrationsFailure);
		}

		function getRegistrationsSuccess(response) {

			if (response.data.registrations.length !== 0) {
				vm.registrations = response.data.registrations;
				vm.registrations_count = response.data.totalRegistrations;
				vm.collected_amount = response.data.totalCollectedAmount;
				vm.noregistration = false;
			} else {
				vm.noregistration = true;
			}
		}

		function getRegistrationsFailure(error) {
			fctToast.showToast('Internal Server Error');
		}
	}
})();
