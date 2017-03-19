(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('EventRegistrationController', EventRegistrationController);

	EventRegistrationController.$inject = ['memberService', '$window'];

	function EventRegistrationController(memberService, $window) {
		var vm = this;

		angular.extend(vm, {
			getExcel: getExcel
		});

		activate();

		function activate() {
			getRegistration();
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

		function getExcel(event_name, confirmed) {
			var input = {
				event_name: event_name,
				confirmation: confirmed,
			};
			var json = JSON.stringify(input);
			memberService.getEventRegistrationExcel(json).then(function (response) {
				$window.open(response.data.path);
			})
			.catch(function (error) {

			});
		}
	}
})();
