var injector = angular.injector(['ngCropper']);
var pixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";

describe('ngCropper', function() {

  describe('Cropper service', function() {
    var Cropper = injector.get('Cropper');

    describe('decode()', function() {
      it('return blob with valid type', function() {
        var blob = Cropper.decode(pixel);
        assert.instanceOf(blob, Blob);
        assert.equal(blob.type, 'image/gif');
      });
    });

    describe('encode()', function() {
      var blob = Cropper.decode(pixel);

      it('return promise resolved with dataUrl', function(done) {
        var promise = Cropper.encode(blob);
        assert.isFunction(promise.then);
        promise.then(function(dataUrl) {
          assert.equal(dataUrl, pixel);
          done();
        })
      });
    });

    describe('crop()', function() {
      var blob = Cropper.decode(pixel);

      it('return promise resolved with blob', function(done) {
        var data = {x: 0, y: 0, width: 1, height: 1};  // pixel
        var promise = Cropper.crop(blob, data);
        assert.isFunction(promise.then);
        promise.then(function(blob) {
          assert.instanceOf(blob, Blob);
          done();
        })
      });
    });

  });

});