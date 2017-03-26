(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('AddEventController', AddEventController);

	AddEventController.$inject = ['$stateParams', 'eventService', '$rootScope', '$timeout', 'Upload', '$state', 'fctToast', '$filter', 'memberService'];

	function AddEventController(stateParams, eventService, $rootScope, $timeout, Upload, $state, fctToast, $filter, memberService) {
		var vm = this;
		vm.isUpdate = false;
		vm.myEvent = {
			'managers': [],
			'event': "Add",
		};
		vm.myEvent.attachments = [];
		vm.files = [];
		vm.image = '';
		vm.myEvent.image = null;

		angular.extend(vm, {
			save: save,
			openManagersModal: openManagersModal,
			uploadFiles: uploadFiles,
			feeTypeChanged: feeTypeChanged,
			uploadImage: uploadImage,
			uploadIconImage: uploadIconImage,
			doneLoading: doneLoading,
		});

		activate();

		function activate() {
			//memberService.initializeCKEditor();
		}

		function doneLoading() {}

		function openManagersModal(total) {
			vm.myEvent.managers = [];
			while (total > 0) {
				var each = {
					"index": 1
				};
				vm.myEvent.managers.push(each);
				total--;
			}
		}

		function feeTypeChanged() {
			switch (vm.myEvent.fees_type) {
			case "no_payment":
				vm.myEvent.fees = 0;
				vm.feeDisabled = true;
				vm.myEvent.do_payment = false;
				break;
			case "do_payment":
				vm.myEvent.do_payment = true;
				break;
			case "late_payment":
				vm.myEvent.do_payment = false;
				break;
			}
		}

		function save() {
			// vm.myEvent.rules = CKEDITOR.instances["editorRules"].getData();
			// vm.myEvent.specification = CKEDITOR.instances["editorSpecification"].getData();
			// vm.myEvent.judging_criteria = CKEDITOR.instances["editorJudgingCriteria"].getData();
			//console.log(vm.myEvent);
			if (vm.myEvent.isUpdate) {
				return eventService.updateEvent(vm.myEvent).then(registerSuccess).catch(registerFailure);
			} else {
				return eventService.addEvent(vm.myEvent).then(registerSuccess).catch(registerFailure);
			}
		}

		function registerSuccess(event) {
			fctToast.showToast("Event Registered.", true);
			$timeout(function () {
				$state.go('in_tc.showEvent');
			});
		}

		function registerFailure(event, error) {
			fctToast.showToast(error.data.message);
		}

		function uploadFiles(files, errFiles) {
			angular.forEach(files, function (file) {
				vm.files.push(file);
				file.upload = Upload.upload({
					url: '/api/members/upload',
					data: {
						file: file
					}
				});
				file.upload.then(function (response) {
					//console.log(response);
					$timeout(function () {
						file.result = response.data;
						var attach = {
							doc_name: file.name,
							link: file.dest,
						};
						vm.myEvent.attachments.push(attach);
						//console.log(attach);
					});
				}, function (response) {
					if (response.status > 0)
						vm.errorMsg = response.status + ': ' + response.data;
				}, function (evt) {
					file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
				});
			});


		}

		function uploadImage(files, errFiles) {
			angular.forEach(files, function (file) {
				file.upload = Upload.upload({
					url: '/api/members/uploadImage',
					data: {
						file: file
					}
				});
				file.upload.then(function (response) {
					reponse.log(response);
					vm.myEvent.event_image = response.data.path;
				}, function (response) {
					if (response.status > 0) {
						////console.log(reponse);
					}
				}, function (evt) {
					file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
				});
			});
		}

		function uploadIconImage(files, errFiles) {
			angular.forEach(files, function (file) {
				file.upload = Upload.upload({
					url: '/api/members/uploadIconImage',
					data: {
						file: file
					}
				});
				file.upload.then(function (response) {
					reponse.log(response);
					vm.myEvent.event_icon_image = response.data.path;
				}, function (response) {
					if (response.status > 0) {
						////console.log(reponse);
					}
				}, function (evt) {
					file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
				});
			});
		} //dfdf//sdf=
	}
})();
