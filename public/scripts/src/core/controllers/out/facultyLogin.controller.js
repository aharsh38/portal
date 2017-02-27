(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('FacultyLoginController', FacultyLoginController);

	FacultyLoginController.$inject = ['$scope', 'fctToast', 'facultyAuthService', '$state', '$rootScope'];

	function FacultyLoginController($scope, fctToast, facultyAuthService, $state, $rootScope) {
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
			facultyAuthService.facultyLogin(newUser);
		}

		$rootScope.$on('SuccessFacultyLogin', loginSuccess);
		$rootScope.$on('ErrorFacultyLogin', loginFailure);

		function loginSuccess(event) {
			fctToast.showToast("Succefully Logged In", true);
			vm.loginButtonClicked = false;
			resetLogin();
			$state.go('in_fc.guidelines');
		}

		function loginFailure(event, error) {
			var msg = error.data.error.message.message.toString();
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
				if (error.data.error.message.errorState.faculty) {
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
