import repl from 'repl';
import fs from 'fs';
import readline from 'readline';
import * as FoxScheme from '../foxscheme';
import { defun } from '../system/native';
import String from '../system/string';
import { Error as SchemeError } from '../system/error';
import nothing from '../system/nothing';

const interp = new FoxScheme.Interpreter();

// Global variable to store input for read function
let readBuffer: string = "";

// Provide a Scheme-level (load) implementation for Node
defun("load", 1, 2, function (filename, evalproc) {
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

defun("read", 0, 0, function () {
  // If we have buffered input, use it
  if (readBuffer.trim()) {
    const p = new FoxScheme.Parser(readBuffer);
    const obj = p.nextObject();
    if (obj === FoxScheme.Parser.EOS) {
      readBuffer = "";
      return nothing;
    } else {
      // For simplicity, clear the buffer after reading one object
      // In a more sophisticated implementation, we'd track the remaining input
      readBuffer = "";
      return obj;
    }
  }

  // For REPL environment, we can't easily read synchronously
  // This would need to be integrated with the REPL's input mechanism
  throw new SchemeError("read requires input to be provided via read-set-input!", "read");
});

// Helper function to set input for read
defun("read-set-input!", 1, 1, function (input) {
  if (!(input instanceof String)) {
    throw new SchemeError("read-set-input! requires a string argument", "read-set-input!");
  }
  readBuffer = input.getValue();
  return nothing;
});

defun("write", 1, 1, function (obj) {
  // write to stdout
  console.log(globalThis.String(obj));
  return nothing;
});

let runWithInterpreter: repl.REPLEval;
runWithInterpreter = function (cmd, context, filename, callback) {
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
myWriter = function (obj) {
  return "" + obj;
}

if (require.main === module) {
  // Check for --script argument
  const args = process.argv.slice(2);
  if (args.length >= 2 && args[0] === '--script') {
    const filename = args[1];
    try {
      // Load and execute the script
      const loadExpr = new FoxScheme.Pair(
        new FoxScheme.Symbol("load"),
        new FoxScheme.Pair(
          new FoxScheme.String(filename),
          FoxScheme.nil
        )
      );
      interp.eval(loadExpr);
    } catch (e) {
      console.error("Error loading script:", e);
      process.exit(1);
    }
  } else {
    // Start REPL if no script argument
    repl.start({
      prompt: '> ',
      eval: runWithInterpreter,
      writer: myWriter
    });
  }
}

export default FoxScheme;
