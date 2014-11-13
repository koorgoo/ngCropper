(function() {
'use strict';

angular.module('ngCropper', ['ng'])
.directive('ngCropper', ['$q', function($q) {
  return {
    restrict: 'A',
    scope: {options: '=ngOptions'},
    link: function(scope, element, atts) {
      var shown = false;

      scope.$on(atts.ngShow, function() {
        if (shown) return;
        shown = true;

        preprocess(scope.options, element[0])
          .then(function(options) {
            element.cropper(options);
          })
      });

      scope.$on(atts.ngHide, function() {
        if (!shown) return;
        shown = false;
        element.cropper('destroy');
      });

      scope.$watch('options.disabled', function(disabled) {
        if (!shown) return;
        if (disabled) element.cropper('disable');
        if (!disabled) element.cropper('enable');
      });
    }
  };

  function preprocess(options, img) {
    options = options || {};

    var defer = $q.defer();
    var toResolve = [passInitial(options)];

    if (options.maximize) toResolve.push(maximizeSelection(options, img));

    $q.all(toResolve).then(function(values) {
      var lastUpdatedOptions = values[values.length-1];
      defer.resolve(lastUpdatedOptions);
    });

    return defer.promise;
  }

  /**
   * The only promise to resolve when no more processing promiseses passed.
   */
  function passInitial(options) {
    var defer = $q.defer();
    defer.resolve(options);
    return defer.promise;
  }

  /**
   * Change options to make selection maximum for the image.
   * fengyuanchen/cropper calculates valid selection's height & width
   * with respect to `aspectRatio`.
   */
  function maximizeSelection(options, img) {
    var defer = $q.defer();

    getRealSize(img).then(function(size) {
      options.data = size;
      defer.resolve(options);
    });

    return defer.promise;
  }

  /**
   * Returns real image size (without changes by css, attributes).
   */
  function getRealSize(img) {
    var defer = $q.defer();
    var size = {height: null, width: null};
    var image = new Image();

    image.onload = function() {
      defer.resolve({width: image.width, height: image.height});
    }

    image.src = img.src;
    return defer.promise;
  }
}])
.service('Cropper', ['$q', function($q) {

  this.encode = function(blob) {
    var defer = $q.defer();
    var reader = new FileReader();
    reader.onload = function(e) {
      defer.resolve(e.target.result);
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
    var _decode = this.decode;

    this.encode(file).then(_createImage).then(function(image) {
      var canvas = createCanvas(data);
      var context = canvas.getContext('2d');

      context.drawImage(image, data.x, data.y, data.width, data.height, 0, 0, data.width, data.height);

      var encoded = canvas.toDataURL(file.type);
      var blob = _decode(encoded);

      defer.resolve(blob);
      removeElement(canvas);
    });

    return defer.promise;
  };

  this.scale = function(file, data) {
    var defer = $q.defer();
    var _decode = this.decode;

    this.encode(file).then(_createImage).then(function(image) {
      var heightOrig = image.height;
      var widthOrig = image.width;
      var ratio, height, width;

      if (angular.isNumber(data)) {
        ratio = data;
        height = heightOrig * ratio;
        width = widthOrig * ratio;
      }

      if (angular.isObject(data)) {
        ratio = widthOrig / heightOrig;
        height = data.height;
        width = data.width;

        if (height && !width)
          width = height * ratio;
        else if (width && !height)
          height = width / ratio;
      }

      var canvas = createCanvas(data);
      var context = canvas.getContext('2d');

      canvas.height = height;
      canvas.width = width;

      context.drawImage(image, 0, 0, widthOrig, heightOrig, 0, 0, width, height);

      var encoded = canvas.toDataURL(file.type);
      var blob = _decode(encoded);

      defer.resolve(blob);
      removeElement(canvas);
    });

    return defer.promise;
  };


  function _createImage(source) {
    var defer = $q.defer();
    var image = new Image();
    image.onload = function(e) { defer.resolve(e.target); };
    image.src = source;
    return defer.promise;
  }

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