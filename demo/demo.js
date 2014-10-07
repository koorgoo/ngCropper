(function() {
'use strict';

angular.module('demo', ['ngCropper'])
.controller('UploadController', function($scope, $timeout, Cropper) {
  var file, crop;

  $scope.onFile = function(blob) {
    Cropper.encode((file = blob)).then(function(dataUrl) {
      $scope.dataUrl = dataUrl;
      $timeout(showCropper);
    });
  };

  function onDone(data) {
    Cropper.crop(file, data).then(function(blob) { crop = blob; });
  };

  $scope.preview = function() {
    Cropper.encode(crop).then(function(dataUrl) {
      ($scope.preview || ($scope.preview = {})).dataUrl = dataUrl;
    })
  };

  $scope.options = {done: onDone};
  $scope.showEvent = 'show';
  $scope.hideEvent = 'hide';

  function showCropper() { $scope.$broadcast($scope.showEvent); }
  function hideCropper() { $scope.$broadcast($scope.hideEvent); }

});

})();