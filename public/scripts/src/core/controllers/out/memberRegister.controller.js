(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('MemberRegistrationController', MemberRegistrationController);

	MemberRegistrationController.$inject = ['memberAuthService', '$scope', 'fctToast', '$rootScope', '$state'];

	function MemberRegistrationController(memberAuthService, $scope, fctToast, $rootScope, $state) {
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
			console.log(newUser);
			memberAuthService.memberRegister(newUser);
		}

		$rootScope.$on('SuccessMemberRegister', registerSuccess);
		$rootScope.$on('ErrorMemberRegister', registerFailure);

		function registerSuccess(event) {
			fctToast.showToast("Succefully Registered", true);
			vm.registerButtonClicked = false;
			resetForm();
			// $state.go('in_fc.guidelines');
		}

		function registerFailure(event, error) {
			var msg = error.data.errMsg.toString();
			vm.registerButtonClicked = false;
			fctToast.showToast(msg);
			resetForm();
		}

		function resetForm() {
			vm.user = {};
			$scope.registerForm.$setPristine();
			$scope.registerForm.$setUntouched();
		}
	}
})();
