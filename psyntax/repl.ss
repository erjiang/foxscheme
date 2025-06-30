(load "lib/core.ss")
(load "lib/fox.r6rs.ss")
(load "psyntax/psyntax.pp")

(define repl
  (lambda ()
    (begin
      (write "> ")
      (write (eval (sc-expand (read))))
      (repl))))

(repl)