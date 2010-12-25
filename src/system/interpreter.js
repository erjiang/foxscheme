/*
 * FoxScheme.Interpreter
 *
 * A simple interpreter of Scheme objects, passed in as FoxScheme objects.
 * This interpreter optionally needs the native functions as provided
 * by the src/native/*.js files.
 *
 * Example usage:
 * 
 *     var p = new FoxScheme.Parser("(+ 2 2)")
 *     var i = new FoxScheme.Interpreter();
 *     while((var expr = p.nextObject()) != p.EOS)
 *         print(i.eval(expr))
 */
FoxScheme.Interpreter = function() {
    if(!(this instanceof FoxScheme.Interpreter)) {
        throw FoxScheme.Error("Improper use of FoxScheme.Interpreter()")
        return null
    }

    this.initialize();
}

FoxScheme.Interpreter.prototype = function() {
  var globals;
  var initialize = function () {
    globals = new FoxScheme.Hash();
  }
  var arrayify = function(list) {
    var ls = []
    while(list !== FoxScheme.nil) {
      ls.push(list.car())
      list = list.cdr()
    }
    return ls;
  }


  var contains = function(arr, item) {
    for (i in arr)
      if(arr[i] === item)
        return true

    return false
  }

  // some reserved keywords that would throw an "invalid syntax"
  // error rather than an "unbound variable" error
  var syntax = ["lambda", "if", "let", "set!", "call/cc"]

  /*
   * eval makes up most of the interpreter.  It is a simple cased
   * recursive interpreter like the 311 interpreter.
   *
   * Currently, it doesn't support lambdas or macros or continuations
   * 
   * This section is especially indented 2 spaces or else it gets
   * kind of wide
   */
  var eval = function(expr, env) {
    /*
     * Anything besides symbols and pairs:
     * Can be returned immediately, regardless of the env
     */
    if(!(expr instanceof FoxScheme.Symbol) &&
       !(expr instanceof FoxScheme.Pair))
      return expr

    if(env === undefined)
      var env = new FoxScheme.Hash();
    
    /*
     * Symbol:
     * Look up the symbol first in the env, then in the
     * globals, and finally the system globals
     */
    if(expr instanceof FoxScheme.Symbol) {
        var sym = expr.name()
        var val
        if((val = env.get(sym)) === undefined)
          if((val = globals.get(sym)) === undefined)
            if((val = FoxScheme.nativeprocedures.get(sym)) === undefined)
              if(contains(syntax, sym))
                throw new FoxScheme.Error("Invalid syntax "+sym)
              else
                throw new FoxScheme.Error("Unbound symbol "+expr)

        return val;
    }

    /*
     * List:
     * Eval the first item and make sure it's a procedure.  Then,
     * apply it to the rest of the list.
     */
    if(expr instanceof FoxScheme.Pair) {
      if(!expr.isProper())
        throw new FoxScheme.Error("Invalid syntax--improper list: "+expr);

      if(expr.car() instanceof FoxScheme.Symbol) {
        var sym = expr.first().name();
        switch (sym) {
          case "quote":
            if(expr.length() !== 2)
              throw new FoxScheme.Error("Can't quote more than 1 thing: "+expr)

            return expr.second()
            break;
          case "lambda":
            //TODO
            break;
          case "if":
            //TODO
            break;
          case "let":
            //TODO
            break;
          case "set!":
            //TODO
            break;
          case "call/cc":
            //TODO
            break;
          case "if":
            //TODO
            break;
          default:
            var proc = eval(expr.car(), env)
            if(!(proc instanceof FoxScheme.Procedure))
              throw new FoxScheme.Error("Attempt to apply non-procedure "+proc)

            // something like (map eval (cdr expr))
            var args = arrayify(expr.cdr())
            for(var i in args) {
              args[i] = eval(args[i], env)
            }

            // actually do (apply (car expr) (cdr expr))
            return proc.fapply(args)
            break;
        }
      }
    }
    throw new FoxScheme.Bug("Don't know what to do with "+expr, "Interpreter")
  }

  /*
   * Finally, give an object for FoxScheme.Interpreter.prototype
   */
  return {
    initialize: initialize,
    eval: eval
  }
}();
