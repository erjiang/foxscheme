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
    }

    this.initialize();
}

FoxScheme.Interpreter.prototype = function() {

  // some reserved keywords that would throw an "invalid syntax"
  // error rather than an "unbound variable" error
  var syntax = ["lambda", "let", "letrec", "begin", "if",
      "set!", "define", "quote", "call/cc", "letcc"]

///////////////////////////////////////////
//
// ENVIRONMENT data types
//
///////////////////////////////////////////
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

///////////////////////////////////////////
//
// Continuation data types
//
///////////////////////////////////////////

  //
  // Enums for continuation types
  //
  var kEmpty = 0, kLet = 1, kLetrec = 2, kBegin = 3, kIf = 4,
      kSet = 5, kProcRator = 6, kProcRands = 7,
      kMapValueofStep = 8, kMapValueofCons = 9, kCallCC = 10

  //
  // Continuation creates a new continuation of a certain type. Here, we abuse
  // objects as arrays to store the continuation's arguments.
  //
  var Continuation = function(type) {
    if(arguments.length < 1)
      throw new FoxScheme.Error("Created continuation with no params?",
          "Continuation")

    // Continuation(kLet, 1, 2, 3)
    // => [1, 2, 3]
    var i = arguments.length
    while(i-- > 1) {
      this[i-1] = arguments[i]
    }

    this.type = type
  }
  Continuation.prototype.toString = function() {
    return "cont"+this.type
  }

///////////////////////////////////////////
//
// Closure data types
//
///////////////////////////////////////////
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

///////////////////////////////////////////
//
// ValueContainer data types
//
///////////////////////////////////////////
  var ValueContainer = function(v) {
    this.value = v
  }
  ValueContainer.prototype.toString = function() {
    return "You got back: "+this.value
  }

///////////////////////////////////////////
//
// Everything is wrapped in this initialize function so that registers get
// properly scoped
//
///////////////////////////////////////////
var initialize = function () {
  var interp
  this._globals = new FoxScheme.Hash();

  //
  // The interpreter's registers:
  //
  var $expr, $env, $k, //   valueof(expr, env, k)
      $v, // $k,          applyK(k, v)
      $rator, $rands, //$k,  applyProc(rator, rands, k)
      $ls, // $env, $k,     mapValueof(ls, env, k)
      $pc              //   program counter!

  var evalDriver = function(expr) {
    $expr = expr
    $env = this._globals
    $k = new Continuation(kEmpty)
    $pc = valueof
    try {
      for(;;)
        $pc.call(this)
    }
    catch (e) {
      if (e instanceof ValueContainer)
        return e.value
      else
        throw e
    }
  }

  /*
   * valueof makes up most of the interpreter.  It is a simple cased
   * recursive interpreter like the 311 interpreter.
   *
   * Currently, it doesn't support lambdas or macros or continuations
   *
   * This section is especially indented 2 spaces or else it gets
   * kind of wide
   */
  var valueof = function(/*expr, env, k*/) {
      //console.log("valueof exp: "+$expr)
      //console.log("valueof env: "+$env)

//    if(!(this instanceof FoxScheme.Interpreter))
//      throw new FoxScheme.Bug("this is not an Interpreter, it is a "+this)

    /*
     * Anything besides symbols and pairs:
     * Can be returned immediately, regardless of the env
     */
    if(!($expr instanceof FoxScheme.Symbol) &&
       !($expr instanceof FoxScheme.Pair)) {
        // can't valueof unquoted vector literal
        if($expr instanceof FoxScheme.Vector)
            throw new FoxScheme.Error("Don't know how to valueof Vector "+$expr+". "+
                                      "Did you forget to quote it?")
      $k = $k
      $v = $expr
      $pc = applyK
      return;
    }

    /*
     * Symbol:
     * Look up the symbol first in the env, then in this instance's
     * globals, and finally the system globals
     */
    if($expr instanceof FoxScheme.Symbol) {
      var val
      if((val = applyEnv($expr, $env)) === undefined) {
        if((val = applyEnv($expr, FoxScheme.nativeprocedures)) === undefined) {
          if(FoxScheme.Util.contains(syntax, $expr.name()))
            throw new FoxScheme.Error("Invalid syntax "+$expr.name())
          else
            throw new FoxScheme.Error("Unbound symbol "+$expr.name())
        }
      }
      $k = $k
      $v = val
      $pc = applyK
      return;
    }

    /*
     * List: (rator rand1 rand2 ...)
     * Eval the first item and make sure it's a procedure.  Then,
     * apply it to the rest of the list.
     */
    if($expr instanceof FoxScheme.Pair) {
      if(!$expr.isProper())
        throw new FoxScheme.Error("Invalid syntax--improper list: "+$expr);

      /*
       * Go to the switch only if the first item is syntax
       */
      if($expr.car() instanceof FoxScheme.Symbol &&
        FoxScheme.Util.contains(syntax, $expr.car().name()) &&
        // make sure the syntax keyword hasn't been shadowed
        applyEnv($expr.car(), $env) === undefined) {
        var sym = $expr.first().name();
        switch (sym) {
          case "quote":
            if($expr.length() > 2)
              throw new FoxScheme.Error("Can't quote more than 1 thing: "+$expr)
            if($expr.length() === 1)
              throw new FoxScheme.Error("Can't quote nothing")

            $k = $k
            $v = $expr.second()
            $pc = applyK
            return;
          case "lambda":
            if($expr.length() < 3)
              throw new FoxScheme.Error("Invalid syntax: "+$expr)
            if($expr.length() > 3)
              throw new FoxScheme.Error("Invalid implicit begin: "+$expr)

            var body = $expr.third()
            var params = $expr.second()

            $k = $k
            $v = new Closure(params, body, $env)
            $pc = applyK
            return;

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
            if($expr.length() < 3)
              throw new FoxScheme.Error("Invalid syntax: "+$expr)
            var body = $expr.third()
            var bindings = $expr.second()

            /*
             * Well, the macro expander should do this
             * optimization, but we can't assume the expander
             */
            if(bindings === FoxScheme.nil) {
              $expr = body
              $env = $env
              $k = $k
              $pc = valueof
              return;
            }

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

            $ls = bindright
            $env = $env
            $k = new Continuation(kLet, body, bindleft, $env, $k)
            $pc = mapValueof
            return;

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
            if($expr.length() < 3)
              throw new FoxScheme.Error("Invalid syntax: "+$expr)
            var body = $expr.third()
            var bindings = $expr.second()
            // see note above at: [case "let":]
            if(bindings === FoxScheme.nil) {
              $expr = body
              $env = $env
              $k = $k
              $pc = valueof
              return;
            }

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

            $ls = bindright
            $env = extendEnv(bindleft, binderr, $env)
            $k = new Continuation(kLetrec, body, bindleft, $env, $k)
            $pc = mapValueof
            return;

          case "begin":
            if($expr.cdr() === FoxScheme.nil) {
              $k = $k
              $v = FoxScheme.nothing
              $pc = applyK
              return;
            }

            // return whatever is in Tail position
            $ls = $expr.cdr()
            $env = $env
            $k = new Continuation(kBegin, $k)
            $pc = mapValueof
            return;

          case "if":
            var l = $expr.length()
            if(l < 3 || l > 4)
              throw new FoxScheme.Error("Invalid syntax for if: "+$expr)

            /*
             * One-armed ifs are supposed to be merely syntax, as
             *     (expand '(if #t #t))
             *     => (if #t #t (#2%void))
             * in Chez Scheme, but here it's easier to support natively
             */
            $env = $env
            $k = new Continuation(kIf, $expr.third(),
                  (l === 3 ? FoxScheme.nothing : $expr.fourth()),
                  $env, $k)
            $expr = $expr.second()
            $pc = valueof
            return;

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
            if($expr.length() !== 3)
              throw new FoxScheme.Error("Invalid syntax in set!: "+$expr)

            var symbol = $expr.second()

            if(!(symbol instanceof FoxScheme.Symbol))
              throw new FoxScheme.Error("Cannot set! the non-symbol "+$expr.second())

            if(applyEnv(symbol, $env) === undefined && applyEnv(symbol, FoxScheme.nativeprocedures) !== undefined) {
              throw new FoxScheme.Error("Attempt to set! native procedure "+sym)
            }

            // valueof the right-hand side
            // set! the appropriately-scoped symbol

            $expr = $expr.third()
            $env = $env
            $k = new Continuation(kSet, symbol, $env, $k)
            $pc = valueof
            return;

          case "call/cc":
            if($expr.length() !== 2)
              throw new FoxScheme.Error("Invalid syntax in call/cc: "+$expr)

            $expr = $expr.second()
            $env = $env
            $k = new Continuation(kCallCC, $k)
            $pc = valueof
            return;
            /*
            return valueof(expr.second(), env, function(p) {
                return applyProc(p, new FoxScheme.Pair(k, FoxScheme.nil), k)
                })
            return applyProc(valueof(expr.second(), env, k), k)
              */
          case "letcc":
            $env = extendEnv($expr.second(), $k, $env)
            $expr = $expr.third()
            $k = $k
            $pc = valueof
            return;
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
        $env = $env
        $k = new Continuation(kProcRator, $expr.cdr(), $env, $k)
        $expr = $expr.car()
        return;
      }
    }
    throw new FoxScheme.Bug("Don't know what to do with "+$expr+
                    " (reached past switch/case)", "Interpreter")
  }

//  kEmpty([value])
//  kLet([rands], body, bindleft, env, k)
//  kLetrec([rands], body, bindleft, newenv, k)
//  kBegin([results], k)
//  kIf([test], conseq, alt, env, k) // check for alt type
//  kSet([val], symbol, env, k)
//  kProcRator([rator], rands, env, k)
//    kProcRands([rands], rator, k)
//  kMapValueofStep([car], cdr, env, k)
//    kMapValueofCons([cdr], car, k)
//  kCallCC(
  var applyK = function(/*k, v*/) {
    //console.log("applyK $k: "+$k)
    //console.log("applyK $v: "+$v)
    // note that the k passed in is overwritten with the k
    // extracted from the Continuation
    switch($k.type) {
      case kEmpty:
        throw new ValueContainer($v)
      case kLet:
        var rands = $v,
            body = $k[0],
            bindleft = $k[1],
            env = $k[2],
            k = $k[3]
        $expr = body
        $env = extendEnv(bindleft, rands, env)
        $k = k
        $pc = valueof
        return;
      case kLetrec:
        var rands = $v,
            body = $k[0],
            bindleft = $k[1],
            env = $k[2],
            k = $k[3]
        $expr = body
        $env = overwriteEnv(bindleft, rands, env)
        $k = k
        $pc = valueof
        return;
      case kBegin:
        var results = $v,
            k = $k[0]
        $k = k
        $v = results.last()
        $pc = applyK
        return;
      case kIf:
        var test = $v,
            conseq = $k[0],
            alt = $k[1],
            env = $k[2],
            k = $k[3]
        if(test !== false) {
          $expr = conseq
          $env = env
          $k = k
          $pc = valueof
          return;
        }
        else
          if(alt === FoxScheme.nothing) { // one-armed if
            $k = k
            $v = alt
            $pc = applyK
            return;
          }
          else {
            $expr = alt
            $env = env
            $k = k
            $pc = valueof
            return;
          }
      case kSet:
        var value = $v,
            symbol = $k[0],
            env = $k[1],
            k = $k[2]
        setEnv(symbol, value, env)
        $k = k
        $v = FoxScheme.nothing
        $pc = applyK
        return;
      case kProcRator:
        var rator = $v,
            rands = $k[0],
            env = $k[1],
            k = $k[2]
        if(!(rator instanceof FoxScheme.Procedure) &&
            !(rator instanceof Closure) &&
            !(rator instanceof Continuation))
            throw new FoxScheme.Error("Attempt to apply non-procedure "+rator)

        $ls = rands
        $env = env
        $k = new Continuation(kProcRands, rator, k)
        $pc = mapValueof
        return;
      case kProcRands:
        var rands = $v,
            rator = $k[0],
            k = $k[1]
        // TODO: extend this for multiple return values
        if(rator instanceof Continuation) {
          $k = rator
          $v = rands.first()
          $pc = applyK
          return;
        }
        $rator = rator
        $rands = rands
        $k = k
        $pc = applyProc
        return;
      case kCallCC:
        var proc = $v,
            k = $k[0]
        if(!($v instanceof Closure))
          throw new FoxScheme.Error("Tried to call/cc a non-Closure: "+$v)

        $rator = proc
        $rands = new FoxScheme.Pair(k, FoxScheme.nil)
        $k = k
        $pc = applyProc
        return;
      case kMapValueofStep:
        var car = $v,
            cdr = $k[0],
            env = $k[1],
            k = $k[2]
        $ls = cdr
        $env = env
        $k = new Continuation(kMapValueofCons, car, k)
        $pc = mapValueof
        return;
      case kMapValueofCons:
        var cdr = $v,
            car = $k[0],
            k = $k[1]
        $k = k
        $v = new FoxScheme.Pair(car, cdr)
        $pc = applyK
        return;
      default:
        throw new FoxScheme.Bug("Unknown continuation type "+$k.type)
    }
  }

  //
  // CPS'd procedure to find valueof of everything in a list
  //
  var mapValueof = function(/*ls, env, k*/) {
    if($ls === FoxScheme.nil) {
      $k = $k
      $v = $ls
      $pc = applyK
      return;
    }
    else {
      $expr = $ls.car()
      $env = $env
      $k = new Continuation(kMapValueofStep, $ls.cdr(), $env, $k)
      $pc = valueof
      return;
    }
  }

/*
  console.log("mapValueof test");
  console.log(mapValueof(lslsls, new FoxScheme.Hash(), function(l) { return l; }));

  */

  //
  // CPS'd procedure to apply a Closure or FoxScheme.Procedure on a
  // list of operands
  //
  var applyProc = function(/*rator, rands, k*/) {
    if($rator instanceof Closure) {
      $expr = $rator.expr
      $env = extendEnv($rator.params, $rands, $rator.env)
      $k = $k
      $pc = valueof
      return;
    }
    if($rator instanceof FoxScheme.Procedure) {
      // actually do (apply (car expr) (cdr expr))
      $k = $k
      $pc = applyK
      $v = $rator.fapply(this, FoxScheme.Util.arrayify($rands))
      return;
    }
    else
      throw new FoxScheme.Error("Attempt to apply non-Closure: "+$rator, "applyClosure")
  }

  var inspectRegisters = function() {
    console.log("$expr")
    console.log($expr)
    console.log("$env")
    console.log($env)
    console.log("$k")
    console.log($k)
    console.log("$v")
    console.log($v)
    console.log("$pc")
    switch($pc) {
      case valueof:
        console.log("valueof")
        break;
      case mapValueof:
        console.log("mapValueof")
        break;
      case applyProc:
        console.log("applyProc")
        break;
      case applyK:
        console.log("applyK")
        break;
      default:
        console.log($pc)
    }
  }

  var setReg = function(name, value) {
    switch(name) {
      case 'expr':
        $expr = value
        break;
      case 'env':
        $env = value
        break;
      case 'k':
        $k = value
        break;
      case 'rator':
        $rator = value
        break;
      case 'rands':
        $rands = value
        break;
      case 'ls':
        $ls = value
        break;
      case 'pc':
        $pc = value
        break;
      default:
        throw new FoxScheme.Bug("Tried to set non-existant register "+name,
            "Interpreter.setReg")
    }
  }

  var getReg = function(name) {
    switch(name) {
      case 'expr':
        return $expr
      case 'env':
        return $env
      case 'k':
        return $k
      case 'rator':
        return $rator
      case 'rands':
        return $rands
      case 'ls':
        return $ls
      case 'pc':
        return $pc
      default:
        throw new FoxScheme.Bug("Tried to get non-existant register "+name,
            "Interpreter.getReg")
    }
  }

  //
  // Finished initialization!
  //
  this.eval = evalDriver
  this.inspectRegisters = inspectRegisters
  //this.valueof = valueof
  this.applyProc = applyProc
  this.getReg = getReg
  this.setReg = setReg
  this.toString = function () { return "#<Interpreter>" }
}

  /*
   * Finally, give an object for FoxScheme.Interpreter.prototype
   */
  return {
    initialize: initialize
  }
}();
