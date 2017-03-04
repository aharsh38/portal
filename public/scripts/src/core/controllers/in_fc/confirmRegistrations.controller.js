(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('ConfirmRegistrationsController', ConfirmRegistrationsController);

	ConfirmRegistrationsController.$inject = ['memberService', '$mdDialog', 'fctToast'];

	function ConfirmRegistrationsController(memberService, $mdDialog, fctToast) {
		var vm = this;
		vm.registration = {};
		vm.registrationButtonClicked = false;
		angular.extend(vm, {
			confirmRegistration: confirmRegistration
		});

		activate();

		function activate() {

		}

		function getFacultyRegistrationData() {

		}

		function confirmRegistration(event) {
			if (vm.registrationButtonClicked) {
				event.preventDefault();
			} else {
				vm.registrationButtonClicked = true;
			}

			// return
			var confirm = $mdDialog.prompt()
				.title('Enter SERIAL ID')
				.textContent('Enter the serial id provided in ther Registration Slip')
				.placeholder('Serial Id')
				.ariaLabel('Serial Id')
				.targetEvent(event)
				.theme('normal')
				.ok('Submit')
				.cancel('Cancel');

			$mdDialog.show(confirm).then(function (result) {
				vm.registration.serialId = result;
				return memberService.confirmRegistration(vm.registration)
					.then(confirmRegistrationSuccess)
					.catch(confirmRegistrationFailure);
			}, function () {
				vm.registrationButtonClicked = false;
			});
		}

		function confirmRegistrationSuccess(response) {
			vm.registrationButtonClicked = false;
			fctToast.showToast('Registration Successful', true);
		}

		function confirmRegistrationFailure(error) {
			var msg;

			if (error.status == 500) {
				msg = 'Internal server error, try again !!';
			} else {
				msg = error.data.error.for;
			}

			vm.registrationButtonClicked = false;
			fctToast.showToast(msg);
		}

	}
})();
