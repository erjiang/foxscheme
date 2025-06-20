#
# Makefile for FoxScheme, to create one foxscheme.js
#
#
# MINIFY is expected to be some program that takes JavaScript file
# and reduces its file size: $(MINIFY) in.js -o output.js
#
#MINIFY=yuicomp
#MINIFY=-o
MINIFY=closure-compiler --js 
MINIFY_OUT=--js_output_file
SCHEME=petite

.PHONY: all
all:
	npm run build
#
# FILES is a list of all the FoxScheme files, in the order that
# they should be run
FILES=src/fox.js \
src/system/nil.js \
src/system/error.js \
src/system/boolean.js \
src/system/number.js \
src/system/symbol.js \
src/system/char.js \
src/system/string.js \
src/system/pair.js \
src/system/vector.js \
src/system/hash.js \
src/system/hashtable.js \
src/system/util.js \
src/system/parser.js \
src/system/procedure.js \
src/system/native.js \
src/system/expand.js \
src/system/looper.js \
src/system/interpreter.js \
\
src/lib/javascript.js

OUTPUT_PATH=bin
OUTPUT=$(OUTPUT_PATH)/foxscheme.js

$(OUTPUT): $(FILES)
	cat $(FILES) > __merged.js
	$(MINIFY) __merged.js $(MINIFY_OUT) $(OUTPUT)
	# This next line adds FoxScheme.version="9dfa9bb3"; to the end of the file
	echo FoxScheme.version=\"`git log -1\
		--pretty=format:%H | cut -c 1-8`'";' >> $(OUTPUT)

uncompressed: $(files)
	cat $(FILES) > $(OUTPUT)

rhino: $(OUTPUT) src/parser/parser.generated.js src/shim/rhino.js
	cat $(OUTPUT) src/shim/rhino.js > $(OUTPUT_PATH)/foxrhino.js

browser: $(OUTPUT) src/parser/parser.generated.js src/shim/browser.js
	cat $(OUTPUT) src/shim/browser.js > $(OUTPUT_PATH)/foxbrowser.js

psyntax/psyntax.js: preparse.ss lib/core.ss psyntax/psyntax.pp
	cat lib/core.ss psyntax/psyntax.pp | $(SCHEME) --script preparse.ss > psyntax/psyntax.js

clean:
	rm -f __merged.js bin/foxscheme.js bin/foxbrowser.js dist/foxscheme-*.js dist/foxscheme-*.js.map

src/parser/parser.generated.js: grammar.peg
	npm run build:grammar

test: src/parser/parser.generated.js
	npm test
