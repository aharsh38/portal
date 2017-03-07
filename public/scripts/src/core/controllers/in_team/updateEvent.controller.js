(function () {
    'use strict';

    angular
      .module('fct.core')
      .controller('UpdateEventController', UpdateEventController);

    UpdateEventController.$inject = ['$stateParams', 'eventService', '$rootScope', '$state', 'fctToast'];

    function UpdateEventController(stateParams, eventService, $rootScope, state, fctToast) {
        var vm = this;
        vm.isUpdate = true;
        vm.myEvent = {
          'managers':[],
        };

        angular.extend(vm, {
            save: save,
            openManagersModal: openManagersModal,
        });

        activate();

        function activate() {
          initializeCKEditor();
          checkEventId();
        }

        function openManagersModal(total) {
          vm.myEvent.managers = [];
          while(total > 0) {
            var each = {"index":1};
            vm.myEvent.managers.push(each);
            total--;
          }
        }

        function checkEventId() {
          if(stateParams.eventId !== undefined && stateParams.eventId !== null) {
              vm.eventId = stateParams.eventId;
              return eventService.getSingleEvent(vm.eventId)
                .then(onEventGetSuccess)
                .catch(onEventGetFailure);

          }
          return null;
        }

        function onEventGetSuccess(eventData) {
          console.log(eventData);
          vm.myEvent = eventData.data;
          vm.myEvent.event = "Update";
        }

        function onEventGetFailure(error) {
          console.log(error);
          //redirect
        }

        function save() {
          vm.myEvent.rules = CKEDITOR.instances["editorRules"].getData();
          vm.myEvent.specification = CKEDITOR.instances["editorSpecification"].getData();
          vm.myEvent.judging_criteria = CKEDITOR.instances["editorJudgingCriteria"].getData();
          console.log(JSON.stringify(vm.myEvent));
          return eventService.updateEvent(vm.eventId, vm.myEvent)
            .then(onUpdateSuccess)
            .catch(onUpdateFailure);
        }

        function onUpdateSuccess(response) {
          console.log(response);
          fctToast.showToast("Update Success.", true);
          state.go('in_tc.showEvent');
        }

        function onUpdateFailure(error) {
          console.log(error);
          fctToast.showToast("Please try again later.");
        }

        function initializeCKEditor() {
          if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
          	CKEDITOR.tools.enableHtml5Elements( document );
            CKEDITOR.config.height = 150;
            CKEDITOR.config.width = 'auto';
            var initSample = ( function() {
            	var wysiwygareaAvailable = isWysiwygareaAvailable();
            	return function() {
            		var editorElement = CKEDITOR.document.getById( 'editor' );
            		if ( wysiwygareaAvailable ) {
            			CKEDITOR.replace( 'editorRules' );
            			CKEDITOR.replace( 'editorSpecification' );
            			CKEDITOR.replace( 'editorJudgingCriteria' );
            		} else {
            			editorElement.setAttribute( 'contenteditable', 'true' );
            			CKEDITOR.inline( 'editorRules' );
            			CKEDITOR.inline( 'editorSpecification' );
            			CKEDITOR.inline( 'editorJudgingCriteria' );
            		}
            	};

          	function isWysiwygareaAvailable() {
          		if ( CKEDITOR.revision == ( '%RE' + 'V%' ) ) {
          			return true;
          		}
          		return !!CKEDITOR.plugins.get( 'wysiwygarea' );
          	}
          } )();
          initSample();
        }
    }
})();
