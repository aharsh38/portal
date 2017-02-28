(function () {
    'use strict';

    angular
      .module('fct.core')
      .controller('EachEventController', EachEventController);

    EachEventController.$inject = ['$stateParams'];

    function EachEventController(stateParams) {
        var vm = this;

        activate();

        function activate() {
          vm.myEvent = (stateParams.showData !== undefined && stateParams.showData !== null) ?
            stateParams.showData
            : false;
		    }
    }
})();
