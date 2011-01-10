/*
 * FoxScheme.Looper
 *
 * A looping interpreter based on jsScheme:
 * http://www.bluishcoder.co.nz/jsscheme/
 *
 * This interpreter uses and abuses JS's exception-throwing mechanism
 * to implement continuations.
 *
 * vim:sw=2 ts=2 sts=2
 */

FoxScheme.Looper = function() {
    if(!(this instanceof FoxScheme.Looper)) {
        throw FoxScheme.Error("Improper use of FoxScheme.Looper()")
        return null
    }

    this.initialize()
}

FoxScheme.Looper.prototype = function() {
  var initialize = function() {
      this._globals = new FoxScheme.Hash()
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
  
  var State = function(expr, env, cc) {
    if(!(this instanceof State))
      throw new FoxScheme.Bug("Improper use of State()", "looper")
    this.expr = expr
    this.env = env
    this.cc = cc
    this.ready = false
  }
  State.prototype.eval = function() {
    if(this.expr == null)
      this.ready = true

    if(!this.ready) {
      // TODO: figure out if this line is necessary
      this.ready = false
      // evalObj evals the state's .expr and modifies the state
      evalObj(this)
    }
    return this.ready
  }
  
  var Continuation = function(expr, env, cc, f) {
    if(!(this instanceof Continuation))
      throw new FoxScheme.Bug("Improper use of Continuation()", "looper")

    // TODO: verify these
    // list index, for continuing inside a list
    this.i = 0
    // expr to be evaluated
    this.expr = expr
    // the current continuation
    this.cc = cc
    // the procedure code to call with the result. f takes a State
    // object and modifies the state accordingly (no return value)
    this.f = f
  }
  
  // some reserved keywords that would throw an "invalid syntax"
  // error rather than an "unbound variable" error
  var syntax = ["lambda", "let", "letrec", "begin", "if",
      "set!", "define", "quote"]
  
  /*
   * This is the top-level eval loop. Unlike the simple recursive
   * evaluator, this loop leaves the processing work to the continue*
   * functions.  This function is merely responsible for continuing
   * the continuations and catching and returning the final result.
   */
  var eval = function(expr) {
    try {
      if(expr instanceof FoxScheme.Symbol()) {
        var val = this._globals.get(expr.name())
        if(val === undefined)
          throw new FoxScheme.Error("Unbound symbol "+expr)
        return r
      }

      /*
       * The top-level continuation, which escapes the eval loop
       * by throwing its result.
       */
      var topCC = new Continuation(null, null, null,
                        function(state) {
                          throw state
                        })
      /*
       * The initial state has an empty environment and the top-level
       * continuation. The expression to be processed next, of
       * course, is the input expr.
       */
      var state = new State(expr, new FoxScheme.Hash(), topCC)

      /*
       * Main computation loop. It is only escaped when topCC throws the final
       * state, or when an Exception occurs.
       */
      for(;;) {
        evalObj(state)
        if(state.ready) {
          state.ready = false
          state.cc.cont(state)
        }
      }
    }
    catch(e) {
      if(e instanceof State)
        return State.expr
      else throw e
    }
  }
  
  /*
   * Interpreter's messy inner-workings begin here
   */
  
  var continueBegin = function(state) {
    state.expr = this.expr.car()
    state.env = this.env
    state.ready = false
    /*
     * if Tail reached, State should move on to what's next (i.e.
     * this continuation's continuation
     */
    if(this.expr.cdr() === FoxScheme.nil)
      state.cc = this.cc
    /*
     * Otherwise, the next expr to process is the cdr() of the begin
     * list, using this continueBegin continuation still
     */
    else
      this.expr = this.expr.cdr()
      state.cc = this
  }
  
  var continueIf = function(state) {
    // everything but #f is false
    if(state.expr === false)
      state.expr = state.expr.car()
    else
      state.expr = state.expr.cdr().car()
    state.env = this.env
    state.cc = this.cc
    state.ready = false
  }

  /*
   * This is like JSScheme's evalTrue, evalPair, and evalVar all
   * wrapped into one.
   */
  // TODO: recheck file for "obj" -> "expr", "car" -> "car()", etc.
  var evalObj = function(state) {
    var expr = state.expr
    if(expr instanceof FoxScheme.Symbol) {
      var sym = expr.name()
      if((state.expr = state.env.get(sym)) === null)
        if((state.expr = this._globals.get(sym)) === null) 
          if((state.expr = FoxScheme.nativeprocedures.get(sym))
              === null)
            throw new FoxScheme.Error("Unbound symbol "+expr,
                "Looper.evalObj")
    }
    else if(expr instanceof FoxScheme.Pair) {
      var sym
      // if syntax keyword!
      if(expr.car() instanceof Symbol &&
          contains(syntax, (sym = expr.car().name())) &&
          // additionally check to see if syntax is shadowed
          state.env.get(sym) === null &&
          this._globals.get(sym) === null &&
          FoxScheme.nativeprocedures.get(sym) === null) {
        switch(sym) {
          case "if":
            state.expr = expr.second()
            state.cc = new Continuation(
                expr.cdr().cdr()
              , state.env
              , state.cc
              , continueIf)
            state.ready = false
            break;
          case "quote":
            state.expr = expr.second()
            state.ready = true
            break;
          // TODO: other primitive syntax
          default:
            throw new FoxScheme.Bug(sym+" syntax keyword not yet implemented")
        }
      }
    }
    /*
     * If we encounter something that we don't need to parse, and can
     * simply return, then set the ready flag to true
     */
    else 
      state.ready = true
  }

  return {
    initialize: initialize,
    eval: eval,
    toString: function() { return "#<LooperInterpreter>" }
  }
}

