/*
 * FoxScheme.String
 *
 * FoxScheme uses its own FoxScheme.String object so that
 * (eq? "abc" "abc") => #f
 */
FoxScheme.String = function(str) {
    // guard against accidental non-instantiation
    if(!(this instanceof FoxScheme.String))
        throw new FoxScheme.Bug("Improper use of FoxScheme.String()")

    this.initialize(str)
}

FoxScheme.String.prototype = {
    initialize: function(str) {
        if(typeof(str) === "string")
            this._value = str
        else
            throw new FoxScheme.Bug("Tried to create String from non-string","String")
    },
    length: function() {
        return this._value.length
    },
    set: function(i, c) {
        if(!(c instanceof FoxScheme.Char))
            throw new FoxScheme.Error(c+" is not a Char", "String.set")
        if(i < 0 || i > this._value.length)
            throw new FoxScheme.Error("Invalid index "+i, "String.set")
        this._value = this._value.slice(0, i)+ c.getValue() +this._value.slice(i+1)
        return
    },
    get: function(i) {
        if(i < 0 || i > this._value.length)
            throw new FoxScheme.Error("Invalid index "+i, "String.get")
        
        return this._value[i]
    },
    getValue: function() {
        return this._value
    },
    toString: function() {
        return '"'+this._value+'"'
    }
}
