(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('AddStudentController', AddStudentController);

	AddStudentController.$inject = ['$http', 'facultyService', '$rootScope', 'fctToast'];

	function AddStudentController($http, facultyService, $rootScope, fctToast) {
		var vm = this;
		vm.coordinator = {};
		vm.editInfo = false;
		vm.preInfo = false;
		vm.updateButtonClicked = false;
		vm.addButtonClicked = false;

		angular.extend(vm, {
			update: update,
			addStudentCoordinator: addStudentCoordinator,
			edit: edit
		});

		activate();

		function activate() {
			return facultyService.getStudentCoordinator()
				.then(getStudentCoordinatorSuccess)
				.catch(getStudentCoordinatorFailure);

		}

		function getStudentCoordinatorSuccess(response) {
			if (response.data.student_coordinator) {
				vm.coordinator = response.data.student_coordinator;
				vm.preInfo = true;
			} else {
				vm.editInfo = true;
			}
		}

		function getStudentCoordinatorFailure(error) {
			// //console.log(error);
		}

		function update(event) {
			vm.updateButtonClicked = true;
			return facultyService.editStudentCoordinator({
					student_coordinator: vm.coordinator
				})
				.then(editStudentCoordinatorSuccess)
				.catch(editStudentCoordinatorFailure);
		}

		function edit() {
			vm.editInfo = true;
		}

		function addStudentCoordinator(event) {
			vm.addButtonClicked = true;
			return facultyService.editStudentCoordinator({
					student_coordinator: vm.coordinator
				})
				.then(addStudentCoordinatorSuccess)
				.catch(editStudentCoordinatorFailure);
		}

		function addStudentCoordinatorSuccess(response) {
			vm.preInfo = true;
			vm.editInfo = false;
			vm.addButtonClicked = false;
			fctToast.showToast('Student Coordinator Details Added Successfuly', true);
		}

		function editStudentCoordinatorSuccess(response) {
			vm.editInfo = false;
			vm.updateButtonClicked = false;
			fctToast.showToast('Student Coordinator Details Updated Successfuly', true);
		}

		function editStudentCoordinatorFailure(error) {
			vm.editInfo = false;
			vm.addButtonClicked = false;
			vm.updateButtonClicked = false;
			fctToast.showToast('Error!! Try Again');
		}
	}
})();
