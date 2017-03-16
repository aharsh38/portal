(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$rootScope', 'memberService'];

	function DashboardController($rootScope, memberService) {
		var vm = this;

		angular.extend(vm, {
			getVFS: getVFS,
			getUVF: getUVF
		});

		activate();

		function activate() {
			return memberService.getVerifyFacultyStudent()
				.then(function (response) {
					vm.VFSPath = response.data.path;
					// $window.open(response.data.path);
					//console.log(response);
				})
				.catch(function (error) {
					//console.log(error);
				});
		}

		function getUVF() {
			return memberService.getUnverifiedFaculty()
				.then(function (response) {
					vm.UVFPath = response.data.path;
					// $window.open(response.data.path);
					//console.log(response);
				})
				.catch(function (error) {
					//console.log(error);
				});
		}

		function getUnconfirmedRegistration() {
			return memberService.getUnconfirmedRegistration()
				.then(function (response) {
					console.log(reponse);
				})
				.catch(function (error) {
					//console.log(error);
				});
		}
	}
})();
