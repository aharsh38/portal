(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$rootScope', 'memberService'];

	function DashboardController($rootScope, memberService) {
		var vm = this;

		angular.extend(vm, {
			func: func
		});

		activate();

		function activate() {

		}

		function func() {

		}
	}
})();
