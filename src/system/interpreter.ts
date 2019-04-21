/*
 * Interpreter
 *
** vim: set sw=2 ts=2:
 *
 * A simple interpreter of Scheme objects, passed in as FoxScheme objects.
 * This interpreter optionally needs the native functions as provided
 * by the src/native/*.js files.
 *
 * Example usage:
 *
 *     var p = new Parser("(+ 2 2)")
 *     var i = new Interpreter();
 *     while((var expr = p.nextObject()) !== Parser.EOS)
 *         print(i.this.eval(expr))
 */
import { Expr } from "./types";
import Pair from "./pair";
import Hash from "./hash";
import Symbol from "./symbol";
import Vector from "./vector";
import nil from "./nil";
import * as Util from "./Util";
import { Error, Bug } from "./error";
import nativeprocedures from "./native";
import nothing from "./nothing";
import { Procedure } from "./procedure";
import Values from "./values";

type Env = Hash;
type List = Pair | nil;

//
// Enums for continuation types
//
/*
var kEmpty = 0, kLet = 1, kLetrec = 2, kBegin = 3, kIf = 4,
    kSet = 5, kProcRator = 6, kProcRands = 7,
    kMapValueofStep = 8, kMapValueofCons = 9, kCallCC = 10;
    */

enum ContinuationType {
  kEmpty = 0,
  kLet,
  kLetrec,
  kBegin,
  kIf,
  kSet,
  kProcRator,
  kProcRands,
  kMapValueofStep,
  kMapValueofCons,
  kCallCC,
}

let CT = ContinuationType;

///////////////////////////////////////////
//
// Continuation object
//
///////////////////////////////////////////

//
// Continuation creates a new continuation of a certain type.
//

interface KEmpty {
  type: typeof CT.kEmpty;
}

interface KLet {
  type: typeof CT.kLet;
  body: Expr;
  bindleft: List;
  env: Env;
  k: Continuation;
}

interface KLetrec {
  type: typeof CT.kLetrec;
  body: Expr;
  bindleft: List;
  env: Env;
  k: Continuation;
}

interface KBegin {
  type: typeof CT.kBegin;
  k: Continuation;
}

interface KIf {
  type: typeof CT.kIf;
  conseq: Expr;
  alt: Expr;
  env: Env;
  k: Continuation;
}

interface KSet {
  type: typeof CT.kSet;
  symbol: Symbol;
  env: Hash;
  k: Continuation;
}

interface KProcRator {
  type: typeof CT.kProcRator;
  rands: Pair;
  env: Hash;
  k: Continuation;
}

interface KProcRands {
  type: typeof CT.kProcRands;
  rator: Procedure | Closure | Continuation;
  k: Continuation;
}

interface KCallCC {
  type: typeof CT.kCallCC;
  k: Continuation;
}

interface KMapValueofStep {
  type: typeof CT.kMapValueofStep;
  cdr: Expr;
  env: Env;
  k: Continuation;
}

interface KMapValueofCons {
  type: typeof CT.kMapValueofCons;
  car: Expr;
  k: Continuation;
}

type Continuation = KLet | KEmpty | KLet | KLetrec | KBegin | KIf | KSet |
  KProcRator | KProcRands | KCallCC | KMapValueofStep | KMapValueofCons;

// some reserved keywords that would throw an "invalid syntax"
// error rather than an "unbound variable" error
const syntax = ["lambda", "let", "letrec", "begin", "if",
  "set!", "define", "quote", "call/cc", "letcc"];

export default class Interpreter {

  //
  // The interpreter's registers:
  //

  // valueof(expr, env, k)
  $expr: Expr;
  $env: Env;
  $k: Continuation;

  // applyK(k, v)
  $v: Expr | Values;
  // $k: already defined

  // applyProc(rator, rands, k)
  // TODO: fill in better types
  $rator: Procedure | Closure;
  $rands: List;
  // $k

  // mapValueof(ls, env, k)
  $ls: any;
  // $env, this.$k

  // program counter
  // TODO: can we type this better?
  $pc: (...args: any) => void;
  
  // callback for async eval
  $callback: (val: Expr) => void;

  _globals: Hash;

  constructor() {
    // We capture a reference to this interpreter because the setTimeout
    // trampoline for async eval loses the "this" reference.
    var thisInterp = this;
    this._globals = new Hash();
    // XXX: are these the right initial values?
    this.$k =  { type: CT.kEmpty }
    this.$expr = nil;
    this.$env = new Hash();
    this.$v = nil;
    this.$rator = { fapply: () => {throw new Error("Tried to use uninitialized $rator")} };
    this.$rands = nil;
    this.$pc = this.valueof;
    this.$callback = console.log;
  }

///////////////////////////////////////////
//
// ENVIRONMENT data types
//
///////////////////////////////////////////

  //
  // applyEnv takes a symbol and looks it up in the given environment
  //
  applyEnv(symbol: Symbol, env: Env) {
    //console.log("looking up "+symbol)
    var sym = symbol.name()
    var val
    if ((val = env.chainGet(sym)) === undefined)
      return undefined;
    /*
     * This trick allows us to bind variables to errors, like in the case of
     * (letrec ((x (+ x 5))) x)
     * so that x => Error: cannot refer to x from inside letrec
     */
    if (val instanceof Error)
      throw val;

    return val;
  }

  setEnv(symbol: Symbol, value: Expr, env: Env) {
    env.chainSet(symbol.name(), value)
  }

  //
  // extendEnv extends an environment
  //
  extendEnv(symbols: List, values: List, env: Env) {
    var newenv = env.extend()

    var pcursor = symbols // param cursor
    var vcursor = values // value cursor
    while(pcursor !== nil) {
      // check for improper param list: (x y . z)
      if(pcursor instanceof Symbol) {
        newenv.set(pcursor.name(), vcursor)
        break;
      } else if (pcursor instanceof Pair && vcursor instanceof Pair) {
        // XXX: Is <Symbol> type assertion safe?
        newenv.set((<Symbol>pcursor.car()).name(), vcursor.car())
        pcursor = pcursor.cdr()
        vcursor = vcursor.cdr()
      } else {
        throw new Bug("pcursor or vcursor reached list end early", "extendEnv");
      }
    }
    return newenv;
  }
  //
  // **overwriteEnv** is like `extendEnv` except that it does not
  // extend the environment first
  //
  overwriteEnv(symbols: List, values: List, env: Env) {
    var pcursor = symbols; // param cursor
    var vcursor = values; // value cursor
    while(pcursor instanceof Pair && vcursor instanceof Pair) {
      /* I don't think we need to check for improper lists like above */
      env.set((<Symbol>pcursor.car()).name(), vcursor.car());
      pcursor = pcursor.cdr();
      vcursor = vcursor.cdr();
    }
    return env;
  }



  saveRegs() {
    return [
      this.$expr,
      this.$env,
      this.$k,
      this.$v,
      this.$rator,
      this.$rands,
      this.$ls,
      this.$pc,
      this.$callback
    ];
  }

  // TODO: type this better?
  restoreRegs(regs: any[]) {
    this.$expr = regs[0];
    this.$env = regs[1];
    this.$k = regs[2];
    this.$v = regs[3];
    this.$rator = regs[4];
    this.$rands = regs[5];
    this.$ls = regs[6];
    this.$pc = regs[7];
    this.$callback = regs[8];
  }

  pcToStr() {
    switch(this.$pc) {
      case this.valueof:
        return "valueof"
      case this.mapValueof:
        return "mapValueof"
      case this.applyProc:
        return "applyProc"
      case this.applyK:
        return "applyK"
      default:
        return "unknown"
    }
  }

  evalDriver(expr: Expr) {
    /*
     * Save registers
     */
    var regs = this.saveRegs();

    this.$expr = expr;
    this.$env = this._globals;
    this.$k = { type: CT.kEmpty };
    this.$pc = this.valueof;
    try {
      for(;;) {
        /*console.log("$pc: "+pcToStr())
        if(pcToStr() == "applyProc") {
          console.log("$rator: "+$rator)
          console.log("$rands: "+$rands)
        }
        */
        this.$pc.call(this);
      }
    }
    catch (e) {
      /*
       * Restore registers
       */
      this.restoreRegs(regs)
    
      // Check if we stopped because we're done
      if (e instanceof ValueContainer)
        return e.value;
      // or we encountered an error
      else
        throw e;
    }
  }

  // Asynchronous evaluation. Using evalAsync won't tie up the browser's thread
  // 100%, allowing the UI and other scripts to continue working, albeit
  // fitfully. The engine executes code for at least 200 ms, then rests for 50
  // ms. Once the code finishes executing, the parameter callback is called
  // with the result of the evaluation.
  evalAsync(expr: Expr, callback: (result: Expr) => void) {

    var t_expr = expr;
    var t_env = this._globals;
    var t_k = { type: CT.kEmpty };
    var t_pc = this.valueof;
    var t_callback = callback;

    // Rather than dirtying any current registers, we're just
    // going to build a new register object manually and launch
    // the trampoline with it.
    setTimeout(
      this.evalTrampoline([
        t_expr,
        t_env,
        t_k,
        null, //$v
        null, //$rator
        null, //$rands
        null, //$ls
        t_pc,
        t_callback]),
      0);

    return true;
  }

  // This is curried so that we can do:
  //     setTimeout(evalTrampoline(regs), 100)
  // evalTrampoline needs to get a register object so that it can
  // temporarily save the current registers, launch its own computation,
  // and then restore things to what they were (multitasking)
  evalTrampoline(regs: any[]) {
    // Here, we use that instead of this because the setTimeout trampoline
    // loses the reference to "this".
    return function(that) {
      return function() {
        /*
        * Save registers
        */
        var old_regs = that.saveRegs();
        that.restoreRegs(regs)

        var start = (new Date()).getTime()
        var i

        try {
          for(;;) {
            i = 20 // work our timeslice no finer than 20 cycles
              while(i--) {
                that.$pc.call(that);
              }
            // work for at least 200 ms, then sleep for 50 ms
            // these values can be adjusted for aggressiveness
            if((new Date()).getTime() - start > 200) {
              // restore registers and leave
              setTimeout(that.evalTrampoline(that.saveRegs()), 50)
              that.restoreRegs(old_regs)
              return true
            }
          }
        }
        catch (e) {
          // Check if we stopped because we're done
          if (e instanceof ValueContainer) {
            that.$callback(e.value)
          }
          // or we encountered an error
          else {
            that.$callback(e)
          }
        }
        that.restoreRegs(old_regs)
        return false
      };
    }(this);
  }

  /*
   * valueof makes up most of the interpreter.  It is a simple cased
   * recursive registerized trampolined interpreter like the 311 interpreter.
   *
   * This section is especially indented 2 spaces or else it gets
   * kind of wide
   */
  valueof(/*expr, env, k*/) {
      //console.log("valueof exp: "+$expr)
      //console.log("valueof env: "+$env)

//    if(!(this instanceof Interpreter))
//      throw new Bug("this is not an Interpreter, it is a "+this)

    /*
     * Anything besides symbols and pairs:
     * Can be returned immediately, regardless of the env
     */
    if(!(this.$expr instanceof Symbol) &&
       !(this.$expr instanceof Pair)) {
        // can't valueof unquoted vector literal
        if(this.$expr instanceof Vector)
            throw new Error("Don't know how to valueof Vector "+this.$expr+". "+
                                      "Did you forget to quote it?")
      this.$k = this.$k;
      this.$v = this.$expr;
      this.$pc = this.applyK;
      return;
    }

    /*
     * Symbol:
     * Look up the symbol first in the env, then in this instance's
     * globals, and finally the system globals
     */
    if(this.$expr instanceof Symbol) {
      let val: Expr | undefined;
      if((val = this.applyEnv(this.$expr, this.$env)) === undefined) {
        if((val = this.applyEnv(this.$expr, nativeprocedures)) === undefined) {
          if(syntax.includes(this.$expr.name()))
            throw new Error("Invalid syntax "+this.$expr.name())
          else
            throw new Error("Unbound symbol "+this.$expr.name())
        }
      }
      this.$k = this.$k
      this.$v = val;
      this.$pc = this.applyK;
      return;
    }

    /*
     * List: (rator rand1 rand2 ...)
     * Eval the first item and make sure it's a procedure.  Then,
     * apply it to the rest of the list.
     */
    if(this.$expr instanceof Pair) {
      if(!this.$expr.isProper())
        throw new Error("Invalid syntax--improper list: "+this.$expr);

      /*
       * Go to the switch only if the first item is syntax
       */
      let eCar = this.$expr.car();
      if (eCar instanceof Symbol &&
        syntax.includes(eCar.name()) &&
        // make sure the syntax keyword hasn't been shadowed
        this.applyEnv(eCar, this.$env) === undefined) {
        var sym = eCar.name();
        switch (sym) {
          case "quote":
            if (this.$expr.length() > 2)
              throw new Error("Can't quote more than 1 thing: " + this.$expr)
            if (this.$expr.length() === 1)
              throw new Error("Can't quote nothing")

            this.$k = this.$k
            this.$v = this.$expr.second()
            this.$pc = this.applyK
            return;
          case "lambda": {
            if(this.$expr.length() < 3)
              throw new Error("Invalid syntax: "+this.$expr)
            if(this.$expr.length() > 3)
              throw new Error("Invalid implicit begin: "+this.$expr)

            let body = this.$expr.third()
            let params = this.$expr.second()

            this.$k = this.$k
            this.$v = new Closure(params, body, this.$env)
            this.$pc = this.applyK
            return;
          }

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
            if(this.$expr.length() < 3)
              throw new Error("Invalid syntax: "+this.$expr)
            var body = this.$expr.third()
            var bindings = this.$expr.second() as List;

            /*
             * Well, the macro expander should do this
             * optimization, but we can't assume the expander
             */
            if(bindings instanceof nil) {
              this.$expr = body;
              this.$env = this.$env;
              this.$k = this.$k;
              this.$pc = this.valueof;
              return;
            }

            //
            // Split the bindings into two lists
            //
            var bindleft: List = nil;
            var bindright: List = nil;
            var bcursor: List = bindings; // ((lhs rhs) ...)
            while(!(bcursor instanceof nil)) {
              //
              // TODO: add back error-checking here
              //
              bindleft = new Pair((<Pair>bcursor.car()).car(), bindleft);
              bindright = new Pair((<Pair>(<Pair>bcursor.car()).cdr()).car(), bindright);
              bcursor = bcursor.cdr();
            }

            this.$ls = bindright
            this.$k = {
              type: CT.kLet,
              body: body, 
              bindleft: bindleft,
              env: this.$env,
              k: this.$k,
            };
            this.$pc = this.mapValueof
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
          case "letrec": {
            if(this.$expr.length() < 3)
              throw new Error("Invalid syntax: "+this.$expr)
            let body = this.$expr.third();
            let bindings: List = this.$expr.second();
            // see note above at: [case "let":]
            if(bindings === nil) {
              this.$expr = body
              this.$env = this.$env
              this.$k = this.$k
              this.$pc = this.valueof
              return;
            }

            //
            // Split the bindings into two lists.
            //
            // `binderr` acts as guards against attempts to use the lhs of a
            // letrec binding in the right hand side
            //
            let bindleft: List = nil;
            let binderr: List = nil;
            let bindright: List = nil;
            let bcursor: List = bindings;
            while(!(bcursor instanceof nil)) {
              //
              // TODO: add back error-checking here
              //
              let bcursorCar = bcursor.car();
              if (!(bcursorCar instanceof Pair)) {
                throw new Error("Malformed letrec car");
              }
              bindleft = new Pair(bcursorCar.car(), bindleft)
              binderr  = new Pair(
                  new Error("Cannot refer to own letrec variable "+
                      bcursorCar.car()), binderr);
              let bcursorCadr = bcursorCar.cdr();
              if (!(bcursorCadr instanceof Pair)) {
                throw new Error("Malformed letrec cadr");
              }
              bindright = new Pair(bcursorCadr.car(), bindright)
              bcursor = bcursor.cdr()
            }

            this.$ls = bindright
            this.$env = this.extendEnv(bindleft, binderr, this.$env)
            this.$k = {
              type: CT.kLetrec,
              body: body,
              bindleft: bindleft,
              env: this.$env,
              k: this.$k,
            };
            this.$pc = this.mapValueof
            return;
          }

          case "begin":
            if(this.$expr.cdr() === nil) {
              this.$k = this.$k
              this.$v = nothing;
              this.$pc = this.applyK
              return;
            }

            // return whatever is in Tail position
            this.$ls = this.$expr.cdr()
            this.$env = this.$env
            this.$k = {
              type: CT.kBegin,
              k: this.$k,
            };
            this.$pc = this.mapValueof
            return;

          case "if":
            var l = this.$expr.length()
            if(l < 3 || l > 4)
              throw new Error("Invalid syntax for if: "+this.$expr)

            /*
             * One-armed ifs are supposed to be merely syntax, as
             *     (expand '(if #t #t))
             *     => (if #t #t (#2%void))
             * in Chez Scheme, but here it's easier to support natively
             */
            // this.$env = this.$env; // XXX: why was this here?
            this.$k = {
              type: CT.kIf,
              conseq: this.$expr.third(),
              alt: (l === 3 ? nothing : this.$expr.fourth()),
              env: this.$env,
              k: this.$k
            };
            this.$expr = this.$expr.second();
            this.$pc = this.valueof;
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
            if(this.$expr.length() !== 3)
              throw new Error("Invalid syntax in set!: "+this.$expr)

            var symbol = this.$expr.second()

            if(!(symbol instanceof Symbol))
              throw new Error("Cannot set! the non-symbol "+this.$expr.second())

            // Actually, set!ing native procedures is fine, and psyntax has to
            // do it anyways
            //if(applyEnv(symbol, this.$env) === undefined && applyEnv(symbol, nativeprocedures
            //  throw new Error("Attempt to set! native procedure "+symbol)
            //}

            // valueof the right-hand side
            // set! the appropriately-scoped symbol

            this.$expr = this.$expr.third()
            this.$env = this.$env
            this.$k = {
              type: CT.kSet,
              symbol: symbol,
              env: this.$env,
              k: this.$k,
            };
            this.$pc = this.valueof
            return;

          case "call/cc":
            if(this.$expr.length() !== 2)
              throw new Error("Invalid syntax in call/cc: "+this.$expr)

            this.$expr = this.$expr.second()
            this.$env = this.$env
            this.$k = {
              type: CT.kCallCC,
              k: this.$k,
            };
            this.$pc = this.valueof
            return;
            /*
            return valueof(expr.second(), env, function(p) {
                return applyProc(p, new Pair(k, nil), k)
                })
            return applyProc(valueof(expr.second(), env, k), k)
              */
          case "letcc":
            this.$env = this.extendEnv(this.$expr.second(), this.$k, this.$env)
            this.$expr = this.$expr.third()
            this.$k = this.$k
            this.$pc = this.valueof
            return;
          /*
           * this will only happen if a keyword is in the syntax list
           * but there is no case for it
           */
          default:
            throw new Bug("Unknown syntax "+sym, "Interpreter")
            break;
        }
      }
      // means that first item is not syntax
      else {
        // return applyProc(valueof(expr.car(), env), mapValueof(expr.cdr(), env))
        this.$env = this.$env
        this.$k = {
          type: CT.kProcRator,
          // TODO: can we get rid of type assertion here?
          rands: this.$expr.cdr() as Pair,
          env: this.$env,
          k: this.$k,
        };
        this.$expr = this.$expr.car()
        return;
      }
    }
    throw new Bug("Don't know what to do with "+this.$expr+
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
  applyK(/*k, v*/) {
    //console.log("applyK this.$k: "+$k)
    //console.log("applyK this.$v: "+$v)
    // note that the k passed in is overwritten with the k
    // extracted from the Continuation

    // convenience for type checker
    let thisK = this.$k;
    switch(thisK.type) {
      case CT.kEmpty: {
        throw new ValueContainer(this.$v)
      }
      case CT.kLet: {
        let rands = this.$v;
        this.$expr = thisK.body;
        this.$env = this.extendEnv(thisK.bindleft, rands, thisK.env);
        this.$k = thisK.k;
        this.$pc = this.valueof;
        return;
      }
      case CT.kLetrec: {
        let rands = this.$v;
        this.$expr = thisK.body
        this.$env = this.overwriteEnv(thisK.bindleft, rands, thisK.env)
        //console.log("Finished letrec of "+bindleft.length()+" items")
        this.$k = thisK.k;
        this.$pc = this.valueof;
        return;
      }
      case CT.kBegin: {
        this.$k = thisK.k;
        if (!(this.$v instanceof Pair)) {
          throw new Bug("Encountered $v="+this.$v, "applyK");
        }
        this.$v = this.$v.last();
        this.$pc = this.applyK;
        return;
      }
      case CT.kIf: {
        let test = this.$v;
        if (test instanceof Values) {
          throw new Error(
            "Returned multiple values to if condition.")
        }

        if (test !== false) {
          this.$expr = thisK.conseq;
          this.$env = thisK.env;
          this.$k = thisK.k;
          this.$pc = this.valueof;
          return;
        }
        else {
          if (thisK.alt === nothing) { // one-armed if
            this.$k = thisK.k;
            this.$v = thisK.alt;
            this.$pc = this.applyK;
            return;
          }
          else {
            this.$expr = thisK.alt;
            this.$env = thisK.env;
            this.$k = thisK.k;
            this.$pc = this.valueof;
            return;
          }
        }
      }
      case CT.kSet: {
        let value = this.$v;
        this.setEnv(thisK.symbol, value, thisK.env)
        this.$k = thisK.k
        this.$v = nothing
        this.$pc = this.applyK
        return;
      }
      case CT.kProcRator: {
        let rator = this.$v;
        if (!(rator instanceof Procedure) &&
          !(rator instanceof Closure)) {
          throw new Error("Attempt to apply non-procedure " + rator)
        }

        this.$ls = thisK.rands
        this.$env = thisK.env
        this.$k = {
          type: CT.kProcRands,
          rator: rator,
          k: thisK.k,
        }
        this.$pc = this.mapValueof
        return;
      }
      case CT.kProcRands: {
        let rands = this.$v;
        // TODO: extend this for multiple return values
        if (thisK.rator instanceof Closure || thisK.rator instanceof Procedure) {
          this.$rator = thisK.rator;
          this.$rands = rands;
          this.$k = thisK.k;
          this.$pc = this.applyProc;
          return;
        } else {
          this.$k = thisK.rator
          if (!(rands instanceof Pair)) {
            throw new Bug("Encountered $v="+this.$v, "applyK");
          }
          this.$v = rands.first()
          this.$pc = this.applyK
          return;
        }
      }
      case CT.kCallCC: {
        let proc = this.$v;
        if(!(this.$v instanceof Closure))
          throw new Error("Tried to call/cc a non-Closure: "+this.$v)

        // TODO: typecheck this properly
        // @ts-ignore
        this.$rator = proc
        this.$rands = new Pair(thisK.k, nil)
        this.$k = thisK.k
        this.$pc = this.applyProc
        return;
      }
      case CT.kMapValueofStep: {
        let car = this.$v;
        this.$ls = thisK.cdr;
        this.$env = thisK.env;
        this.$k = {
          type: CT.kMapValueofCons,
          car: car,
          k: thisK.k,
        };
        this.$pc = this.mapValueof;
        return;
      }
      case CT.kMapValueofCons: {
        let cdr = this.$v;
        this.$k = thisK.k;
        this.$v = new Pair(thisK.car, cdr);
        this.$pc = this.applyK;
        return;
      }
      default:
        throw new Bug("Unknown continuation type "+this.$k.type)
    }
  }

  //
  // CPS'd procedure to find valueof of everything in a list
  //
  mapValueof(/*ls, env, k*/) {
    if(this.$ls === nil) {
      this.$k = this.$k
      this.$v = this.$ls
      this.$pc = this.applyK
      return;
    }
    else {
      this.$expr = this.$ls.car();
      this.$env = this.$env;
      this.$k = {
        type: CT.kMapValueofStep,
        cdr: this.$ls.cdr(),
        env: this.$env,
        k: this.$k,
      };
      this.$pc = this.valueof;
      return;
    }
  }

/*
  console.log("mapValueof test");
  console.log(mapValueof(lslsls, new Hash(), function(l) { return l; }));

  */

  //
  // CPS'd procedure to apply a Closure or Procedure on a
  // list of operands
  //
  applyProc(/*rator, rands, k*/) {
    if(this.$rator instanceof Closure) {
      this.$expr = this.$rator.expr
      this.$env = this.extendEnv(this.$rator.params, this.$rands, this.$rator.env)
      this.$k = this.$k
      this.$pc = this.valueof
      return;
    }
    if(this.$rator instanceof Procedure) {
      // actually do (apply (car expr) (cdr expr))
      this.$k = this.$k
      this.$pc = this.applyK
      this.$v = this.$rator.fapply(this, Util.arrayify(this.$rands))
      return;
    }
    else
      throw new Error("Attempt to apply non-Closure: "+this.$rator, "applyClosure")
  }

  inspectRegisters() {
    console.log("$expr")
    console.log(this.$expr)
    console.log("$env")
    console.log(this.$env)
    console.log("$k")
    console.log(this.$k)
    console.log("$v")
    console.log(this.$v)
    console.log("$pc")
    switch(this.$pc) {
      case this.valueof:
        console.log("valueof")
        break;
      case this.mapValueof:
        console.log("mapValueof")
        break;
      case this.applyProc:
        console.log("applyProc")
        break;
      case this.applyK:
        console.log("applyK")
        break;
      default:
        console.log(this.$pc)
    }
  }

  setReg(name: string, value: any) {
    switch(name) {
      case 'expr':
        this.$expr = value;
        break;
      case 'env':
        this.$env = value;
        break;
      case 'k':
        this.$k = value;
        break;
      case 'rator':
        this.$rator = value;
        break;
      case 'rands':
        this.$rands = value;
        break;
      case 'ls':
        this.$ls = value;
        break;
      case 'pc':
        this.$pc = value;
        break;
      case 'callback':
        this.$callback = value;
        break;
      default:
        throw new Bug("Tried to set non-existant register "+name,
            "Interpreter.setReg")
    }
  }

  getReg(name: string) {
    switch(name) {
      case 'expr':
        return this.$expr;
      case 'env':
        return this.$env;
      case 'k':
        return this.$k;
      case 'rator':
        return this.$rator;
      case 'rands':
        return this.$rands;
      case 'ls':
        return this.$ls;
      case 'pc':
        return this.$pc;
      case 'callback':
        return this.$callback;
      default:
        throw new Bug("Tried to get non-existant register "+name,
            "Interpreter.getReg")
    }
  }
  toString() { 
    return "#<Interpreter>" 
  }
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
//   env: Hash
// }
//
export class Closure {
  params: Expr; // should be a List of values
  expr: Expr;
  env: Env;
  constructor(params: Expr, expr: Expr, env: Env) {
    this.params = params;
    this.expr = expr;
    this.env = env;
  }
  toString() {
    return "#<FoxScheme Closure>"
  }
}

///////////////////////////////////////////
//
// ValueContainer data types
//
///////////////////////////////////////////
class ValueContainer {
  value: Expr;
  constructor(v: Expr) {
    this.value = v;
  }
  toString() {
    return "You got back: " + this.value;
  }
}
