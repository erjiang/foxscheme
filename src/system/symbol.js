FoxScheme.Symbol = function(name) {
    // guard against accidental non-instantiation
    if(!(this instanceof FoxScheme.Symbol)) {
        console.log("Improper use of FoxScheme.Symbol()");
        return null;
    }

    // allow us to subclass without going through this initialization
    if(name === false)
        return;

    // check to see if the symbol name is proper
    if(name === null)
        throw new FoxScheme.Error("Tried to create a symbol without a name");
    if(name.indexOf(" ") !== -1)
        throw new FoxScheme.Error("Invalid symbol name: \""+name+"\"");

    var invalid = ["."];
    for(var i in invalid) {
        if(name === invalid[i])
            // this kind of thing should be caught by the parser...
            throw new FoxScheme.Bug("Invalid symbol name: "+name, "FoxScheme.Symbol")
    }
    
    // finish initialization
    this._name = name;
};
FoxScheme.Symbol.prototype = {
    toString: function() { return this._name; },
    name: function() { return this._name }
};

FoxScheme.Gensym = function() {
    if(!(this instanceof FoxScheme.Gensym))
        throw new FoxScheme.Bug("Improper use of FoxScheme.Gensym()")

    this.initialize.apply(this, arguments)
}
FoxScheme.Gensym.gensymcount = 0
FoxScheme.Gensym.printgensym = true
FoxScheme.Gensym.prototype = function() {
    var constructor = new FoxScheme.Symbol(false) // skip init
    constructor.initialize = function(shortname, name) {
        if(shortname === undefined)
            shortname = "g"+FoxScheme.Gensym.gensymcount

        this._shortname = shortname

        if(name === undefined)
            this._name = "_"+shortname+"__fox-"+FoxScheme.Gensym.gensymcount
        else
            this._name = name

        FoxScheme.Gensym.gensymcount++
    }
    constructor.toString = function() {
        if(FoxScheme.Gensym.printgensym)
            return ["#{",this._shortname," ",this._name,"}"].join("")
        else
            return this._shortname
    }
    return constructor;
}();
