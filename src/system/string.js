/*
 * Strings are just Javascript strings for now.
 *
 * However, strings should have quotation marks wrapped around them when
 * printed to avoid confusion with symbols.
 *
 * As far as I can tell, Rhino does not use the toString method of
 * String, so this does not affect Rhino's REPL
 */

String.prototype.toString = function () {
    return '"'+this+'"';
}
