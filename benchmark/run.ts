import fs from 'fs';
import path from 'path';
import * as FoxScheme from '../src/foxscheme';

const { Parser, Interpreter } = FoxScheme as any;
interface Benchmark {
  file: string;
  expected: number;
}

const benchmarks: Benchmark[] = [
  { file: '01-factorial.scm', expected: 2432902008176640000 },
  { file: '02-dotproduct.scm', expected: 2000 },
  { file: '03-nbody.scm', expected: 1 },
  { file: '04-bst.scm', expected: 499500 },
];

const interp = new Interpreter();
let total = 0;
for (const bench of benchmarks) {
  const code = fs.readFileSync(path.join(__dirname, bench.file), 'utf8');
  const parser = new Parser(code);
  let obj: any;
  let result: any = undefined;
  const start = Date.now();
  while ((obj = parser.nextObject()) !== Parser.EOS) {
    result = interp.eval(obj);
  }
  const elapsed = Date.now() - start;
  if (typeof result === 'number') {
    const diff = Math.abs(result - bench.expected);
    if (diff > 1e-9) {
      throw new Error(`${bench.file} expected ${bench.expected} but got ${result}`);
    }
  } else if (result != bench.expected) {
    throw new Error(`${bench.file} expected ${bench.expected} but got ${result}`);
  }
  total += elapsed;
  console.log(`${bench.file}: ${(elapsed / 1000).toFixed(3)}s`);
}
console.log(`Total: ${(total / 1000).toFixed(3)}s`);
