(set! list
  (lambda x x))

;; TODO: fix list? to detect cycles
(set! list?
  (lambda (x)
    (if (pair? x)
      (list? (cdr x))
      (null? x))))

(set! not
  (lambda (v)
    (= v #F)))

(set! boolean?
  (lambda (v)
    (if (= v #t)
      #t
      (= v #f))))

(set! null?
  (lambda (v)
    (= v '())))

(set! map
  (lambda (proc ls)
    (if (not (list? ls))
      (error 'map "Can't map on non-list")
      (if (null? ls)
        '()
        (cons (proc (car ls)) (map proc (cdr ls)))))))
