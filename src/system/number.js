/*
 * number.js
 *
 * This file simply modifies JS's Number.prototype.toString to better print
 * Infinity as +inf.0
 */
Number.prototype.toString = function() {
    return function() {
        if(this == Infinity)
            return "+inf.0"
        else if(this == -Infinity)
            return "-inf.0"
        else
            // use magic native type coercion
            return ""+this
    }
}();
