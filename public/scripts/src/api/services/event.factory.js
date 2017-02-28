(function () {
	'use strict';

	angular
	  .module('fct.core')
	  .factory('eventService', eventService);

	eventService.$inject = ['$http'];

	function eventService($http) {
	  var service = {
	    addEvent: addEvent,
			getEvent: getEvent,
	  };

	  return service;

	  function addEvent(eventData) {
			return $http.post('/api/event/events', eventData)
				.then(resolveFunc)
				.catch(rejectFunc);
	  }

	  function getEvent() {
			return $http.get('/api/event/events')
				.then(resolveFunc)
				.catch(rejectFunc);
	  }

	  function updateEvent(eventData) {
			return $http.put('/api/event/events/' + eventData.id, eventData)
				.then(resolveFunc)
				.catch(rejectFunc);
	  }

		function resolveFunc(response) {
			return response;
		}

		function rejectFunc(error) {
			return error;
		}
	}
})();
