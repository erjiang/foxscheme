//
// test/unit.js - unit tests of BiwaScheme
//
// This file is utf-8
// このファイルはUTF-8です

var interp = new $fs.Interpreter()
var evto = function(expr, test) {
    var p = new $fs.Parser(expr)
    var e = p.nextObject()
    var r;
    try {
        r = interp.eval(e)
    } catch (e) {
        throw new Error(["Got error \"", e, "\" while evaluating ", expr].join(""))
    }
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
var assert_true = function(bool) {
    if(bool !== true)
        throw new Error("Assertion failed: Got "+bool+" but expected true")
}
var assert_equals = function(a, b) {
    if(a !== b)
        throw new Error("Assertion failed: Expected "+b+" but got "+a)
}
var assert_instanceof = function(a, b) {
    if(!(a instanceof b))
        throw new Error("Assertion failed: "+a+" is not an instanceof "+b)
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

describe('Parser', {
    "Cramped decimal": function() {
        evto("'(2.())", function(x) {
            assert_instanceof(x, FoxScheme.Pair)
            assert_equals(x.car(), 2)
            assert_equals(x.cdr().car(), FoxScheme.nil)
            return true;
        })
    },
    "Cramped nils": function () {
        evto("'(().())", function(x) {
            assert_instanceof(x, FoxScheme.Pair)
            assert_equals(x.car(), FoxScheme.nil)
            assert_equals(x.cdr(), FoxScheme.nil)
            return true;
        })
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
    },
    Booleans: function() {
        evto("#t", true)
        evto("#T", true)
        evto("#f", false)
        evto("#F", false)
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
    nil: function() {
        evto("'()", FoxScheme.nil)
    },
    cons: function() {
        evto('(cons 1 2)', function(x) { return x instanceof FoxScheme.Pair })
        should_error('(cons 1)')
        should_error('(cons 3 4 5)')
    },
    car: function() {
        evto("(car '(1 . 2))", 1)
        evto("(car (cons 5 6))", 5)
        evto("(car (car (car (cons (cons (cons 5 7) 4) 2))))", 5)
        evto("(car (cons '() 5))", FoxScheme.nil)
        should_error('(car 3)')
    },
    cdr: function() {
        evto("(cdr '(1 . 3))", 3)
        evto("(cdr '(1))", FoxScheme.nil)
        evto("(cdr (car '((1 . 3) 5)))", 3)
        should_error("(cdr 5)")
        should_error("(cdr (cdr '(5)))")
    },
    'pair?': function() {
        evto("(pair? (cons 4 5))", true)
        evto("(pair? '())", false)
        evto("(pair? 5)", false)
        evto("(pair? (car (cons '() 5)))", false)
    },
    pairs: function() {
        evto("(car (cdr '(4 5 6)))", 5)
        evto("(car (cdr (car '((1 5) 2))))", 5)
        evto("((car (cdr (cons car (cons cdr '())))) (cons 5 6))", 6)
    }
})

describe('Lambdas', {
    'listify params': function () {
        evto("((lambda x (car x)) 1 2 3)", 1)
        evto("((lambda x (car (cdr x))) 1 2 3)", 2)
        evto("((lambda x x))", FoxScheme.nil)
        evto("((lambda x (car x)) 1)", 1)
        evto("((lambda x (cdr x)) 1)", FoxScheme.nil)
    },
    'list of params': function () {
        evto("((lambda (a b c) c) 1 2 3)", 3)
        evto("((lambda (x) x) 5)", 5)
        evto("((lambda (a b c) (cdr b)) 1 '(2 . 3) 5)", 3)
    },
    'no params': function () {
        evto("((lambda () 5))", 5)
    },
    'improper params': function () {
        evto("((lambda (a b . c) (car c)) 1 2 5)", 5)
        evto("((lambda (a b . c) b) 1 5 2)", 5)
    },
    'nested lambdas': function () {
        // the inner x should shadow the outer x
        evto(" ((lambda (x) ((lambda (x) x) 5) ) 2) ", 5)
        evto(" ((lambda x ((lambda y (car (car y))) (car (cdr x))))  1 '(5 . 6) 4 2) ", 5)
    }
})

describe("if", {
    "Basic if": function() {
        evto("(if #t 5 1)", 5)
        evto("(if #f 1 5)", 5)
    },
    "One-armed if": function() {
        evto("(if #f 1)", FoxScheme.void)
        evto("(if #t 5)", 5)
    },
    Truthy: function () {
        evto("(if 3 5 1)", 5)
        evto("(if '() 5 1)", 5)
    }
})
