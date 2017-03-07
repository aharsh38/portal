(function () {
    'use strict';

    angular
      .module('fct.core')
      .controller('AddEventController', AddEventController);

    AddEventController.$inject = ['$stateParams', 'eventService', '$rootScope'];

    function AddEventController(stateParams, eventService, $rootScope) {
        var vm = this;
        vm.isUpdate = false;
        vm.myEvent = {
          'managers':[],
          'event': "Add",
        };
        vm.files = [];
        vm.images = [];

        angular.extend(vm, {
            save: save,
            openManagersModal: openManagersModal,
        });

        activate();

        function activate() {
          initializeCKEditor();
        }

        function openManagersModal(total) {
          vm.myEvent.managers = [];
          while(total > 0) {
            var each = {"index":1};
            vm.myEvent.managers.push(each);
            total--;
          }
        }

        function save() {
          console.log(JSON.stringify(vm.myEvent));
          vm.myEvent.rules = CKEDITOR.instances["editorRules"].getData();
          vm.myEvent.specification = CKEDITOR.instances["editorSpecification"].getData();
          vm.myEvent.judging_criteria = CKEDITOR.instances["editorJudgingCriteria"].getData();

    		  if(vm.myEvent.isUpdate) {
      			return eventService.updateEvent(vm.myEvent).then(onRegisterSuccess).catch(onRegisterFailure);
    		  } else {
      			return eventService.addEvent(vm.myEvent).then(onRegisterSuccess).catch(onRegisterFailure);
    		  }
        }

    		function registerSuccess(event) {
            asToast.showToast("Registered",true);

        }

        function registerFailure(event, error) {
            asToast.showToast(error.data.message);
        }

        function initializeCKEditor() {
          if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
          	CKEDITOR.tools.enableHtml5Elements( document );

          // The trick to keep the editor in the sample quite small
          // unless user specified own height.
          CKEDITOR.config.height = 150;
          CKEDITOR.config.width = 'auto';

          var initSample = ( function() {
          	var wysiwygareaAvailable = isWysiwygareaAvailable();

          	return function() {
          		var editorElement = CKEDITOR.document.getById( 'editor' );

          		// Depending on the wysiwygare plugin availability initialize classic or inline editor.
          		if ( wysiwygareaAvailable ) {
          			CKEDITOR.replace( 'editorRules' );
          			CKEDITOR.replace( 'editorSpecification' );
          			CKEDITOR.replace( 'editorJudgingCriteria' );
          		} else {
          			editorElement.setAttribute( 'contenteditable', 'true' );
          			CKEDITOR.inline( 'editorRules' );
          			CKEDITOR.inline( 'editorSpecification' );
          			CKEDITOR.inline( 'editorJudgingCriteria' );

          			// TODO we can consider displaying some info box that
          			// without wysiwygarea the classic editor may not work.
          		}

          		//CKEDITOR.instances["editor"].getData()
          		//to get the data
          	};

          	function isWysiwygareaAvailable() {
          		// If in development mode, then the wysiwygarea must be available.
          		// Split REV into two strings so builder does not replace it :D.
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
