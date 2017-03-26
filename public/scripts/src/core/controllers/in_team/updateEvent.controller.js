(function () {
	'use strict';

	angular
		.module('fct.core')
		.controller('UpdateEventController', UpdateEventController);

	UpdateEventController.$inject = ['$stateParams', 'eventService', '$rootScope', '$state', 'fctToast', 'memberService', 'Upload', '$timeout'];

	function UpdateEventController(stateParams, eventService, $rootScope, state, fctToast, memberService, Upload, $timeout) {
		var vm = this;
		vm.isUpdate = true;
		vm.myEvent = {
			'managers': [],
		};
		vm.myEvent.attachments = [];
		vm.files = [];
		vm.feeDisabled = false;
		vm.myEvent.do_payment = false;
		vm.loadIndex = 0;
		vm.loadCompleted = 3;
		vm.myEvent.image = null;

		angular.extend(vm, {
			save: save,
			openManagersModal: openManagersModal,
			uploadFiles: uploadFiles,
			feeTypeChanged: feeTypeChanged,
			doneLoading: doneLoading,
			uploadImage: uploadImage,
			uploadIconImage: uploadIconImage,
		});

		activate();

		function activate() {
			//memberService.initializeCKEditor();
			//checkEventId();
		}

		function doneLoading() {
			vm.loadIndex++;
			if (vm.loadIndex == vm.loadCompleted) {
				checkEventId();
			}
		}

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

		function checkEventId() {
			if (stateParams.eventId !== undefined && stateParams.eventId !== null) {
				vm.eventId = stateParams.eventId;
				return eventService.getSingleEvent(vm.eventId)
					.then(onEventGetSuccess)
					.catch(onEventGetFailure);

			}
			return null;
		}

		function onEventGetSuccess(eventData) {
			//console.log(eventData);
			vm.myEvent = eventData.data;
			vm.myEvent.event = "Update";
			vm.myEvent.totalManager = vm.myEvent.managers.length;
			vm.files = vm.myEvent.attachments;
			// return [CKEDITOR.instances['editorRules'].setData(vm.myEvent.rules),
			// 	CKEDITOR.instances['editorSpecification'].setData(vm.myEvent.specification),
			// 	CKEDITOR.instances['editorJudgingCriteria'].setData(vm.myEvent.judging_criteria)];
		}

		function onEventGetFailure(error) {
			//console.log(error);

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
			return eventService.updateEvent(vm.eventId, vm.myEvent)
				.then(onUpdateSuccess)
				.catch(onUpdateFailure);
		}

		function onUpdateSuccess(response) {
			fctToast.showToast("Update Success.", true);
			state.go('in_tc.showEvent');
		}

		function onUpdateFailure(error) {
			fctToast.showToast("Please try again later.");
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
					// //console.log(response);
					var attach = {
						doc_name: file.name,
						link: response.data.path,
					};
					vm.myEvent.attachments.push(attach);
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
					// //console.log(response);
					$timeout(function () {
						vm.myEvent.event_image = response.data.path;
					});
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
					url: '/api/members/uploadIcons',

					data: {
						file: file
					}
				});
				file.upload.then(function (response) {
					// //console.log(response);
					vm.myEvent.event_icon = response.data.path;
				}, function (response) {
					if (response.status > 0) {
						////console.log(reponse);
					}
				}, function (evt) {
					file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
				});
			});
		}
	}
})();
