// @ts-ignore
import 'mocha';
//
// test/unit.js - unit tests of FoxScheme
//
// This file is utf-8
// このファイルはUTF-8です

import * as $fs from "../src/foxscheme";
import fs from 'fs';
import path from 'path';
import '../src/shim/node';
let FoxScheme = $fs;

var evto = function (expr, test) {
  var interp = new $fs.Interpreter()
  var e, p, r
  if (typeof (expr) === "string") {
    p = new $fs.Parser(expr)
    e = p.nextObject()
  } else {
    e = expr
  }

  r = interp.eval(e)

  if (test instanceof Function) {
    if (!test(r))
      throw new Error("Value " + r + " did not pass test")
  }
  else if (r instanceof FoxScheme.String ||
    r instanceof FoxScheme.Char) {
    if (r.getValue() != test)
      throw new Error("Expected " + test + " but got " + r.getValue() + " for " + expr)
  }
  else if (r != test) {
    throw new Error("Expected " + test + " but got " + r + " for " + expr)
  }
  return true;
}
var should_error = function (expr) {
  var interp = new $fs.Interpreter()
  if (expr instanceof Function) {
    try {
      expr()
    } catch (e) {
      if (e instanceof FoxScheme.Error)
        return true;
      else
        throw new Error("Error was not type FoxScheme.Error")
    }
    throw new Error("Should have gotten an error!")
  }
  else {
    var p = new $fs.Parser(expr)
    var r;
    try {
      r = interp.eval(p.nextObject())
    } catch (e) {
      if (e instanceof FoxScheme.Error)
        return true;
      else
        throw e
    }
    throw new Error(expr + " should have evaluated to an error, " +
      "but we got " + r + " instead")
  }
}
var should_error_message = function(expr, substr) {
  var interp = new $fs.Interpreter();
  var p = new $fs.Parser(expr);
  try {
    interp.eval(p.nextObject());
  } catch (e) {
    if (e instanceof FoxScheme.Error) {
      if (e.message.indexOf(substr) === -1) {
        throw new Error("Error message '" + e.message + "' does not contain '" + substr + "'");
      }
      return true;
    }
    throw e;
  }
  throw new Error(expr + " should have evaluated to an error");
}
var assert_true = function (bool) {
  if (bool !== true)
    throw new Error("Assertion failed: Got " + bool + " but expected true")
}
var assert_equals = function (a, b) {
  if (a !== b)
    throw new Error("Assertion failed: Expected " + b + " but got " + a)
}
var assert_instanceof = function (a, b) {
  if (!(a instanceof b))
    throw new Error("Assertion failed: " + a + " is not an instanceof " + b)
}

/*********** U N I T  T E S T S *************/

/*
 * Tests some invalid input that the PARSER should NOT accept
 */
describe('Unparseable', function () {
  it('Improper improper lists', function () {
    var parse_error = function (txt) {
      var p = new $fs.Parser(txt)
      try {
        p.nextObject()
      }
      catch (e) {
        if (e instanceof FoxScheme.Error)
          return true
        else
          throw e
      }
      throw new Error(txt + " did not throw an error!")
    }
    parse_error("(1 2 . 3 4)") // improper list
    parse_error("(1 2 3")      // unfinished list
    parse_error(")")   // end list
  });
});

describe('Parser', function () {
  it("Cramped decimal", function () {
    evto("'(2.())", function (x) {
      assert_instanceof(x, FoxScheme.Pair)
      assert_equals(x.car(), 2)
      assert_equals(x.cdr().car(), FoxScheme.nil)
      return true;
    })
  });
  it("Cramped nils", function () {
    evto("'(().())", function (x) {
      assert_instanceof(x, FoxScheme.Pair)
      assert_equals(x.car(), FoxScheme.nil)
      assert_equals(x.cdr(), FoxScheme.nil)
      return true;
    })
  });
  /*
   * Catches a bug in which $fs.Util.listify was used to listify the quoted
   * objects, but listify incorrectly assumed that JS strings were arguments
   * arrays (because of the presence of .length) and would simply return the
   * empty list.
   */
  it("Quote string literal", function () {
    evto('\'"hello"', function (s) {
      assert_instanceof(s, FoxScheme.String)
      assert_equals(s.getValue(), "hello")
      return true
    });
  });
  /*
   * Catches a bug in which parseInt was used always.
   */
  it("Parse float", function () {
    evto("123456.654321", 123456.654321)
  });

  it("calculateIndentation ignores parens in strings", function() {
    const indent = FoxScheme.Parser.calculateIndentation('(display "(")');
    assert_equals(indent, 0);
  });
  it("calculateIndentation handles escaped quotes", function() {
    const indent = FoxScheme.Parser.calculateIndentation('(display "foo \\"(")');
    assert_equals(indent, 0);
  });

  it("Ignores semicolon comments", function() {
    var p = new $fs.Parser("1 ;comment\n2");
    assert_equals(p.nextObject(), 1);
    assert_equals(p.nextObject(), 2);
  });

  it("Ignores block comments", function() {
    var p = new $fs.Parser("#| comment |# 1 2");
    assert_equals(p.nextObject(), 1);
    assert_equals(p.nextObject(), 2);
  });

  it("Parses ellipsis token", function() {
    var p = new $fs.Parser("...");
    var o = p.nextObject();
    assert_instanceof(o, FoxScheme.Symbol);
    assert_equals(o.name(), "...");
  });

  it("Parses quasiquote syntax", function() {
    var p = new $fs.Parser("`(a ,b ,@c)");
    var o = p.nextObject();
    assert_equals(o.toString(), "(quasiquote (a (unquote b) (unquote-splicing c)))");
  });
  it("Parses syntax quoting", function() {
    var p = new $fs.Parser("#'(a b c)");
    var o = p.nextObject();
    assert_equals(o.toString(), "(syntax (a b c))");
  });
  it("Parses quasisyntax", function() {
    var p = new $fs.Parser("#`(a #,b #,@c)");
    var o = p.nextObject();
    assert_equals(o.toString(), "(quasisyntax (a (unsyntax b) (unsyntax-splicing c)))");
  });
});

/*
 * Test basic fuctionality for understanding literals
 */
describe('Simple literals', function () {
  it("Numbers", function () {
    evto('2', 2)
    evto('-5', -5)
  });
  it("Rationals", function () {
    evto('12/48', 0.25)
  });
  it("Floats", function () {
    evto('123.321', 123.321)
  });
  it("Characters", function () {
    evto('#\\a', function (a) {
      return ((a instanceof FoxScheme.Char) &&
        (a.getValue() == "a"))
    })
  });
  it("Hex characters", function () {
    evto('#\\x61', function (a) {
      return (
        a instanceof FoxScheme.Char &&
        a.getValue() == 'a'
      );
    });
    should_error('#\\xgg');
  });
  it("Booleans", function () {
    evto("#t", true)
    evto("#T", true)
    evto("#f", false)
    evto("#F", false)
  });
});

/*
 * Tests using the arithmetic functions implemented natively.
 * There are some interesting cases to watch out for, such as:
 *      (- 5) => 5      ;; negation
 *      (/ 5) => 1/5    ;; reciprocal
 *      (+)   => 0      ;; additive identity
 *      (*)   => 1      ;; multiplicative identity
 */
describe('Native arithmetic', function () {
  it('Boolean', function () {
    evto('(+ 2 2)', 4)
    evto('(+ 5 -2)', 3)
    evto('(* 3 5)', 15)
    evto('(/ 15 3)', 5)
  });
  it('Thunks', function () {
    evto('(+)', 0)
    evto('(*)', 1)
  });
  it('Multi + and *', function () {
    evto('(+ 1 2 3 4 5)', 15)
    evto('(* 1 2 6 3)', 36)
  });
  it('Multi - and /', function () {
    evto('(- 10 1 2 3)', 4)
    evto('(/ 24 2 3 1)', 4)
  });
  it('Singletons', function () {
    evto('(+ 5)', 5)
    evto('(- 5)', -5)
    evto('(- -5)', 5)
    evto('(* -5)', -5)
    evto('(* 3)', 3)
    evto('(/ 10)', 0.1)
    evto('(/ 5)', 0.2)
  });
  it('= Binary', function () {
    evto('(= 2 2)', true)
    evto('(= 2 3)', false)
  });
  it('= Multi', function () {
    evto('(= 1 1 1 1 2)', false)
    evto('(= 0 0 0 0 0)', true)
  });
  it('= invalid', function () {
    should_error('(= 2 #\\a)')
    should_error("(= 'sym 'sym)")
  });
  it('expt', function () {
    evto('(expt 2 2)', 4)
    evto('(expt 0 0)', 1)
  });
  it('sqrt', function () {
    evto('(sqrt 0)', 0)
    evto('(sqrt 4)', 2)
    evto('(sqrt 0.64)', 0.8)
  });
  it('log', function () {
    evto('(log 1)', 0)
    evto('(log 10)', Math.log(10))
  });
});

/*
 * Boolean stuff like 'not'
 * (commented out because it's not native)
describe('Booleans', function() {
  it("not", function() {
        evto("(not #f)", true)
        evto("(not #t)", false)
        evto("(not 5)", false)
        evto("(not '())", false)
        evto("(not '(1 2 3))", false)
  });
  it("unary not", function() {
        should_error("(not 1 2)")
        should_error("(not)")
  });
})
 */

/*
 * Equality checking
 */
describe('Equality', function () {
  it("eq? numbers", function () {
    evto("(eq? 1 1)", true)
    evto("(eq? 1 2)", false)
    evto("(eq? 5 'a)", false)
    // Just a limitation of JS
    // evto("(eq? 1.0 1)", false)
  });
  it("eq? bools", function () {
    evto("(eq? #t #t)", true)
    evto("(eq? #t #f)", false)
    evto("(eq? #t 5)", false)
    evto("(eq? #t 'a)", false)
  });
  it("eq? symbols", function () {
    evto("(eq? 'abc 'abc)", true)
    evto("(eq? 'ABC 'abc)", false)
    evto("(eq? 'a 'b)", false)
    evto("(eq? 'a \"a\")", false)
  });
  it("eq? strings", function () {
    // strings are like vectors:
    // different instances are not eq
    evto('(eq? "fox" "fox")', false)
    evto('(begin (set! x "fox")' +
      '(set! y x)' +
      '(eq? x y))',
      true)
  });
  it("eq? vectors", function () {
    evto('(eq? (make-vector 5) (make-vector 5))', false)
    evto('(begin (set! x (make-vector 5))' +
      '(set! y x)' +
      '(eq? x y))',
      true)
  });
  it("eq? lists", function () {
    evto("(eq? '(1 2 3 4) '(1 2 3 4))", false)
    evto("((lambda (x) (eq? (cdr x) (cdr x)))" +
      "'(1 2 3))",
      true)
  });
  it("eq? chars", function () {
    evto("(eq? #\\a #\\a)", true)
    evto("(eq? #\\b #\\a)", false)
    // 'a' === 61
    evto("(eq? #\\a #\\x61)", true)
  });
});

/*
 * Tests the basic native pair functions
 */
describe('Pairs', function () {
  it("nil", function () {
    evto("'()", FoxScheme.nil)
  });
  it('null?', function () {
    evto("(null? '())", true)
    evto("(null? (car '(5)))", false)
    evto("(null? (cdr '(5)))", true)
  });
  it("cons", function () {
    evto('(cons 1 2)', function (x) { return x instanceof FoxScheme.Pair })
    should_error('(cons 1)')
    should_error('(cons 3 4 5)')
  });
  it("car", function () {
    evto("(car '(1 . 2))", 1)
    evto("(car (cons 5 6))", 5)
    evto("(car (car (car (cons (cons (cons 5 7) 4) 2))))", 5)
    evto("(car (cons '() 5))", FoxScheme.nil)
    should_error('(car 3)')
  });
  it("cdr", function () {
    evto("(cdr '(1 . 3))", 3)
    evto("(cdr '(1))", FoxScheme.nil)
    evto("(cdr (car '((1 . 3) 5)))", 3)
    should_error("(cdr 5)")
    should_error("(cdr (cdr '(5)))")
  });
  it('pair?', function () {
    evto("(pair? (cons 4 5))", true)
    evto("(pair? '())", false)
    evto("(pair? 5)", false)
    evto("(pair? (car (cons '() 5)))", false)
  });
  it('pair? errors', function () {
    should_error("(pair?)")
    should_error("(pair? 1 2)")
  });
  it("pairs", function () {
    evto("(car (cdr '(4 5 6)))", 5)
    evto("(car (cdr (car '((1 5) 2))))", 5)
    evto("((car (cdr (cons car (cons cdr '())))) (cons 5 6))", 6)
  });
});

describe('Lambdas', function () {
  it('listify params', function () {
    evto("((lambda x (car x)) 1 2 3)", 1)
    evto("((lambda x (car (cdr x))) 1 2 3)", 2)
    evto("((lambda x x))", FoxScheme.nil)
    evto("((lambda x (car x)) 1)", 1)
    evto("((lambda x (cdr x)) 1)", FoxScheme.nil)
  });
  /*
   * Catches the potential bug where a listify'd lambda would clone its
   * environment at creation time rather than at run-time, thus missing the
   * changed x.
   */
  it('scope listified', function () {
    evto("(((lambda (x y)" +
      "(begin (set! ret " +
      "(lambda z " +
      "(+ x y)))" +
      "(set! x 3)" +
      " ret))" +
      "1 2) 'a 'b 'c)",
      5)
  });
  it('list of params', function () {
    evto("((lambda (a b c) c) 1 2 3)", 3)
    evto("((lambda (x) x) 5)", 5)
    evto("((lambda (a b c) (cdr b)) 1 '(2 . 3) 5)", 3)
  });
  it('no params', function () {
    evto("((lambda () 5))", 5)
  });
  it('improper params', function () {
    evto("((lambda (a b . c) (car c)) 1 2 5)", 5)
    evto("((lambda (a b . c) b) 1 5 2)", 5)
  });
  it('empty improper params', function () {
    evto("((lambda (x y . z) z) 3 4)", FoxScheme.nil)
  });
  it('nested lambdas', function () {
    // the inner x should shadow the outer x
    evto(" ((lambda (x) ((lambda (x) x) 5) ) 2) ", 5)
    evto(" ((lambda x ((lambda y (car (car y))) (car (cdr x))))  1 '(5 . 6) 4 2) ", 5)
  });
});

describe("let", function () {
  it("basic let", function () {
    evto("(let ((x 2) (y 3)) (+ x y))", 5)
    evto("(let ((x 5) (z 2)) (+ x 0))", 5)
  });
  it("refer globals", function () {
    should_error("(let ((x 2)) (+ x y))")
  });
  it("shadowing", function () {
    evto("(let ((x 5) (y 3))" +
      "(let ((x 2)) (+ x y)))",
      5)
  });
  it("refer above", function () {
    evto("(let ((x 2) (y 3))" +
      "(let ((x (+ x y))) x))",
      5)
  });
  it("not letrec", function () {
    should_error("(let ((zero (lambda (n)" +
      "(if (= n 0) #t" +
      "(zero (- n 1))))))" +
      "(zero 10)")
  });
})

/*
 * These letrec tests do not currently check for the subtleties laid out by
 * R6RS that were not in R5RS.
 */
describe("letrec", function () {
  it("Factorial", function () {
    evto("(letrec ((fact (lambda (n)" +
      "(if (= n 0) 1" +
      "(* n (fact (- n 1)))))))" +
      "(fact 5))",
      120)
  });
  it("Cannot bind self", function () {
    should_error("(letrec ((circ (cons 1 (cons 2 circ))))" +
      "(+ 2 2))") // do nothing to avoid infinite loop
  });
  it("Cannot bind self even if it's in scope above", function () {
    should_error("(let ((x 5))" +
      "(letrec ((x (+ x 5)))" +
      "x))")
  });
  it("Cannot bind vars from own letrec", function () {
    should_error("(let ((x 5) (y 3))" +
      "(letrec ((x (+ y 5)) (y (+ x 3)))" +
      "(+ x y)))")
  });
})

describe("if", function () {
  it("Basic if", function () {
    evto("(if #t 5 1)", 5)
    evto("(if #f 1 5)", 5)
  });
  it("One-armed if", function () {
    evto("(if #f 1)", FoxScheme.nothing)
    evto("(if #t 5)", 5)
  });
  it("Truthy", function () {
    evto("(if 3 5 1)", 5)
    evto("(if '() 5 1)", 5)
  });
  /*
   * Catches a bug in which the local env
   * wasn't passed to the if statement
   */
  it("Scope", function () {
    evto("((lambda (x)" +
      "   (if (= x 1)" +
      "     5    3))" +
      " 1)",
      5)
    evto("((lambda (x)" +
      "   (if #t" +
      "       (+ x 5)" +
      "       (* x 2)))" +
      " 0)",
      5)
  });
})

describe("Strings", function () {
  it("String literals", function () {
    evto('""', "")
    evto('"alpha!"', "alpha!")
  });
  it("Unicode Strings", function () {
    evto('"このファイルはUTF-8です"',
      "このファイルはUTF-8です")
  });
  it("make-string nulls", function () {
    evto('(make-string 5)', "\0\0\0\0\0")
    evto('(make-string 0)', "")
  });
  it("make-string fill", function () {
    evto('(make-string 5 #\\f)', "fffff")
    evto('(make-string 0 #\\f)', "")
  });
  it("make-string invalid", function () {
    should_error("(make-string)")
    should_error("(make-string #\\a")
    should_error('(make-string 3 "a")')
    should_error('(make-string 3 5)')
  });
  it("string-length", function () {
    evto('(string-length "fox!!")', 5)
    evto('(string-length "")', 0)
  });
  it("string-length invalid", function () {
    should_error('(string-length #\\a)')
    should_error('(string-length)')
    should_error('(string-length "a" "bb")')
  });
  it('string-ref', function () {
    evto('(string-ref "FOX" 0)', function (x) {
      assert_instanceof(x, FoxScheme.Char)
      assert_equals(x.getValue(), "F")
      return true
    })
    evto('(string-ref "fox!" 3)', '!')
  });
  it('string-ref invalid', function () {
    should_error('(string-ref "fox!" -1)')
    should_error('(string-ref "fox!" 4)')
  });
  it('string-set!', function () {
    evto('(string-set! "abc" 0 #\\f)', FoxScheme.nothing)
    evto('(begin (set! x "fox.")' +
      '(set! y x)' +
      '(string-set! x 3 #\\!)' +
      '(string-ref y 3))',
      '!')
  });
  it('string-set! invalid', function () {
    should_error('(string-set! "" 0 #\\f)')
    should_error('(string-set! "a" 0 "a")')
    should_error('(string-set! "abc" -1 #\\a)')
    should_error('(string-set! "abc" 3 #\\a)')
  });
})

describe("Vectors", function () {
  it("Vector literals", function () {
    evto("'#()", function (x) {
      assert_instanceof(x, FoxScheme.Vector)
      assert_equals(x.length(), 0)
      return true;
    })
    evto("'#(6 2 1 4 7 5)", function (x) {
      assert_instanceof(x, FoxScheme.Vector)
      assert_equals(x.length(), 6)
      assert_equals(x.get(0), 6)
      assert_equals(x.get(3), 4)
      assert_equals(x.get(5), 5)
      return true;
    })
    evto("'#(() () 4 #\\a)", function (x) {
      assert_instanceof(x, FoxScheme.Vector)
      assert_equals(x.length(), 4)
      assert_equals(x.get(0), FoxScheme.nil)
      assert_instanceof(x.get(3), FoxScheme.Char)
      assert_equals(x.get(3).getValue(), "a")
      return true;
    })
    // vectors must be quoted
    should_error("#(+ 2 3)")
  });
  it("make-vector", function () {
    evto("(make-vector 0)", function (x) {
      assert_instanceof(x, FoxScheme.Vector)
      assert_equals(x.length(), 0)
      return true;
    })
    evto("(make-vector 5)", function (x) {
      assert_instanceof(x, FoxScheme.Vector)
      assert_equals(x.length(), 5)
      assert_equals(x.get(0), 0)
      assert_equals(x.get(3), 0)
      return true;
    })
    evto("(make-vector 5 -1)", function (x) {
      assert_instanceof(x, FoxScheme.Vector)
      assert_equals(x.length(), 5)
      assert_equals(x.get(0), -1)
      assert_equals(x.get(4), -1)
      return true;
    })
    should_error("(make-vector)")
    should_error("(make-vector #\\a)")
    should_error("(make-vector 3 5 3)")
  });
  it("vector-ref", function () {
    evto("(vector-ref '#(1 2 3) 0)", 1)
    evto("(vector-ref '#(1 2 3 5) 3)", 5)
  });
  it("vector-ref invalid index message", function() {
    should_error_message("(vector-ref '#(1 2) 'a)", "index a");
  });
  it("vector-set!", function () {
    evto("(let ((v (make-vector 5)))" +
      "(begin " +
      "(vector-set! v 3 5) " +
      "(vector-ref v 3)))",
      5)
  });
  it("vector-set! invalid", function () {
    should_error("(vector-set! 3 0 1)")
    should_error("(let ((v (make-vector 2))) (vector-set! v 2 5))")
  });
})

describe("begin", function () {
  it("basic begin", function () {
    evto("(begin 1 2 5)", 5)
    evto("(begin (+ 2 2) (+ 2 1) (+ 2 3))", 5)
  });
  it("singleton", function () {
    evto("(begin 5)", 5)
    evto("(begin (+ 2 3))", 5)
  });
  it("nothing", function () {
    evto("(begin)", FoxScheme.nothing)
  });
})

describe("set!", function () {
  it("evaluates", function () {
    // just making sure
    evto("(set! x 5)", FoxScheme.nothing)
  });
  it("echo", function () {
    evto("(begin (set! x 5) x)", 5)
    evto("(begin (set! x 3) (set! y 2) (+ x y))", 5)
  });
  it("reset!", function () {
    evto("(begin (set! x 2) (set! x 5) x)", 5)
  });
  it("immutable", function () {
    should_error("(set! 5 2)")
    should_error("(begin (set! x '(1 . 2)) " +
      "(set! (car x) 5) x)")
  });
  it("recursion", function () {
    // set! should put the new var in scope for
    // the lambda
    evto("(begin " +
      "(set! fact " +
      "  (lambda (x)" +
      "    (if (= x 1)" +
      "        x" +
      "        (* x (fact (- x 1))))))" +
      "(fact 5))",
      120)
  });
})

describe("Scope", function () {
  it("Shadow syntax", function () {
    // if we let if be +, then (if 1 2 3) => 6
    evto("((lambda (if) (if 1 2 3)) +)", 6)
  });
  it("Attempt to reach in other scope", function () {
    /*
     * the inner lambda should not return the x=5 that was
     * defined by the outer lambda, since that x was not
     * in scope when the inner lambda was defined
     */
    should_error("((lambda (x y) (y)) 5 (lambda () x))")
  });
  it("lexical set!", function () {
    /*
     * This example increments an internal counter every time `x` is run.
     * It should increment the counter three times.
     */
    evto("(let ((x #f) (y 0)) " +
      "(begin " +
      "(set! x (lambda () (begin (set! y (+ 1 y)) y))) " +
      "(x) (x) (x)))",
      3)
  });
  it("lexical set! 2", function () {
    /*
     * A slightly fat example, but this will fail in interpreters where the
     * environment is not properly extended, but is statically cloned.  In
     * that case, the set! will update the old environment while the cloned
     * env is unaffected.
     */
    evto("(let ((ret #f) (thunky #f) (v1 #f) (v2 #f))" +
      "(begin (let ((x 1) (y 2))" +
      "(begin" +
      "(set! ret (lambda z (+ x y)))" +
      "(set! thunky (lambda () (set! x (+ 1 x))))" +
      "(set! x 3)))" +
      "(set! v1 (ret 'a 'b 'c))" +
      "(thunky)" +
      "(set! v2 (ret 'a 'b 'c))" +
      "(+ v1 v2)))",
      11)
  });
  it("set! globals", function () {
    /*
     * set!ing globals should not affect lambda vars
     */
    evto("(begin (set! x 2) ((lambda (x) x) 5))", 5)
  });
  it("set! globals 2", function () {
    /*
     * However, unbound global vars can be set!'d
     */
    evto("(begin " +
      " (set! y (lambda () x))" +
      " (set! x 5)" +
      " (y))",
      5)
  });
})

describe("call/cc", function () {
  it("in trivial case", function () {
    evto("(call/cc (lambda (k) 5))", 5)
  });
  it("continuation used inside a begin", function() {
    evto("(call/cc (lambda (k) " +
      "(begin (k 5) 7)))",
      5)
  });
});

describe("Multiple Values", function () {
  /*
it("call-with-values 1", function() {
      evto("(call-with-values (lambda () (values 3 4 5)) (lambda (x y z) (+ x y z)))",
           12)
});
  */
  it("apply-values", function () {
    evto("(apply-values + (values 110 10))", 120)
  });
  it("values to if conditional", function () {
    should_error("(if (values 1 2) #t #f)")
  });
  it("values to regular function", function () {
    should_error("((lambda x x) (values 1 2 3))");
  });
  it("single value to function", function () {
    evto("((lambda (x) x) (values 120))", 120)
  });
})

/*
 * Tests the native gensym functionality
 */
describe("gensym", function () {
  it("unique", function () {
    var x1 = new $fs.Gensym("x")
    var x2 = new $fs.Gensym("x")
    assert_true(x1.name() !== x2.name())
  });
  it("(gensym)", function () {
    evto("(gensym)", function (x) {
      assert_instanceof(x, FoxScheme.Symbol)
      return true
    })
    evto("(eq? (gensym) (gensym))", false)
  });
  it('(gensym "x")', function () {
    evto('(gensym "x")', function (x) {
      assert_instanceof(x, FoxScheme.Symbol)
      assert_true(x.name() !== "x")
      return true
    })
    evto('(eq? (gensym "x") (gensym "x"))', false)
  });
})

describe("Symbol", function () {
  it("invalid names throw FoxScheme.Error", function () {
    should_error(function () {
      new $fs.Symbol("bad name");
    });
  });
});

describe("Native library methods", function () {
  //
  // Apply is a fragile library method in native.js because it must directly
  // deal with the interpreter's registers.
  //
  it("apply", function () {
    evto("(apply + '(1 2 3 4))",
      10)
  });
  it("apply", function () {
    evto("(apply (lambda (x y) (+ x y)) '(2 3))",
      5)
  });
  //
  // procedure?
  //
  it("procedure", function () {
    evto("(procedure? +)",
      true)
    evto("(procedure? (lambda () 'a))",
      true)
    evto("(procedure? '#(3 4 5))",
      false)
  });
  //
  // string stuff
  //
  it("stringappend", function () {
    evto('(string-append "hello " "world")', function (x) {
      assert_instanceof(x, FoxScheme.String)
      assert_equals(x.getValue(), "hello world")
      return true;
    })
  });
  it("string2symbol", function () {
    evto('(string->symbol "hello")', function (x) {
      assert_instanceof(x, FoxScheme.Symbol)
      assert_equals(x.name(), "hello")
      return true;
    })
  });
  it("symbol2string", function () {
    evto("(symbol->string 'hello)", function (x) {
      assert_instanceof(x, FoxScheme.String)
      assert_equals(x.getValue(), "hello")
      return true;
    })
  });
})

/*
 * Tests the macro expander
 */
/* Deprecated for psyntax
describe("Simple Expand", function() {
  it("gensyms", function() {
        // (lambda (x) (+ x y))
        // => (lambda (<gensym>) (+ <gensym> y))
        var e = new $fs.Expand()
        var p = new $fs.Parser("(lambda (x) (+ x y))")
        var r = e.expand(p.nextObject())
        assert_true(r.second().car().name() !== "x")
        // make sure the two x's become the same thing
        assert_equals(r.second().car(),
                    r.third().second())
        // make sure the y didn't change
        assert_equals(r.third().third().name(), "y")
  });
    /*
     * (lambda (x y) x y)
     * => (lambda (<gensym-x> <gensym-y>) (begin <gensym-x> <gensym-y>))
     *
  it("lambda implicit begin", function() {
        var e = new $fs.Expand()
        var p = new $fs.Parser("(lambda (x y) x y)")
        var r = e.expand(p.nextObject())
        assert_true(r.second().car().name() !== "x")
        assert_equals(r.second().car(), r.third().second())
        assert_equals(r.second().second(), r.third().third())
        assert_equals(r.third().car().name(), "begin")
  });
    ,
    /*
     * (let ((x 5)) x)
     * => (let ((<gen-x> 5)) <gen-x>)
     *
  it("let gensym", function() {
        var e = new $fs.Expand()
        var p = new $fs.Parser("(let ((x 5)) x)")
        var o = p.nextObject()
        var r = e.expand(o)
        // make sure x got replaced
        assert_true(o.third().name() !== r.third().name())
        // make sure both occurrences of x got replaced
        assert_equals(r.second().car().car(), r.third())
        // make sure the answer is still the same
  });
    ,
    /*
     * (let () x y z) => (begin x y z)
     *
  it("empty let", function() {
        var e = new $fs.Expand()
        var p = new $fs.Parser("(let () (set! x 2) (set! y 3) (+ x y))")
        var o = p.nextObject()
        var r = e.expand(o)
        assert_equals(r.car().name(), "begin")
        // make sure answer is still correct
        evto(r, 5)
  });
    /*
     * Provide an (expand <expr>) function to Scheme
     *
  it("(expand)", function() {
        evto("(expand '(let () x))", function(sym) {
            assert_instanceof(sym, FoxScheme.Symbol)
            assert_equals(sym.name(), "x")
            return true
        })
  });
})
*/

describe('Miscellaneous', function () {
  // the first exercise from The Seasoned Schemer,
  // rewritten without 'cond' or 'or'
  it('two-in-a-row?', function () {
    evto("(begin " +
      "(set! is-first?" +
      "  (lambda (a lat)" +
      "   (if (null? lat)" +
      "    #f" +
      "    (eq? (car lat) a))))" +
      "(set! two-in-a-row?" +
      "  (lambda (lat)" +
      "    (if (null? lat)" +
      "         #f" +
      "         (if (is-first? (car lat) (cdr lat))" +
      "             #t" +
      "             (two-in-a-row? (cdr lat))))))" +
      "(if (two-in-a-row? '(f o x sc he me))" +
      "    #f" +
      "    (two-in-a-row? '(8 6 7 5 3 0 0 9)))" +
      ")",
      true)
  });
  it("fibonacci", function () {
    evto("(begin" +
      "(set! fib (lambda (n)" +
      "(if (< n 1) 1" +
      "(+ (fib (- n 1)) (fib (- n 2))))))" +
      "(fib 6))",
      21)
  });
  /*
   * Length by Y Combinator, copied from BiwaScheme
   */
  it('Y combinator', function () {
    evto("(((lambda (f) ((lambda (proc) (f (lambda (arg) ((proc proc) arg)))) (lambda (proc) (f (lambda (arg) ((proc proc) arg)))))) (lambda (self) (lambda (ls) (if (null? ls) 0 (+ 1 (self (cdr ls))))))) '(1 2 3 4 5))",
      5)
  });
  /*
   * Length by Y Combinator, tail-recursive, copied from
   * BiwaScheme
   */
  it('Y combinator (tail recursive)', function () {
    evto("(((lambda (f) ((lambda (proc) (f (lambda (arg1 arg2) ((proc proc) arg1 arg2)))) (lambda (proc) (f (lambda (arg1 arg2) ((proc proc) arg1 arg2)))))) (lambda (self) (lambda (ls acc) (if (null? ls) acc (self (cdr ls) (+ 1 acc)))))) '(1 2 3 4 5) 0)",
      5)
  });
  /*
   * AddN function generator
   */
  it("addN", function () {
    evto("(begin (set! addN" +
      "(lambda (n) (lambda (x) (+ x n))))" +
      "(set! add7 (addN 7))" +
      "(add7 -2))",
      5)
  });
  /*
   * factorial by CPS
   */
  it("factcps", function () {
    evto("(letrec ((fact*" +
      "(lambda (n k) " +
      "(if (< n 2) (k 1) " +
      "(fact* (- n 1) (lambda (r) (k (* r n)))))))) " +
      "(fact* 5 (lambda (v) v)))",
      120)
  });
});

describe('Node load', function () {
  it('loads a Scheme file and evaluates its contents', function () {
    const filename = path.join(__dirname, 'fixtures', 'load-test.scm');
    evto(`(begin (load "${filename}") loaded-val)`, 123);
  });
});
