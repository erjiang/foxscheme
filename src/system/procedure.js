/*
 * FoxScheme.Procedure
 * A general, inheritable class that outlines what a Procedure should do.
 * So named as to not be confused with JS's function keyword.
 *
 * Consider this a virtual class, as we don't want to add any costly init
 * code that will be run whenever it is subclassed.
 */

FoxScheme.Procedure = function() {
    if(!(this instanceof FoxScheme.Procedure)) {
        throw new FoxScheme.Bug("Improper use of FoxScheme.Procedure()")
    }

    this.initialize.apply(this, arguments)
}
FoxScheme.Procedure.prototype = {
    initialize: function() { },
    toString: function() { return "#<Procedure>" }
}
/*
 *
 * This file provides methods for creating native JavaScript functions
 * for use by FoxScheme.Interpreter
 */

FoxScheme.NativeProcedure = function () {
    if(!(this instanceof FoxScheme.NativeProcedure)) {
        throw new FoxScheme.Bug("Improper use of FoxScheme.NativeProcedure()")
    }

    this.initialize.apply(this, arguments)
}

FoxScheme.NativeProcedure.prototype = function() {
    
    /*
     * We need to create this from FoxScheme.Procedure()
     * so that instanceof works, and then write the props
     * into constructor separately.
     */
    var constructor = new FoxScheme.Procedure();
    /*
     * To create a function, pass a function in as a_proc,
     * and optionally specify the arity, and an optional
     * max arity.
     *
     * For example: cons, 2
     * because cons takes only two arguments.
     */
    constructor.initialize = function(a_proc, a_name, a_arity, a_maxarity) {
        this.proc = a_proc
            this.arity = a_arity
            if(typeof(a_arity) === "undefined")
                this.arity = -1;
        this.maxarity = a_maxarity
            if(typeof(a_maxarity) === "undefined")
                this.maxarity = -1;
        this.name = a_name
            if(typeof(a_name) === "undefined")
                this.name = null;
    }
    constructor.fapply = function(interp, ls) {
        /*
         * Check for invalid number of params
         */
        if(this.arity !== -1) {
            if(ls.length < this.arity)
                throw new FoxScheme.Error(["Needed ",this.arity," parameters but only got ",ls.length].join(""), 
                                            this.toString())
            else if (this.maxarity !== -1)
                if(ls.length > this.maxarity)
                    throw new FoxScheme.Error(["Could only take at most ",this.maxarity,
                                               " parameters but got ",ls.length].join(""), 
                                                this.toString())
        }
        /*
         * Do the actual procedure application here.
         * Let 'this' be the calling interpreter.
         */
        return this.proc.apply(interp, ls)
    }
    constructor.toString = function() {
        if(this.name === null)
            return "#<NativeProcedure>";
        return ['#<NativeProcedure ', this.name, '>'].join("");
    }
    return constructor;
}();

/*
 * FoxScheme.InterpretedProcedure
 * A prototype for lambdas. 
 */

FoxScheme.InterpretedProcedure = function () {
    if(!(this instanceof FoxScheme.InterpretedProcedure)) {
        throw new FoxScheme.Bug("Improper use of FoxScheme.InterpretedProcedure()")
    }

    this.initialize.apply(this, arguments)
}

FoxScheme.InterpretedProcedure.prototype = function() {
    
    var constructor = new FoxScheme.Procedure();
    var env = [];
    var interpreter
    /*
     * To create a function, pass a function in as a_proc,
     * and optionally specify the arity, and a boolean for whether
     * extra arguments arer passed in as a list.
     *
     * When fapply is called, it will call the procedure it was initialized
     * with, passing it all of fapply's arguments.
     *
     * For example: cons, 2
     * because cons takes only two arguments.
     */
    constructor.initialize = function(a_proc, a_arity, a_improper) {
        this.proc = a_proc
        this.arity = a_arity
        if(typeof(a_arity) === "undefined")
            this.arity = 0;
        this.improper = a_improper
            if(typeof(a_improper) === "undefined")
                this.improper = false;
    }
    constructor.fapply = function(interp, ls) {
        /*
         * Check for invalid number of params
         */
        if(this.improper === true) {
            if(ls.length < this.arity)
                throw new FoxScheme.Error(["Needed at least ",this.arity,
                                           " parameters but only got ",ls.length].join(""), 
                                            this.toString())
        }
        else {
            if(ls.length < this.arity)
                throw new FoxScheme.Error(["Needed ",this.arity," parameters but only got ",ls.length].join(""), 
                                            this.toString())
            else if (ls.length > this.arity)
                throw new FoxScheme.Error(["Could only take at most ",this.arity,
                                           " parameters but got ",ls.length].join(""), 
                                            this.toString())
        }
        /*
         * Do the actual procedure application here.
         */
        console.log("About to apply ")
            console.log(ls)
        return this.proc.apply(interp, ls)
    }
    constructor.toString = function() {
        return "#<InterpretedProcedure>";
    }
    return constructor;
}();
