import { Expr } from "./types";
import Pair from "./pair";
/*
 * Hashtable
 *
 * This hash table implements the R6RS hashtables, as opposed to hash.js which
 * is only used internally by 
 */
export default class Hashtable {
  _store: { [key: string]: Pair[] };
  constructor() {
    this._store = {};
  }

  clear() {
    this._store = {};
  }
  
  get(k: Expr) {
    var ks = k.toString()
    var lookup
    if((lookup = this._store[ks]) !== undefined) {
      var i = lookup.length
      while(i--) {
        if(lookup[i].car() === k) {
          return lookup[i].cdr()
        }
      }
    }
    return null
  }

  set(k: Expr, v: Expr) {
    var ks = k.toString()
    var lookup
    if((lookup = this._store[ks]) !== undefined) {
      var i = lookup.length
      while(i--) {
        if(lookup[i].car() === k) {
          return lookup[i].setCdr(v)
        }
      }
      // not found, make new entry
      lookup.push(new Pair(k, v))
    }
    else {
      this._store[ks] = ([new Pair(k, v)])
    }
    return v
  }

  remove (k: Expr) {
    var ks = k.toString()
    var v = this._store[ks]
    delete this._store[ks]
    return v
  }
}
