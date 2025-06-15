import repl from 'repl';
import fs from 'fs';
import * as FoxScheme from '../foxscheme';
import {defun} from '../system/native';
import String from '../system/string';
import {Error as SchemeError} from '../system/error';
import nothing from '../system/nothing';

const interp = new FoxScheme.Interpreter();

// Provide a Scheme-level (load) implementation for Node
defun("load", 1, 2, function(filename, evalproc) {
  if (!(filename instanceof String))
    throw new SchemeError("Must specify a filename string to load from", "load");
  if (evalproc === undefined)
    evalproc = this.eval;
  const path = filename.getValue();
  let data: string;
  try {
    data = fs.readFileSync(path, 'utf8');
  } catch (e) {
    throw new SchemeError("Failed to read file: " + (e as any).message, "load");
  }
  const p = new FoxScheme.Parser(data);
  let o: any;
  while ((o = p.nextObject()) !== FoxScheme.Parser.EOS) {
    evalproc.apply(this, [o]);
  }
  return nothing;
});

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

if (require.main === module) {
  repl.start({
    prompt: '> ',
    eval: runWithInterpreter,
    writer: myWriter
  });
}

export default FoxScheme;
