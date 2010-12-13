/*
 * FoxScheme.Char
 *
 * A character object containing a single Unicode character.
 */
FoxScheme.Char = function(c) {
    // guard against accidental non-instantiation
    if(!(this instanceof FoxScheme.Char)) {
        console.log("Improper use of FoxScheme.Char()");
        return null;
    }

    if(typeof(c) === "string")
        if(c.length == 1)
            this._char = c;
        else
            throw new FoxScheme.Error("Char() given string \""+c+"\"");
    else if(typeof(c) === "number")
        this._char = String.fromCharCode(c);
    else
        throw new FoxScheme.Error("Char() given object typed "+typeof(c));
}
FoxScheme.Char.prototype = function() {
    var charString = [ // the first 128 characters
        "nul", "soh", "stx", "etx", "eot", "enq", "ack", "bel", "bs", "ht",
        "lf", "vt", "ff", "cr", "so", "si", "dle", "dc1", "dc2", "dc3", "dc4",
        "nak", "syn", "etb", "can", "em", "sub", "esc", "fs", "gs", "rs",
        "us", "space", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+",
        ", ", "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
        ":", ";", "<", "=", ">", "?", "@", "A", "B", "C", "D", "E", "F", "G",
        "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U",
        "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_", "`", "a", "b", "c",
        "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q",
        "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~", "del"
    ];
    return {
        toInteger: function(c) {
            // allow this to be used statically
            if(c !== undefined)
                return (new FoxScheme.Char(c)).toInteger();
            return this._char.charCodeAt(0);
        },
        toString: function() {
            var x = this.toInteger();
            if(x < 128)
                return "#\\" + charString[x];
            else
                return "#\\" + x.toString(16);
        }
    };
}();
