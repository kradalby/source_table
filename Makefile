PATH:= node_modules/.bin:$(PATH)
SHELL:= /bin/bash

build.css:
	lessc frontend/less/style.less static/css/bundle.css
	autoprefixer static/css/bundle.css

build.js:
	browserify src/index.js | uglifyjs -c > out/source-table.js

build.js.debug:
	browserify src/index.js > out/source-table.js

watch:
	watchman-make -p 'src/*.js' 'Makefile' -t build.js

build: build.js build.css
