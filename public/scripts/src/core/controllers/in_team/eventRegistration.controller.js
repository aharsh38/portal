(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('EventRegistrationController', EventRegistrationController);

	EventRegistrationController.$inject = ['memberService'];

	function EventRegistrationController(memberService) {
		var vm = this;

		// angular.extend(vm, {
		// 	func: func
		// });

		activate();

		function activate() {
			getRegistration();
			// var input = {
			// 	event_name: "somethon",
			// 	do_payment: true,
			// };
			// var x = JSON.stringify(input);
			// return memberService.getEventRegistrationExcel(x).then(function (response) {
			// 	console.log(response);
			// })
			// .catch(function (error) {
			//
			// });
		}

		function getRegistration() {
			return memberService.getRegistrationsByEvent().then(success).catch(failure);
		}

		function success(response) {
			vm.eventDetails = response.data;
			console.log(response);
		}

		function failure(error) {
			console.log(error);
		}
	}
})();
