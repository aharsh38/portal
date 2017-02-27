(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('FacultyLayoutController', FacultyLayoutController)
		.controller('ContactDialogController', ContactDialogController);

	FacultyLayoutController.$inject = ['facultyAuthService', '$mdSidenav', '$rootScope', 'fctToast', '$state', '$mdDialog', '$mdMedia', '$scope'];

	function FacultyLayoutController(facultyAuthService, $mdSidenav, $rootScope, fctToast, $state, $mdDialog, $mdMedia, $scope) {
		var vm = this;

		$scope.$watch(function () {
			return $mdMedia('xs') || $mdMedia('sm');
		});

		angular.extend(vm, {
			logout: logout,
			openLeftSidenav: openLeftSidenav,
			isOpenLeftSidenav: isOpenLeftSidenav,
			closeLeftSidenav: closeLeftSidenav,
			contact: contact
		});

		activate();

		function activate() {

		}

		function logout() {
			facultyAuthService.logout();
		}

		$rootScope.$on('logoutSuccessful', logoutSuccessful);

		function logoutSuccessful(event) {
			fctToast.showToast("Succesfully Logged out", true);
			$state.go('out.login');
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

		function contact(ev) {
			var useFullScreen = $mdMedia('sm') || $mdMedia('xs');
			$mdDialog.show({
				controller: 'ContactDialogController',
				templateUrl: '/templates/components/dialogs/contact.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true,
				fullscreen: useFullScreen // Only for -xs, -sm breakpoints.
			});
		}
	}

	ContactDialogController.$inject = ['$scope', '$mdDialog'];

	function ContactDialogController($scope, $mdDialog) {
		$scope.cancel = function () {
			$mdDialog.cancel();
		};

		$scope.hide = function () {
			$mdDialog.hide();
		};
	}
})();
