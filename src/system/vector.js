FoxScheme.Vector = function(elements) {
    // guard against accidental non-instantiation
    if(!(this instanceof FoxScheme.Vector)) {
        throw new FoxScheme.Bug("Improper use of FoxScheme.Vector()");
    }

    this._array = [];
    /*
     * Allow vector to be created from an existing JS array
     */
    if(elements !== undefined) {
        if(elements instanceof Array) {
            var i = elements.length
            while(i--) {
                this._array[i] = elements[i];
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
    },
    length: function() {
        return this._array.length;
    },
    set: function(i, el) {
        if(i < 0 || i >= this._array.length)
            throw new FoxScheme.Error("Invalid vector index "+i, "Vector")

        return this._array[i] = el;
    },
    get: function(i) {
        if(i < 0 || i >= this._array.length)
            throw new FoxScheme.Error("Invalid vector index "+i, "Vector")

        return this._array[i];
    }
};
