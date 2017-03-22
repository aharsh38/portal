(function() {
    'use strict';

    angular
        .module('fct.core')
        .controller('ConfirmRegistrationModalController', ConfirmRegistrationModalController);

    ConfirmRegistrationModalController.$inject = ['facultyService', '$mdDialog', 'fctToast', 'registration'];

    function ConfirmRegistrationModalController(facultyService, $mdDialog, fctToast, registration) {
        var vm = this;
        vm.registration = registration;
        vm.registrationButtonClicked = false;

        angular.extend(vm, {
            confirmData: confirmData,
            hide: hide
        });

        function confirmData() {
            if (vm.registrationButtonClicked) {
                event.preventDefault();
            } else {
                vm.registrationButtonClicked = true;
            }

            return facultyService.confirmRegistration(registration)
                .then(confirmRegistrationSuccess)
                .catch(confirmRegistrationFailure);
        }

        function confirmRegistrationSuccess(response) {
            console.log(response);
            vm.registrationButtonClicked = false;
            vm.registration = {};
            $scope.confirmRegistrationForm.$setPristine();
            $scope.confirmRegistrationForm.$setUntouched();

            var msg;

            if (response.status == 400) {
                msg = response.data.error.for;
                fctToast.showToast(msg);
            }

            if (msg) {
                msg = response.data.message;
                fctToast.showToast(msg, true);
            }
            hide();
        }

        function confirmRegistrationFailure(error) {
            var msg;

            if (error.status == 500) {
                msg = 'Internal server error, try again !!';
            } else {
                msg = error.data.error.for;
            }
            fctToast.showToast(msg);
            hide();
        }

        function hide() {
            $mdDialog.hide();
        }
    }

})();
