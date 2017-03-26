(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('DashboardController', DashboardController);

	DashboardController.$inject = ['$rootScope', 'memberService', '$window'];

	function DashboardController($rootScope, memberService, $window) {
		var vm = this;
		vm.confirmedCount = 0;
		vm.unConfirmedCount = 0;
		vm.totalConfirmedParticipants = 0;
		vm.totalAmountCollected = 0;

		angular.extend(vm, {
			getVFS: getVFS,
			getUVF: getUVF
		});

		activate();

		function activate() {
			getVFS();
			getUVF();
			getConfirmedRegistrationCount();
			getRegistrationData();
			// exportParticipantList();
		}

		function getRegistrationData() {
			return memberService.getRegistrationsByEvent()
				.then(function (response) {
					var array = response.data;
					//console.log(response);
					var each = 0;
					var index = 0;
					for (index = 0; index < array.length; index++) {
						each += parseInt(array[index].unconfirmed_registrations);
					}
				}).catch(function (error) {
					// //console.log(error);
				});
		}

		function getVFS() {
			return memberService.getVerifyFacultyStudent()
				.then(function (response) {
					vm.VFSPath = response.data.path;
					// $window.open(response.data.path);
					////console.log(response);
				})
				.catch(function (error) {
					////console.log(error);
				});
		}

		function getUVF() {
			return memberService.getUnverifiedFaculty()
				.then(function (response) {
					vm.UVFPath = response.data.path;
					// $window.open(response.data.path);
					////console.log(response);
				})
				.catch(function (error) {
					////console.log(error);
				});
		}

		function getConfirmedRegistrationCount() {
			return memberService.getConfirmedRegistrationCount()
				.then(function (response) {
					vm.confirmedCount = response.data.confirmedCount;
					vm.unConfirmedCount = response.data.unConfirmedCount;
					vm.totalConfirmedParticipants = response.data.totalConfirmedParticipants;
					vm.totalAmountCollected = response.data.totalAmountCollected;
					//console.log(response);
				})
				.catch(function (error) {
					//console.log(error);
				});
		}

		function exportParticipantList() {
			return memberService.exportParticipantList()
				.then(function (response) {
					//console.log(response);
				})
				.catch(function (error) {
					//console.log(error);
				});
		}
	}
})();









// (function() {
//     'use strict';
//
//     angular
//         .module('fct.core')
//         .controller('DashboardController', DashboardController);
//
//     DashboardController.$inject = ['$rootScope', 'memberService', '$window'];
//
//     function DashboardController($rootScope, memberService, $window) {
//         var vm = this;
//         vm.confirmedCount = 0;
//         vm.unConfirmedCount = 0;
//         vm.totalConfirmedParticipants = 0;
//         vm.totalAmountCollected = 0;
//
//         angular.extend(vm, {
//             getVFS: getVFS,
//             getUVF: getUVF
//         });
//
//         activate();
//
//         function activate() {
//             getVFS();
//             getUVF();
//             getConfirmedRegistrationCount();
//             // exportParticipantList();
//         }
//
//         function getVFS() {
//             return memberService.getVerifyFacultyStudent()
//                 .then(function(response) {
//                     vm.VFSPath = response.data.path;
//                     // $window.open(response.data.path);
//                     ////console.log(response);
//                 })
//                 .catch(function(error) {
//                     ////console.log(error);
//                 });
//         }
//
//         function getUVF() {
//             return memberService.getUnverifiedFaculty()
//                 .then(function(response) {
//                     vm.UVFPath = response.data.path;
//                     // $window.open(response.data.path);
//                     ////console.log(response);
//                 })
//                 .catch(function(error) {
//                     ////console.log(error);
//                 });
//         }
//
//         function getConfirmedRegistrationCount() {
//           return memberService.getConfirmedRegistrationCount()
//             .then(function(response) {
//               vm.confirmedCount = response.data.confirmedCount;
//               vm.unConfirmedCount = response.data.unConfirmedCount;
//               vm.totalConfirmedParticipants = response.data.totalConfirmedParticipants;
//               vm.totalAmountCollected = response.data.totalAmountCollected;
//               //console.log(response);
//             })
//             .catch(function(error) {
//               //console.log(error);
//             });
//         }
//
//         function exportParticipantList() {
//           return memberService.exportParticipantList()
//             .then(function(response) {
//                 //console.log(response);
//             })
//             .catch(function(error) {
//                 //console.log(error);
//             });
//           }
//     }
// })();
