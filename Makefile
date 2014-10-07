MINIFY=node_modules/minify/bin/minify.js
CROPPER_JS=client/bower_components/cropper/dist/cropper.js
CROPPER_CSS=client/bower_components/cropper/dist/cropper.css

prepare:
	bower install
	npm install

dist:
	rm dist/*
	cp ngCropper.js dist/ngCropper.js
	$(MINIFY) dist/ngCropper.js > dist/ngCropper.min.js
	cp $(CROPPER_JS) dist/ngCropper.all.js
	cat ngCropper.js >> dist/ngCropper.all.js
	cp $(CROPPER_CSS) dist/ngCropper.all.css
	$(MINIFY) dist/ngCropper.all.js > dist/ngCropper.all.min.js
	$(MINIFY) dist/ngCropper.all.css > dist/ngCropper.all.min.css

test:
	open -a "/Applications/Google Chrome.app" test/index.html

.PHONY: prepare dist test