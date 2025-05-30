import readline from 'readline';
import * as FoxScheme from './foxscheme';

const interpreter = new FoxScheme.Interpreter();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

let buffer = '';

function evaluate(buf: string) {
  const parser = new FoxScheme.Parser(buf);
  let obj: any;
  while ((obj = parser.nextObject()) !== FoxScheme.Parser.EOS) {
    const result = interpreter.eval(obj);
    console.log(String(result));
  }
}

rl.prompt();

rl.on('line', (line) => {
  buffer += line + '\n';
  const indent = FoxScheme.Parser.calculateIndentation(buffer);
  if (indent === 0) {
    try {
      evaluate(buffer);
    } catch (err) {
      console.error((err as Error).message);
    }
    buffer = '';
    rl.setPrompt('> ');
  } else {
    rl.setPrompt(' '.repeat(indent));
  }
  rl.prompt();
}).on('close', () => {
  console.log('Bye!');
  process.exit(0);
});
