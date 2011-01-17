;; Compatibility definitions to allow FoxScheme to load psyntax.pp
;;
;;

;(define length
;  (lambda (ls)
;    (if (null? ls)
;      0
;      (+ 1 (length (cdr ls))))))

;; This definition of length copied from Ikarus Scheme
;; ikarus/scheme/ikarus.lists.ss
(define length
  (letrec ([race
             (lambda (h t ls n)
               (if (pair? h)
                 (let ([h (cdr h)])
                   (if (pair? h)
                     (if (not (eq? h t))
                       (race (cdr h) (cdr t) ls (+ n 2))
                       (error 'length "circular list" ls))
                     (if (null? h)
                       (+ n 1)
                       (error 'length "not a proper list" ls))))
                 (if (null? h)
                   n
                   (error 'length "not a proper list" ls))))])
    (lambda (ls)
      (race ls ls ls 0))))

(define not
  (lambda (v)
    (= v #f)))


(define eval-core
  (lambda (x)
    (eval x (interaction-environment))))

(define list
  (lambda x x))

(define list?
  (lambda (ls)
    (if (pair? ls)
      (list? (cdr ls))
      (null? ls))))

;; This is the expanded version of for-all as presented in TSPL4
(define for-all
  (lambda (f ls . more)
    (let ((t (null? ls)))
      (if t
          t
          ((letrec ((for-all (lambda (x ls more)
                               (if (null? ls)
                                 (apply f x (map car more))
                                 (if (apply f x (map car more))
                                   (for-all
                                     (car ls)
                                     (cdr ls)
                                     (map cdr more))
                                   #f)))))
             for-all)
           (car ls)
           (cdr ls)
           more)))))

(define map
  (lambda (f ls . more)
    (if (null? more)
      ((letrec ((map1 (lambda (ls)
                        (if (null? ls)
                          '()
                          (cons (f (car ls)) (map1 (cdr ls)))))))
         map1)
       ls)
      ((letrec ((map-more (lambda (ls more)
                            (if (null? ls)
                              '()
                              (cons
                                (apply f (car ls) (map car more))
                                (more-more (cdr ls) (map cdr more)))))))
         map-more)
       ls more))))

