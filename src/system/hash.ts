import { Expr } from "./types";
/*
 * Hash
 *
 * A simple hash implementation that takes advantage of JS native object
 * properties.
 *
 * This is used to represent the environments (symbol->value mappings)
 * in the Interpreter, so it includes facilities for chaining
 * environments:
 *
 * env = new $fs.Hash()
 * newenv = env.extend()
 * newerenv = newenv.extend()
 *
 * These hashes are chained like this:
 *   newerenv -> newenv -> env
 *
 * newerenv.get("x") will search up the chain until it finds a binding
 * for "x".  Note that the set() method *does not* go up the chain, and
 * will always affect the outermost hash.  This may shadow bindings
 * further up the chain.
 * 
 * If the key is not found, undefined is returned.
 *
 */
export default class Hash {
  /*
    * We can optionally initialize this hash with another hash,
    * and the new Hash will be changed to the given Hash.  Then,
    * if this hash looks up something and cannot find it, it will
    * ask the chained hash, which asks its chained hash, and so
    * on.  This means searches search up the hash chain.
    */
  _store: { [id: string]: Expr };
  _next: Hash | undefined;
  constructor(next?: Hash) {
    this._store = {};
    this._next = next;
  }
  chainGet(key: string): Expr | undefined {
    if (this._store.hasOwnProperty(key)) {
      return this._store[key];
    } else if (this._next !== undefined) {
      return this._next.chainGet(key);
    }
  }
  get(key: string) {
    if (this._store.hasOwnProperty(key)) {
      return this._store[key];
    }
  }
  chainSet(key: string, value: Expr): void {
    if(this.get(key) !== undefined) {
      this.set(key, value);
    }
    else {
      if(this._next !== undefined) {
        this._next.chainSet(key, value);
      } else {
        this._store[key] = value;
      }
    }
  }
  set(key: string, value: Expr): void {
    this._store[key] = value;
  }
  unset(key: string) {
    var val = this._store[key];
    delete this._store[key];
    return val;
  }
  toString() {
    return "#<SystemHash>"
  }
  clone() {
    var c = new Hash();
    for(var k in this._store) {
      c.set(k, this._store[k]);
    }
    return c;
  }
  /*
    * The extend method is a shortcut for initializing a new Hash
    * with this Hash
    */
  extend() {
    return new Hash(this);
  }
}
