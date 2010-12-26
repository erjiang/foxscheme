/*
 * FoxScheme.Hash
 *
 * A simple hash implementation that takes advantage of JS native object
 * properties.
 *
 * TODO: Replace with better implementation
 */
FoxScheme.Hash = function () {
    if(!(this instanceof FoxScheme.Hash)) {
        throw new FoxScheme.Error("Improper use of FoxScheme.Hash()");
        return null;
    }
    this.initialize()
}

FoxScheme.Hash.prototype = function () {
    return {
        initialize: function () { this._store = {} },
        get: function (key) {
            if(this._store[key] !== Object.prototype.key)
                return this._store[key]
        },
        set: function (key, value) {
            return this._store[key] = value
        },
        unset: function (key) {
            var val = this._store[key]
            delete this._store[key]
            return val
        },
        toString: function () {
            return "#<Hash>"
        },
        clone: function () {
            var c = new FoxScheme.Hash()
            for(var k in this._store)
                c.set(k, this._store[k])
            return c;
        }
    }
}();

