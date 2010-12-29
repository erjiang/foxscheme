/*
 * FoxScheme.Util
 *
 * Useful stuff for converting an array to a list and back and stuff.
 */
FoxScheme.Util = {
  /*
   * Listify converts an array into a FoxScheme list
   */
  listify: function(arg, end) {
    /*
     * "end" allows us to override what goes at the
     * end of the list (the empty list by default)
     */
    var list = end;
    if(end === undefined)
      list = FoxScheme.nil;
    /*
     * Build a list out of an Array
     */
    if(arg instanceof Array || 
        /*
         * We need to be able to listify arguments, even though arguments is
         * not an Array, which we catch by checking for the length property.
         * Unfortunately, this was a bug because FoxScheme.Pair has method
         * "length" too, so manually exclude Pairs
         * TODO: See if there's a better way to check if arguments
         */
        (arg.length !== undefined &&
         !(arg instanceof FoxScheme.Pair) &&
         !(arg instanceof FoxScheme.Vector))) {
      var i = arg.length;
      while(i--) {
        list = new FoxScheme.Pair(arg[i], list);
      }
    }
    else
      list = new FoxScheme.Pair(arg, list);

    return list;
  }
  /*
   * Arrayify can convert both FoxScheme lists
   * and arguments "arrays" into arrays
   */
  ,
  arrayify: function(list) {
    var ls = []
    /*
     * Converts a FoxScheme list into an array by
     * walking the list
     */
    if(list instanceof FoxScheme.Pair ||
       list === FoxScheme.nil) {
      while(list instanceof FoxScheme.Pair) {
        ls.push(list.car())
        list = list.cdr()
      }
      /*
       * Check if last item is improper (not nil)
       * This means that '(1 2 . 3) => [1, 2, 3] !!
       * Careful!
       */
      if(!(list === FoxScheme.nil))
        ls.push(list)
    }
    /*
     * Converts arguments into an array
     */
    else {
      var i = list.length
      while(i--)
        ls[i] = list[i]
    }
    return ls;
  }
    /*
     * Map a function to a list
     */
    ,
    map: function(func, ls) {
        if(!(ls instanceof FoxScheme.Pair))
            throw new FoxScheme.Bug("Attempt to map on non-list "+ls)
        if(!ls.isProper())
            throw new FoxScheme.Bug("Attempt to map on improper list "+ls)

        var arr = FoxScheme.Util.arrayify(ls)
        var i = arr.length
        while(i--) {
            arr[i] = func(arr[i])
        }
        return FoxScheme.Util.listify(arr)
    }
}

