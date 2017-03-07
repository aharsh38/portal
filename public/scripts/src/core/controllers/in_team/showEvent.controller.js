(function () {
    'use strict';

    angular
      .module('fct.core')
      .controller('ShowEventController', ShowEventController);

    ShowEventController.$inject = [];

    function ShowEventController() {
        var vm = this;

        activate();

        function activate() {

        function getEvents() {console.log("dff");alert('dd');
            return eventService.getEvent()
              .then(getEventSuccess)
              .catch(getEventFailure);
        }

        function getEventSuccess(response) {
          console.log(response);
          vm.dummyEvents = response.data;
        }

        }
    }
})();
