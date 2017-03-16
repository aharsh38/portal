(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('ConfirmRegistrationsController', ConfirmRegistrationsController);

	ConfirmRegistrationsController.$inject = ['facultyService', '$mdDialog', 'fctToast', '$scope'];

	function ConfirmRegistrationsController(facultyService, $mdDialog, fctToast, $scope) {
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
				return facultyService.confirmRegistration(vm.registration)
					.then(confirmRegistrationSuccess)
					.catch(confirmRegistrationFailure);
			}, function () {
				vm.registrationButtonClicked = false;
			});
		}

		function confirmRegistrationSuccess(response) {
			console.log(response);
			vm.registrationButtonClicked = false;
			vm.registration = {};
			$scope.confirmRegistrationForm.$setPristine();
			$scope.confirmRegistrationForm.$setUntouched();
			var msg = response.data.message;
			fctToast.showToast(msg, true);
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
