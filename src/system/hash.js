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
}

FoxScheme.Hash.prototype = function () {
    var store = {};

    return {
        initialize: function () {},
        get: function (key) {
            if(store[key] !== Object.prototype.key)
                return store[key]
        },
        set: function (key, value) {
            return store[key] = value
        },
        unset: function (key) {
            var val = store[key]
            delete store[key]
            return val
        },
        toString: function () {
            return "#<Hash>"
        }
    }
}();

