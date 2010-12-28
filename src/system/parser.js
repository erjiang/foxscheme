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
                                            FoxScheme.Util.listify(this.nextObject()));
            case "`":
                return new FoxScheme.Pair(new FoxScheme.Symbol("quasiquote"),
                                            FoxScheme.Util.listify(this.nextObject()));
            case ",":
                return new FoxScheme.Pair(new FoxScheme.Symbol("unquote"),
                                            FoxScheme.Util.listify(this.nextObject()));
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
                 * We use our own FoxScheme.String so that
                     (eq? (make-string 3) (make-string 3)) => #f
                 *   and so we can override toString()
                 */
                if(t.length > 1 &&
                    t[0] == '"' &&
                    t[t.length - 1] == '"')
                    // can't substring the empty string
                    return t === '""' ? new FoxScheme.String("") : 
                            new FoxScheme.String(t.substring(1, t.length - 1));

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
                return FoxScheme.Util.listify(list);
            }
            /*
             * Check for improper list
             */
            if(t === ".") {
                this.i++
                var ls = FoxScheme.Util.listify(list, this.nextObject())
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
