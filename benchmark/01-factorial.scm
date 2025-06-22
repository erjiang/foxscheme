(letrec ((fact (lambda (n acc)
                 (if (< n 2)
                     acc
                     (fact (- n 1) (* n acc))))))
  (fact 20 1))
