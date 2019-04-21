import { Expr } from "./types";
import { Bug } from "./error";
///////////////////////////////////////////
//
// Values (multiple values) containers
//
///////////////////////////////////////////

export default class Values {
  values: Expr[];
  constructor(vals: Expr[]) {
    if (vals.length === 1) {
      throw new Bug("Multiple values created with only one value.");
    }
    if (vals.length === 0) {
      throw new Bug("Multiple values created with no values.");
    }
    this.values = vals;
  }
  toString() {
    return this.values.join("\n");
  }
}