.PHONY: check check-browser serve
check:
	node --check assets/js/app.js
	node --check service-worker.js
	node tools/check.cjs
	git diff --check -- .

check-browser: check
	node tools/check-browser.cjs

serve:
	node tools/serve.cjs
