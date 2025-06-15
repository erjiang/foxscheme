Testing changes:

1. Run `npm run build` to make sure build still works.
2. Run `npm tests` to run test suite.

Important: all changes should be tested on the CLI if possible. Simple ad-hoc testing can be done using the node.js shim, e.g.

$ echo "(+ 2 2)" | npm run repl

will print "4" on the last line.
