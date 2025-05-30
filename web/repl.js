(function() {
  const consoleDiv = document.getElementById('console');
  const prompt = document.getElementById('prompt');
  const interpreter = new FoxScheme.Interpreter();
  let buffer = '';

  function append(text, cls) {
    const div = document.createElement('div');
    div.className = 'line ' + cls;
    div.textContent = text;
    consoleDiv.appendChild(div);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
  }

  function evaluate() {
    try {
      const parser = new FoxScheme.Parser(buffer);
      let obj;
      while((obj = parser.nextObject()) !== FoxScheme.Parser.EOS) {
        const result = interpreter.eval(obj);
        append(String(result), 'result');
      }
    } catch(err) {
      append('Error: ' + err.message, 'error');
    }
    buffer = '';
  }

  prompt.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const line = prompt.value;
      prompt.value = '';
      buffer += line + '\n';
      append(line, 'input');
      if (FoxScheme.Parser.calculateIndentation(buffer) === 0) {
        evaluate();
      }
    }
  });
})();
