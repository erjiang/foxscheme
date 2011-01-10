load("src/fox.js")
load("src/system/nil.js")
load("src/system/error.js")
load("src/system/boolean.js")
load("src/system/number.js")
load("src/system/symbol.js")
load("src/system/char.js")
load("src/system/string.js")
load("src/system/pair.js")
load("src/system/vector.js")
load("src/system/hash.js")
load("src/system/hashtable.js")
load("src/system/util.js")
load("src/system/parser.js")
load("src/system/procedure.js")
load("src/system/native.js")
load("src/system/expand.js")
load("src/system/looper.js")
load("src/system/interpreter.js")

FoxScheme.load = function(filename, i) {

    var p = new FoxScheme.Parser(readFile(filename))
    if(i === undefined)
        i = $fs.i
    var expr
    while((expr = p.nextObject()) !== FoxScheme.Parser.EOS) {
        i.eval(expr)
    }
    return i
}

$fs.i = new $fs.Interpreter()

$fs.eval = function(str) {
    var p = new $fs.Parser(str)
    var expr
    var r
    while((expr = p.nextObject()) !== $fs.Parser.EOS) {
        r = $fs.i.eval(expr)
    }
    return r;
}
