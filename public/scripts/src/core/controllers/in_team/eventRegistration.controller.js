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
			console.log(JSON.stringify(getRegistration()));
		}

		function getRegistration() {
			return memberService.getTotalRegistrations();
		}
	}
})();
