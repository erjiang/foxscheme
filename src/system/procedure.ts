import Interpreter from "./interpreter";
import { Expr } from "./types";
import { Error } from "./error";
/*
 * Procedure
 * A general, inheritable class that outlines what a Procedure should do.
 * So named as to not be confused with JS's function keyword.
 *
 * Consider this a virtual class, as we don't want to add any costly init
 * code that will be run whenever it is subclassed.
 */

export abstract class Procedure {
  abstract fapply(interp: Interpreter, ls: Expr[]): Expr;
  toString() {
    return "#<Procedure>";
  }
}
/*
 *
 * This file provides methods for creating native JavaScript functions
 * for use by Interpreter
 */

export type ProcedureFunction = (this: Interpreter, ...args: any) => Expr;

export class NativeProcedure extends Procedure {
  /*
   * To create a function, pass a function in as a_proc,
   * and optionally specify the arity, and an optional
   * max arity.
   *
   * For example: cons, 2
   * because cons takes only two arguments.
   */
  proc: ProcedureFunction;
  arity: number | null;
  maxarity: number | null;
  name: string;
  constructor(
    a_proc: ProcedureFunction,
    a_name: string,
    a_arity: number | undefined,
    a_maxarity: number | undefined) {

    super();

    this.proc = a_proc
    // XXX: shouldn't this.arity always be 0 or higher?
    if (a_arity === undefined) {
      this.arity = null;
    } else {
      this.arity = a_arity
    }
    if (a_maxarity === undefined) {
      this.maxarity = null;
    } else {
      this.maxarity = a_maxarity;
    }
    this.name = a_name
    if (typeof (a_name) === "undefined")
      this.name = "unnamed";
  }
  fapply(interp: Interpreter, ls: Expr[]) {
    /*
 * Check for invalid number of params
 */
    if(this.arity !== null) {
      if(ls.length < this.arity) {
        throw new Error(["Needed ",this.arity," parameters but only got ",ls.length].join(""), 
          this.toString());
      }
      else if (!(this.maxarity === null) && this.maxarity !== -1) {
        if (ls.length > this.maxarity) {
          throw new Error(["Could only take at most ", this.maxarity,
            " parameters but got ", ls.length].join(""),
            this.toString());
        }
      }
    }
    /*
     * Do the actual procedure application here.
     * Let 'this' be the calling interpreter.
     */
    return this.proc.apply(interp, ls);
  }
  toString() {
    if(this.name === null)
      return "#<NativeProcedure>";
    return `#<NativeProcedure ${this.name}>`;
  }
}

/*
 * InterpretedProcedure
 * A prototype for lambdas. 
 */
export class InterpretedProcedure extends Procedure {
   
  //interpreter // XXX: Where is this used?
  /*
   * To create a function, pass a function in as a_proc,
   * and optionally specify the arity, and a boolean for whether
   * extra arguments arer passed in as a list.
   *
   * When fapply is called, it will call the procedure it was initialized
   * with, passing it all of fapply's arguments.
   *
   * For example: cons, 2
   * because cons takes only two arguments.
   */
  proc: ProcedureFunction;
  arity: number;
  // are arguments passed in as a list?
  improper: boolean;
  constructor(a_proc: ProcedureFunction, a_arity: number, a_improper = false) {
    super();
    this.proc = a_proc;
    this.arity = a_arity
    if(typeof(a_arity) === "undefined")
      this.arity = 0;
    this.improper = a_improper;
  }
  fapply(interp: Interpreter, ls: Expr[]) {
    /*
     * Check for invalid number of params
     */
    if(this.improper === true) {
      if(ls.length < this.arity)
        throw new Error(["Needed at least ",this.arity,
                       " parameters but only got ",ls.length].join(""), 
                      this.toString())
    }
    else {
      if(ls.length < this.arity) {
        throw new Error(
          `Needed ${this.arity} parameters but only got ${ls.length}`,
          this.toString())
      }
      else if (ls.length > this.arity) {
        throw new Error(
          `Could only take at most ${this.arity} parameters but got ${ls.length}`, 
          this.toString());
      }
    }
    /*
     * Do the actual procedure application here.
     */
    return this.proc.apply(interp, ls);
  }
  toString() {
    return "#<InterpretedProcedure>";
  }
}
