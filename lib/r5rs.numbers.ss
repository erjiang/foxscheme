;;
;; R5RS numeric procedures
;;

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Basic operators
;; Provided in native.js:
;;   +
;;   -
;;   *
;;   /
;;   expt      (Math.pow)
;;   sqrt      (Math.sqrt)
;;   remainder (%)
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

;; TODO: Not sure what to do with these two with JS's arithmetic
(define numerator
  (lambda (n) n))
(define denominator
  (lambda (n) 1))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Rounding
;; Defined in native.js:
;;   ceiling  (Math.ceil)
;;   floor    (Math.floor)
(define truncate
  (lambda (n)
    (if (> n 0)
      (floor n)
      (ceiling n))))

(define zero?
  (lambda (n)
    (= n 0)))

(define negative?
  (lambda (n)
    (< n 0)))

(define positive?
  (lambda (n)
    (> n 0)))

(define odd?
  (lambda (n)
    (= (modulo n 2) 1)))

(define even?
  (lambda (n)
    (= (modulo n 2) 0)))

(define max
  (lambda ls
    (if (null? (cdr ls)) (car ls)
      (if (> (car ls) (cdr ls))
        (max (cons (car ls) (cdr (cdr ls))))
        (max (cdr ls))))))

(define min
  (lambda ls
    (if (null? (cdr ls)) (car ls)
      (if (> (car ls) (cdr ls))
        (min (cons (car ls) (cdr (cdr ls))))
        (min (cdr ls))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Trigonometry
;; Defined natively:
;;   sin
;;   cos
;;   tan
;;   asin
;;   acos
;;   atan

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Exponentials
;; Defined natively:
;;   exp
;;   log

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Complex numbers
;;
;; No.
(define real-part
  (lambda (n)
    (if (number? n)
      n
      (error 'real-part "Non-number received" n))))
(define complex?
  (lambda (n)
    (if (number? n)
      #t
      (error 'complex? "Non-number received" n))))
