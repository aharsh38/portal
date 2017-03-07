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
			return $http.post('/api/members/events', eventData)
				.then(resolveFunc)
				.catch(rejectFunc);
	  }

	  function getEvent() {
			return $http.get('/api/members/events')
				.then(resolveFunc)
				.catch(rejectFunc);
	  }

	  function getSingleEvent(id) {
			return $http.get('/api/members/events/' + id)
				.then(resolveFunc)
				.catch(rejectFunc);
	  }

	  function updateEvent(eventId, eventData) {
			return $http.put('/api/members/events/' + eventId, eventData)
				.then(resolveFunc)
				.catch(rejectFunc);
	  }

	  function deleteEvent(eventId) {
			return $http.delete('/api/members/events/' + eventId)
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
