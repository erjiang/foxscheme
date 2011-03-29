/*
 *
 * Implements the important native JS functions for FoxScheme
 * (i.e. things that cannot be written in Scheme)
 */

(function(defun) {

defun("js:eval", 1, 1,
    function() {
        var expr = arguments[0];
        if(!(expr instanceof FoxScheme.String))
            throw new FoxScheme.Error("Tried to evaluate non-string: "+expr)

        // Use JavaScript's `eval` to run the given string
        var retval = eval(expr.getValue())
        if(retval === undefined)
            retval = FoxScheme.nothing

        return retval
    })

})(FoxScheme.nativeprocedures.defun);
