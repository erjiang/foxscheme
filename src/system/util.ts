/*
 * Util
 *
 * Useful stuff for converting an array to a list and back and stuff.
 */

import { Expr, List } from "./types";
import { Bug } from "./error";
import nil from "./nil";
import Pair from "./pair";

/*
  * Listify converts an array into a FoxScheme list
  */
export function listify(arg: Expr | Expr[], end?: Expr): List {
  /*
    * "end" allows us to override what goes at the
    * end of the list (the empty list by default)
    */
  let list: Expr;
  if(end === undefined) {
    list = nil;
  } else {
    list = end;
  }
  /*
    * Build a list out of an Array
    */
  if(arg instanceof Array) {
    var i = arg.length;
    while(i--) {
      list = new Pair(arg[i], list);
    }
  }
  else
    list = new Pair(arg, list);

  return list;
}
/*
  * Arrayify can convert both FoxScheme lists
  * and arguments "arrays" into arrays
  */
export function arrayify(list: Pair | nil | Iterable<any>) {
  var ls = []
  /*
    * Converts a FoxScheme list into an array by
    * walking the list
    */
  if(list instanceof Pair ||
      list instanceof nil) {
    while(list instanceof Pair) {
      ls.push(list.car())
      list = list.cdr()
    }
    /*
      * Check if last item is improper (not nil)
      * This means that '(1 2 . 3) => [1, 2, 3] !!
      * Careful!
      */
    if(!(list === nil)) {
      ls.push(list)
    }
    return ls;
  }
  /*
    * Converts arguments into an array
    */
  else {
    return [...list];
  }
}
  /*
    * Map a function to a list
    */
function map(func: (arg0: any) => any, ls: Pair | nil) {
  if (!(ls instanceof Pair))
    throw new Bug("Attempt to map on non-list " + ls, "Util.map");
  if (!ls.isProper())
    throw new Bug("Attempt to map on improper list " + ls, "Util.map");

  let arr = arrayify(ls);
  var i = arr.length;
  while (i--) {
    arr[i] = func(arr[i])
  }
  return listify(arr);
}
