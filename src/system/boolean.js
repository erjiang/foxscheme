/*
 * boolean.js
 * This file simply modifies JS's own Boolean object's toString
 */
Boolean.prototype.toString = function () {
    if(this == true)
        return "#t"
    else
        return "#f"
}
