/*
 *
 * This file provides methods for creating native JavaScript functions
 * for use by FoxScheme.Interpreter
 */

FoxScheme.NativeFunction = function() {
    if(!(this instanceof FoxScheme.NativeFunction)) {
        throw new FoxScheme.Bug("Improper use of FoxScheme.NativeFunction()");
    }

    this.initialize.apply(this, arguments)
}

FoxScheme.NativeFunction.prototype = function() {
    var proc, name, arity, maxarity;
    return {
        /*
         * To create a function, pass a function in as a_proc,
         * and optionally specify the arity, and an optional
         * max arity.
         *
         * For example: cons, 2
         * because cons takes only two arguments.
         */
        initialize: function(a_proc, a_name, a_arity, a_maxarity) {
            proc = a_proc
            arity = a_arity
            if(typeof(a_arity) === "undefined")
                arity = -1;
            maxarity = a_maxarity
            if(typeof(a_maxarity) === "undefined")
                maxarity = -1;
            name = a_name
            if(typeof(a_name) === "undefined")
                name = null;
        },
        fapply: function(/* args */) {
            /*
             * Check for invalid number of params
             */
            if(arity !== -1) {
                if(arguments.length < arity)
                    throw new FoxScheme.Error("Too few parameters", this.toString())
                else if (maxarity !== -1)
                    if(arguments.length > maxarity)
                        throw new FoxScheme.Error("Too many parameters", this.toString())
            }
            /*
             * Do the actual procedure application here.
             */
            proc.apply(proc, arguments)
        },
        toString: function() {
            if(name === null)
                return "#<native-procedure>";
            return ['#<native-procedure ', name, '>'].join("");
        }
    }
}();
