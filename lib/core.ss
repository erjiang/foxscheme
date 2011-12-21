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
    (eq? v #F)))

(define boolean?
  (lambda (v)
    (if (eq? v #t)
      #t
      (eq? v #f))))

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
;; (define eq?)
;;
(define eqv? eq?)

(define call-with-current-continuation
  (lambda (thunk)
    (call/cc thunk)))

;; copied from Ikarus
(define assq
  (letrec ([race
             (lambda (x h t ls)
               (if (pair? h)
                 (let ([a (car h)] [h (cdr h)])
                   (if (pair? a)
                     (if (eq? ($car a) x)
                       a
                       (if (pair? h)
                         (if (not (eq? h t))
                           (let ([a ($car h)])
                             (if (pair? a)
                               (if (eq? ($car a) x)
                                 a
                                 (race x ($cdr h) ($cdr t) ls))
                               (error 'assq "malformed alist"
                                    ls)))
                           (error 'assq "circular list" ls))
                         (if (null? h)
                           #f
                           (error 'assq "not a proper list" ls))))
                     (error 'assq "malformed alist" ls)))
                 (if (null? h)
                   #f
                   (error 'assq "not a proper list" ls))))])
    (lambda (x ls) 
      (race x ls ls ls))))

;; copied from jsscheme.html
(define equal?
  (lambda (x y)
    ((lambda (eqv)
       (if eqv eqv
         (if (pair? x)
           (begin
             (if (pair? y)
               (if (equal? (car x) (car y))
                 (equal? (cdr x) (cdr y))
                 #f)
               #f))
           (if (vector? x)
             (if (vector? y)
               ((lambda (n)
                  (if (= (vector-length y) n)
                    ((begin
                       (define loop
                         (lambda (i)
                           ((lambda (eq-len)
                              (if eq-len
                                eq-len
                                (if (equal? (vector-ref x i)
                                            (vector-ref y i))
                                  (loop (+ i 1))
                                  #f)))
                            (= i n))))
                       loop)
                     0)
                    #f))
                (vector-length x))
               #f)
             #f))))
     (eqv? x y))))


(define append
  (lambda (lsa lsb)
    (if (null? lsa)
      lsb
      (cons (car lsa) (append (cdr lsa) lsb)))))

(define reverse
  (lambda (ls)
    (if (null? ls)
      '()
      (append (reverse (cdr ls))
              (list (car ls))))))

;;
;; Multiple values stuff
;;
(define call-with-values
  (lambda (producer consumer)
    (apply-values consumer (producer))))
