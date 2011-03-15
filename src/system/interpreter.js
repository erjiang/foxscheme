/*
 * FoxScheme.Interpreter
 *
** vim: set sw=2 ts=2:
 *
 * A simple interpreter of Scheme objects, passed in as FoxScheme objects.
 * This interpreter optionally needs the native functions as provided
 * by the src/native/*.js files.
 *
 * Example usage:
 * 
 *     var p = new FoxScheme.Parser("(+ 2 2)")
 *     var i = new FoxScheme.Interpreter();
 *     while((var expr = p.nextObject()) != null)
 *         print(i.this.eval(expr))
 */
FoxScheme.Interpreter = function() {
    if(!(this instanceof FoxScheme.Interpreter)) {
        throw FoxScheme.Error("Improper use of FoxScheme.Interpreter()")
        return null
    }

    this.initialize();
}

FoxScheme.Interpreter.prototype = function() {

  var initialize = function () {
    this._globals = new FoxScheme.Hash();
    console.log(testMapValueof());
  }
  /*
   * Checks if an array contains an item by doing
   * simple for loop through the keys
   */
  var contains = function(arr, item) {
    for (var i in arr)
      if(arr[i] === item)
        return true

    return false
  }

  // some reserved keywords that would throw an "invalid syntax"
  // error rather than an "unbound variable" error
  var syntax = ["lambda", "let", "letrec", "begin", "if",
      "set!", "define", "quote"]

  /*
   * valueof makes up most of the interpreter.  It is a simple cased
   * recursive interpreter like the 311 interpreter.
   *
   * Currently, it doesn't support lambdas or macros or continuations
   * 
   * This section is especially indented 2 spaces or else it gets
   * kind of wide
   */
  var valueof = function(expr, env, k) {
      //console.log("valueof exp: "+expr)
      //console.log("valueof env: "+env)

    if(k === undefined)
      k = function(v) { return v };

//    if(!(this instanceof FoxScheme.Interpreter))
//      throw new FoxScheme.Bug("this is not an Interpreter, it is a "+this)

    /*
     * Anything besides symbols and pairs:
     * Can be returned immediately, regardless of the env
     */
    if(!(expr instanceof FoxScheme.Symbol) &&
       !(expr instanceof FoxScheme.Pair)) {
        // can't valueof unquoted vector literal
        if(expr instanceof FoxScheme.Vector)
            throw new FoxScheme.Error("Don't know how to valueof Vector "+expr+". "+
                                      "Did you forget to quote it?")
      return k(expr);
    }

    if(env === undefined)
      env = this._globals;

    /*
     * Symbol:
     * Look up the symbol first in the env, then in this instance's
     * globals, and finally the system globals
     */
    if(expr instanceof FoxScheme.Symbol) {
      var val
      if((val = applyEnv(expr, env)) === undefined) {
        if((val = applyEnv(expr, FoxScheme.nativeprocedures)) === undefined) {
          if(contains(syntax, sym))
            throw new FoxScheme.Error("Invalid syntax "+sym)
          else
            throw new FoxScheme.Error("Unbound symbol "+sym)
        }
      }
      return k(val)
    }

    /*
     * List: (rator rand1 rand2 ...)
     * Eval the first item and make sure it's a procedure.  Then,
     * apply it to the rest of the list.
     */
    if(expr instanceof FoxScheme.Pair) {
      if(!expr.isProper())
        throw new FoxScheme.Error("Invalid syntax--improper list: "+expr);

      /*
       * Go to the switch only if the first item is syntax
       */
      if(expr.car() instanceof FoxScheme.Symbol &&
        contains(syntax, expr.car().name()) &&
        // make sure the syntax keyword hasn't been shadowed
        applyEnv(expr.car(), env) === undefined) {
        var sym = expr.first().name();
        switch (sym) {
          case "quote":
            if(expr.length() > 2)
              throw new FoxScheme.Error("Can't quote more than 1 thing: "+expr)
            if(expr.length() === 1)
              throw new FoxScheme.Error("Can't quote nothing")

            return k(expr.second())
            break;
          case "lambda":
            if(expr.length() < 3)
              throw new FoxScheme.Error("Invalid syntax: "+expr)

            var body = expr.third()
            var params = expr.second()

            return k(new Closure(params, body, env))

          /*
           * Yes, "let" can be converted to immediately-applied lambdas,
           * but implementing it natively is quite a bit simpler and doesn't
           * involve creating and then immediately consuming a lambda (which
           * may be quite expensive). Additionally, an immediately-applied
           * lambda of the form ((lambda (x) x) 5)
           * may be optimized to be (let ((x 5)) x) instead.
           *
           * This section is a lot like that for lambda as
           * far as syntax checks go.
           */
          case "let":
            if(expr.length() < 3)
              throw new FoxScheme.Error("Invalid syntax: "+expr)
            var body = expr.third()
            var bindings = expr.second()
            
            /*
             * Well, the macro expander should do this
             * optimization, but we can't assume the expander
             */
            if(bindings === FoxScheme.nil)
              return valueof(body, env)

            //
            // Split the bindings into two lists
            //
            var bindleft = FoxScheme.nil
            var bindright = FoxScheme.nil
            var bcursor = bindings
            while(bcursor !== FoxScheme.nil) {
              //
              // TODO: add back error-checking here
              //
              bindleft = new FoxScheme.Pair(bcursor.car().car(), bindleft)
              bindright = new FoxScheme.Pair(bcursor.car().cdr().car(), bindright)
              bcursor = bcursor.cdr()
            }

            return mapValueof(bindright, env, function(rands) {
              return valueof(body, extendEnv(bindleft, rands, env), k)
            })

          /* TODO: Read Dybvig, Ghuloum, "Fixing letrec (reloaded)"
           * This code is much like let, except that each rhs is evaluated with
           * NEWENV instead of ENV
           * This code is basically sound if used correctly, but doesn't catch
           * the case where
           * 
           *   (let ([x 5])
           *     (letrec ([x (+ 5 x)])
           *       x))
           *   => Error: Attempt to reference explicitly unbound var x
           *
           * TODO: Fix this by adding explicitly unbound vars
           */
          case "letrec":
            if(expr.length() < 3)
              throw new FoxScheme.Error("Invalid syntax: "+expr)
            var body = expr.third()
            var bindings = expr.second()
            // see note above at: [case "let":]
            if(bindings === FoxScheme.nil)
              return valueof(body, env)

            //
            // Split the bindings into two lists.
            //
            // `binderr` acts as guards against attempts to use the lhs of a
            // letrec binding in the right hand side
            //
            var bindleft  = FoxScheme.nil
            var binderr   = FoxScheme.nil
            var bindright = FoxScheme.nil
            var bcursor = bindings
            while(bcursor !== FoxScheme.nil) {
              //
              // TODO: add back error-checking here
              //
              bindleft = new FoxScheme.Pair(bcursor.car().car(), bindleft)
              binderr  = new FoxScheme.Pair(
                  new FoxScheme.Error("Cannot refer to own letrec variable "+
                      bcursor.car().car()), binderr)
              bindright = new FoxScheme.Pair(bcursor.car().cdr().car(), bindright)
              bcursor = bcursor.cdr()
            }
            var newenv = extendEnv(bindleft, binderr, env)

            return mapValueof(bindright, newenv, function(rands) {
              return valueof(body, overwriteEnv(bindleft, rands, newenv), k)
            })

          case "begin":
            if(expr.cdr() === FoxScheme.nil)
              return k(FoxScheme.nothing)

            // return whatever is in Tail position
            return mapValueof(expr.cdr(), env, function(results) {
                return k(results.last())
            })

          case "if":
            var l = expr.length()
            if(l < 3 || l > 4)
              throw new FoxScheme.Error("Invalid syntax for if: "+expr)

            /*
             * One-armed ifs are supposed to be merely syntax, as
             *     (expand '(if #t #t))
             *     => (if #t #t (#2%void))
             * in Chez Scheme, but here it's easier to support natively
             */
            return valueof(expr.second(), env, function(test) {
              if(test !== false)
                return valueof(expr.third(), env, k)
              else
                if(l === 3)
                  return k(FoxScheme.nothing)
                else
                  return valueof(expr.fourth(), env, k)
            })

          /*
           * We define define to be set! because psyntax.pp depends on define
           * being available, but we cannot (set! define set!) because set! is
           * syntax and we do not have first-class syntax, and we cannot write
           * a macro to do so without psyntax.pp!
           * 
           * In FoxScheme, top-level define is exactly set!, unlike R6RS
           * semantics.
           */
          case "define":
          case "set!":
            if(expr.length() !== 3)
              throw new FoxScheme.Error("Invalid syntax in set!: "+expr)

            var symbol = expr.second()

            if(!(symbol instanceof FoxScheme.Symbol))
              throw new FoxScheme.Error("Cannot set! the non-symbol "+expr.second())

            if(applyEnv(symbol, env) === undefined && applyEnv(symbol, FoxScheme.nativeprocedures) !== undefined) {
              throw new FoxScheme.Error("Attempt to set! native procedure "+sym)
            }

            // valueof the right-hand side
            // set! the appropriately-scoped symbol
            
            return valueof(expr.third(), env, function(val) {
              setEnv(symbol, val, env)
              return k(FoxScheme.nothing)
            })

          /*
           * this will only happen if a keyword is in the syntax list
           * but there is no case for it
           */
          default:
            throw new FoxScheme.Bug("Unknown syntax "+sym, "Interpreter")
            break;
        }
      }
      // means that first item is not syntax
      else {
        // return applyProc(valueof(expr.car(), env), mapValueof(expr.cdr(), env))
        return valueof(expr.car(), env, function(rator) {
          if(!(rator instanceof FoxScheme.Procedure) && !(rator instanceof Closure))
            throw new FoxScheme.Error("Attempt to apply non-procedure "+proc)
          return mapValueof(expr.cdr(), env, function(rands) {
            return applyProc(rator, rands, k)
          })
        })
      }
    }
    throw new FoxScheme.Bug("Don't know what to do with "+expr+
                    " (reached past switch/case)", "Interpreter")
  }

  var mapValueof = function(ls, env, k) {
    if(ls === FoxScheme.nil)
      return k(FoxScheme.nil)
    else
      return valueof(ls.car(), env, function(a) {
        return mapValueof(ls.cdr(), env, function(d) {
          return k(new FoxScheme.Pair(a, d))
        })
      })
  };

  var testMapValueof = function() {
    var ls = FoxScheme.Util.listify([1, 2, 3, 4])
    return mapValueof(ls, new FoxScheme.Hash(), function(l) { return l; })
  }

/*
  console.log("mapValueof test");
  console.log(mapValueof(lslsls, new FoxScheme.Hash(), function(l) { return l; }));

  */
  var Env = FoxScheme.Hash
  //
  // applyEnv takes a symbol and looks it up in the given environment
  //
  var applyEnv = function(symbol, env) {
    var sym = symbol.name()
    var val
    if((val = env.chainGet(sym)) === undefined)
        return undefined;
    /*
     * This trick allows us to bind variables to errors, like in the case of 
     * (letrec ((x (+ x 5))) x)
     * so that x => Error: cannot refer to x from inside letrec
     */
    if(val instanceof FoxScheme.Error)
        throw val;

    return val;
  }

  var setEnv = function(symbol, value, env) {
    env.chainSet(symbol.name(), value)
  }

  //
  // extendEnv extends an environment
  //
  var extendEnv = function(symbols, values, env) {
    var newenv = env.extend()
    //
    // Singleton special case
    //
    if(symbols instanceof FoxScheme.Symbol) {
      newenv.set(symbols.name(), values)
      return newenv
    }

    var pcursor = symbols // param cursor
    var vcursor = values // value cursor
    while(pcursor !== FoxScheme.nil) {
      // check for improper param list: (x y . z)
      if(!(pcursor instanceof FoxScheme.Pair)) { 
        newenv.set(pcursor.name(), vcursor)
        break;
      }
      newenv.set(pcursor.car().name(), vcursor.car())
      pcursor = pcursor.cdr()
      vcursor = vcursor.cdr()
    }
    return newenv;
  }
  //
  // **overwriteEnv** is like `extendEnv` except that it does not
  // extend the environment first
  //
  var overwriteEnv = function(symbols, values, env) {
    var pcursor = symbols // param cursor
    var vcursor = values // value cursor
    while(pcursor !== FoxScheme.nil) {
      /* I don't think we need to check for improper lists like above */
      env.set(pcursor.car().name(), vcursor.car())
      pcursor = pcursor.cdr()
      vcursor = vcursor.cdr()
    }
    return env
  }
    

  //
  // Closure:
  // {
  //   params: (x y . z),
  //   expr: (+ x y),
  //   env: FoxScheme.Hash
  // }
  //
  var Closure = function(params, expr, env) {
    this.params = params;
    this.expr = expr;
    this.env = env;
  }
  Closure.prototype.toString = function() {
    return "#<FoxScheme Closure>"
  }

  var applyProc = function(rator, rands, k) {
    if(rator instanceof Closure) {
      return valueof(rator.expr, extendEnv(rator.params, rands, rator.env), k)
    }
    if(rator instanceof FoxScheme.Procedure) {
      // actually do (apply (car expr) (cdr expr))
      return k(rator.fapply(this, FoxScheme.Util.arrayify(rands)))
    }
    else
      throw new FoxScheme.Error("Attempt to apply non-Closure: "+rator, "applyClosure")
  }

  /*
   * Finally, give an object for FoxScheme.Interpreter.prototype
   */
  return {
    initialize: initialize,
    eval: valueof,
    toString: function () { return "#<Interpreter>" },
  }
}();
