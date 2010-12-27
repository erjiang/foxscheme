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
    if(elements !== undefined) {
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
