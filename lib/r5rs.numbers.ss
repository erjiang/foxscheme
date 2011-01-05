;;
;; Provided in native.js:
;;   +
;;   -
;;   *
;;   /
;;   expt
;;   sqrt
;;   remainder (JS's %)
;;
;; Not implemented yet:
;;   gcd
;;   lcm

(define abs
  (lambda (n)
    (if (> n 0)
      n
      (- n))))

(define quotient
  (lambda (n m)
    (/ (- n (remainder n m)) m)))

(define modulo
  (lambda (n m)
    (if (> m 0)
      (abs (remainder n m))
      (- (abs (remainder n m))))))

;(define gcd
;  (lambda ls
;    
;    (letrec ((b-gcd
;               (lambda (x y)
;                 (if (= y 0) x
;                   (b-gcd y (remainder x y))))))
;      (let ([x (if (< x 0) (- x) x)]
;            [y (if (< y 0) (- y) y)])
;        (if (> x y) (gcd x y)
;        (if (< x y) (gcd y x)
;            x))))
