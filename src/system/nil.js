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
 * FoxScheme.void
 * 
 * A special object representing the output of (void)
 */
FoxScheme.void = {
    toString: function() {
        return "#<void>";
    }
};
