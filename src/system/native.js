/*
 *
 * Implements the important native JS functions for FoxScheme
 * (i.e. things that cannot be written in Scheme)
 */

FoxScheme.nativeprocedures = function() {
var funcs = new FoxScheme.Hash();
var defun = function(name, arity, maxarity, proc) {
    funcs.set(name,
        new FoxScheme.NativeProcedure(proc, name, arity, maxarity))
}

/*
 * Some type-checking conveniences
 */
var isNumber = function(n) {
    return !isNaN(n)
}

/*
 * Void
 */
defun("void", 0, 0,
    function() {
        return FoxScheme.nothing
    })
/*
 * trace-closure
 * ugh why is debugging so hard
 *
 * fyi: hackish solution that was cooked up in a
 * debugging session. Relies on console.log!
 */
defun("trace-closure", 2, undefined,
    function(symbol, func) {
        var sym = symbol.name()
        return new FoxScheme.NativeProcedure(
            function (/* args */) {
                var new_args = []
                var i = arguments.length
                while(i--) {
                    new_args[i] = arguments[i]
                }
                if(console)
                    console.log(["(",sym," ",new_args.join(" "),")"].join(""))
                var r = func.fapply(new_args)
                if(console)
                    console.log("and got: "+r)
                return r
            },
            "traced-closure",
            0,
            undefined)
    })
/*
 * Pair operators
 */
defun("cons", 2, 2,
    function(a, b) {
        return new FoxScheme.Pair(a, b)
    })

defun("car", 1, 1,
    function(p) {
        if(!(p instanceof FoxScheme.Pair))
            throw new FoxScheme.Error(p+" is not a Pair", "car");

        return p.car()
    })

defun("cdr", 1, 1,
    function(p) {
        if(!(p instanceof FoxScheme.Pair))
            throw new FoxScheme.Error(p+" is not a Pair", "cdr");

        return p.cdr()
    })

/*
 * Arithmetic operators that are native by necessity or 
 * for obvious performance reasons.
 */

// = folds into boolean
defun("=", 1, undefined,
    function(/* args */) {
        if(isNaN(arguments[0]))
            throw new FoxScheme.Error(arguments[0]+" is not a number.", "=")
        var standard = arguments[0]
        var i = arguments.length
        while(i--) {
            if(isNaN(arguments[i]))
                throw new FoxScheme.Error(arguments[i]+" is not a number.", "=")
            if(arguments[i] !== standard)
                return false
        }
        return true
    })
defun("+", undefined, undefined,
    function(/* args */) {
        var acc = 0;
        /*
         * Unfortunately, arguments is not an array
         */
        var i = arguments.length;
        while(i--) {
            if(isNaN(arguments[i]))
                throw new FoxScheme.Error(arguments[i]+" is not a number")

            acc += arguments[i]
        }
        return acc;
    })
defun("-", 1, undefined,
    function(/* args */) {
        if(isNaN(arguments[0]))
            throw new FoxScheme.Error(arguments[0]+" is not a number")
        var acc = arguments[0]
        var i = arguments.length
        // (- 5) => -5
        if(i === 1)
            return - acc;

        while(i-- > 1) { // exclude 1st arg
            if(isNaN(arguments[i]))
                throw new FoxScheme.Error(arguments[i]+" is not a number")

            acc -= arguments[i]
        }
        return acc
    })

defun("*", undefined, undefined,
    function(/* args */) {
        var acc = 1;
        var i = arguments.length;
        while(i--) {
            if(isNaN(arguments[i]))
                throw new FoxScheme.Error(arguments[i]+" is not a number")

            acc *= arguments[i]
        }
        return acc;
    })

defun("/", 1, undefined,
    function(/* args */) {
        if(isNaN(arguments[0]))
            throw new FoxScheme.Error(arguments[0]+" is not a number")
        var acc = arguments[0]
        var i = arguments.length
        // (/ 5) => 1/5
        if(i === 1)
            return 1/ acc;

        while(i-- > 1) { // exclude 1st arg
            if(isNaN(arguments[i]))
                throw new FoxScheme.Error(arguments[i]+" is not a number")

            acc /= arguments[i]
        }
        return acc
    })

/*
 * Some basic type-checking predicates!
 */
defun("null?", 1, 1,
    function(p) {
        return p === FoxScheme.nil
    })
defun("pair?", 1, 1,
    function(p) {
        return p instanceof FoxScheme.Pair
    })

defun("number?", 1, 1,
    function(n) {
        return isNumber(n)
    })

defun("symbol?", 1, 1,
    function(s) {
        return s instanceof FoxScheme.Symbol
    })

/*
 * Vector ops
 */
defun("make-vector", 1, 2,
    function(n, e) {
        if(isNaN(n))
            throw new FoxScheme.Error(n+" is not a number", "make-vector")
        if(e === undefined)
            e = 0;
        var fill = [];
        while(n--)
            fill.push(e)
        return new FoxScheme.Vector(fill)
    })
defun("vector-length", 1, 1,
    function(v) {
        if(!(v instanceof FoxScheme.Vector))
            throw new FoxScheme.Error(v+" is not a Vector", "vector-length")
        return v.length()
    })

defun("vector-set!", 3, 3,
    function(v, i, el) {
        if(!(v instanceof FoxScheme.Vector))
            throw new FoxScheme.Error(v+" is not a Vector", "vector-set!")
        if(isNaN(i))
            throw new FoxScheme.Error(i+" is not a number", "vector-set!")
        
        v.set(i, el)
        return FoxScheme.nothing;
    })

defun("vector-ref", 2, 2,
    function(v, i) {
        if(!(v instanceof FoxScheme.Vector))
            throw new FoxScheme.Error(v+" is not a Vector", "vector-ref")
        if(isNaN(i))
            throw new FoxScheme.Error(i+" is not a number", "vector-ref")

        return v.get(i)
    })

/*
 * String ops
 */
defun("make-string", 1, 2,
    function(n, e) {
        if(isNaN(n))
            throw new FoxScheme.Error(n+" is not a number", "make-string")
        var ev;
        if(e === undefined)
            ev = "\0"
        else {
            if(!(e instanceof FoxScheme.Char))
                throw new FoxScheme.Error(e+" is not a Char", "make-string")
            ev = e.getValue()
        }
        var fill = []
        while(n--)
            fill.push(ev)
        return new FoxScheme.String(fill.join(""))
    })
defun("string-length", 1, 1,
    function(v) {
        if(!(v instanceof FoxScheme.String))
            throw new FoxScheme.Error(v+" is not a String", "string-length")
        return v.length()
    })
defun("string-set!", 3, 3,
    function(v, i, el) {
        if(!(v instanceof FoxScheme.String))
            throw new FoxScheme.Error(v+" is not a String", "string-set!")
        if(isNaN(i))
            throw new FoxScheme.Error(i+" is not a number", "string-set!")
        if(!(el instanceof FoxScheme.Char))
            throw new FoxScheme.Error(el+" is not a Char", "string-set!")
        if(i < 0 || i >= v.length())
            throw new FoxScheme.Error("Invalid index "+i, "string-set!")
        
        v.set(i, el)
        return FoxScheme.nothing;
    })
defun("string-ref", 2, 2,
    function(v, i) {
        if(!(v instanceof FoxScheme.String))
            throw new FoxScheme.Error(v+" is not a String", "string-ref")
        if(isNaN(i))
            throw new FoxScheme.Error(i+" is not a number", "string-ref")
        if(i < 0 || i >= v.length())
            throw new FoxScheme.Error("Invalid index "+i, "string-ref")

        return new FoxScheme.Char(v.get(i))
    })

/*
 * Boolean operator
 */
defun("not", 1, 1,
    function(v) {
        if(v === false)
            return true
        else
            return false
    })

/*
 * eq?
 */
defun("eq?", 2, 2,
    function(a, b) {
        // Symbols are indistinguishable if they
        // have the same name
        if( a instanceof FoxScheme.Symbol &&
            b instanceof FoxScheme.Symbol)
            return a.name() === b.name()
        if( a instanceof FoxScheme.Char &&
            b instanceof FoxScheme.Char)
            return a.getValue() === b.getValue()

        return a === b
    })

/*
 * Symbols
 */
defun("gensym", 0, 1,
    function(nameString) {
        var name
        if(nameString === undefined)
            name = "g"
        else if(nameString instanceof FoxScheme.String)
            name = nameString.getValue()
        else
            throw new FoxScheme.Error(nameString+" is not a string")

        return FoxScheme.Symbol.gensym(name)
    })

/*
 * System stuff
 */
defun("expand", 1, 1,
    function(expr) {
        var e = new FoxScheme.Expand()
        return e.expand(expr)
    })

return funcs;
}();
