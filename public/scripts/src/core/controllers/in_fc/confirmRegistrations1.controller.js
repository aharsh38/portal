(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('ConfirmRegistrationsController1', ConfirmRegistrationsController1);

	ConfirmRegistrationsController1.$inject = ['facultyService', '$mdDialog', 'fctToast', '$scope'];

	function ConfirmRegistrationsController1(facultyService, $mdDialog, fctToast, $scope) {
		// var vm = this;
		// vm.registration = {};
		// vm.registrationButtonClicked = false;
		// angular.extend(vm, {
		// 	// confirmRegistration: confirmRegistration,
		// 	getRegistrationData: getRegistrationData
		// });
		//
		// activate();
		//
		// function activate() {
		//
		// }
		//
		// function getFacultyRegistrationData() {
		//
		// }
		//
		//
		//
		// function confirmRegistrationSuccess(response) {
		// 	//console.log(response);
		// 	vm.registrationButtonClicked = false;
		//
		//
		// 	var msg;
		//
		// 	if (response.status == 400) {
		// 		msg = response.data.error.for;
		// 		fctToast.showToast(msg);
		// 	}
		//
		// 	if (response.status == 200) {
		// 		msg = response.data.message;
		// 		fctToast.showToast(msg, true);
		// 		vm.registration = {};
		// 		$scope.confirmRegistrationForm.$setPristine();
		// 		$scope.confirmRegistrationForm.$setUntouched();
		//
		// 	} else if (response.status == 404) {
		// 		vm.registration = {};
		// 		fctToast.showToast("REGISTRAION NOT FOUND");
		// 	} else if (response.status == 405) {
		// 		vm.registration = {};
		// 		fctToast.showToast("REGISTRAION CONFIRMED ALREADY", true);
		// 	} else {
		// 		vm.registration = {};
		// 		fctToast.showToast("ERROR PLEASE TRY AGAIN", true);
		// 	}
		//
		// }
		// //
		// function confirmRegistrationFailure(error) {
		// 	var msg;
		// 	vm.registration = {};
		// 	if (error.status == 500) {
		// 		msg = 'Internal server error, try again !!';
		// 	} else {
		// 		msg = error.data.error.for;
		// 	}
		//
		// 	vm.registrationButtonClicked = false;
		// 	fctToast.showToast(msg);
		// }
		//
		// function getRegistrationData() {
		// 	if (vm.registrationButtonClicked) {
		// 		event.preventDefault();
		// 	} else {
		// 		vm.registrationButtonClicked = true;
		// 	}
		//
		// 	facultyService.getRegistrationData(vm.registration)
		// 		.then(getRegistrationDataSuccess)
		// 		.catch(getRegistrationDataFailure);
		// }
		//
		// function getRegistrationDataFailure(error) {
		// 	fctToast.showToast("Internet Error, Please Try Again");
		// 	vm.registration = {};
		// 	vm.registrationButtonClicked = false;
		// }
		//
		// function getRegistrationDataSuccess(response) {
		// 	// //console.log(response);
		// 	if (response.status == 200) {
		// 		vm.registration.teamId = response.data.teamId;
		// 		vm.registration.email = response.data.email;
		// 		vm.registration.mobileno = response.data.mobileno;
		// 		vm.registration.serialId = response.data.serialId;
		//
		// 		$mdDialog.show({
		// 				templateUrl: './templates/components/dialogs/confirmDetailDialog.html',
		// 				controller: 'ConfirmRegistrationModalController',
		// 				controllerAs: 'crmc',
		// 				locals: {
		// 					registration: vm.registration
		// 				},
		// 				clickOutsideToClose: true,
		// 				fullscreen: true
		// 			})
		// 			.then(confirmRegistrationSuccess)
		// 			.catch(confirmRegistrationFailure);
		// 	} else {
		// 		fctToast.showToast("Registration Not Found");
		// 		vm.registrationButtonClicked = false;
		// 		vm.registration = {};
		// 	}
		// }


	}


})();
