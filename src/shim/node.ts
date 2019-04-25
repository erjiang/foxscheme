import repl from 'repl';
import * as FoxScheme from '../foxscheme';

const interp = new FoxScheme.Interpreter();

let runWithInterpreter: repl.REPLEval;
runWithInterpreter = function(cmd, context, filename, callback) {
  if (FoxScheme.Parser.calculateIndentation(cmd) !== 0) {
    return callback(new repl.Recoverable(new Error("Unexpected EOL")), null);
  }
  let parse = new FoxScheme.Parser(cmd);
  let nextObject = parse.nextObject();
  callback(null, interp.eval(nextObject));
}

// FoxScheme defines toString on its classes so coercing to a string should give
// us the right output
let myWriter: repl.REPLWriter;
myWriter = function(obj) {
  return "" + obj;
}

repl.start({
  prompt: '> ',
  eval: runWithInterpreter,
  writer: myWriter
})
