(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('AddStudentController', AddStudentController);

	AddStudentController.$inject = ['$http','facultyAuthService', '$rootScope', 'fctToast'];

	function AddStudentController($http, facultyAuthService, $rootScope, fctToast) {
		var vm = this;
        vm.coordinator = {};
        vm.editInfo = false;
        vm.preInfo = false;
        vm.updateButtonClicked = false;
        vm.addButtonClicked = false;

		angular.extend(vm, {
			update: update,
            addStudentCoordinator: addStudentCoordinator,
            edit:edit
		});

		activate();

		function activate() {
            if(!$rootScope.faculty.studentCoordinator){
                vm.editInfo = true;
            }else{
                vm.coordinator = $rootScope.faculty.studentCoordinator;
            }
		}

		function update(event) {
            vm.updateButtonClicked = true;
            return facultyAuthService.updateStudentCoordinator(vm.coordinator)
                .then(updateStudentCoordinatorSuccess)
                .catch(updateStudentCoordinatorFailure);
		}

		function edit() {
            vm.editInfo = true;
		}

		function addStudentCoordinator(event) {
            vm.addButtonClicked = true;
            return facultyAuthService.updateStudentCoordinator(vm.coordinator)
                .then(addStudentCoordinatorSuccess)
                .catch(updateStudentCoordinatorFailure);
		}

        function addStudentCoordinatorSuccess(response) {
            vm.preInfo = true;
            vm.editInfo = false;
            vm.addButtonClicked = false;
            fctToast.showToast('Student Coordinator Details Added Successfuly',true);
        }

        function updateStudentCoordinatorSuccess(response) {
            vm.editInfo = false;
            vm.updateButtonClicked = false;
            fctToast.showToast('Student Coordinator Details Updated Successfuly',true);
        }

        function updateStudentCoordinatorFailure(error) {
            vm.editInfo = false;
            vm.addButtonClicked = false;
            vm.updateButtonClicked = false;
            fctToast.showToast('Error!! Try Again');
        }
	}
})();
