(function() {
'use strict';

angular.module('ngCropper', [])
.directive('ngCropper', function() {
  return {
    restrict: 'A',
    scope: {onDone: '=ngDone'},
    link: function(scope, element, attrs) {
      var showEvent = attrs.ngShowEvent;
      var hideEvent = attrs.ngHideEvent;

      var opts = angular.extend({
        aspectRatio: 'auto',
        done: scope.onDone || angular.noop
      }, attrs);

      scope.$on(showEvent, function() {
        element.cropper(opts);
      });

      scope.$on(hideEvent, function() {
        element.cropper('destroy');
      });
    }
  };
})
.service('Cropper', ['$q', function($q) {

  this.encode = function(blob) {
    var defer = $q.defer();
    var reader = new FileReader();
    reader.onload = function() {
      defer.resolve(reader.result);
    };
    reader.readAsDataURL(blob);
    return defer.promise;
  };

  this.decode = function(dataUrl) {
    var meta = dataUrl.split(';')[0];
    var type = meta.split(':')[1];
    var binary = atob(dataUrl.split(',')[1]);
    var array = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], {type: type}); 
  };

  this.crop = function(file, data) {
    var defer = $q.defer();
    var type = file.type;
    var _decode = this.decode;
    
    this.encode(file).then(function(dataUrl) {
      var canvas = createCanvas(data);
      var context = canvas.getContext('2d');
      var image = new Image();
      image.src = dataUrl;

      context.drawImage(image, data.x, data.y, data.width, data.height, 0, 0, data.width, data.height);
      var encoded = canvas.toDataURL(file.type);

      var blob = _decode(encoded);

      defer.resolve(blob);
      removeElement(canvas);
    });

    return defer.promise;
  };


  function createCanvas(data) {
    var canvas = document.createElement('canvas');
    canvas.width = data.width;
    canvas.height = data.height;
    canvas.style.display = 'none';
    document.body.appendChild(canvas);
    return canvas;
  }

  function removeElement(el) {
    el.parentElement.removeChild(el);
  }

}]);

})();