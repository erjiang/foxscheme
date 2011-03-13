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
  var valueof = function(expr, env) {
      //console.log("valueof exp: "+expr)
      //console.log("valueof env: "+env)

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
      return expr;
    }

    if(env === undefined)
      var env = this._globals;

    /*
     * Symbol:
     * Look up the symbol first in the env, then in this instance's
     * globals, and finally the system globals
     */
    if(expr instanceof FoxScheme.Symbol) {
      return applyEnv(expr, env)
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
         env.chainGet(expr.car().name()) === undefined) {
        var sym = expr.first().name();
        switch (sym) {
          case "quote":
            if(expr.length() > 2)
              throw new FoxScheme.Error("Can't quote more than 1 thing: "+expr)
            if(expr.length() === 1)
              throw new FoxScheme.Error("Can't quote nothing")

            return expr.second()
            break;
          case "lambda":
            if(expr.length() < 3)
              throw new FoxScheme.Error("Invalid syntax: "+expr)

            var body = expr.third()
            var params = expr.second()

            return new Closure(params, body, env)

            break;
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

            else if(bindings instanceof FoxScheme.Pair) {
              var newenv = env.extend()
              var bindarr = FoxScheme.Util.arrayify(bindings)
              var i = bindarr.length
              while(i--) {
                // check binding syntax
                if(bindarr[i].length() !== 2)
                  throw new FoxScheme.Error("Invalid syntax for let binding: "+bindings)
                if(!(bindarr[i].car() instanceof FoxScheme.Symbol))
                  throw new FoxScheme.Error("Cannot bind "+bindarr[i].car()+" in "+bindings)
                newenv.set(bindarr[i].car().name(),
                    valueof(bindarr[i].second(), env))
              }
              return valueof(body, newenv)
            }
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

            else if(bindings instanceof FoxScheme.Pair) {
              var newenv = env.extend()
              var bindarr = FoxScheme.Util.arrayify(bindings)
              /*
               * We run two loops here.
               * The first time, we go through all of the bindings. We do
               * syntax checks and then rebind each var with a FoxScheme.Error.
               * This way, if a letrec tries referring to itself immediately,
               * the error is thrown and acts as a guard.
               */
              var i = bindarr.length
              while(i--) {
                // check binding syntax
                if(bindarr[i].length() !== 2)
                  throw new FoxScheme.Error("Invalid syntax for letrec binding: "+bindings)
                if(!(bindarr[i].car() instanceof FoxScheme.Symbol))
                  throw new FoxScheme.Error("Cannot bind "+bindarr[i].car()+" in "+bindings)

                newenv.set(bindarr[i].car().name(), new FoxScheme.Error("Cannot refer to own letrec variable "+bindarr[i].car()))
              }
              /*
               * This next loop actually evals the RHS of each binding and
               * rebinds the var with the result.
               */
              i = bindarr.length
              while(i--) {
                newenv.set(bindarr[i].car().name(),
                    /*
                     * The only difference between letrec and let is that we
                     * valueof each rhs with NEWENV instead of ENV. Since NEWENV
                     * is an object, modifying NEWENV here will also affect any
                     * captured references to NEWENV in lambdas in the rhs,
                     * allowing recursion to work
                     */
                    valueof(bindarr[i].second(), newenv))
              }
            }
            return valueof(body, newenv);
          case "begin":
            if(expr.cdr() === FoxScheme.nil)
              return FoxScheme.nothing
            var cursor = expr.cdr()
            while(cursor.cdr() !== FoxScheme.nil) {
              valueof(cursor.car(), env)
              cursor = cursor.cdr()
            }

            // return whatever is in Tail position
            return valueof(cursor.car(), env)
            break;
          case "if":
            var l = expr.length()
            if(l < 3 || l > 4)
              throw new FoxScheme.Error("Invalid syntax for if: "+expr)

            if(valueof(expr.second(), env) !== false)
              return valueof(expr.third(), env)
            /*
             * One-armed ifs are supposed to be merely syntax, as
             *     (expand '(if #t #t))
             *     => (if #t #t (#2%void))
             * in Chez Scheme, but here it's easier to support natively
             */
            else if(l === 3)
              return FoxScheme.nothing;
            else
              return valueof(expr.fourth(), env)
            break;
          /*
           * We define define to be set! because psyntax.pp depends on define
           * being available, but we cannot (set! define set!) because set! is
           * syntax and we do not have first-class syntax, and we cannot write
           * a macro to do so without psyntax.pp!
           * 
           * In FoxScheme, define is exactly set!, unlike Chez Scheme, which
           * allows you to (define + *) but not (set! + *)
           */
          case "define":
            if(expr.length() !== 3)
              throw new FoxScheme.Error("Invalid syntax in define: "+expr)
            if(!(expr.second() instanceof FoxScheme.Symbol))
              throw new FoxScheme.Error("Cannot define the non-symbol "+expr.second())

            var sym = expr.second().name()
            // valueof the right-hand side
            // set! the appropriately-scoped symbol
            if(env.chainGet(sym) !== undefined) {
              // don't valueof unless we can actually set!
              var val = valueof(expr.third(), env)
              env.chainSet(sym, val)
            }
            else if(FoxScheme.nativeprocedures.get(sym) !== undefined) {
              throw new FoxScheme.Error("Attempt to set! native procedure "+sym)
            }
            else {
              var val = valueof(expr.third(), env)
              this._globals.set(sym, val)
            }
            return FoxScheme.nothing;
            break;
          case "set!":
            if(expr.length() !== 3)
              throw new FoxScheme.Error("Invalid syntax in set!: "+expr)

            if(!(expr.second() instanceof FoxScheme.Symbol))
              throw new FoxScheme.Error("Cannot set! the non-symbol "+expr.second())

            var sym = expr.second().name()
            // valueof the right-hand side
            // set! the appropriately-scoped symbol
            if(env.chainGet(sym) !== undefined) {
              // don't valueof unless we can actually set!
              var val = valueof(expr.third(), env)
              env.chainSet(sym, val)
            }
            else if(FoxScheme.nativeprocedures.get(sym) !== undefined) {
              throw new FoxScheme.Error("Attempt to set! native procedure "+sym)
            }
            else {
              var val = valueof(expr.third(), env)
              this._globals.set(sym, val)
            }
            return FoxScheme.nothing;
            break;
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
        var proc = valueof(expr.car(), env)
        if(!(proc instanceof FoxScheme.Procedure) && !(proc instanceof Closure))
          throw new FoxScheme.Error("Attempt to apply non-procedure "+proc)

        return applyProc(proc, mapValueof(expr.cdr(), env))
      }
    }
    throw new FoxScheme.Bug("Don't know what to do with "+expr+
                    " (reached past switch/case)", "Interpreter")
  }

  var mapValueof = function(ls, env) {
    if(ls === FoxScheme.nil)
      return FoxScheme.nil
    else
      return new FoxScheme.Pair(valueof(ls.car(), env), mapValueof(ls.cdr(), env))
  }

  var Env = FoxScheme.Hash
  //
  // applyEnv takes a symbol and looks it up in the given environment
  //
  var applyEnv = function(symbol, env) {
    var sym = symbol.name()
    var val
    if((val = env.chainGet(sym)) === undefined)
      if((val = FoxScheme.nativeprocedures.get(sym)) === undefined) {
        if(contains(syntax, sym))
          throw new FoxScheme.Error("Invalid syntax "+sym)
        else
          throw new FoxScheme.Error("Unbound symbol "+expr)
      }
    /*
     * This trick allows us to bind variables to errors, like in the case of 
     * (letrec ((x (+ x 5))) x)
     * so that x => Error: cannot refer to x from inside letrec
     */
    if(val instanceof FoxScheme.Error)
        throw val;

    return val;
  }

  //
  // extendEnv extends an environment
  //
  var extendEnv = function(params, values, env) {
    var newenv = env.extend()
    //
    // Singleton special case
    //
    if(params instanceof FoxScheme.Symbol) {
      newenv.set(params.name(), values)
      return newenv
    }

    var pcursor = params // param cursor
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

  var applyProc = function(rator, rands) {
    if(rator instanceof Closure) {
      return valueof(rator.expr, extendEnv(rator.params, rands, rator.env))
    }
    if(rator instanceof FoxScheme.Procedure) {
      // actually do (apply (car expr) (cdr expr))
      return rator.fapply(this, FoxScheme.Util.arrayify(rands))
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
