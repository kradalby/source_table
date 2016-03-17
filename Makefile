PATH:= node_modules/.bin:$(PATH)
SHELL:= /bin/bash

build.css:
	lessc frontend/less/style.less static/css/bundle.css
	autoprefixer static/css/bundle.css

build.js:
	browserify index.js | uglifyjs -c > out/source-table.js

build.js.debug:
	browserify index.js > out/source-table.js

build: build.js build.css
