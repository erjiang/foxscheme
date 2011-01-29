/*
 * FoxScheme.Looper
 *
** vim: set sw=2 ts=2 sts=2 expandtab:
 *
 * A looping interpreter based on jsScheme:
 * http://www.bluishcoder.co.nz/jsscheme/
 *
 * This interpreter uses and abuses JS's exception-throwing mechanism
 * to implement continuations.
 *
 */

FoxScheme.Looper = function() {
    if(!(this instanceof FoxScheme.Looper)) {
        throw new FoxScheme.Error("Improper use of FoxScheme.Looper()")
        return null
    }

    this.initialize()
}

/*
 * Guide to writing code with this nonsense
 *
 * Everything side-affects the state instead of using implicit Javascript
 * returns and continuations.  For instance, the evaluator (evalObj) takes a
 * state as input, where state.expr is the Scheme expression to be evaluated.
 * The result of that Scheme expression properly replaces state.expr (i.e.,
 * state.expr = eval(state.expr)). Nothing is returned from evalObj.
 */
FoxScheme.Looper.prototype = function() {
  // grab a reference to the current Looper
  var looper
  var initialize = function() {
      this._globals = new FoxScheme.Hash()
      looper = this
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
  
  /*
   * State object holds the current computation state
   *
   * expr is the expr that we want to eval next
   * env is the current env
   * cc is TODO: ???
   * ready is whether this state is done eval'ing (in which case expr can be
   * returned) or not (keep eval'ing)
   */
  var State = function(expr, env, cc) {
    if(!(this instanceof State))
      throw new FoxScheme.Bug("Improper use of State()", "looper")
    this.expr = expr
    this.env = env
    this.cc = cc
    this.ready = false

    this.toString = function() {
        return "#<LooperState :expr "+this.expr.toString()+">" }
  }
  var evalState = function(state) {
    if(state.expr == null)
      state.ready = true
    
    if(!state.ready) {
      // TODO: figure out if this line is necessary
      state.ready = false
      // evalObj evals the state's .expr and modifies the state
      evalObj(state)
    }
    return state.ready
  }
  
  var Continuation = function(expr, env, cc, f) {
    if(!(this instanceof Continuation))
      throw new FoxScheme.Bug("Improper use of Continuation()", "looper")

    // TODO: verify these
    // list index, for continuing inside a list
    this.i = 0
    // expr to be evaluated
    this.expr = expr
    // the environment in which to evaluate expr in
    this.env = env
    // the current continuation
    this.cc = cc
    // the procedure code to call with the result. f takes a State
    // object and modifies the state accordingly (no return value)
    this.cont = f
  }
  /*
   * The top-level continuation, which escapes the eval loop
   * by throwing its result.
   */
  var topCC = new Continuation(null, null, null,
                    function(state) {
                      throw state
                    })
  
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
    /*
     * The initial state has an empty environment and the top-level
     * continuation. The expression to be processed next, of
     * course, is the input expr.
     */
    var topEnv = this._globals.extend()
    var state = new State(expr, topEnv, topCC)
    try {
      /*
       * Main computation loop. It is only escaped when topCC throws the final
       * state, or when an Exception occurs.
       */
      for(;;) {
        // give evalObj this without exposing it as a property
        evalObj.apply(this, [state])
        if(state.ready) {
          state.ready = false
          state.cc.cont(state)
        }
      }
    }
    catch(e) {
      if(e instanceof State)
        return state.expr
      else
        throw e
    }
  }
  
  /*
   * Interpreter's messy inner-workings begin here
   */
  
  /*
   * This is like JSScheme's evalTrue, evalPair, and evalVar all
   * wrapped into one.
   */
  // TODO: recheck file for "obj" -> "expr", "car" -> "car()", etc.
  var evalObj = function(state) {
    /*
     * If the state is already done, then stop executing this level (jump out)
     * This fixes the bug: (eval '(cdr '(1 2 3))) => (eval '(2 3)) => error!
     */
    if(state.ready === true)
      return;

    var expr = state.expr
    if(expr instanceof FoxScheme.Symbol) {
      var sym = expr.name()
      if((state.expr = state.env.chainGet(sym)) === undefined)
        if((state.expr = FoxScheme.nativeprocedures.get(sym))
            === undefined)
          throw new FoxScheme.Error("Unbound symbol "+expr,
              "Looper.evalObj")

      state.ready = true
    }
    else if(expr instanceof FoxScheme.Pair) {
      var sym
      // TODO: Error checking
      // if syntax keyword!
      if(expr.car() instanceof FoxScheme.Symbol &&
          contains(syntax, (sym = expr.car().name())) &&
          // additionally check to see if syntax is shadowed
          state.env.get(sym) === undefined &&
          this._globals.get(sym) === undefined &&
          FoxScheme.nativeprocedures.get(sym) === undefined) {
        switch(sym) {
          case "quote":
            state.expr = expr.second()
            state.ready = true
            break;
          case "begin":
            /*
             * Catch case of:  (begin)
             */
            if(expr.cdr() === FoxScheme.nil) {
              state.expr = FoxScheme.nothing
              state.ready = true
            }
            else {
              state.expr = expr.second()
              if(expr.length() > 2) {
                state.cc = new Continuation(
                                expr.cdr().cdr(),
                                state.env,
                                state.cc,
                                continueBegin)
              }
            }
            state.ready = false
            break;
          case "if":
            state.expr = expr.second()
            state.cc = new Continuation(
                expr.cdr().cdr()
              , state.env
              , state.cc
              , continueIf)
            state.ready = false
            break;
          case "set!":
          case "define":
            if(expr.length() !== 3)
              throw new FoxScheme.Error("Invalid syntax in set!: "+expr)

            if(!(expr.second() instanceof FoxScheme.Symbol))
              throw new FoxScheme.Error("Cannot set! the non-symbol "+expr.second())

            state.expr = expr.third()
            state.cc = new Continuation(
                            expr.second(),
                            state.env,
                            state.cc,
                            continueSet)
            state.ready = false
            break;
          case "lambda":
            var params = expr.second()
            var body = expr.third()
            /*
             * Add implicit begin
             *   (lambda () x y z) => (lambda () (begin x y z))
             *
             * TODO: This should go in the macro expander
            if(expr.cdr().cdr() > 1)
              body = FoxScheme.utils.listify([new FoxScheme.Symbol("begin"),
                                        body])
             */

            /*
             * We need to grab a reference to the env now, because
             * if we do state.env later, state's env will have changed by then
             */
            var capturedEnv = state.env

            if(params instanceof FoxScheme.Symbol) {
                var sym = expr.second().name()
                // TODO: does this need to be moved to inside the function??
                /*
                 * Catches the special case of (lambda x body)
                 */
                state.expr = new FoxScheme.InterpretedProcedure(
                  function() {
                    /*
                     * this = { state: state,
                     *          interpreter: interpreter }
                     */
                    var newenv = capturedEnv.extend()
                    // currState = state at lambda runtime
                    var currState = this.state
                    newenv.set(sym, FoxScheme.Util.listify(arguments))

                    /*
                     * This procedure will be used like:
                     *   state.expr = proc.fapply({ state: state,
                     *                              interpreter: that },
                     *                            args)
                     *
                     * so if we set the state to false and return the body,
                     * the Looper will continue to evaluate the body (with
                     * the right env of course)
                     */
                    currState.env = newenv
                    currState.ready = false
                    return body
                  },
                  0,    // minimum zero args
                  true) // true = no upper bound on no. of args
            } else if (params instanceof FoxScheme.Pair) {
              /*
               * Proper parameters list:
               *   (lambda (x y z) (list x y z))
               * see interpreter.js for comments
               */
              if(params.isProper()) {
                params = FoxScheme.Util.arrayify(params)
                state.expr = new FoxScheme.InterpretedProcedure(
                  function() {
                    var i = params.length
                    var newenv = capturedEnv.extend()
                    while(i--)
                      newenv.set(params[i].name(), arguments[i])

                    var currState = this.state
                    
                    currState.env = newenv
                    currState.ready = false
                    return body
                  },
                  params.length,
                  false)
              } else {
                params = FoxScheme.Util.arrayify(params)
                state.expr = new FoxScheme.InterpretedProcedure(
                  function () {
                    var newenv = capturedEnv.extend()
                    var args = FoxScheme.Util.arrayify(arguments)
                    var currState = this.state
                    var i = params.length - 1
                    while(i--)
                      newenv.set(params[i].name(), args[i])
                    // process last improper arg
                    newenv.set(params[params.length - 1].name(),
                               FoxScheme.Util.listify(args.slice(params.length - 1)))

                    currState.env = newenv
                    currState.ready = false
                    return body
                    },
                    params.length - 1,
                    true)
              }
            } else if(params === FoxScheme.nil) {
                state.expr = new FoxScheme.InterpretedProcedure(
                        function() {
                        var newenv = capturedEnv.extend()
                        var currState = this.state
                        currState.env = newenv
                        currState.ready = false
                        return body
                        }, 0, false)
            } else {
                throw new FoxScheme.Error("Invalid parameter list in "+expr)
            }

            // done, return, go out, etc.
            state.ready = true

            break;
          case "let":
            if(expr.length() < 3)
              throw new FoxScheme.Error("Invalid syntax: "+expr)
            if(expr.length() > 3)
              throw new FoxScheme.Error("Multiple bodies in let: "+expr)
            var body = expr.third()
            var bindings = expr.second()
            var params = FoxScheme.nil
            var args = FoxScheme.nil
            /*
             * Extract lhs and rhs from bindings:
             *    ((x 3) (y 4))
             *    => (x y)
             *       (3 4)
             */
            while(bindings !== FoxScheme.nil) {
              // (set! params (cons (caar bindings) params))
              params = new FoxScheme.Pair(bindings.car().car(), params)
              // (set! args (cons (cadar bindings) args))
              args = new FoxScheme.Pair(bindings.car().cdr().car(), args)
              bindings = bindings.cdr()
            }
            // assemble new lambda
            state.expr =
              new FoxScheme.Pair(
                new FoxScheme.Pair(new FoxScheme.Symbol("lambda"),
                  new FoxScheme.Pair(params,
                    new FoxScheme.Pair(body, FoxScheme.nil))),
                args)
            state.ready = false
            break;
          /*
             case "let":
             if(expr.length() < 3)
             throw new FoxScheme.Error("Invalid syntax: "+expr)
             var body = expr.third()
             var bindings = expr.second()
          /*
           * This'll probably be optimized by the macro expander anyways
           * /
           if(bindings = FoxScheme.nil)
          // TODO: ????

          else if(bindings instanceof FoxScheme.Pair) {
          var newenv = state.env.extend()
          */
          case "letrec":
            /*
             * Check for empty bindings list
             */
            if(expr.second() === FoxScheme.nil) { 
              state.expr = expr.third()
              state.ready = false
            }
            else {
              /*
               * The first thing to process is the rhs of the first binding:
               *   (letrec ((a first-thing) ...) body)
               */
              state.expr = expr.second().car().second()
              /*
               * newenv is the environment that these letrec bindings will
               * be evaluated in and bound in, and consequently used to
               * evaluate the body
               */
              var newenv = state.env.extend()
              state.env = newenv
              state.cc = new Continuation(
                              expr.third(),
                              newenv,
                              state.cc,
                              continueLetrec(expr.second()))
              state.ready = false
            }
            break;
          // TODO: other primitive syntax
          default:
            throw new FoxScheme.Bug(sym+" syntax keyword not yet implemented")
        }
        }
        // Otherwise, an ordinary procedure application
        else {
            state.expr = expr.car()
            state.cc = new Continuation(
                    expr.cdr(),
                    state.env,
                    state.cc,
                    continueApply)
        state.ready = false
      }
    }
    /*
     * Vectors are not literals
     */
    else if(expr instanceof FoxScheme.Vector) {
        throw new FoxScheme.Error("Invalid syntax: "+expr.toString())
    }
    /*
     * If we encounter something that we don't need to parse, and can
     * simply return, then set the ready flag to true
     */
    else 
      state.ready = true
  }

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
     * Otherwise, move the list cursor forward by one, setting the next item to
     * process, and then set the continuation to be this continuation still
     */
    else {
      this.expr = this.expr.cdr()
      state.cc = this
    }
  }
  /*
   * This is supposed to be attached to Continuation.cont, and
   * Continuation.expr holds the next possible values, so this.expr works
   *
   * Ex: (if #t 5 4)
   * state.expr = #t
   * this.expr = (5 4) 
   */
  var continueIf = function(state) {
    // everything but #f is true
    if(state.expr !== false) {
      state.expr = this.expr.car()
      state.ready = false
    }
    else {// false branch
      if(this.expr.cdr() === FoxScheme.nil) {
        state.expr = FoxScheme.nothing
        state.ready = true
      }
      else {
        state.expr = this.expr.cdr().car()
        state.ready = false
      }
    }
    state.env = this.env
    state.cc = this.cc
  }
  
  /*
   * (set! sym val)
   * this.expr = sym
   * state.expr = val
   * 
   * TODO: should scope checking be done at evalObj or in this continuation?
   */
  var continueSet = function(state) {
    state.env = this.env
    state.cc = this.cc

    var sym = this.expr.name()
    if(state.env.get(sym) !== undefined)
      state.env.set(this.expr.name(), state.expr)
    else if(FoxScheme.nativeprocedures.get(sym) !== undefined)
      throw new FoxScheme.Error("Attempt to set! native procedure "+sym)
    else
      looper._globals.set(sym, state.expr)

    // (set! x 5) => #<void>
    state.expr = FoxScheme.nothing
    state.ready = true
  }

  var continueApply = function (state) {
    // abuse objects as arrays!
    // this[0] is the procedure
    this[this.i++] = state.expr
    /* 
     * If we've reached the end of the list, then we apply
     * the procedure to the arguments
     */
    if(this.expr === FoxScheme.nil) {
      var args = []
      for(var i = 1; i < this.i; i++) {
        args.push(this[i])
      }
      state.env = this.env
      state.cc = this.cc
      // by convention, the first of the arguments shall be
      // the state and the second the arguments
      state.expr = this[0].fapply(
          {
              state: state,
              interpreter: looper,
              _globals: looper._globals},
          args)
      /*
       * The state is not necessarily ready! If it was a native procedure, then
       * state.expr now contains the result.  However, if it was a trampolined
       * CPS procedure, then state.expr is now the body of the procedure and we
       * need to continue executing.
       */
      state.ready = !(this[0] instanceof FoxScheme.InterpretedProcedure)
    }
    /*
     * If we're in the  middle of the list, then keep
     * processing the arguments
     */
    else {
      state.expr = this.expr.car()
      state.env = this.env
      state.cc = this
      this.expr = this.expr.cdr()
      state.ready = false
    }
  }

  var continueLetrec = function(bindings) {
    // gather a list of all symbols to be bound
    var newbindings = []
    return function(state) {
      // if not, keep processing
      newbindings.push(new FoxScheme.Pair(
            bindings.car().car().name(),
            state.expr))
      bindings = bindings.cdr()
      // reached the end of the list?
      if(bindings === FoxScheme.nil) {
        var args = []
        var i = newbindings.length
        while(i--)
          this.env.set(newbindings[i].car(), newbindings[i].cdr())
        /*
         * because this is letrec, we just use the same env to evaluate the body as the one we used to evaluate the bindings.  state.env and this.env should point to the same object.
         */
        //state.env = this.env
        state.cc = this.cc
        state.expr = this.expr
        state.ready = false
      }
      // keep processing
      else {
        state.expr = bindings.car().second()
        state.ready = false
      }
    }
  }

/*
  var continueLet = function(state) {
    // abuse objects as arrays!
    this[this.i++] = state.expr
    /*
     * Start processing bindings
     */

  return {
    initialize: initialize,
    eval: eval,
    toString: function() { return "#<LooperInterpreter>" }
  }
}()
