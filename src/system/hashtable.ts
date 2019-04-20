/*
 * FoxScheme.Hashtable
 *
 * This hash table implements the R6RS hashtables, as opposed to hash.js which
 * is only used internally by FoxScheme.
 */

FoxScheme.Hashtable = function() {
    if(!(this instanceof FoxScheme.Hashtable)) {
        throw new FoxScheme.Bug("Improper use of FoxScheme.Hashtable()")
    }

    this.initialize.apply(this, arguments)
}

FoxScheme.Hashtable.prototype = function() {
    var initialize = function() {
        this._store = []
        return
    }

    var clear = function() {
        this._store = []
    }
    
    var get = function(k) {
        var ks = k.toString()
        var lookup
        if((lookup = this._store[ks]) !== undefined) {
            var i = lookup.length
            while(i--) {
                if(lookup[i].car() === k) {
                    return lookup[i].cdr()
                }
            }
        }
        return null
    }

    var set = function(k, v) {
        var ks = k.toString()
        var lookup
        if((lookup = this._store[ks]) !== undefined) {
            var i = lookup.length
            while(i--) {
                if(lookup[i].car() === k) {
                    return lookup[i].setCdr(v)
                }
            }
            // not found, make new entry
            lookup.push(new FoxScheme.Pair(k, v))
        }
        else {
            this._store[ks] = ([new FoxScheme.Pair(k, v)])
        }
        return v
    }

    var remove = function (k) {
        var ks = k.toString()
        var v = this._store[ks]
        delete this._store[ks]
        return v
    }

    return {
        initialize: initialize,
        clear: clear,
        get: get,
        set: set
    }
}();
