(function() {
    'use strict';

    angular
        .module('fct.core')
        .controller('AddStudentController', AddStudentController);

    AddStudentController.$inject = ['$http', 'facultyAuthService', '$rootScope', 'fctToast'];

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
            edit: edit
        });

        activate();

        function activate() {
            if (angular.isUndefined($rootScope.faculty.student_coordinator.name)) {
                vm.editInfo = true;
            } else {
                vm.coordinator = $rootScope.faculty.student_coordinator;
                vm.preInfo = true;
            }
        }

        function update(event) {
            vm.updateButtonClicked = true;
            return facultyAuthService.editStudentCoordinator({
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
            return facultyAuthService.editStudentCoordinator({
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
