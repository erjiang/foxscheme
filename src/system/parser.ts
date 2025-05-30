/*
 * Parser
 *
 * Copied from BiwaScheme/src/parser.js.
 * This takes a string representing an Sexp and converts it
 * into internal FoxScheme data.
 *
 * Usage:
 *   p = new $fs.Parser
 *   while((o = p.nextObject()) !== null)
 *      eval(o)
 *
 * TODO: Rescope this to allow better minification.
 */
import * as Util from "./util";
import Char from "./char";
import Gensym from "./gensym";
import Pair from "./pair";
import Symbol from "./symbol";
import Vector from "./vector";
import String from "./string";
import { Error } from "./error";
import { Expr } from "./types";

class EOS { }

//
// Parser
// copied from jsScheme - should be rewrriten (support #0=, etc)
//
export default class Parser {
  i: number;
  tokens: string[];
  static EOS = new EOS();
  constructor(txt: string) {
    this.tokens = this.tokenize(txt);
    this.i = 0;
  }
  // given a fragment of scheme code, calculate the number of spaces to indent
  // the next line. If the code is a complete expression (number of parens are
  // balanced) then this should return 0.
  static calculateIndentation(fragment: string): number {
    let parens = 0;
    let inString = false;
    let column = 2; // start with 2 to account for prompt
    let leftParensColumns = [];
    for (var i = 0; i < fragment.length; i++) {
      const ch = fragment[i];
      switch (ch) {
        case '"':
          inString = !inString;
          column++;
          break;
        case "(":
          if (!inString) {
            parens++;
            leftParensColumns.push(column);
          }
          column++;
          break;
        case ")":
          if (!inString) {
            parens--;
            leftParensColumns.pop();
          }
          column++;
          break;
        case "\n":
          column = 0;
          break;
        default:
          column++;
      }
    }
    if (leftParensColumns.length > 0) {
      // indent by two
      // @ts-ignore: we already checked that leftParensColumns is not empty
      return leftParensColumns.pop() + 2;
    } else {
      return 0;
    }
  }
  inspect() {
    return `#<Parser:${this.i}/${this.tokens.length} ${this.tokens.toString()}>`;
  }
  tokenize(txt: string) {
    let tokens: string[] = [];
    let oldTxt: string | null = null;
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
              throw new Error("Found an extra comment terminator: `|#'")
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
  }
  nextObject(): Expr | EOS {
    if (this.i === undefined)
      this.i = 0;
    if (this.i >= this.tokens.length)
      return Parser.EOS;

    var t = this.tokens[this.i];
    this.i++;
    switch (t) {
      case "(":
      case "[":
        return this.nextList();
      case "#(":
      case "#[":
        return this.nextVector();
      case "#{":
        if (this.tokens[this.i + 2] !== "}") {
          throw new Error("Invalid gensym literal: #{" +
            this.tokens[this.i] + " " + this.tokens[this.i + 1] +
            this.tokens[this.i + 2])
        }
        var r = new Gensym(this.tokens[this.i],
          this.tokens[this.i + 1])
        this.i += 3
        return r;
      case "'": // convert '... into (quote ...)
        return new Pair(new Symbol("quote"),
          Util.listify(this.nextObject()));
      case "`":
        return new Pair(new Symbol("quasiquote"),
          Util.listify(this.nextObject()));
      case ",":
        return new Pair(new Symbol("unquote"),
          Util.listify(this.nextObject()));
      case "#t":
      case "#T":
        return true;
      case "#f":
      case "#F":
        return false;
      case ".":
      case ")":
      case "]":
        throw new Error(t + " should not appear outside a list")
        break
      default:
        /*
         * Could be a number
         */
        // JavaScript's parseInt("9x") => 9
        if (t.match(/[^0-9.+-e]/) === null) {
          /*
           * Could be a rational, which we'll convert to a float
           * anyways
           * TODO: treat as rational numbers
           */
          let rational: RegExpMatchArray | null;
          if ((rational = t.match(/^([0-9-]+)\/([0-9]+)$/)) !== null) {
            // type coerce those strings!
            return parseInt(rational[1]) / parseInt(rational[2]);
          }
          /*
           * Not a rational, just parse it like normal
           * Note that this differs from Chez Scheme in that
           * parseFloat is sloppy about accepting input. Examples:
           *
           *     chez> 12/48-
           *     Exception: variable \x31;2/48- is not bound
           *
           *     js> parseFloat("12/48-")
           *     12
           *
           * TODO: Better sanitize numbers
           */
          var n = parseFloat(t);
          if (!isNaN(n))
            return n;
        }
        /*
         * Could be a character
         */
        if (t.substring(0, 2) == "#\\")
          return new Char(t); // Char will handle parsing the character

        /*
         * Strings start and end with "
         * We use our own String so that
             (eq? (make-string 3) (make-string 3)) => #f
         *   and so we can override toString()
         */
        if (t.length > 1 &&
          t[0] == '"' &&
          t[t.length - 1] == '"') {

          t = t.replace(/\\(.)/, "$1")
          // can't substring the empty string
          return t === '""' ? new String("") :
            new String(t.substring(1, t.length - 1));
        }

        /*
         * Must be a symbol, then.
         */
        return new Symbol(t);
    }
  }

  nextList() {
    var list = [];
    /*
     * this.nextObject() increments the token index, so we
     * don't necessarily have to do this.i++
     */
    while (this.i < this.tokens.length) {
      var t = this.tokens[this.i];
      /*
       * Check for the end of the list
       */
      if (t === ")" || t === "]") {
        this.i++;
        return Util.listify(list);
      }
      /*
       * Check for improper list
       */
      if (t === ".") {
        this.i++
        var ls = Util.listify(list, this.nextObject())
        if (this.tokens[this.i] !== ")" &&
          this.tokens[this.i] !== "]")
          throw new Error("Only one item should follow dot (.)");

        this.i++
        return ls
      }

      list.push(this.nextObject());
    }
    throw new Error("Unexpected end of list encountered");
  }

  nextVector() {
    var list = [];
    while (this.i < this.tokens.length) {
      var t = this.tokens[this.i];
      if (t === ")" || t === "]") {
        this.i++;
        return new Vector(list);
      }
      list.push(this.nextObject());
    }
    throw new Error("Expected end of vector but got EOF instead");
  }
}
