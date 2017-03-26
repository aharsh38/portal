(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('MemberForgotPasswordApplyController', MemberForgotPasswordApplyController);

	MemberForgotPasswordApplyController.$inject = ['$scope', 'fctToast', 'memberAuthService', '$state', '$rootScope'];

	function MemberForgotPasswordApplyController($scope, fctToast, memberAuthService, $state, $rootScope) {
		var vm = this;

		vm.user = {};
		vm.submitButtonClicked = false;
		vm.applied = false;
		$scope.forgotPasswordApplyForm = {};

		angular.extend(vm, {
			submit: submit
		});

		function submit(event) {
			//console.log("HIII");
			if (vm.submitButtonClicked) {
				event.preventDefault();
			} else {
				vm.submitButtonClicked = true;
			}
			var newUser = angular.copy(vm.user);
			memberAuthService.memberForgotPasswordApply(newUser);
		}

		$rootScope.$on('SuccessMemberForgotPasswordApply', memberForgotPasswordApplySuccess);
		$rootScope.$on('ErrorMemberForgotPasswordApply', memberForgotPasswordApplyFailure);

		function memberForgotPasswordApplySuccess(event) {
			vm.submitButtonClicked = false;
			resetForm();
		}

		function memberForgotPasswordApplyFailure(event, error) {
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
