(function () {
    'use strict';

    angular
      .module('fct.core')
      .controller('EachEventController', EachEventController);

    EachEventController.$inject = ['$stateParams', 'eventService'];

    function EachEventController(stateParams, eventService) {
        var vm = this;

        activate();

        function activate() {
          if(stateParams.eventId !== undefined && stateParams.eventId !== null) {
            vm.eventId = stateParams.eventId;
            getEvent();
          }
		    }

        function getEvent() {
          return eventService.getSingleEvent(vm.eventId)
            .then(getEventSuccess)
            .catch(getEventFailure);
        }

        function getEventSuccess(response) {
          console.log(response);
          vm.myEvent = response.data;
          //todo: redirect
        }

        function getEventFailure(error) {
          console.log(error);
        }
    }
})();
