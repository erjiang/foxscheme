/*
 * FoxScheme.nil
 *
 * A special object representing Scheme's list terminator.
 * It's called "nil" after Lisp's nil, but also to avoid
 * confusion with Javascript's own null.
 */

export class Nil {
    static toString() {
        return "()";
    }
}

let nil = new Nil();
export default nil;

export function isNil(x: any): x is Nil {
  return x instanceof Nil || x === nil || x === Nil;
}
