(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('FacultySettingsController', FacultySettingsController);

	FacultySettingsController.$inject = ['facultyAuthService', 'fctToast', '$scope', '$rootScope', '$timeout', 'facultyService'];

	function FacultySettingsController(facultyAuthService, fctToast, $scope, $rootScope, $timeout, facultyService) {
		var vm = this;
		vm.updateInfo = false;
		$scope.changePasswordForm = {};
		vm.user = {};
		vm.userDetail = {};
		vm.updateButtonClicked = false;

		angular.extend(vm, {
			changePassword: changePassword,
			updateFaculty: updateFaculty,
		});

		activate();

		function activate() {
			getEachFaculty();
		}

		function getEachFaculty() {
			return facultyService.getEachFaculty()
			.then(function (response) {
				console.log(response);
				vm.userDetail.email = response.data.email;
				vm.userDetail.mobileno = parseInt(response.data.mobileno);
				vm.userDetail.name = response.data.name;
				vm.preInfo = true;
			}).catch(function (error) {
				console.log(error);
			});
		}

		function updateFaculty() {
			if (vm.updating) {
				event.preventDefault();
			} else {
				vm.updating = true;
				vm.updateButtonClicked = true;
				return facultyService.updateFaculty(vm.userDetail)
				.then(function (response) {
					vm.userDetail = response.data;
					vm.updateButtonClicked = false;
					vm.updating = false;
					vm.editInfo = false;
					getEachFaculty();
					console.log(response);
				})
				.catch(function (error) {
					vm.updateButtonClicked = false;
					vm.updating = false;
					console.log(error);
				});
			}
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
			$scope.changePasswordForm.$setUntouched();
		}
	}
})();
