(function () {
    'use strict';

    angular
      .module('fct.core')
      .controller('EventCardController', EventCardController);

    EventCardController.$inject = ['eventService', '$mdDialog', 'memberService', '$scope'];

    function EventCardController(eventService, $mdDialog, memberService, $scope) {
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
            vm.deleteId = id;
            return memberService.getDeleteModal()
              .then(confirmedDelete)
              .catch(unconfirmedDelete);
          }
          return null;
        }

        function confirmedDelete() {
          return eventService.deleteEvent(vm.deleteId)
            .then(deleteEventSuccess)
            .catch(deleteEventFailure);
        }

        function unconfirmedDelete() {
          //
        }

        function deleteEventSuccess(response) {
          console.log(response);
          $scope.reload();
          // vm.reload();
        }

        function deleteEventFailure(error) {
          console.log(error);
          //redirect
        }
    }
})();
