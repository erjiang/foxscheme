;;
;; Stuff for psyntax
;;
(define $global-prop-list (make-hashtable))
(define propkey
  (lambda (symbol key)
    (string-append (symbol->string symbol)
                   (symbol->string key))))
(define putprop
  (lambda (symbol key value)
    (hashtable-set! $global-prop-list
                    (propkey symbol key)
                    value)))

(define getprop
  (lambda (symbol key)
    (hashtable-ref $global-prop-list
                   (propkey symbol key)
                   #f)))

(define remprop
  (lambda (symbol key)
    (hashtable-delete! $global-prop-list
                       (propkey symbol key))))
