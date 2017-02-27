(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('FacultySettingsController', FacultySettingsController);

	FacultySettingsController.$inject = ['facultyAuthService', 'fctToast', '$scope', '$rootScope', '$timeout'];

	function FacultySettingsController(facultyAuthService, fctToast, $scope, $rootScope, $timeout) {
		var vm = this;
		vm.updateInfo = false;
		$scope.changePasswordForm = {};
		vm.user = {};

		angular.extend(vm, {
			changePassword: changePassword
		});

		activate();

		function activate() {

		}

		function changePassword(event) {
			if (vm.updateInfo) {
				event.preventDefault();
			} else {
				vm.updateInfo = true;
				facultyAuthService.changeFacultyPassword(vm.user);
			}
		}

		$rootScope.$on('FacultyChangePasswordSuccess', FacultyChangePasswordSuccess);
		$rootScope.$on('FacultyChangePasswordFailure', FacultyChangePasswordFailure);

		function FacultyChangePasswordSuccess(event) {
			fctToast.showToast("Password Changed Successfully", true);
			$timeout(function () {
				resetForm();
			});

		}

		function FacultyChangePasswordFailure(event, error) {
			fctToast.showToast(error.data.message);
			$timeout(function () {
				resetForm();
			});
		}

		function resetForm() {
			vm.user = {};
			vm.updateInfo = false;
			$scope.changePasswordForm.$setPristine();
			$scope.changePasswordForm.$setUntouched();
		}
	}
})();
