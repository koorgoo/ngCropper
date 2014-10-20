var injector = angular.injector(['ngCropper']);
var pixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";


describe('ngCropper', function() {

  function createImage(source) {
    var defer = injector.get('$q').defer();
    var img = new Image();
    img.src = source;
    img.onload = function(e) { defer.resolve(e.target); };
    return defer.promise;
  }

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
        });
      });
    });


    describe('scale()', function() {
      var blob = Cropper.decode(pixel);

      it('return promise resolved with blob', function(done) {
        var promise = Cropper.scale(blob, {width: 2});
        assert.isFunction(promise.then);
        promise.then(function(blob) {
          assert.instanceOf(blob, Blob);
          done();
        });
      });

      it('accept Number ratio', function(done) {
        Cropper.scale(blob, 2)  // = 4 pixels 
        .then(Cropper.encode).then(createImage)
        .then(function(img) {
          assert.equal(img.width, 2); 
          assert.equal(img.height, 2);
          done();
        });
      });

      it('accept Object data', function(done) {
        Cropper.scale(blob, {width: 4, height: 2})  // = 8 pixels 
        .then(Cropper.encode).then(createImage)
        .then(function(img) {
          assert.equal(img.width, 4); 
          assert.equal(img.height, 2);
          done();
        });
      });

      it('calculate width if height passed', function(done) {
        Cropper.scale(blob, {height: 2})  // = 4 pixels 
        .then(Cropper.encode).then(createImage)
        .then(function(img) {
          assert.equal(img.width, 2); 
          assert.equal(img.height, 2);
          done();
        });
      });

      it('calculate height if with passed', function(done) {
        Cropper.scale(blob, {width: 2})  // = 4 pixels 
        .then(Cropper.encode).then(createImage)
        .then(function(img) {
          assert.equal(img.width, 2); 
          assert.equal(img.height, 2);
          done();
        });
      });
    });
  });

});