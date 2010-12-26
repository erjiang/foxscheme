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
    return (typeof(n) === "number")
}

/*
 * Void
 */
defun("void", 0, 0,
    function() {
        return FoxScheme.void
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
defun("+", undefined, undefined,
    function(/* args */) {
        var acc = 0;
        /*
         * Unfortunately, arguments is not an array
         */
        var i = arguments.length;
        while(i--) {
            if(!isNumber(arguments[i]))
                throw new FoxScheme.Error(arguments[i]+" is not a number")

            acc += arguments[i]
        }
        return acc;
    })
defun("-", 1, undefined,
    function(/* args */) {
        if(!isNumber(arguments[0]))
            throw new FoxScheme.Error(arguments[0]+" is not a number")
        var acc = arguments[0]
        var i = arguments.length
        // (- 5) => -5
        if(i === 1)
            return - acc;

        while(i-- > 1) { // exclude 1st arg
            if(!isNumber(arguments[i]))
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
            if(!isNumber(arguments[i]))
                throw new FoxScheme.Error(arguments[i]+" is not a number")

            acc *= arguments[i]
        }
        return acc;
    })

defun("/", 1, undefined,
    function(/* args */) {
        if(!isNumber(arguments[0]))
            throw new FoxScheme.Error(arguments[0]+" is not a number")
        var acc = arguments[0]
        var i = arguments.length
        // (/ 5) => 1/5
        if(i === 1)
            return 1/ acc;

        while(i-- > 1) { // exclude 1st arg
            if(!isNumber(arguments[i]))
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

return funcs;
}();
