(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('FacultyForgotPasswordSetController', FacultyForgotPasswordSetController);

	FacultyForgotPasswordSetController.$inject = ['$scope', 'fctToast', 'facultyAuthService', '$state', '$rootScope', '$stateParams'];

	function FacultyForgotPasswordSetController($scope, fctToast, facultyAuthService, $state, $rootScope, $stateParams) {
		var vm = this;


		vm.token = Boolean($stateParams.token);
		// console.log("token", vm.token);
		vm.user = {};
		vm.changePasswordButtonClicked = false;
		vm.set = false;
		$scope.forgotPasswordSetForm = {};

		angular.extend(vm, {
			changePassword: changePassword
		});



		function changePassword() {
			if (vm.changePasswordButtonClicked) {
				event.preventDefault();
			} else {
				vm.changePasswordButtonClicked = true;
			}
			var newUser = angular.copy(vm.user);
			newUser.token = $stateParams.token;
			var uid = $stateParams.id;
			console.log($stateParams.id);
			facultyAuthService.facultyForgotPasswordSet(newUser, uid);
		}



		$rootScope.$on('SuccessFacultyForgotPasswordSet', facultyForgotPasswordSetSuccess);
		$rootScope.$on('ErrorFacultyForgotPasswordSet', facultyForgotPasswordSetFailure);

		function facultyForgotPasswordSetSuccess(event) {
			vm.changePasswordButtonClicked = false;
			resetForm();
		}

		function facultyForgotPasswordSetFailure(event, error) {
			vm.changePasswordButtonClicked = false;
			resetForm(error);
		}

		function resetForm(error) {
			if (angular.isUndefined(error)) {
				vm.user = {};
				$scope.forgotPasswordSetForm.$setPristine();
				$scope.forgotPasswordSetForm.$setUntouched();
				vm.set = true;
			} else {
				vm.error = true;
				vm.errorMsg = error.data.error.for;
				vm.set = true;
			}
		}
	}
})();
