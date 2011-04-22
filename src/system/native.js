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
funcs.defun = defun

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
                var r = func.fapply(this, new_args)
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
defun("<", 1, undefined,
    function(/* args */) {
        if(isNaN(arguments[0]))
            throw new FoxScheme.Error(arguments[0]+" is not a number.", "=")
        var standard = arguments[arguments.length - 1]
        var i = arguments.length - 1
        while(i--) {
            if(isNaN(arguments[i]))
                throw new FoxScheme.Error(arguments[i]+" is not a number.", "=")
            if(!(arguments[i] < standard))
                return false
            standard = arguments[i]
        }
        return true
    })
defun(">", 1, undefined,
    function(/* args */) {
        if(isNaN(arguments[0]))
            throw new FoxScheme.Error(arguments[0]+" is not a number.", "=")
        var standard = arguments[arguments.length - 1]
        var i = arguments.length - 1
        while(i--) {
            if(isNaN(arguments[i]))
                throw new FoxScheme.Error(arguments[i]+" is not a number.", "=")
            if(!(arguments[i] > standard))
                return false
            standard = arguments[i]
        }
        return true
    })
defun("<=", 1, undefined,
    function(/* args */) {
        if(isNaN(arguments[0]))
            throw new FoxScheme.Error(arguments[0]+" is not a number.", "=")
        var standard = arguments[arguments.length - 1]
        var i = arguments.length - 1
        while(i--) {
            if(isNaN(arguments[i]))
                throw new FoxScheme.Error(arguments[i]+" is not a number.", "=")
            if(!(arguments[i] <= standard))
                return false
            standard = arguments[i]
        }
        return true
    })
defun(">=", 1, undefined,
    function(/* args */) {
        if(isNaN(arguments[0]))
            throw new FoxScheme.Error(arguments[0]+" is not a number.", "=")
        var standard = arguments[arguments.length - 1]
        var i = arguments.length - 1
        while(i--) {
            if(isNaN(arguments[i]))
                throw new FoxScheme.Error(arguments[i]+" is not a number.", "=")
            if(!(arguments[i] >= standard))
                return false
            standard = arguments[i]
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
 * In Scheme, modulo's result has the same sign as the second
 * number, while remainder's has the same sign as the first.  In
 * JavaScript, modulo's has the same sign as the first.  Thus,
 * Scheme's remainder == JavaScript's %
 */
defun("remainder", 2, 2,
    function(n, m) {
        if(isNaN(n))
            throw new FoxScheme.Error(n+" is not a number", "remainder")
        if(isNaN(m))
            throw new FoxScheme.Error(m+" is not a number", "remainder")
        return n % m;
    })
defun("expt", 2, 2, 
    function(n, m) {
        if(isNaN(n))
            throw new FoxScheme.Error(n+" is not a number", "expt")
        if(isNaN(m))
            throw new FoxScheme.Error(m+" is not a number", "expt")
        return Math.pow(n, m)
    })
defun("sqrt", 1, 1,
    function(n) {
        if(isNaN(n))
            throw new FoxScheme.Error(n+" is not a number", "sqrt")
        if(n < 0)
            throw new FoxScheme.Error("No complex number support", "sqrt")

        return Math.sqrt(n)
    })
defun("round", 1, 1,
    function(n) {
        if(isNaN(n))
            throw new FoxScheme.Error(n+" is not a number", "round")
        return Math.round(n)
    })
defun("ceiling", 1, 1,
    function(n) {
        if(isNaN(n))
            throw new FoxScheme.Error(n+" is not a number", "ceiling")
        return Math.ceil(n)
    })
defun("floor", 1, 1,
    function(n) {
        if(isNaN(n))
            throw new FoxScheme.Error(n+" is not a number", "floor")
        return Math.floor(n)
    })
/*
 * Trigonometry functions
 */
defun("sin", 1, 1,
    function(n) {
        if(isNaN(n))
            throw new FoxScheme.Error(n+" is not a number", "sin")

        return Math.sin(n)
    })
defun("cos", 1, 1,
    function(n) {
        if(isNaN(n))
            throw new FoxScheme.Error(n+" is not a number", "cos")

        return Math.cos(n)
    })
defun("tan", 1, 1,
    function(n) {
        if(isNaN(n))
            throw new FoxScheme.Error(n+" is not a number", "tan")

        return Math.tan(n)
    })
defun("asin", 1, 1,
    function(n) {
        if(isNaN(n))
            throw new FoxScheme.Error(n+" is not a number", "asin")

        return Math.asin(n)
    })
defun("acos", 1, 1,
    function(n) {
        if(isNaN(n))
            throw new FoxScheme.Error(n+" is not a number", "acos")

        return Math.acos(n)
    })
defun("atan", 1, 1,
    function(n) {
        if(isNaN(n))
            throw new FoxScheme.Error(n+" is not a number", "atan")

        return Math.atan(n)
    })
/*
 * Exponentials
 */
defun("exp", 1, 1,
    function(n) {
        if(isNaN(n))
            throw new FoxScheme.Error(n+" is not a number", "exp")

        return Math.exp(n)
    })
defun("log", 1, 1,
    function(n) {
        if(isNaN(n))
            throw new FoxScheme.Error(n+" is not a number", "log")

        return Math.exp(n)
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
        return !isNaN(n)
    })
defun("symbol?", 1, 1,
    function(s) {
        return s instanceof FoxScheme.Symbol
    })
defun("procedure?", 1, 1,
    function(p) {
        return (p instanceof FoxScheme.Procedure) ||
               (p instanceof this.Closure)
    })
defun("string?", 1, 1,
    function(s) {
        return s instanceof FoxScheme.String
    })
defun("set-car!", 2, 2,
    function(p, v) {
        if(!(p instanceof FoxScheme.Pair))
            throw new FoxScheme.Error(p+" is not a pair", "set-car!")
        p.setCar(v)
        return FoxScheme.nothing
    })
defun("set-cdr!", 2, 2,
    function(p, v) {
        if(!(p instanceof FoxScheme.Pair))
            throw new FoxScheme.Error(p+" is not a pair", "set-car!")
        p.setCdr(v)
        return FoxScheme.nothing
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
 * Function stuff
 */
defun("apply", 2, undefined,
    function(proc) {
        var args = FoxScheme.Util.arrayify(arguments).slice(1, -1)
        var lastarg = arguments[arguments.length - 1]
        if(lastarg === FoxScheme.nil) {
            // do nothing
        }
        else if(lastarg instanceof FoxScheme.Pair) {
            args = FoxScheme.Util.listify(args.concat(FoxScheme.Util.arrayify(lastarg)))
        }
        else {
            throw new FoxScheme.Error("Last argument to apply must be a list", "apply")
        }

        //console.log("applying "+proc+" to "+args)
        this.setReg("rator", proc)
        this.setReg("rands", args)
        this.setReg("pc",    this.applyProc)
        return null
    })

/*
 * Symbols
 */
defun("gensym", 0, 1,
    function(nameString) {
        var name
        if(nameString === undefined)
            { /* leave undefined */ }
        else if(nameString instanceof FoxScheme.String)
            name = nameString.getValue()
        else
            throw new FoxScheme.Error(nameString+" is not a string")

        return new FoxScheme.Gensym(name)
    })

/*
 * Hashtable stuff
 */
defun("make-eq-hashtable", 0, 1, // ignore initial capacity
    function() {
        return new FoxScheme.Hashtable()
    })
defun("hashtable-set!", 3, 3,
    function(ht, key, value) {
        ht.set(key, value)
        return FoxScheme.nothing
    })
defun("hashtable-ref", 3, 3,
    function(ht, key, dfault) {
        var r
        if((r = ht.get(key)) !== null)
            return r;
        else return dfault
    })
defun("hashtable-contains?", 2, 2,
    function(ht, key) {
        var r
        if((r = ht.get(key)) !== null)
            return true;
        else return false
    })
/*
 * System stuff
 */
/*
 * This is for compatibility with psyntax.pp, which needs eval-core. 
 *
 * (define (eval-core expr)
 *   (eval expr (interaction-environment)))
 *
 * i.e. evaluate expr in the TOP-LEVEL environment. To accomplish
 * this, eval is defined in src/system/native.js and eval-core
 * defined in fox.r6rs.ss.
 */
defun("eval", 1, 2,
    function(expr, globals) {
        return this.eval(expr)
    })
defun("interaction-environment", 0, 0,
    function() {
        return this._globals
    })
defun("expand", 1, 1,
    function(expr) {
        var e = new FoxScheme.Expand()
        return e.expand(expr)
    })
defun("error", 2, undefined,
    function(who, message) {
        if(!(who instanceof FoxScheme.Symbol) &&
           !(who instanceof FoxScheme.String))
            throw new FoxScheme.Error("who must be a symbol or string", "error")
        if(!(message instanceof FoxScheme.String))
            throw new FoxScheme.Error("message must be a string", "error")

        var whoStr = (who instanceof FoxScheme.Symbol) ? who.name() : who.getValue()
        if(arguments.length > 2) {
            var irritants = FoxScheme.Util.arrayify(arguments).slice(2).join(" ")
            // we actually want to throw an error
            throw new FoxScheme.Error(message+" with irritants ("+irritants+")", whoStr)
        } else {
            throw new FoxScheme.Error(message, whoStr)
        }
    })

defun("vector", 0, undefined,
    function(/*elements*/) {
        return new FoxScheme.Vector(FoxScheme.Util.arrayify(arguments))
    })
defun("vector?", 1, 1,
    function(v) {
        return v instanceof FoxScheme.Vector
    })
defun("vector-length", 1, 1,
    function(v) {
        if(!(v instanceof FoxScheme.Vector))
            throw new FoxScheme.Error("Can't get vector-length of non-vector "+v)

        return v.length()
    })
defun("vector-ref", 2, 2,
    function(vector, index) {
        if(!(vector instanceof FoxScheme.Vector))
            throw new FoxScheme.Error("Can't vector-ref non-vector "+v)
        if(isNaN(index))
            throw new FoxScheme.Error("Can't get non-numeric index "+v)
        if(index < 0 || index >= vector.length())
            throw new FoxScheme.Error("Vector index "+index+" is out of bounds")

        return vector.get(index)
    })
defun("vector-set!", 3, 3,
    function(vector, index, value) {
        if(!(vector instanceof FoxScheme.Vector))
            throw new FoxScheme.Error("Can't vector-ref non-vector "+v)
        if(isNaN(index))
            throw new FoxScheme.Error("Can't get non-numeric index "+v)
        if(index < 0 || index >= vector.length())
            throw new FoxScheme.Error("Vector index "+index+" is out of bounds")
        
        vector.set(index, value)

        return FoxScheme.nothing
    })

return funcs;
}();
