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
			updateEvent: updateEvent,
			getSingleEvent: getSingleEvent,
			deleteEvent: deleteEvent,
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

	  function getSingleEvent(id) {
			return $http.get('/api/event/events/' + id)
				.then(resolveFunc)
				.catch(rejectFunc);
	  }

	  function updateEvent(eventId, eventData) {
			return $http.put('/api/event/events/' + eventId, eventData)
				.then(resolveFunc)
				.catch(rejectFunc);
	  }

	  function deleteEvent(eventId) {
			return $http.delete('/api/event/events/' + eventId)
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
