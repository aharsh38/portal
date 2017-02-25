(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('VerifyCoordinatorController', VerifyCoordinatorController);

    VerifyCoordinatorController.$inject = [ '$scope'];

    function VerifyCoordinatorController($scope){


  $scope.details=[{name:'ABC',mobileno:'1234567890',city:'Ahmedabad',collegename:'ldce',email:'abc@gmail.com',verified:'yes'},
  {name:'ABC',mobileno:'1234567890',city:'Ahmedabad',collegename:'ldce',email:'abc@gmail.com',verified:'no'},
  {name:'ABC',mobileno:'1234567890',city:'Ahmedabad',collegename:'ldce',email:'abc@gmail.com',verified:'no'}];
}
})();
