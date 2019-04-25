/*
 * FoxScheme.nothing
 *
 * A special object representing the output of (void).
 * Rhino does not like properties being called "void", so
 * it's called nothing here.
 */
export class Nothing {
  toString() {
    return "#<void>";
  }
}

let nothing = new Nothing();
export default nothing;

export function isNothing(x: any): x is Nothing {
  return (x instanceof Nothing) || (x === nothing) || (x === Nothing);
}
