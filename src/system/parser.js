/*
 * FoxScheme.Parser
 *
 * Copied from BiwaScheme/src/parser.js.
 * This takes a string representing an Sexp and converts it
 * into internal FoxScheme data.
 *
 * TODO: Rescope this to allow better minification.
 */

//
// Parser 
// copied from jsScheme - should be rewrriten (support #0=, etc)
//
FoxScheme.Parser = function(txt){
    // guard against accidental non-instantiation
    if(!(this instanceof FoxScheme.Parser)) {
        console.log("Improper use of FoxScheme.Parser()");
        return null;
    }
    this.tokens = this.tokenize(txt);
    this.i = 0;
};
FoxScheme.Parser.prototype = {
    listify: function(arg, end) {
        var list = end;
        if(!end)
            list = FoxScheme.nil;
        /*
         * Build a list out of an Array
         */
        if(arg instanceof Array) {
            var i = arg.length;
            while(i--) {
                list = new FoxScheme.Pair(arg[i], list);
            }
        }
        else
            list = new FoxScheme.Pair(arg, list);

        return list;
    },

    inspect: function () {
        return ["#<Parser:", this.i, "/", this.tokens.length, " ", Object.inspect(this.tokens), ">"].join("");
    },

    tokenize: function (txt) {
        var tokens = new Array(),
            oldTxt = null;
        var in_srfi_30_comment = 0;

        while (txt != "" && oldTxt != txt) {
            oldTxt = txt;
            txt = txt.replace(/^\s*(;[^\r\n]*(\r|\n|$)|#;|#\||#\\[^\w]|#?(\(|\[|{)|\)|\]|}|\'|`|,@|,|\+inf\.0|-inf\.0|\+nan\.0|\"(\\(.|$)|[^\"\\])*(\"|$)|[^\s()\[\]{}]+)/, function ($0, $1) {
                var t = $1;

                if (t == "#|") {
                    in_srfi_30_comment++;
                    return "";
                } else if (in_srfi_30_comment > 0) {
                    if (/(.*\|#)/.test(t)) {
                        in_srfi_30_comment--;
                        if (in_srfi_30_comment < 0) {
                            throw new FoxScheme.Error("Found an extra comment terminator: `|#'")
                        }
                        // Push back the rest substring to input stream.
                        return t.substring(RegExp.$1.length, t.length);
                    } else {
                        return "";
                    }
                } else {
                    if (t.charAt(0) != ';') tokens[tokens.length] = t;
                    return "";
                }
            });
        }
        return tokens;
    },

    sexpCommentMarker: new Object,

    nextObject: function() {
        if(typeof(this.i) === "undefined")
            this.i = 0;
        if(this.i >= this.tokens.length)
            return FoxScheme.Parser.EOS;

        var t = this.tokens[this.i];
        this.i++;
        switch(t) {
            case "(":
            case "[":
                return this.nextList();
            case "#(":
            case "#[":
                return this.nextVector();
            case "'": // convert '... into (quote ...)
                return new FoxScheme.Pair(new FoxScheme.Symbol("quote"),
                                            this.listify(this.nextObject()));
            case "`":
                return new FoxScheme.Pair(new FoxScheme.Symbol("quasiquote"),
                                            this.listify(this.nextObject()));
            case ",":
                return new FoxScheme.Pair(new FoxScheme.Symbol("unquote"),
                                            this.listify(this.nextObject()));
            case "#t":
            case "#T":
                return true;
            case "#f":
            case "#F":
                return false;
            case ".":
            case ")":
            case "]":
                throw new FoxScheme.Error(t+" should not appear outside a list")
                break
            default:
                /*
                 * Could be a number
                 */
                // JavaScript's parseInt("9x") => 9
                if(t.match(/[^0-9.+-e]/) === null) {
                    var n = parseInt(t);
                    if(!isNaN(n))
                        return n;
                }
                /*
                 * Could be a character
                 */
                if(t.substring(0,2) == "#\\")
                    return new FoxScheme.Char(t); // Char will handle parsing the character

                /*
                 * Strings start and end with "
                 */
                if(t.length > 1 &&
                    t[0] == '"' &&
                    t[t.length - 1] == '"')
                    return t.substring(1, t.length - 2);

                /*
                 * Must be a symbol, then.
                 */
                return new FoxScheme.Symbol(t);

                break;
        }
    },

    nextList: function() {
        var list = [];
        /*
         * this.nextObject() increments the token index, so we
         * don't necessarily have to do this.i++
         */
        while(this.i < this.tokens.length) {
            var t = this.tokens[this.i];
            /*
             * Check for the end of the list
             */
            if(t === ")" || t === "]") {
                this.i++;
                return this.listify(list);
            }
            /*
             * Check for improper list
             */
            if(t === ".") {
                this.i++
                var ls = this.listify(list, this.nextObject())
                if(this.tokens[this.i] !== ")" &&
                   this.tokens[this.i] !== "]")
                    throw new FoxScheme.Error("Only one item should follow dot (.)",  "FoxScheme.Parser")

                this.i++
                return ls
            }

            list.push(this.nextObject());
        }
        throw new FoxScheme.Error("Unexpected end of list encountered", "Parser")
    },
    
    nextVector: function() {
        var list = [];
        while(this.i < this.tokens.length) {
            var t = this.tokens[this.i];
            if(t === ")" || t === "]") {
                this.i++;
                return new FoxScheme.Vector(list);
            }
            list.push(this.nextObject());
        }
    }

}; // end of = { ...
// indicates end of source file
FoxScheme.Parser.EOS = new Object();
