load("dist/foxscheme.js");

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
// TODO: implement (load)

$fs.i = new $fs.Interpreter()

$fs.eval = function(str) {
    var p = new $fs.Parser(str)
    var expr
    var r
    while((expr = p.nextObject()) !== FoxScheme.Parser.EOS) {
        r = $fs.i.eval(expr)
    }
    return r;
}

console = { log: function(m) { print(m) }}
