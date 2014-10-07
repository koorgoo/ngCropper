(function() {
'use strict';

angular.module('demo', ['ngCropper'])
.controller('UploadController', function($scope, $timeout, Cropper) {
  var file = null;
  var crop = null;

  $scope.onFile = function(blob) {
    Cropper.encode((file = blob)).then(function(dataUrl) {
      $scope.dataUrl = dataUrl;
      $timeout(showCropper);
    });
  };

  $scope.onSelection = function(data) {
    Cropper.crop(file, data).then(function(blob) { crop = blob; });
  };

  $scope.showPreview = function() {
    Cropper.encode(crop).then(function(dataUrl) {
      ($scope.preview || ($scope.preview = {})).dataUrl = dataUrl;
    })
  };

  $scope.showCropperEvent = 'showCropper';
  $scope.hideCropperEvent = 'hideCropper';

  function showCropper() { $scope.$broadcast($scope.showCropperEvent); }
  function hideCropper() { $scope.$broadcast($scope.hideCropperEvent); }

});

})();