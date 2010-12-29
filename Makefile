#
# Makefile for FoxScheme, to create one foxscheme.js
#
#
# MINIFY is expected to be some program that takes JavaScript file
# and reduces its file size: $(MINIFY) in.js -o output.js
MINIFY=yuicomp
#
# FILES is a list of all the FoxScheme files, in the order that
# they should be run
FILES=src/fox.js \
src/system/nil.js \
src/system/error.js \
src/system/boolean.js \
src/system/symbol.js \
src/system/char.js \
src/system/string.js \
src/system/pair.js \
src/system/vector.js \
src/system/hash.js \
src/system/util.js \
src/system/parser.js \
src/system/procedure.js \
src/system/native.js \
src/system/expand.js \
src/system/interpreter.js

OUTPUT=bin/foxscheme.js

default: $(FILES)
	cat $(FILES) > __merged.js
	$(MINIFY) __merged.js -o $(OUTPUT)

uncompressed: $(files)
	cat $(FILES) > $(OUTPUT)

clean:
	rm __merged.js
