(let ((v1 (make-vector 4000000 1))
      (v2 (make-vector 4000000 2)))
  (letrec ((dot (lambda (i acc)
                  (if (= i 4000000)
                      acc
                      (dot (+ i 1)
                           (+ acc (* (vector-ref v1 i)
                                     (vector-ref v2 i))))))))
    (dot 0 0)))
