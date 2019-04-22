/*
 * FoxScheme.nothing
 * 
 * A special object representing the output of (void).
 * Rhino does not like properties being called "void", so
 * it's called nothing here.
 */
export default class nothing {
  static toString() {
    return "#<void>";
  }
}