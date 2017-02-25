(function () {
    'use strict';

    angular
      .module('fct.core')
      .controller('AddEventController', AddEventController);

    AddEventController.$inject = ['$stateParams', 'eventService', '$rootScope'];

    function AddEventController(stateParams, eventService, $rootScope) {
        var vm = this;
        vm.myEvent = {};

        angular.extend(vm, {
            register: register
        });

        activate();

        function activate() {
          initializeCKEditor();
        }

        function register() {alert(JSON.stringify(vm.myEvent));
          //eventService.addEvent(vm.myEvent);
        }

    		$rootScope.$on('registerSuccess', registerSuccess);
        $rootScope.$on('registerFailure', registerFailure);

    		function registerSuccess(event) {
            asToast.showToast("Registered",true);

        }

        function registerFailure(event, error) {
            asToast.showToast(error.data.message);
        }

        function initializeCKEditor() {
          if(stateParams.editData !== undefined &&
              stateParams.editData !== null) {
            vm.myEvent = stateParams.editData;
            vm.myEvent.event = "Insert";
          } else {
            vm.myEvent.event = "Update";
          }

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
