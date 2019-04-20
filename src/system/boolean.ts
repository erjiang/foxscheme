/*
 * boolean.js
 * This strictly optional file simply modifies JS's own Boolean object's
 * toString to print like Scheme booleans
 */
Boolean.prototype.toString = function () {
    if(this == true)
        return "#t"
    else
        return "#f"
}
