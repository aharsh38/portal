(function () {
	'use strict';

	angular
	.module('fct.core')
	.directive('ngFileModel', fileUpload);

	fileUpload.$inject = ['$parse'];

	function fileUpload($parse) {

		var directive = {
			restrict: 'A',
			scope: {
			  filesdata : '='
			},
			link: linkFunc,
		};

		return directive;

		function linkFunc ($scope, $element, $attributes) {
			var model = $parse($attributes.ngFileModel);
			var isMultiple = $attributes.multiple;
			var modelSetter = model.assign;
			var values = [];
			var i = 0;
			$element.bind('change', function () {//console.log($scope.filesdata);
				angular.forEach($element[0].files, function (item) {
					var value = {
						name: item.name,
						progress: 0,
						response: item,
					};
					values.push(value);
					if (isMultiple) {
						modelSetter($scope, values);
					} else {
						modelSetter($scope, values[0]);
					}
					var fd = new FormData();
					fd.append("uploaded_file", item);
					var xhr = new XMLHttpRequest();
					(function(i) {
						xhr.upload.onprogress = function (event) {
							$scope.$apply(function(){
								if (event.lengthComputable) {
									$scope.files[i].progress = Math.round(event.loaded * 100 / event.total);
								} else {
									$scope.files[i].progress = 'unable to compute';
								}
							});
						};
						xhr.onload = function (event) {
							if(!angular.isNumber(event.target.responseText)) {
								$scope.images.push(event.target.responseText);
							}
						};
						xhr.onabort = function (event) {
							$scope.$apply(function(){
								$scope.progressVisible = false;
							});
							alert('canceled');
						};
						xhr.onerror = function (event) {
							$scope.$apply(function(){
								$scope.progressVisible = false;
							});
							alert('failed');
						};
					})(i);
					xhr.open("POST", "/api/event/events", true);
					$scope.progressVisible = true;
					xhr.send(fd);
					i++;
				});
			});
		}
	}

})();
