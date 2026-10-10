.PHONY: build check check-browser serve
build:
	node tools/build.cjs

check:
	node --check data.js
	node --check views.js
	node --check app.js
	node --check sw.js
	node tools/build.cjs --check
	node tools/check.cjs

check-browser: check
	node tools/check-browser.cjs

serve:
	node tools/serve.cjs
