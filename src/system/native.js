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
            throw new FoxScheme.Error(v+" is not a Vector", "vector-length")
        if(isNaN(i))
            throw new FoxScheme.Error(i+" is not a number", "vector-length")
        
        v.set(i, el)
        return FoxScheme.nothing;
    })

defun("vector-ref", 2, 2,
    function(v, i) {
        if(!(v instanceof FoxScheme.Vector))
            throw new FoxScheme.Error(v+" is not a Vector", "vector-length")
        if(isNaN(i))
            throw new FoxScheme.Error(i+" is not a number", "vector-length")

        return v.get(i)
    })

return funcs;
}();
