(define length
  (lambda (ls)
    (letrec
      ((race
         (lambda (hare turtle n)
           (if (pair? hare)
             (let ((hare (cdr hare)))
               (if (pair? hare)
                 (let ((hare (cdr hare))
                       (turtle (cdr turtle)))
                   (if (eq? hare turtle)
                     (error 'length "Circular list detected.")
                     (race hare turtle (+ 2 n))))
                 (if (null? hare)
                   (+ n 1)
                   (error 'length "Improper list"))))
             (if (null? hare)
               n
               (error 'length "Improper list"))))))
      (race ls ls 0))))

(define list
  (lambda x x))

;; TODO: fix list? to detect cycles
(define list?
  (lambda (ls)
    (letrec
      ((race
         (lambda (hare turtle)
           (if (pair? hare)
             (let ((hare (cdr hare)))
               (if (pair? hare)
                 (let ((hare (cdr hare))
                       (turtle (cdr turtle)))
                   (if (eq? hare turtle)
                     #f
                     (race hare turtle)))
                 #t))
             #t))))
      (race ls ls))))

(define not
  (lambda (v)
    (= v #F)))

(define boolean?
  (lambda (v)
    (if (= v #t)
      #t
      (= v #f))))

;;(define null?
;;  (lambda (v)
;;    (= v '())))

(define map
  (lambda (proc ls)
    (if (not (list? ls))
      (error 'map "Can't map on non-list")
      (if (null? ls)
        '()
        (cons (proc (car ls)) (map proc (cdr ls)))))))

(define memq
  (lambda (v ls)
    (if (null? ls)
      #f
      (if (eq? v (car ls))
        ls
        (memq v (cdr ls))))))
(define memv memq)

;; eq? is a native procedure
;; (define eq?
;;
(define eqv? eq?)
