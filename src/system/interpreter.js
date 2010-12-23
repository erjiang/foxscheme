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
}

FoxScheme.prototype = function() {
  var arrayify = function(list) {
    var ls = []
    while(list !== FoxScheme.nil) {
      ls.push(list.car())
      list = list.cdr()
    }
    return ls;
  }
  var get = function(env, x) {
    for(i in env) {
      if(env[i].car() == x)
        return env[i].cdr()
    }
    return null;
  }

  var eval = function(expr, env) {
    if(typeof(env) === undefined)
      var env = [];

    if(expr instanceof FoxScheme.Pair) {
      if(!expr.isProper())
        throw new FoxScheme.Error("Invalid syntax--improper list "+expr.toString());
      if(expr.first() instanceof FoxScheme.Symbol) {
        var sym = expr.first().name();
        switch (sym) {
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
            //TODO
            break;
        }
      }
    }
    else
      return expr;
  }
}();
