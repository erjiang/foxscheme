//
// test/unit.js - unit tests of BiwaScheme
//
// This file is utf-8
// このファイルはUTF-8です

var interp = new $fs.Interpreter()
var evto = function(expr, test) {
    var p = new $fs.Parser(expr)
    var e = p.nextObject()
    var r = interp.eval(e)
    if(test instanceof Function) {
        if(!test(r))
            throw new Error("Value "+r+" did not pass test")
    }
    else if(r != test)
        throw new Error("Expected "+test+" but got "+r)
}
var should_error = function(expr) {
    if(expr instanceof Function) {
        try{
            expr()
        } catch (e) {
            if(e instanceof FoxScheme.Error)
                return true;
            else
                throw new Error("Error was not type FoxScheme.Error")
        }
        throw new Error("Should have gotten an error!")
    }
    else {
        var p = new $fs.Parser(expr)
        try {
            interp.eval(p.nextObject())
        } catch (e) {
            if(e instanceof FoxScheme.Error)
                return true;
            else
                throw e
        }
        throw new Error(expr+" should have evaluated to an error")
    }
}

/*********** U N I T  T E S T S *************/

/*
 * Tests some invalid input that the PARSER should NOT accept
 */
describe('Unparseable', {
    'Improper improper lists': function() {
        var parse_error = function(txt) {
            var p = new $fs.Parser(txt)
            try {
                p.nextObject()
            }
            catch (e) {
                if(e instanceof FoxScheme.Error)
                    return true
                else
                    throw e
            }
            throw new Error(txt+" did not throw an error!")
        }
        parse_error("(1 2 . 3 4)") // improper list
        parse_error("(1 2 3")      // unfinished list
        parse_error(")")   // end list
    }
})

/*
 * Test basic fuctionality for understanding literals
 */
describe('Simple literals', {
    Numbers: function() {
        evto('2', 2)
        evto('-5', -5)
    },
    Characters: function() {
        evto('#\\a', function(a) {
            return ((a instanceof FoxScheme.Char) &&
                    (a.getValue() == "a"))
        })
    }
})

/*
 * Tests using the arithmetic functions implemented natively.
 * There are some interesting cases to watch out for, such as:
 *      (- 5) => 5      ;; negation
 *      (/ 5) => 1/5    ;; reciprocal
 *      (+)   => 0      ;; additive identity
 *      (*)   => 1      ;; multiplicative identity
 */
describe('Native arithmetic', {
    'Boolean': function() {
        evto('(+ 2 2)', 4)
        evto('(+ 5 -2)', 3)
        evto('(* 3 5)', 15)
        evto('(/ 15 3)', 5)
    },
    'Thunks': function() {
        evto('(+)', 0)
        evto('(*)', 1)
    },
    'Multi + and *': function() {
        evto('(+ 1 2 3 4 5)', 15)
        evto('(* 1 2 6 3)', 36)
    },
    'Multi - and /': function() {
        evto('(- 10 1 2 3)', 4)
        evto('(/ 24 2 3 1)', 4)
    },
    'Singletons': function() {
        evto('(+ 5)', 5)
        evto('(- 5)', -5)
        evto('(- -5)', 5)
        evto('(* -5)', -5)
        evto('(* 3)', 3)
        evto('(/ 10)', 0.1)
        evto('(/ 5)', 0.2)
    }
})

/*
 * Tests the basic native pair functions
 */
describe('Pairs', {
    'cons': function() {
        evto('(cons 1 2)', function(x) { return x instanceof FoxScheme.Pair })
        should_error('(cons 1)')
        should_error('(cons 3 4 5)')
    }
})
