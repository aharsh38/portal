(function () {
	'use strict';

	angular
		.module('fct.api')
		.factory('memberService', memberService);

	memberService.$inject = ['$http', '$mdDialog'];

	function memberService($http, $mdDialog) {
		var service = {
			getAllFacultyCoordinators: getAllFacultyCoordinators,
			verifyFaculty: verifyFaculty,
			getTotalRegistrations: getTotalRegistrations,
			getDeleteModal: getDeleteModal,
			initializeCKEditor: initializeCKEditor,
		};

		return service;

		function getAllFacultyCoordinators() {
			return $http.get('/api/members/faculty')
				.then(responseFunc)
				.catch(errorFunc);
		}

		function verifyFaculty(id) {
			return $http.patch('/api/members/faculty/verify/' + id)
				.then(responseFunc)
				.catch(errorFunc);
		}

		function getTotalRegistrations() {
			return $http.get('/api/members/registrations')
				.then(responseFunc)
				.catch(errorFunc);
		}

		function confirmRegistration(registration) {

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

		function getDeleteModal() {
			var confirm = $mdDialog.confirm()
				.title('Delete')
				.textContent('Are you sure you want to delete this record?')
				.ok('Confirm')
				.cancel('Cancel');
			return $mdDialog.show(confirm).then(responseFunc, errorFunc);
		}

		function responseFunc(response) {
			return response;
		}

		function errorFunc(error) {
			return error;
		}

	}
})();
