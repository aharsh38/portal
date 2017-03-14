(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('FacultyForgotPasswordApplyController', FacultyForgotPasswordApplyController);

	FacultyForgotPasswordApplyController.$inject = ['$scope', 'fctToast', 'facultyAuthService', '$state', '$rootScope'];

	function FacultyForgotPasswordApplyController($scope, fctToast, facultyAuthService, $state, $rootScope) {
		var vm = this;

		vm.user = {};
		vm.submitButtonClicked = false;
		vm.applied = false;
		$scope.forgotPasswordApplyForm = {};

		angular.extend(vm, {
			submit: submit
		});

		console.log("HHHIII");

		function submit(event) {
			console.log("222");
			if (vm.submitButtonClicked) {
				event.preventDefault();
			} else {
				vm.submitButtonClicked = true;
			}
			var newUser = angular.copy(vm.user);
			facultyAuthService.facultyForgotPasswordApply(newUser);
		}



		$rootScope.$on('SuccessFacultyForgotPasswordApply', facultyForgotPasswordApplySuccess);
		$rootScope.$on('ErrorFacultyForgotPasswordApply', facultyForgotPasswordApplyFailure);

		function facultyForgotPasswordApplySuccess(event) {
			vm.submitButtonClicked = false;
			resetForm();
		}

		function facultyForgotPasswordApplyFailure(event, error) {
			vm.submitButtonClicked = false;
			resetForm(error);
		}

		function resetForm(error) {
			if (angular.isUndefined(error)) {
				vm.user = {};
				$scope.forgotPasswordApplyForm.$setPristine();
				$scope.forgotPasswordApplyForm.$setUntouched();
				vm.applied = true;
			} else {
				$scope.forgotPasswordApplyForm.email.$error.not_registered = true;
			}
		}
	}
})();
