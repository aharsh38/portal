(function () {
    'use strict';

    angular
      .module('fct.core')
      .controller('EventCardController', EventCardController);

    EventCardController.$inject = ['eventService', '$mdDialog'];

    function EventCardController(eventService, $mdDialog) {
        var vm = this;
        vm.openCard = false;
        vm.caret = 'expand_less';

        angular.extend(vm, {
            deleteEvent: deleteEvent,
        });

        activate();

        function activate() {

        }

        function deleteEvent(id) {
          if(id !== undefined && id !== null) {
            return eventService.getDeleteModal()
              .then(confirmedDelete)
              .catch(unconfirmedDelete);
          }
          return null;
        }

        function confirmedDelete() {
          return eventService.deleteEvent(id)
            .then(deleteEventSuccess)
            .catch(deleteEventFailure);
        }

        function unconfirmedDelete() {
          //
        }

        function deleteEventSuccess(response) {
          console.log(response);
          vm.reload();
        }

        function deleteEventFailure(error) {
          console.log(error);
          //redirect
        }
    }
})();
