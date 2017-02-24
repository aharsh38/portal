(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('LoginController', LoginController);

	LoginController.$inject = ['authService'];

	function LoginController(authService) {
		var vm = this;
		vm.user = {};

		angular.extend(vm, {
			login: login
		});

		activate();

		function activate() {

		}

		function login() {
			if (vm.user !== null) {
				return authService.login(vm.user);
			}
		}
	}
})();
