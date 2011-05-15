;;
;; This script takes Scheme expressions and preparses it into a form that is
;; ready to be directly loaded into FoxScheme. This script automatically adds
;; JavaScript code to load the expressions into FoxScheme at runtime, so all
;; that is needed is to execute the JavaScript file.
;;

;;
;; Sends the result of preparse to the current-output-port (STDOUT)
;;
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

(display "(function (default_load_function, ls, p, v, s, t, c, nil) {\n")
(let loop ((dat (read)))
  (if (eof-object? dat)
    #t
    (begin
      (display "default_load_function(")
      (display (preparse dat))
      (display ");\n")
      (loop (read)))))
(display "
})(
  $interpreter.eval,
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
