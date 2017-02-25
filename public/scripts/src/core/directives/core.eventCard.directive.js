(function () {
  'use strict';

  angular
    .module('fct.core')
    .directive('eventCard', eventCard);

  eventCard.$inject = [];
  
  function eventCard() {
    var directive = {
          restrict: 'E',
          templateUrl: '/templates/components/cards/eventCard.html',
          link: linkFunc,
          scope: {
              eventdata : '='
          },
          controller: 'EventCardController',
          controllerAs: 'ecc'
      };

      return directive;

      function linkFunc($scope, $element, $attributes) {
          $scope.openCard = false;
          $scope.caret = 'expand_less';
          $scope.toggleCard = toggleCard;
          console.log($scope.userdata);

          function toggleCard() {
              $scope.openCard = !($scope.openCard);

              if($scope.openCard === true){
                  $scope.caret = 'expand_more';
              }
              else {
                  $scope.caret = 'expand_less';
              }
          }
      }

  }

	angular
    .module('fct.core')
    .controller('EventCardController', EventCardController);

  EventCardController.$inject = ['$scope'];

  function EventCardController($scope) {

  }

})();
