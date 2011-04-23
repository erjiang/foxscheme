(define (outparse expr)
  (display (preparse expr)))
(define (preparse expr)
  (cond
    ((list? expr)
     (echo-list expr))
    ((pair? expr)
     (format "p(~a, ~a)"
             (preparse (car expr))
             (preparse (cdr expr))))
    ((symbol? expr)
     (format "s(\"~a\")" expr))
    ((vector? expr)
     (echo-vector expr))
    ((string? expr)
     (format "t(\"~a\")" expr))
    ((number? expr)
     (format "~s" expr))
    ((boolean? expr)
     (echo-boolean expr))
    ((char? expr)
     (format "c(\"~a\")" expr))
    (else (error 'preparse "Don't know what to do with " expr))))

(define (echo-boolean expr)
  (if expr
    "true"
    "false"))
(define (echo-list expr)
  (if (null? expr)
    "nil"
    (string-append
      "ls(["
      (letrec ((loop-list
                 (lambda (ls)
                   (if (null? (cdr ls))
                     (format "~a])\n" (preparse (car ls)))
                     (format "~a,~a"
                             (preparse (car ls))
                             (loop-list (cdr ls)))))))
        (loop-list expr)))))

(define (echo-vector expr)
  (do ((i 0 (+ 1 i))
       (str "v([" (string-append str "," (preparse (vector-ref expr i)))))
    ((= i (vector-length expr)) 
     (string-append str "])"))))

(display "var psyntax1 = (function (ls, p, v, s, t, c, nil) {
  return ")
(outparse (read))
(display "
})(
  // ls
  FoxScheme.Util.listify,
  // p
  function(a, b) {
    return new FoxScheme.Pair(a, b);
  },
  // v
  function(v) {
    return new FoxScheme.Vector(v);
  },
  // s
  function(s) {
    return new FoxScheme.Symbol(s);
  },
  function(t) {
    return new FoxScheme.String(t);
  },
  function(c) {
    return new FoxScheme.Char(c);
  },
  FoxScheme.nil
)")
