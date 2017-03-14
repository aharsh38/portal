(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$rootScope', 'memberService'];

	function DashboardController($rootScope, memberService) {
		var vm = this;

		angular.extend(vm, {
		});

		activate();

		function activate() {alert('dsfsdf');
			getVFSCount();
			getUVFCount();
		}

		function getVFSCount() {
			return memberService.getVerifyFacultyStudent()
				.then(function(response) {
					console.log(response);
				})
				.catch(function(error) {
					console.log(error);
				});
		}

		function getUVFCount() {
			return memberService.getUnverifiedFaculty()
				.then(function(response) {
					console.log(response);
				})
				.catch(function(error) {
					console.log(error);
				});
		}

		function getUnconfirmedRegistration() {
			return memberService.getUnconfirmedRegistration()
				.then(function(response) {
					console.log(reponse);
				})
				.catch(function(error) {
					//console.log(error);
				});
		}
	}
})();
