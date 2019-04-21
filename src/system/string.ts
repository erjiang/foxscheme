import { Error, Bug } from "./error";
import Char from "./char";

/*
 * String
 *
 * FoxScheme uses its own String object so that
 * (eq? "abc" "abc") => #f
 */
export default class String {
    _value: string;
    constructor(str: string) {
        if(typeof(str) === "string")
            this._value = str;
        else
            throw new Bug("Tried to create String from non-string","String");
    }
    length() {
        return this._value.length;
    }
    set(i: number, c: Char) {
        if(!(c instanceof Char))
            throw new Error(c+" is not a Char", "String.set")
        if(i < 0 || i > this._value.length)
            throw new Error("Invalid index "+i, "String.set")
        this._value = this._value.slice(0, i)+ c.getValue() +this._value.slice(i+1)
    }
    get(i: number) {
        if(i < 0 || i > this._value.length)
            throw new Error("Invalid index "+i, "String.get")
        
        return this._value[i]
    }
    getValue() {
        return this._value
    }
    toString() {
        return '"'+this._value+'"'
    }
}
