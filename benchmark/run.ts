import fs from 'fs';
import path from 'path';
import * as FoxScheme from '../src/foxscheme';

const { Parser, Interpreter } = FoxScheme as any;
const benchmarks = [
  '01-fib31.scm',
  '02-fib30.scm',
  '03-loop2_5.scm',
  '04-loop3.scm',
  '05-loop5.scm'
];

const interp = new Interpreter();
let total = 0;
for (const file of benchmarks) {
  const code = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const parser = new Parser(code);
  let obj: any;
  const start = Date.now();
  while ((obj = parser.nextObject()) !== Parser.EOS) {
    interp.eval(obj);
  }
  const elapsed = Date.now() - start;
  total += elapsed;
  console.log(`${file}: ${ (elapsed/1000).toFixed(3) }s`);
}
console.log(`Total: ${(total/1000).toFixed(3)}s`);
