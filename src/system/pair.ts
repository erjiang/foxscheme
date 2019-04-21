/*
 * Pair
 *
 */
import { Expr } from "./types";
import { Bug } from "./error";
import nil from "./nil";

// TODO: can we genericize Pair? Pair<Tu, Tv>?
export default class Pair {
    _car: Expr;
    _cdr: Expr;
    constructor(car: Expr, cdr: Expr) {
        this._car = car;
        this._cdr = cdr;
    }
    car() {
        return this._car;
    }
    setCar(v: Expr) {
        var r = this._car
        this._car = v
        return r
    }
    setCdr(v: Expr) {
        var r = this._cdr
        this._cdr = v
        return r
    }
    cdr() {
        return this._cdr;
    }
    toString(): string {
        /*
         * Recursively print out the list, if (pair? (cdr this))
         */
        if(this._cdr instanceof Pair) {
            return "("+this._car.toString()
                +" "+this._cdr.toString().substring(1);
        }
        // @ts-ignore: _cdr COULD BE nil if Expr = Pair | nil
        else if(this._cdr === nil) {
            return "("+this._car.toString()+")";
        }
        else {
            return "("+this._car.toString()
                +" . "+this._cdr.toString()+")";
        }
    }
    /*
     * Some utility functions for use internally by FoxScheme
     */
    isProper(): boolean {
        // @ts-ignore: Expr could be Pair | nil
        if(this._cdr === nil)
            return true
        else if(this._cdr instanceof Pair)
            return this._cdr.isProper()
        else
            return false
    }
    first() {
        return this.car();
    }
    second() {
        // @ts-ignore: This is inherently unsafe
        return (<Pair>this.cdr()).car();
    }
    third() {
        // @ts-ignore: This is inherently unsafe
        return (<Pair>(<Pair>this.cdr()).cdr()).car();
    }
    fourth() {
        // @ts-ignore: This is inherently unsafe
        return (<Pair>(<Pair>(<Pair>this.cdr()).cdr()).cdr()).car();
    }
    last(): Expr {
        // @ts-ignore: Expr could be Pair | nil
        if(this._cdr === nil) {
            return this._car
        }
        else
            if(this._cdr instanceof Pair)
                return this._cdr.last()
            else
                throw new Bug("Can't get last of improper list", "Pair.last")
    }
    length(): number {
        var acc = 0;
        var cursor: Pair | nil = this;
        while(cursor !== nil) {
            acc += 1;
            if(!(cursor instanceof Pair)) // improper list
                throw new Bug("Improper list "+this, "Pair.length()");
            cursor = cursor._cdr
        }
        return acc
    }
};
