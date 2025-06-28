// @ts-ignore
import 'mocha';
import * as $fs from "../src/foxscheme";
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

describe('Bracket Syntax', function () {
  it("Parses basic list with brackets", function () {
    evto("'[1 2 3]", function (x) {
      return x instanceof FoxScheme.Pair && 
             x.car() === 1 &&
             x.cdr().car() === 2 &&
             x.cdr().cdr().car() === 3 &&
             x.cdr().cdr().cdr() === FoxScheme.nil;
    });
  });

  it("Parses basic vector with brackets", function () {
    evto("'#[1 2 3]", function (x) {
      return x instanceof FoxScheme.Vector && 
             x.get(0) === 1 &&
             x.get(1) === 2 &&
             x.get(2) === 3;
    });
  });

  it("Parses function application with brackets", function () {
    evto("'[+ 1 2]", function (x) {
      return x instanceof FoxScheme.Pair &&
             x.car() instanceof FoxScheme.Symbol &&
             x.car().name() === "+" &&
             x.cdr().car() === 1 &&
             x.cdr().cdr().car() === 2;
    });
  });

  it("Parses nested structures with brackets", function () {
    evto("'[[1 2] [3 4]]", function (x) {
      return x instanceof FoxScheme.Pair &&
             x.car() instanceof FoxScheme.Pair &&
             x.cdr().car() instanceof FoxScheme.Pair;
    });
  });

  it("Parses mixed parentheses and brackets", function () {
    evto("'([1 2] (3 4))", function (x) {
      return x instanceof FoxScheme.Pair &&
             x.car() instanceof FoxScheme.Pair &&
             x.cdr().car() instanceof FoxScheme.Pair;
    });
  });

  it("Parses vector with nested lists using brackets", function () {
    evto("'#[#[1 2] #[3 4]]", function (x) {
      return x instanceof FoxScheme.Vector &&
             x.get(0) instanceof FoxScheme.Vector &&
             x.get(1) instanceof FoxScheme.Vector;
    });
  });
}); 