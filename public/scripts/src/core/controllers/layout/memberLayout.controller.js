(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('MemberLayoutController', MemberLayoutController);

	MemberLayoutController.$inject = ['memberAuthService', '$mdSidenav', '$rootScope', 'fctToast', '$state', '$scope'];

	function MemberLayoutController(memberAuthService, $mdSidenav, $rootScope, fctToast, $state, $scope) {
		var vm = this;

		angular.extend(vm, {
			logout: logout,
			openLeftSidenav: openLeftSidenav,
			isOpenLeftSidenav: isOpenLeftSidenav,
			closeLeftSidenav: closeLeftSidenav,
		});

		activate();

		function activate() {

		}

		function logout() {
			memberAuthService.logout();
		}

		$rootScope.$on('logoutSuccessful', logoutSuccessful);

		function logoutSuccessful(event) {
			fctToast.showToast("Succesfully Logged out", true);
			$state.go('out.member_login');
		}

		function openLeftSidenav() {
			$mdSidenav('left').open();
		}

		function isOpenLeftSidenav() {
			return $mdSidenav('left').isOpen();
		}

		function closeLeftSidenav() {
			$mdSidenav('left').close();
		}
	}

})();
