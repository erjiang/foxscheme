/*
 * FoxScheme.nil
 *
 * A special object representing Scheme's list terminator.
 * It's called "nil" after Lisp's nil, but also to avoid 
 * confusion with Javascript's own null.
 */

FoxScheme.nil = {
    toString: function() {
        return "()";
    }
};

/*
 * FoxScheme.nothing
 * 
 * A special object representing the output of (void).
 * Rhino does not like properties being called "void", so
 * it's called nothing here.
 */
FoxScheme.nothing = {
    toString: function() {
        return "#<void>";
    }
};
