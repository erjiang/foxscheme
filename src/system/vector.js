FoxScheme.Vector = function(elements) {
    // guard against accidental non-instantiation
    if(!(this instanceof FoxScheme.Vector)) {
        console.log("Improper use of FoxScheme.Vector()");
        return null;
    }

    this._array = [];
    /*
     * Allow vector to be created from an existing JS array
     */
    if(typeof(elements) !== "undefined") {
        if(elements instanceof Array) {
            for(i in elements) {
                this._array.push(elements[i]);
            }
        }
        else {
            throw new FoxScheme.Error("Vector constructor given non-array");
        }
    }
};
FoxScheme.Vector.prototype = {
    toString: function() { 
        return "#("+this._array.join(" ")+")";
    }
};
