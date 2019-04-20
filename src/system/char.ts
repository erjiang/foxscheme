import { Error } from "./error";
/*
 * FoxScheme.Char
 *
 * A character object containing a single Unicode character.
 */
export default class Char {
    charString: string[] = [ // the first 128 characters
        "nul", "soh", "stx", "etx", "eot", "enq", "ack", "bel", "bs", "ht",
        "lf", "vt", "ff", "cr", "so", "si", "dle", "dc1", "dc2", "dc3", "dc4",
        "nak", "syn", "etb", "can", "em", "sub", "esc", "fs", "gs", "rs", "us",
        "space", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ", ",
        "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":",
        ";", "<", "=", ">", "?", "@", "A", "B", "C", "D", "E", "F", "G", "H",
        "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
        "W", "X", "Y", "Z", "[", "\\", "]", "^", "_", "`", "a", "b", "c", "d",
        "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r",
        "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~", "del"];
    _char: string;
    constructor(c: string) {
        let oc = c; // keep original value for error messages
        this._char = "invalid";
        if (typeof (c) === "string") {
            if (c.length == 1)
                this._char = c;
            /*
             * accept Scheme-formatted characters to simplify parser
             */
            else if (c.length > 2 && c[0] == "#" && c[1] == "\\") {
                var resolved = false;
                c = c.substring(2); // cut off the #\
                /*
                 * See if it's in our ASCII table
                 */
                var i = this.charString.length;
                while (i--) {
                    if (this.charString[i] == c) {
                        this._char = String.fromCharCode(i);
                        resolved = true;
                    }
                }
                if (!resolved) {
                    /*
                     * Attempt to parse hex char code #\xABCD
                     */
                    if (c[0] === "x") {
                        c = c.substring(1);
                        this._char = String.fromCharCode(parseInt(c, 16));
                        resolved = true;
                    }
                    else
                        throw new Error("Invalid character " + oc);
                }
                if (!resolved)
                    throw new Error("Could not understand character " + oc);
            }
            else
                throw new Error("Char() given string \"" + c + "\"");
        }
        else if (typeof (c) === "number")
            this._char = String.fromCharCode(c);
        else
            throw new Error("Char() given object typed " + typeof (c));
    }
    toInteger(c?: string): number {
        // allow this to be used statically
        if (c !== undefined) return (new Char(c)).toInteger();
        return this._char.charCodeAt(0);
    }
    toString() {
        var x = this.toInteger();
        if (x < 128) return "#\\" + this.charString[x];
        else return "#\\x" + x.toString(16);
    }
    getValue() {
        return this._char;
    }
}

