MINIFY=node_modules/minify/bin/minify.js
CROPPER_JS=bower_components/cropperjs/dist/cropper.js
CROPPER_CSS=bower_components/cropperjs/dist/cropper.css
BROWSER=open -a "/Applications/Google Chrome.app"

prep:
	bower install
	npm install

dist: prep
	rm dist/*
	cp ngCropperjs.js dist/ngCropperjs.js
	$(MINIFY) dist/ngCropperjs.js > dist/ngCropperjs.min.js
	cp $(CROPPER_JS) dist/ngCropperjs.all.js
	echo >> dist/ngCropperjs.all.js
	cat ngCropperjs.js >> dist/ngCropperjs.all.js
	cp $(CROPPER_CSS) dist/ngCropperjs.all.css
	$(MINIFY) dist/ngCropperjs.all.js > dist/ngCropperjs.all.min.js
	$(MINIFY) dist/ngCropperjs.all.css > dist/ngCropperjs.all.min.css

test:
	$(BROWSER) test/index.html

demo:
	$(BROWSER) demo/index.html

.PHONY: prepare dist test demo
