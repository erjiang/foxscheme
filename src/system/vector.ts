import { Error } from "./error";
import { Expr } from "./types";

export default class Vector {
  _array: Expr[];
  constructor(elements?: Expr[]) {
    this._array = [];
    /*
     * Allow vector to be created from an existing JS array
     */
    if (elements !== undefined) {
      if (elements instanceof Array || 'length' in elements) {
        var i = elements.length
        while (i--) {
          this._array[i] = elements[i];
        }
      }
      else {
        throw new Error("Vector constructor given non-array");
      }
    }
  }
  toString() {
    return "#(" + this._array.join(" ") + ")";
  }
  length() {
    return this._array.length;
  }
  set(i: number, el: Expr) {
    if (i < 0 || i >= this._array.length)
      throw new Error("Invalid vector index " + i)

    return this._array[i] = el;
  }
  get(i: number) {
    if (i < 0 || i >= this._array.length)
      throw new Error("Invalid vector index " + i)

    return this._array[i];
  }
};
