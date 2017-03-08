(function () {
    'use strict';

    angular
      .module('fct.core')
      .controller('EachEventController', EachEventController);

    EachEventController.$inject = ['$stateParams', 'eventService', '$sce'];

    function EachEventController(stateParams, eventService, $sce) {
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
          vm.rules = $sce.trustAsHtml(vm.myEvent.rules);
          vm.judging_criteria = $sce.trustAsHtml(vm.myEvent.judging_criteria);
          vm.specification = $sce.trustAsHtml(vm.myEvent.specification);
        }

        function getEventFailure(error) {
          console.log(error);
        }
    }
})();
