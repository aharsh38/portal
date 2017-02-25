(function () {
    'use strict';

    angular
      .module('fct.core')
      .controller('ShowEventController', ShowEventController);

    ShowEventController.$inject = [];
    
    function ShowEventController() {
        var vm = this;

        activate();
        var joinedDate = "ab";

        function activate() {

          vm.dummyEvents = [{
            teamId: '32049',
            teamName: 'Mona Lisa',
            leaderName: 'Monit',
            contactNumber: '9329239499',
            eventName: 'Scrabble+',
            email: 'abc@123.com',
            eventSection: 'IT Department'
          },
          {
            teamId: '32048',
            teamName: 'Mango',
            leaderName: 'Monit',
            contactNumber: '9329239499',
            eventName: 'Scrabble+',
            email: 'abc@123.com',
            eventSection: 'IT Department'
          },
          {
            teamId: '32047',
            teamName: 'Rascals',
            leaderName: 'Monit',
            contactNumber: '9329239499',
            eventName: 'Scrabble+',
            email: 'abc@123.com',
            eventSection: 'IT Department'
          },
          {
            teamId: '32046',
            teamName: 'Rockerstar',
            leaderName: 'Monit',
            contactNumber: '9329239499',
            eventName: 'Scrabble+',
            email: 'abc@123.com',
            eventSection: 'IT Department'
          },];

        }
    }
})();
