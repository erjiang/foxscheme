When finding and fixing a bug, it's preferable to first write a test for the bug and make sure the test fails. Then, fix the bug and make sure the test passes.

Testing changes:

1. Run `npm run build` to make sure build still works.
2. Run `npm test` to run test suite.

Important: all changes should be tested on the CLI if possible. Simple ad-hoc testing can be done using the node.js shim, e.g.

$ echo "(+ 2 2)" | npm run repl

will print "4" on the last line.
