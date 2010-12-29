/*
 * FoxScheme.Expand
 *
 * Recursively expand an expression and make unique all local references by
 * replacing vars with gensym'd names.
 */
FoxScheme.Expand = function(globals) {
    if(!(this instanceof FoxScheme.Expand)) {
        throw new FoxScheme.Bug("Improper use of FoxScheme.Expand()")
    }
    /*
     * Initializing expand with an array of globals will let the expander know
     * which variables refer to primitives that aren't shadowed by globals.
     * Modifying the original hash will also update the expander.
     */
   /* not yet needed
    * TODO: macros
    if(globals)
        this._globals = globals
    else
        this._globals = new FoxScheme.Hash()
        */
}

FoxScheme.Expand.prototype = function() {
    /*
     * Unlike the interpreter, env maps symbol names to gensym'd symbols
     * (String -> FoxScheme.Symbol)
     */
    var expand = function(expr, env) {
        if(env === undefined)
            env = new FoxScheme.Hash()

        if(expr instanceof FoxScheme.Symbol) {
            var sym = expr.name()
            var lookup
            if((lookup = env.get(sym)) !== undefined) {
                return lookup;
            }
            else return expr;
        }

        else if(expr instanceof FoxScheme.Pair) {
            /*
             * TODO: Optimize directly-applied lambdas to let statements a la
             * Chez Scheme:
             *    ((lambda (x) x) 5) => (let ((x 5)) x)
             */
            if(expr.first() instanceof FoxScheme.Symbol) {
                /*
                 * applying expand on the rator BEFORE checking to see if
                 * it's "lambda" or "let" allows us to redefine lambda
                 *
                 * We first process the BINDINGS, modifying newenv along the way,
                 * and then we process the BODY, wrapping it in BEGIN if necessary
                 */
                var rator = this.expand(expr.first(), env)
                // don't keep going if it's not syntax
                // TODO: better organize this part
                if(rator.name() !== "lambda" && rator.name() !== "let") {
                    var that = this
                    return new FoxScheme.Pair(rator,
                            FoxScheme.Util.map(function (x) {
                                return that.expand(x, env) }, expr.cdr()))
                }
                var newenv = env.clone()
                var bindings
                var body
                if(rator.name() === "lambda") {
                    // (lambda x body ...) case
                    if(expr.second() instanceof FoxScheme.Symbol) {
                        bindings = FoxScheme.Symbol.gensym(expr.second().name())
                        newenv.set(expr.second().name(), bindings)
                    }
                    // (lambda (a b c ...) body ...)
                    else if(expr.second() instanceof FoxScheme.Pair) {
                        var bindarr = FoxScheme.Util.arrayify(expr.second())
                        var i = bindarr.length
                        while(i--) {
                            if(!(bindarr[i] instanceof FoxScheme.Symbol))
                                throw new FoxScheme.Error("Bindings contains non-symbol "+
                                        bindarr[i], "Expand")

                            var oldsym = bindarr[i].name()
                            bindarr[i] = FoxScheme.Symbol.gensym(oldsym)
                            newenv.set(oldsym, bindarr[i])
                            if(expr.second().isProper()) {
                                bindings = FoxScheme.Util.listify(bindarr)
                            } else {
                                throw new FoxScheme.Bug("TODO: Improper lambda bindings ...", "Expand")
                            }
                        }
                    }
                    // (lambda () body)
                    else if(expr.second() === FoxScheme.nil) {
                        bindings = FoxScheme.nil
                    }
                    else
                        throw new FoxScheme.Error("Invalid parameter list in "+expr, "Expand")
                }
                /*
                 * multiple bodies:
                 *   (lambda x body1 body2 ...)
                 *   => (lambda x (begin body1 body2 ...))
                 */
                if(expr.length() > 3) {
                    // body = (cons 'begin (map expand (cddr expr)))
                    var that = this;
                    body = new FoxScheme.Pair(new FoxScheme.Symbol("begin"),
                        FoxScheme.Util.map(function(expr) {
                            return that.expand(expr, newenv) },
                            expr.cdr().cdr()))
                }
                // single body
                else if(expr.length() === 3) {
                    body = this.expand(expr.third(), newenv)
                }
                else
                    throw new FoxScheme.Error("No body in lambda: "+expr)

                return FoxScheme.Util.listify([expr.car(), bindings, body])
            }
            // if the first element is not a symbol, then it's not a macro
            else { // if not symbol
                var that = this;
                return FoxScheme.Util.map(function (expr) {
                    return that.expand(expr, env) }, expr)
            }
            throw new FoxScheme.Bug("Expand fell through cases", "Expand")
        }
    }
    return {
        expand: expand
    }
}();
