(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('VerifyCoordinatorController', VerifyCoordinatorController);

	VerifyCoordinatorController.$inject = ['$scope', 'memberService', '$mdDialog'];

	function VerifyCoordinatorController($scope, memberService, $mdDialog) {
		var vm = this;
		vm.limitFaculty = 5;
		vm.nomoreFaculty = true;

		angular.extend(vm, {
			verifyFaculty: verifyFaculty,
			loadmore: loadmore
		});

		activate();

		function activate() {
			return memberService.getAllFacultyCoordinators()
				.then(getAllFacultyCoordinatorsSuccess)
				.catch(getAllFacultyCoordinatorsFailure);
		}


		function getAllFacultyCoordinatorsSuccess(response) {
			vm.faculties = response.data;
			// console.log(vm.faculties);
			if (vm.limitFaculty <= vm.faculties.length) {
				vm.nomoreFaculty = false;
			}
		}

		function getAllFacultyCoordinatorsFailure(error) {
			//State go to Add Events
			//Dashboard
			// console.log(error);
		}

		function verifyFaculty(id, index, event) {
			vm.verifyingIndex = index;

			var confirm = $mdDialog.confirm()
				.title('Are you sure?')
				.textContent('You will be Verifying ' + vm.faculties[index].name + ' as a Faculty Coordinator')
				.ariaLabel('FCVER')
				.targetEvent(event)
				.ok('Confirm Verification')
				.theme('normal')
				.cancel('No, not now !!!');

			$mdDialog.show(confirm).then(function () {
				return memberService.verifyFaculty(id)
					.then(verifyFacultySuccess)
					.catch(verifyFacultyFailure);
			}, function () {
				// $scope.status = 'You decided to keep your debt.';
			});


		}

		function verifyFacultySuccess(response) {
			vm.faculties[vm.verifyingIndex].verified = true;
		}

		function verifyFacultyFailure(error) {
			//fctToast.show('FAilure');
		}

		function loadmore() {
			vm.limitFaculty += 5;
			if (vm.limitFaculty >= vm.faculties.length) {
				vm.nomoreFaculty = true;
			}
		}
	}
})();
