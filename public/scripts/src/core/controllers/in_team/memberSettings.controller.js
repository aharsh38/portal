(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('MemberSettingsController', MemberSettingsController);

	MemberSettingsController.$inject = ['memberAuthService', 'fctToast', '$scope', '$rootScope', '$timeout'];

	function MemberSettingsController(memberAuthService, fctToast, $scope, $rootScope, $timeout) {
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
				memberAuthService.changeMemberPassword(vm.user);
			}
		}

		$rootScope.$on('MemberChangePasswordSuccess', MemberChangePasswordSuccess);
		$rootScope.$on('MemberChangePasswordFailure', MemberChangePasswordFailure);

		function MemberChangePasswordSuccess(event) {
			fctToast.showToast("Password Changed Successfully", true);
			$timeout(function () {
				resetForm();
			});

		}

		function MemberChangePasswordFailure(event, error) {
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
