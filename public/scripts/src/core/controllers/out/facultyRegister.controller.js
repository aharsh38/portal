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

		// vm.states = loadAll();
		vm.selectedItem = null;
		vm.searchText = null;
		vm.querySearch = querySearch;

		angular.extend(vm, {
			register: register
		});

		activate();

		function activate() {
			return facultyAuthService.getColleges()
				.then(getCollegesSuccess)
				.catch(getCollegesError);
		}

		function getCollegesSuccess(response) {
			vm.colleges = response.data;
		}

		function getCollegesError(error) {
			fctToast.showToast('Error in getting colleges');
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
			$state.go('in_fc.guidelines');
		}

		function registerFailure(event, error) {
			var msg = 'Email already registered';
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
			var results = query ? vm.colleges.filter(createFilterFor(query)) : vm.colleges;
			var deferred = $q.defer();
			console.log(results);
			$timeout(function () {
				deferred.resolve(results);
			}, Math.random() * 1000, false);
			return deferred.promise;
		}

		// function loadAll() {
		// 	var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware, Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana';
		//
		// 	return allStates.split(/, +/g).map(function (state) {
		// 		return {
		// 			value: state.toLowerCase(),
		// 			display: state
		// 		};
		// 	});
		// }


		function createFilterFor(query) {
			var lowercaseQuery = angular.lowercase(query);
			return function filterFn(college) {
				var matches = college.name.match(/\b(\w)/g);
				var acronym = matches.join('');
				acronym = acronym.toLowerCase();
				return (college.name.toLowerCase().trim().indexOf(lowercaseQuery) === 0 ||
					acronym.indexOf(lowercaseQuery) === 0);
			};
		}
	}
})();
