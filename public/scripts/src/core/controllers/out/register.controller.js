(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('FacultyRegistrationController', FacultyRegistrationController);

	FacultyRegistrationController.$inject = ['authService', '$scope', 'asToast', '$rootScope', '$state'];

	function FacultyRegistrationController(authService, $scope, asToast, $rootScope, $state) {
		var vm = this;
		vm.user = {};
		vm.registerButtonClicked = false;

		angular.extend(vm, {
			register: register
		});

		activate();

		function activate() {

		}

		function register() {
			if (vm.registerButtonClicked) {
				event.preventDefault();
			} else {
				vm.registerButtonClicked = true;
			}
			var newUser = angular.copy(vm.user);
			authService.register(newUser);
		}

		$rootScope.$on('SuccessRegister', registerSuccess);
		$rootScope.$on('ErrorRegister', registerFailure);

		function registerSuccess(event) {
			asToast.showToast("Succefully Registered", true);
			vm.registerButtonClicked = false;
			resetForm();
			$state.go('inapp.orders');
		}

		function registerFailure(event, error) {
			var msg = error.data.errMsg.toString();
			vm.registerButtonClicked = false;
			asToast.showToast(msg);
			resetForm();
		}

		function resetForm() {
			vm.user = {};
			$scope.registerForm.$setPristine();
			$scope.registerForm.$setUntouched();
		}
	}
})();
