/*
 * FoxScheme.Error
 *
 * A JavaScript Error to be thrown for errors arising from bad user
 * input (bad syntax, etc.)
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
    toString: function() { return "[ERROR] "+this.message; }
};

/*
 * FoxScheme.Bug
 *
 * A Javascript error to be thrown in an internal fault that
 * should never happen.
 *
 */

FoxScheme.Bug = function(message) {
    // guard against accidental non-instantiation
    if(!(this instanceof FoxScheme.Bug)) {
        console.log("Improper use of FoxScheme.Bug()");
        return null;
    }

    // finish initialization
    this.message = message;
};
FoxScheme.Bug.prototype = {
    toString: function() { return "[BUG] "+this.message; }
};
