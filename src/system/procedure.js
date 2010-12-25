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
    constructor.fapply = function(ls) {
        /*
         * Check for invalid number of params
         */
        if(this.arity !== -1) {
            if(arguments.length < this.arity)
                throw new FoxScheme.Error("Too few parameters", this.toString())
            else if (this.maxarity !== -1)
                if(arguments.length > this.maxarity)
                    throw new FoxScheme.Error("Too many parameters", this.toString())
        }
        /*
         * Do the actual procedure application here.
         */
        return this.proc.apply(this.proc, ls)
    }
    constructor.toString = function() {
        if(this.name === null)
            return "#<NativeProcedure>";
        return ['#<NativeProcedure ', this.name, '>'].join("");
    }
    return constructor;
}();