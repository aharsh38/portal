(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('MemberLoginController', MemberLoginController);

	MemberLoginController.$inject = ['$scope', 'fctToast', 'memberAuthService', '$state', '$rootScope'];

	function MemberLoginController($scope, fctToast, memberAuthService, $state, $rootScope) {
		var vm = this;
		vm.user = {};
		vm.loginButtonClicked = false;
		$scope.loginForm = {};

		angular.extend(vm, {
			login: login
		});


		function login() {
			if (vm.loginButtonClicked) {
				event.preventDefault();
			} else {
				vm.loginButtonClicked = true;
			}
			var newUser = angular.copy(vm.user);
			memberAuthService.memberLogin(newUser);
		}

		$rootScope.$on('SuccessMemberLogin', loginSuccess);
		$rootScope.$on('ErrorMemberLogin', loginFailure);

		function loginSuccess(event) {
			fctToast.showToast("Succefully Logged In", true);
			vm.loginButtonClicked = false;
			resetLogin();
			$state.go('in_tc.verifyCoordinator');
		}

		function loginFailure(event, error) {
			var msg = error.data.error.message.message.toString();
			// console.log(error);
			vm.loginButtonClicked = false;
			fctToast.showToast(msg);
			resetLogin(error);
		}

		function resetLogin(error) {
			if (angular.isUndefined(error)) {
				vm.user = {};
				$scope.loginForm.$setPristine();
				$scope.loginForm.$setUntouched();
			} else {
				if (error.data.error.message.errorState.member) {
					vm.user.email = null;
					$scope.loginForm.password.$error.incorrect = false;
					$scope.loginForm.email.$error.not_registered = true;
				} else {
					vm.user.password = null;
					$scope.loginForm.password.$error.incorrect = true;
				}
			}
		}

	}
})();
