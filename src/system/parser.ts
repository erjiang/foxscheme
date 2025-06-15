import generated from './parser.generated';
import { Expr } from './types';
import { Error } from './error';

class EOS {}

export default class Parser {
  static EOS = new EOS();
  private exprs: Expr[];
  private i: number;
  private error: Error | null;

  constructor(txt: string) {
    try {
      this.exprs = generated.parse(txt) as Expr[];
      this.error = null;
    } catch (e) {
      this.exprs = [];
      const loc = (e as any).location?.start;
      if (loc) {
        this.error = new Error(`${(e as Error).message} at line ${loc.line} column ${loc.column}`);
      } else {
        this.error = new Error((e as Error).message);
      }
    }
    this.i = 0;
  }

  static calculateIndentation(fragment: string): number {
    let parens = 0;
    let inString = false;
    let column = 2; // start with 2 to account for prompt
    let leftParensColumns: number[] = [];
    for (var i = 0; i < fragment.length; i++) {
      const ch = fragment[i];
      switch (ch) {
        case '"': {
          // handle escaped quotes inside strings
          let backslashCount = 0;
          for (let j = i - 1; j >= 0 && fragment[j] === '\\'; j--) {
            backslashCount++;
          }
          if (backslashCount % 2 === 0) {
            inString = !inString;
          }
          column++;
          break;
        }
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
        case '\n':
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

  nextObject(): Expr | EOS {
    if (this.error) {
      const err = this.error;
      this.error = null;
      throw err;
    }
    if (this.i >= this.exprs.length) return Parser.EOS;
    return this.exprs[this.i++];
  }

  inspect() {
    return `#<Parser:${this.i}/${this.exprs.length}>`;
  }
}
