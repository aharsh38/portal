(function () {
	'use strict';

	angular
	  .module('fct.core')
	  .factory('eventService', eventService);

	eventService.$inject = ['$http'];

	function eventService($http) {
	  var service = {
	    addEvent: addEvent
	  };

	  return service;

	  function addEvent(event) {
			alert(JSON.stringify(event));
			// return $http.post('/api/event/events', event)
			// 	.then(resolveFunc)
			// 	.catch(rejectFunc);
	  }

		function resolveFunc(response) {
			return response;
		}

		function rejectFunc(error) {
			return error;
		}
	}
})();
