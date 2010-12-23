FoxScheme.Symbol = function(name) {
    // guard against accidental non-instantiation
    if(!(this instanceof FoxScheme.Symbol)) {
        console.log("Improper use of FoxScheme.Symbol()");
        return null;
    }

    // check to see if the symbol name is proper
    if(name === null)
        throw new FoxScheme.Error("Tried to create a symbol without a name");
    if(name.indexOf(" ") !== -1)
        throw new FoxScheme.Error("Invalid symbol name: \""+name+"\"");
    
    // finish initialization
    this._name = name;
};
FoxScheme.Symbol.prototype = {
    toString: function() { return this._name; },
    name: function() { return this._name }
};
