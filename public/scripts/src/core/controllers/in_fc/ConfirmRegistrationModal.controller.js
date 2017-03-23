(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('ConfirmRegistrationModalController', ConfirmRegistrationModalController);

	ConfirmRegistrationModalController.$inject = ['$mdDialog', 'registration', 'facultyService'];

	function ConfirmRegistrationModalController($mdDialog, registration, facultyService) {
		var vm = this;
		vm.registration = registration;
		vm.registrationButtonClicked = false;

		angular.extend(vm, {
			confirmData: confirmData,
			hide: hide,
			cancel: cancel
		});

		function confirmData() {
			if (vm.registrationButtonClicked) {
				event.preventDefault();
			} else {
				vm.registrationButtonClicked = true;
			}

			return facultyService.confirmRegistration(registration)
				.then(confirmRegistrationSuccess)
				.catch(confirmRegistrationFailure);
		}

		function confirmRegistrationSuccess(response) {
			console.log(response);
			hide(response);
		}

		function confirmRegistrationFailure(error) {
			$mdDialog.cancel(error);
		}

		function hide(response) {
			$mdDialog.hide(response);
		}

		function cancel() {
			$mdDialog.cancel();
		}
	}

})();
