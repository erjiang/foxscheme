/*
 *
 * Implements the important native JS functions for FoxScheme
 * (i.e. things that cannot be written in Scheme)
 */

import * as Util from "./util";
import Char from "./char";
import Gensym from "./gensym";
import Hash from "./hash";
import Interpreter from "./interpreter";
import Pair from "./pair";
import String from "./string";
import Symbol from "./symbol";
import Vector from "./vector";
import nil from "./nil";
import nothing from "./nothing";
import { Closure } from "./interpreter";
import { Error } from "./error";
import { Expr, List } from "./types";
import { JavaScriptProcedure } from "./javascript";
import { NativeProcedure, ProcedureFunction, Procedure } from "./procedure";
import Hashtable from "./hashtable";
import Values from "./values";

// define defun inside nativeprocedures so that it can modify funcs but still
// get exported
export let defun: (
    name: string,
    arity: number | undefined,
    maxarity: number | undefined,
    proc: ProcedureFunction) => void;

let nativeprocedures = (function() {
  var funcs = new Hash();
  defun = function(
    name: string,
    arity: number | undefined,
    maxarity: number | undefined,
    proc: ProcedureFunction) {

    funcs.set(name,
      new NativeProcedure(proc, name, arity, maxarity));
  }

/*
 * Void
 */
defun("void", 0, 0,
  function() {
    return nothing
  })
/*
 * trace-closure
 * ugh why is debugging so hard
 *
 * fyi: hackish solution that was cooked up in a
 * debugging session. Relies on console.log!
 */
defun("trace-closure", 2, undefined,
  function(symbol: Symbol, func: JavaScriptProcedure) {
    var sym = symbol.name()
    return new NativeProcedure(
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
    return new Pair(a, b)
  })

defun("car", 1, 1,
  function(p) {
    if(!(p instanceof Pair))
      throw new Error(p+" is not a Pair", "car");

    return p.car()
  })

defun("cdr", 1, 1,
  function(p) {
    if(!(p instanceof Pair))
      throw new Error(p+" is not a Pair", "cdr");

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
      throw new Error(arguments[0]+" is not a number.", "=")
    var standard = arguments[0]
    var i = arguments.length
    while(i--) {
      if(isNaN(arguments[i]))
        throw new Error(arguments[i]+" is not a number.", "=")
      if(arguments[i] !== standard)
        return false
    }
    return true
  })
defun("<", 1, undefined,
  function(/* args */) {
    if(isNaN(arguments[0]))
      throw new Error(arguments[0]+" is not a number.", "=")
    var standard = arguments[arguments.length - 1]
    var i = arguments.length - 1
    while(i--) {
      if(isNaN(arguments[i]))
        throw new Error(arguments[i]+" is not a number.", "=")
      if(!(arguments[i] < standard))
        return false
      standard = arguments[i]
    }
    return true
  })
defun(">", 1, undefined,
  function(/* args */) {
    if(isNaN(arguments[0]))
      throw new Error(arguments[0]+" is not a number.", "=")
    var standard = arguments[arguments.length - 1]
    var i = arguments.length - 1
    while(i--) {
      if(isNaN(arguments[i]))
        throw new Error(arguments[i]+" is not a number.", "=")
      if(!(arguments[i] > standard))
        return false
      standard = arguments[i]
    }
    return true
  })
defun("<=", 1, undefined,
  function(/* args */) {
    if(isNaN(arguments[0]))
      throw new Error(arguments[0]+" is not a number.", "=")
    var standard = arguments[arguments.length - 1]
    var i = arguments.length - 1
    while(i--) {
      if(isNaN(arguments[i]))
        throw new Error(arguments[i]+" is not a number.", "=")
      if(!(arguments[i] <= standard))
        return false
      standard = arguments[i]
    }
    return true
  })
defun(">=", 1, undefined,
  function(/* args */) {
    if(isNaN(arguments[0]))
      throw new Error(arguments[0]+" is not a number.", "=")
    var standard = arguments[arguments.length - 1]
    var i = arguments.length - 1
    while(i--) {
      if(isNaN(arguments[i]))
        throw new Error(arguments[i]+" is not a number.", "=")
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
        throw new Error(arguments[i]+" is not a number")

      acc += arguments[i]
    }
    return acc;
  })
defun("-", 1, undefined,
  function(/* args */) {
    if(isNaN(arguments[0]))
      throw new Error(arguments[0]+" is not a number")
    var acc = arguments[0]
    var i = arguments.length
    // (- 5) => -5
    if(i === 1)
      return - acc;

    while(i-- > 1) { // exclude 1st arg
      if(isNaN(arguments[i]))
        throw new Error(arguments[i]+" is not a number")

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
        throw new Error(arguments[i]+" is not a number")

      acc *= arguments[i]
    }
    return acc;
  })

defun("/", 1, undefined,
  function(/* args */) {
    if(isNaN(arguments[0]))
      throw new Error(arguments[0]+" is not a number")
    var acc = arguments[0]
    var i = arguments.length
    // (/ 5) => 1/5
    if(i === 1)
      return 1/ acc;

    while(i-- > 1) { // exclude 1st arg
      if(isNaN(arguments[i]))
        throw new Error(arguments[i]+" is not a number")

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
      throw new Error(n+" is not a number", "remainder")
    if(isNaN(m))
      throw new Error(m+" is not a number", "remainder")
    return n % m;
  })
defun("expt", 2, 2, 
  function(n, m) {
    if(isNaN(n))
      throw new Error(n+" is not a number", "expt")
    if(isNaN(m))
      throw new Error(m+" is not a number", "expt")
    return Math.pow(n, m)
  })
defun("sqrt", 1, 1,
  function(n) {
    if(isNaN(n))
      throw new Error(n+" is not a number", "sqrt")
    if(n < 0)
      throw new Error("No complex number support", "sqrt")

    return Math.sqrt(n)
  })
defun("round", 1, 1,
  function(n) {
    if(isNaN(n))
      throw new Error(n+" is not a number", "round")
    return Math.round(n)
  })
defun("ceiling", 1, 1,
  function(n) {
    if(isNaN(n))
      throw new Error(n+" is not a number", "ceiling")
    return Math.ceil(n)
  })
defun("floor", 1, 1,
  function(n) {
    if(isNaN(n))
      throw new Error(n+" is not a number", "floor")
    return Math.floor(n)
  })
/*
 * Trigonometry functions
 */
defun("sin", 1, 1,
  function(n) {
    if(isNaN(n))
      throw new Error(n+" is not a number", "sin")

    return Math.sin(n)
  })
defun("cos", 1, 1,
  function(n) {
    if(isNaN(n))
      throw new Error(n+" is not a number", "cos")

    return Math.cos(n)
  })
defun("tan", 1, 1,
  function(n) {
    if(isNaN(n))
      throw new Error(n+" is not a number", "tan")

    return Math.tan(n)
  })
defun("asin", 1, 1,
  function(n) {
    if(isNaN(n))
      throw new Error(n+" is not a number", "asin")

    return Math.asin(n)
  })
defun("acos", 1, 1,
  function(n) {
    if(isNaN(n))
      throw new Error(n+" is not a number", "acos")

    return Math.acos(n)
  })
defun("atan", 1, 1,
  function(n) {
    if(isNaN(n))
      throw new Error(n+" is not a number", "atan")

    return Math.atan(n)
  })
/*
 * Exponentials
 */
defun("exp", 1, 1,
  function(n) {
    if(isNaN(n))
      throw new Error(n+" is not a number", "exp")

    return Math.exp(n)
  })
defun("log", 1, 1,
  function(n) {
    if(isNaN(n))
      throw new Error(n+" is not a number", "log")

    return Math.exp(n)
  })


/*
 * Some basic type-checking predicates!
 */
defun("null?", 1, 1,
  function(p) {
    return p === nil;
  })
defun("pair?", 1, 1,
  function(p) {
    return p instanceof Pair;
  })
defun("number?", 1, 1,
  function(n) {
    return !isNaN(n)
  })
defun("symbol?", 1, 1,
  function(s) {
    return s instanceof Symbol
  })
defun("procedure?", 1, 1,
  function(p) {
    return (p instanceof Procedure) || (p instanceof Closure);
  })
defun("string?", 1, 1,
  function(s) {
    return s instanceof String
  })
defun("set-car!", 2, 2,
  function(p, v) {
    if(!(p instanceof Pair))
      throw new Error(p+" is not a pair", "set-car!")
    p.setCar(v)
    return nothing
  })
defun("set-cdr!", 2, 2,
  function(p, v) {
    if(!(p instanceof Pair))
      throw new Error(p+" is not a pair", "set-car!")
    p.setCdr(v)
    return nothing
  })

/*
 * Vector ops
 */
defun("make-vector", 1, 2,
  function(n, e) {
    if(isNaN(n))
      throw new Error(n+" is not a number", "make-vector")
    if(e === undefined)
      e = 0;
    var fill = [];
    while(n--)
      fill.push(e)
    return new Vector(fill)
  })
defun("vector-length", 1, 1,
  function(v) {
    if(!(v instanceof Vector))
      throw new Error(v+" is not a Vector", "vector-length")
    return v.length()
  })

defun("vector-set!", 3, 3,
  function(v, i, el) {
    if(!(v instanceof Vector))
      throw new Error(v+" is not a Vector", "vector-set!")
    if(isNaN(i))
      throw new Error(i+" is not a number", "vector-set!")
    
    v.set(i, el)
    return nothing;
  })

defun("vector-ref", 2, 2,
  function(v, i) {
    if(!(v instanceof Vector))
      throw new Error(v+" is not a Vector", "vector-ref")
    if(isNaN(i))
      throw new Error(i+" is not a number", "vector-ref")

    return v.get(i)
  })

/*
 * String ops
 */
defun("make-string", 1, 2,
  function(n, e) {
    if(isNaN(n))
      throw new Error(n+" is not a number", "make-string")
    var ev;
    if(e === undefined)
      ev = "\0"
    else {
      if(!(e instanceof Char))
        throw new Error(e+" is not a Char", "make-string")
      ev = e.getValue()
    }
    var fill = []
    while(n--)
      fill.push(ev)
    return new String(fill.join(""))
  })
defun("string-length", 1, 1,
  function(v) {
    if(!(v instanceof String))
      throw new Error(v+" is not a String", "string-length")
    return v.length()
  })
defun("string-set!", 3, 3,
  function(v, i, el) {
    if(!(v instanceof String))
      throw new Error(v+" is not a String", "string-set!")
    if(isNaN(i))
      throw new Error(i+" is not a number", "string-set!")
    if(!(el instanceof Char))
      throw new Error(el+" is not a Char", "string-set!")
    if(i < 0 || i >= v.length())
      throw new Error("Invalid index "+i, "string-set!")
    
    v.set(i, el)
    return nothing;
  })
defun("string-ref", 2, 2,
  function(v, i) {
    if(!(v instanceof String))
      throw new Error(v+" is not a String", "string-ref")
    if(isNaN(i))
      throw new Error(i+" is not a number", "string-ref")
    if(i < 0 || i >= v.length())
      throw new Error("Invalid index "+i, "string-ref")

    return new Char(v.get(i))
  })

/*
 * eq?
 */
defun("eq?", 2, 2,
  function(a, b) {
    // Symbols are indistinguishable if they
    // have the same name
    if( a instanceof Symbol &&
      b instanceof Symbol)
      return a.name() === b.name()
    if( a instanceof Char &&
      b instanceof Char)
      return a.getValue() === b.getValue()

    return a === b
  })

/*
 * Function stuff
 */
defun("apply", 2, undefined,
  function(proc, ...argv: Expr[]) {
    var argList: Expr[] = Util.arrayify(argv).slice(1, -1)
    var lastarg = argv[argv.length - 1]
    let args: List;
    if(lastarg === nil) {
      // do nothing
    }
    else if(lastarg instanceof Pair) {
      args = Util.listify(argList.concat(Util.arrayify(lastarg)))
    }
    else {
      throw new Error("Last argument to apply must be a list", "apply")
    }

    //console.log("applying "+proc+" to "+args)
    this.setReg("rator", proc);
    // TODO: figure out why this isn't typechecking
    // @ts-ignore
    this.setReg("rands", args);
    this.setReg("pc",  this.applyProc)
    return nil; // to appease type checker
  })

defun("eval", 1, 2,
  function(expr, env) {
    this.setReg("expr", expr)
    this.setReg("env", new Hash())
    this.setReg("pc", this.valueof)
    return nil; // to appease type checker
  })

/*
 * Symbols
 */
defun("gensym", 0, 1,
  function(nameString) {
    var name
    if(nameString === undefined)
      { /* leave undefined */ }
    else if(nameString instanceof String)
      name = nameString.getValue()
    else
      throw new Error(nameString+" is not a string")

    return new Gensym(name)
  })
defun("gensym?", 1, 1,
  function(sym) {
    return sym instanceof Gensym
  })

/*
 * Hashtable stuff
 */
defun("make-hashtable", 0, 1, // ignore initial capacity
  function() {
    return new Hashtable();
  })
defun("hashtable-set!", 3, 3,
  function(ht, key, value) {
    ht.set(key, value)
    return nothing
  })
defun("hashtable-ref", 3, 3,
  function(ht, key, dfault) {
    var r
    if((r = ht.get(key)) !== null)
      return r;
    else return dfault
  })
defun("hashtable-delete!", 2, 2,
  function(ht, key) {
    ht.remove(key)
    return nothing
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
defun("error", 2, undefined,
  function(who, message) {
    if(!(who instanceof Symbol) &&
       !(who instanceof String))
      throw new Error("who must be a symbol or string", "error")
    if(!(message instanceof String))
      throw new Error("message must be a string", "error")

    var whoStr = (who instanceof Symbol) ? who.name() : who.getValue()
    if(arguments.length > 2) {
      var irritants = Util.arrayify(arguments).slice(2).join(" ")
      // we actually want to throw an error
      throw new Error(message+" with irritants ("+irritants+")", whoStr)
    } else {
      throw new Error(message.toString(), whoStr)
    }
  })

defun("vector", 0, undefined,
  function(/*elements*/) {
    return new Vector(Util.arrayify(arguments))
  })
defun("vector?", 1, 1,
  function(v) {
    return v instanceof Vector
  })
defun("vector-length", 1, 1,
  function(v) {
    if(!(v instanceof Vector))
      throw new Error("Can't get vector-length of non-vector "+v)

    return v.length()
  })
defun("vector-ref", 2, 2,
  function(vector, index) {
    if(!(vector instanceof Vector))
      throw new Error("Can't vector-ref non-vector " + vector);
    if(isNaN(index))
      throw new Error("Can't get non-numeric index " + vector);
    if(index < 0 || index >= vector.length())
      throw new Error("Vector index "+index+" is out of bounds")

    return vector.get(index)
  })
defun("vector-set!", 3, 3,
  function(vector, index, value) {
    if(!(vector instanceof Vector))
      throw new Error("Can't vector-set! non-vector " + vector);
    if(isNaN(index))
      throw new Error("Can't get non-numeric index "+vector);
    if(index < 0 || index >= vector.length())
      throw new Error("Vector index "+index+" is out of bounds");
    
    vector.set(index, value)

    return nothing
  })

defun("symbol->string", 1, 1,
  function(symbol) {
    if(!(symbol instanceof Symbol))
      throw new Error("Non-symbol given: "+symbol, "symbol->string")

    return new String(symbol.name())
  })

defun("string->symbol", 1, 1,
  function(str) {
    if(!(str instanceof String))
      throw new Error("Non-FoxScheme-String given: "+str, "string->symbol")
    
    return new Symbol(str.getValue())
  })

//
// Convert the arguments to an array of JS strings and then use .join("") to append them
//
defun("string-append", 1, undefined,
  function(/* strs */) {
    var strs = []
    var f = arguments.length
    for(var i = 0; i < f; i++) {
      if(!(arguments[i] instanceof String))
        throw new Error("Tried to append non-string "+arguments[i])

      strs.push(arguments[i].getValue())
    }
    return new String(strs.join(""))
  })

defun("char?", 1, 1,
  function(c) {
    return c instanceof Char;
  })

//
// Stuff for multiple return values
//
defun("values", undefined, undefined,
  function(/*args*/) {
    if(arguments.length === 1)
      return arguments[0]
    
    return new Values(
      Util.arrayify(arguments))
  })
defun("apply-values", 2, undefined,
  function(proc, vals) {
    let args: List;
    if(vals instanceof Values)
      args = Util.listify(vals.values)
    else
      args = new Pair(vals, nil)

    //console.log("applying "+proc+" to "+args)
    this.setReg("rator", proc);
    this.setReg("rands", args);
    this.setReg("pc",  this.applyProc);
    return nil; // to appease type checker
  })
/*
defun("call-with-values", 2, 2,
  function(producer, consumer) {
    console.log("call-with-values")
    var oldCallback = this.getReg("callback");
    var that = this
    this.setReg("callback",
      (function() {
        return function(newvals) {
        console.log("call-with-values callback")
          that.setReg("callback", oldCallback)
          that.setReg("rator", consumer)
          that.setReg("rands", Util.listify(newvals.values))
          that.setReg("pc",
            that.applyProc)
        }})()
      )
    this.setReg("rator", producer)
    this.setReg("rands", nil)
    this.setReg("pc", this.applyProc)
  })
*/

return funcs;
})();

export default nativeprocedures;