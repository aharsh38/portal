(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('ParticipantRegistrationController', ParticipantRegistrationController);

	ParticipantRegistrationController.$inject = ['$http'];

	function ParticipantRegistrationController($http) {
		var vm = this;
		vm.myParticipant = {
			eventObject: {
				event_id: 123123,
				event_shortcode: 'EVET'
			},
			other_participants: []
		};
    vm.otherParticipants = [];
		vm.myParticipant.other_participants = [];
    vm.maxParticipants = 4;
    vm.eventPrice = 50;
    vm.esflag = false;
    vm.nopflag = false;

		angular.extend(vm, {
      getParticipantLength : getParticipantLength,
      save : save,
      openParticipantModule : openParticipantModule,
		});

		activate();

		function activate() {
			var x = '{"eventObject": {"event_id": "123123","event_shortcode": "EVET","event_section": "1","event_name": "1"},"other_participants": [{"title": "Team Member","leaderFlag": false,"$$hashKey": "object:68","name": "cl","email": "d@ddc.c","college_name": "1","branch": "2","semester": "6","mobileno": "43223443223","enrollment": "322342342342343"}],"total_amount": 100,"numberOfParticipant": "2","do_payment": true,"team_leader": {"title": "Team Leader","leaderFlag": true,"$$hashKey": "object:67","name": "fd","email": "s@sd.3","mobileno": "12341232133","college_name": "1","branch": "1","semester": "2","enrollment": "231312312332333"}}';
			return $http.post('/api/registration/create', x)
				.then(resolveFunc)
				.catch(rejectFunc);
		}

    function openParticipantModule(total) {
      vm.nopflag = true;
      var first = true;
      vm.myParticipant.other_participants = [];
      while(total > 0) {
        var each = {"title": (first) ? "Team Leader" : "Team Member",
                    "leaderFlag": first};
        vm.myParticipant.other_participants.push(each);
        first = false;
        total--;
      }
    }

    function getParticipantLength() {
      return vm.myParticipant.other_participants.length;
    }

		function save() {
			vm.myParticipant.do_payment = true;
			//console.log(JSON.stringify(vm.myParticipant));
			vm.myParticipant.team_leader = vm.myParticipant.other_participants[0];
			vm.myParticipant.other_participants.splice(0, 1);
			//console.log(JSON.stringify(vm.myParticipant));
			return $http.post('/api/registration/create', vm.myParticipant)
				.then(resolveFunc)
				.catch(rejectFunc);
		}

		function resolveFunc(response) {
			//console.log(response);
		}

		function rejectFunc(error) {
			//console.log(error);
		}
	}
})();
