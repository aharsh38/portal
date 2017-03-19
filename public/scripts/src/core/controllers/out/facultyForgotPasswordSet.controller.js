(function () {
	'use strict';
	//df
	angular
		.module('fct.core')
		.controller('FacultyForgotPasswordSetController', FacultyForgotPasswordSetController);

	FacultyForgotPasswordSetController.$inject = ['$scope', 'fctToast', 'facultyAuthService', '$state', '$rootScope', '$stateParams', '$location'];

	function FacultyForgotPasswordSetController($scope, fctToast, facultyAuthService, $state, $rootScope, $stateParams, $location) {
		var vm = this;
		console.log("URL", $location.url());
		var uriLi = $location.url();
		uriLi = uriLi.replace('#x3D;', '=');
		uriLi = uriLi.replace('&%23x3D;', '=');
		var fi, si, ti, foi;
		fi = uriLi.indexOf('=');
		si = uriLi.indexOf('&');
		ti = uriLi.indexOf('=', fi + 1);
		foi = uriLi.length;

		var utoken = uriLi.substring(fi + 1, si);
		// console.log("utoken", utoken);

		var userid = uriLi.substring(ti + 1, foi);
		// console.log("uid", userid);

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
			newUser.token = utoken;
			var uid = userid;

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
