/*
 * Dependency graph generator for FoxScheme
 *
 * Usage: rhino dependencies.js src/system/*.js > dependencies.dot
 *        dot dependencies.dot
 *
 * This script analyzes the JavaScript source files passed in as arguments, and
 * generates a graph of which FoxScheme classes refer to which.  This script
 * assumes a few conventions about the FoxScheme source:
 *   * Class declarations start at the beginning of the line, and each class is
 *     only one step down from FoxScheme:
 *       i.e. /^FoxScheme.\w+/
 *   * Comments occupy their own line, so lines containing " * " or "// " are
 *     skipped
 *   * The source for a class immediately follows that class's declaration in a
 *     contiguous block until the next declaration
 *
 * JavaScript object properties are abused to avoid printing duplicate edges
 */

var nodes = []
var edges = {} // fake hash

var declRegex = /^(FoxScheme\.\w+) =/
var classRegex = /FoxScheme\.\w+/g

for(var i = 0; i < arguments.length; i++) {
    var file = java.io.File(arguments[i])
    var br = java.io.BufferedReader(java.io.FileReader(file))

    var currentClass = null
    var line
    var results
    while((line = br.readLine()) !== null) {
        // see if a new class is declared
        if((results = declRegex(line)) !== null) {
            currentClass = results[1]
            nodes.push(currentClass)
            continue;
        }
        
        if(currentClass === null)
            continue;

        // avoid commented-out things
        if(line.indexOf(" * ") !== -1 ||
            line.indexOf("// ") !== -1)
            continue;

        while((results = classRegex(line)) !== null) {
            if(results[0] !== currentClass)
                // set fakehash's key
                edges[['"',currentClass,'" -> "',results[0],'"'].join("")] = true
        }
    }
}

print("digraph FoxScheme {")

for(var i in nodes) {
    print(['"',nodes[i],'"'].join(""))
}

for(var i in edges) {
    print(i)
}

print("}")
