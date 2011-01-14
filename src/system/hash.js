/*
 * FoxScheme.Hash
 *
 * A simple hash implementation that takes advantage of JS native object
 * properties.
 *
 * This is used to represent the environments (symbol->value mappings)
 * in the Interpreter, so it includes facilities for chaining
 * environments:
 *
 * env = new $fs.Hash()
 * newenv = env.extend()
 * newerenv = newenv.extend()
 *
 * These hashes are chained like this:
 *   newerenv -> newenv -> env
 *
 * newerenv.get("x") will search up the chain until it finds a binding
 * for "x".  Note that the set() method *does not* go up the chain, and
 * will always affect the outermost hash.  This may shadow bindings
 * further up the chain.
 *
 */
FoxScheme.Hash = function () {
    if(!(this instanceof FoxScheme.Hash)) {
        throw new FoxScheme.Error("Improper use of FoxScheme.Hash()");
        return null;
    }
    this.initialize.apply(this, arguments)
}

FoxScheme.Hash.prototype = function () {
    return {
        /*
         * We can optionally initialize this hash with another hash,
         * and the new Hash will be changed to the given Hash.  Then,
         * if this hash looks up something and cannot find it, it will
         * ask the chained hash, which asks its chained hash, and so
         * on.  This means searches search up the hash chain.
         */
        initialize: function (next) {
            this._store = {}
            this._next = next
        },
        get: function (key) {
            var r
            if((r = this._store[key]) !== undefined &&
               r !== Object.prototype[key])
                return r
            else if(this._next !== undefined)
                return this._next.get(key)
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
            return "#<SystemHash>"
        },
        clone: function () {
            var c = new FoxScheme.Hash()
            for(var k in this._store)
                c.set(k, this._store[k])
            return c;
        },
        /*
         * The extend method is a shortcut for initializing a new Hash
         * with this Hash
         */
        extend: function () {
            return new FoxScheme.Hash(this)
        }
    }
}();

