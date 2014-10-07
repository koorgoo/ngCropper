(function() {
'use strict';

angular.module('demo', ['ngCropper'])
.controller('UploadController', function($scope, $timeout, Cropper) {
  var file, data;

  /**
   * Method is called every time file input's value changes.
   * Because of Angular has not ng-change for file inputs a hack is needed -
   * call `angular.element(this).scope().onFile(this.files[0])`
   * when input's event is fired.
   */
  $scope.onFile = function(blob) {
    Cropper.encode((file = blob)).then(function(dataUrl) {
      $scope.dataUrl = dataUrl;
      $timeout(showCropper);  // need $digest to set image's src before
    });
  };

  /**
   * When there is a cropped image to show encode it to base64 string and
   * use a source for image element.
   */
  $scope.preview = function() {
    if (!file || !data) return;
    Cropper.crop(file, data).then(Cropper.encode).then(function(dataUrl) {
      ($scope.preview || ($scope.preview = {})).dataUrl = dataUrl;
    });
  };

  /**
   * Object is used to pass options to initalize cropper.
   * More on options - https://github.com/fengyuanchen/cropper#options
   */
  $scope.options = {
    done: function(dataNew) {
      data = dataNew;
    }
  };

  /**
   * Showing (initializing) and hiding (destroying) of cropper are started by
   * events. The scope of the `ng-cropper` directive is derived from the scope of
   * the controller. When initializing `ng-cropper` directive adds two handlers
   * listening to events passed by attributes `ng-show` and `ng-hide`.
   * To show or hide a cropper `$broadcast` proper event.
   */
  $scope.showEvent = 'show';
  $scope.hideEvent = 'hide';

  function showCropper() { $scope.$broadcast($scope.showEvent); }
  function hideCropper() { $scope.$broadcast($scope.hideEvent); }

});

})();
