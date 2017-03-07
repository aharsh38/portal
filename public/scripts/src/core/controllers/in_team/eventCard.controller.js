(function () {
    'use strict';

    angular
      .module('fct.core')
      .controller('EventCardController', EventCardController);

    EventCardController.$inject = ['eventService', '$scope'];

    function EventCardController(eventService, $scope) {
        var vm = this;
        vm.openCard = false;
        vm.caret = 'expand_less';

        angular.extend(vm, {
            deleteEvent: deleteEvent,
            abc: abc,
        });

        activate();

        function activate() {
        }

        function abc() {
          console.log('fff');
          vm.abcd();
        }

        function deleteEvent(id) {
          if(id !== undefined && id !== null) {
              return eventService.deleteEvent(id)
                .then(deleteEventSuccess)
                .catch(deleteEventFailure);

          }
          return null;
        }

        function deleteEventSuccess(response) {
          console.log(response);
        }

        function deleteEventFailure(error) {
          console.log(error);
          //redirect
        }
    }
})();
