(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('FacultyRegistrationController', FacultyRegistrationController);

	FacultyRegistrationController.$inject = ['facultyAuthService', '$scope', 'fctToast', '$rootScope', '$state', '$timeout', '$q'];

	function FacultyRegistrationController(facultyAuthService, $scope, fctToast, $rootScope, $state, $timeout, $q) {
		var vm = this;
		vm.user = {};
		vm.registerButtonClicked = false;

		vm.states = loadAll();
		vm.selectedItem = null;
		vm.searchText = null;
		vm.querySearch = querySearch;

		angular.extend(vm, {
			register: register
		});

		activate();

		function activate() {

		}

		function register() {
			if (vm.registerButtonClicked) {
				event.preventDefault();
			} else {
				vm.registerButtonClicked = true;
			}
			var newUser = angular.copy(vm.user);
			facultyAuthService.facultyRegister(newUser);
		}

		$rootScope.$on('SuccessFacultyRegister', registerSuccess);
		$rootScope.$on('ErrorFacultyRegister', registerFailure);

		function registerSuccess(event) {
			fctToast.showToast("Succefully Registered", true);
			vm.registerButtonClicked = false;
			resetForm();
			// $state.go('in_fc.guidelines');
		}

		function registerFailure(event, error) {
			var msg = error.data.errMsg.toString();
			vm.registerButtonClicked = false;
			fctToast.showToast(msg);
			resetForm();
		}

		function resetForm() {
			vm.user = {};
			$scope.registerForm.$setPristine();
			$scope.registerForm.$setUntouched();
		}



		function querySearch(query) {
			var results = query ? vm.states.filter(createFilterFor(query)) : vm.states;
			var deferred = $q.defer();
			$timeout(function () {
				deferred.resolve(results);
			}, Math.random() * 1000, false);
			return deferred.promise;
		}

		function loadAll() {
			var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana';

			return allStates.split(/, +/g).map(function (state) {
				return {
					value: state.toLowerCase(),
					display: state
				};
			});
		}


		function createFilterFor(query) {
			var lowercaseQuery = angular.lowercase(query);

			return function filterFn(state) {
				return (state.value.indexOf(lowercaseQuery) === 0);
			};

		}
	}
})();
