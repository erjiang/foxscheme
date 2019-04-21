/*
 * FoxScheme.nil
 *
 * A special object representing Scheme's list terminator.
 * It's called "nil" after Lisp's nil, but also to avoid 
 * confusion with Javascript's own null.
 */

export default class nil {
    toString() {
        return "()";
    }
}
