/*
 * FoxScheme.Error
 *
 * A JavaScript Error to be thrown for internal FoxScheme errors.
 *
 */

FoxScheme.Error = function(message) {
    // guard against accidental non-instantiation
    if(!(this instanceof FoxScheme.Error)) {
        console.log("Improper use of FoxScheme.Error()");
        return null;
    }

    // finish initialization
    this.message = message;
};
FoxScheme.Error.prototype = {
    toString: function() { return this.message; }
};
