/*
 *
 * Implements the important native JS functions for FoxScheme
 * (i.e. things that cannot be written in Scheme)
 */
/*
var FoxScheme.lib.JavaScript = function() {
*/
(function(defun) {

defun("js:eval", 1, 1,
    function() {
        var expr = arguments[0];
        if(!(expr instanceof FoxScheme.String))
            throw new FoxScheme.Error("Tried to evaluate non-string: "+expr,
                "js:eval")

        // Use JavaScript's `eval` to run the given string
        var retval = eval(expr.getValue())
        if(retval === undefined)
            retval = FoxScheme.nothing

        return retval
    })

defun("js:procedure", 1, 1,
    function() {
        var expr = arguments[0];
        if(!(expr instanceof FoxScheme.String))
            throw new FoxScheme.Error("Tried to evaluate non-string: "+expr,
                "js:procedure")

        console.log("about to eval: "+"("+expr.getValue()+")")
        var proc = eval("("+expr.getValue()+")")
        console.log("came back as "+proc)

        if(!(proc instanceof Function))
            throw new FoxScheme.Error("JavaScript code block did not evaluate to a Function", "js:procedure")

        return new FoxScheme.JavaScriptProcedure(proc)
    })

})(FoxScheme.nativeprocedures.defun);

FoxScheme.JavaScriptProcedure = function() {
    if(!(this instanceof FoxScheme.JavaScriptProcedure)) {
        throw new FoxScheme.Bug("Improper use of FoxScheme.JavaScriptProcedure()")
    }

    this.initialize.apply(this, arguments)
}

FoxScheme.JavaScriptProcedure.prototype = (function() {

    var constructor = new FoxScheme.Procedure();

    constructor.initialize = function(proc) {
        this.proc = proc
    }

    constructor.fapply = function(interp, ls) {
        var i = ls.length
        /*
        // Do some conversions between FoxScheme and JS data types
        while(i--) {
            if(ls[i] instanceof FoxScheme.String) {
                ls[i] = ls[i].getValue()
            } else if(ls[i] === FoxScheme.nil) {
                ls[i] = null
            } else if(ls[i] === FoxScheme.nothing) {
                ls[i] = undefined
            } else if(ls[i] instanceof FoxScheme.Char) {
                ls[i] = ls[i].getValue()
            }
        }
        */
        var retval = this.proc.apply(interp, ls)
        if(retval === undefined)
            return FoxScheme.nothing

        return retval
    }

    return constructor
})();

FoxScheme.JavaScriptProcedure.prototype.toString = function() {
    return "#<JavaScriptProcedure>"
}
