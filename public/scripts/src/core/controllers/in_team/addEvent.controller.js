(function () {
    'use strict';

    angular
      .module('fct.core')
      .controller('AddEventController', AddEventController);

    AddEventController.$inject = ['$stateParams', 'eventService', '$rootScope'];

    function AddEventController(stateParams, eventService, $rootScope) {
        var vm = this;
        vm.myEvent = {
          'managers':[],
        };
        vm.files = [];
        vm.images = [];

        angular.extend(vm, {
            register: register,
            openManagersModal: openManagersModal,
        });

        activate();

        function activate() {
          initializeCKEditor();
          checkEventData();
        }

        function checkEventData() {
          if(stateParams.editData !== undefined && stateParams.editData !== null) {
            vm.myEvent = stateParams.editData;
            vm.myEvent.event = "Update";
			vm.myEvent.isUpdate = true;
            CKEDITOR.document.getById("editorRules").setHtml(vm.myEvent.rules);
            CKEDITOR.document.getById("editorSpecification").setHtml(vm.myEvent.specification);
            CKEDITOR.document.getById("editorJudgingCriteria").setHtml(vm.myEvent.judging_criteria);
          } else {
            vm.myEvent.event = "Insert";
			vm.myEvent.isUpdate = false;
          }
        }

        function register() {
          console.log(JSON.stringify(vm.myEvent));
          vm.myEvent.rules = CKEDITOR.instances["editorRules"].getData();
          vm.myEvent.specification = CKEDITOR.instances["editorSpecification"].getData();
          vm.myEvent.judging_criteria = CKEDITOR.instances["editorJudgingCriteria"].getData();
		  if(vm.myEvent.update) {
			return eventService.updateEvent(vm.myEvent).then(onRegisterSuccess).catch(onRegisterFailure);
		  } else {
			return eventService.addEvent(vm.myEvent).then(onRegisterSuccess).catch(onRegisterFailure);
		  }
        }

        function onRegisterSuccess(response) {
          console.log(response);
        }

        function onRegisterFailure(error) {
          console.log(error);
        }

        function openManagersModal(total) {
          vm.myEvent.managers = [];
          while(total > 0) {
            var each = {"index":1};
            vm.myEvent.managers.push(each);
            total--;
          }
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
