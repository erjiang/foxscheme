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
};
FoxScheme.Parser.prototype = function() {
var i = 0;
return {
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
    nextObject: function () {
        var r = this.nextObject0();

        if (r != this.sexpCommentMarker) return r;

        r = this.nextObject();
        if (r == FoxScheme.Parser.EOS) throw new FoxScheme.Error("Readable object not found after S exression comment");

        r = this.nextObject();
        return r;
    },
    arrayToList: function(a) {
        var list = FoxScheme.nil;
        for(var i = a.length - 1; i >= 0; i--) {
            list = new FoxScheme.Pair(a[i], list);
        }
    },

    getList: function (close) {
        var list = FoxScheme.nil,
            prev = list;
        while (this.i < this.tokens.length) {

            this.eatObjectsInSexpComment("Input stream terminated unexpectedly(in list)");

            if (this.tokens[this.i] == ')' || this.tokens[this.i] == ']' || this.tokens[this.i] == '}') {
                this.i++;
                break;
            }

            if (this.tokens[this.i] == '.') {
                this.i++;
                var o = this.nextObject();
                if (o != FoxScheme.Parser.EOS && list != FoxScheme.nil) {
                    prev.cdr = o;
                }
            } else {
                var cur = new FoxScheme.Pair(this.nextObject(), FoxScheme.nil);
                if (list == FoxScheme.nil) list = cur;
                else prev.cdr = cur;
                prev = cur;
            }
        }
        return list;
    },

    getVector: function (close) {
        var arr = new Array();
        while (this.i < this.tokens.length) {

            this.eatObjectsInSexpComment("Input stream terminated unexpectedly(in vector)");

            if (this.tokens[this.i] == ')' || this.tokens[this.i] == ']' || this.tokens[this.i] == '}') {
                this.i++;
                break;
            }
            arr[arr.length] = this.nextObject();
        }
        return arr;
    },

    eatObjectsInSexpComment: function (err_msg) {
        while (this.tokens[this.i] == '#;') {
            this.i++;
            if ((this.nextObject() == FoxScheme.Parser.EOS) || (this.i >= this.tokens.length)) throw new FoxScheme.Error(err_msg);
        }
    },

    nextObject0: function () {
        if (this.i >= this.tokens.length) return FoxScheme.Parser.EOS;

        var t = this.tokens[this.i++];
        // if( t == ')' ) return null;
        if (t == '#;') return this.sexpCommentMarker;

        var s = t == "'" ? 'quote'
              : t == "`" ? 'quasiquote' 
              : t == "," ? 'unquote' 
              : t == ",@" ? 'unquote-splicing' 
              : false;

        if (s || t == '('
              || t == '#(' 
              || t == '[' 
              || t == '#[' 
              || t == '{' 
              || t == '#{') {
            return s ? new FoxScheme.Pair(new FoxScheme.Symbol(s), new FoxScheme.Pair(this.nextObject(), FoxScheme.nil)) : (t == '(' || t == '[' || t == '{') ? this.getList(t) : this.getVector(t);
        } else {
            switch (t) {
            case "+inf.0":
                return Infinity;
            case "-inf.0":
                return -Infinity;
            case "+nan.0":
                return NaN;
            }

            var n;
            if (/^#x[0-9a-z]+$/i.test(t)) { // #x... Hex
                n = new Number('0x' + t.substring(2, t.length));
            } else if (/^#d[0-9\.]+$/i.test(t)) { // #d... Decimal
                n = new Number(t.substring(2, t.length));
            } else {
                n = new Number(t); // use constructor as parser
            }

            if (!isNaN(n)) {
                return n.valueOf();
            } else if (t == '#f' || t == '#F') {
                return false;
            } else if (t == '#t' || t == '#T') {
                return true;
            } else if (t.toLowerCase() == '#\\newline') {
                return FoxScheme.Char.get('\n');
            } else if (t.toLowerCase() == '#\\space') {
                return FoxScheme.Char.get(' ');
            } else if (t.toLowerCase() == '#\\tab') {
                return FoxScheme.Char.get('\t');
            } else if (/^#\\.$/.test(t)) {
                return FoxScheme.Char.get(t.charAt(2));
            } else if (/^\"(\\(.|$)|[^\"\\])*\"?$/.test(t)) {
                return t.replace(/(\r?\n|\\n)/g, "\n").replace(/^\"|\\(.|$)|\"$/g, function ($0, $1) {
                    return $1 ? $1 : '';
                });
            } else
            return new FoxScheme.Symbol(t);
        }
    }
}; // end of return { ...
}();
// indicates end of source file
FoxScheme.Parser.EOS = new Object();
