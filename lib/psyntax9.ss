($sc-put-cte
  '#(syntax-object let* ((top) #(ribcage #(let*) #((top)) #(let*))))
  (lambda (x2664)
    ((lambda (tmp2665)
       ((lambda (tmp2666)
          (if (if tmp2666
                  (apply
                    (lambda (let*2671 x2670 v2669 e12668 e22667)
                      (andmap identifier? x2670))
                    tmp2666)
                  '#f)
              (apply
                (lambda (let*2677 x2676 v2675 e12674 e22673)
                  ((letrec ((f2678 (lambda (bindings2679)
                                     (if (null? bindings2679)
                                         (cons
                                           '#(syntax-object let ((top) #(ribcage () () ()) #(ribcage #(bindings) #((top)) #("i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(let* x v e1 e2) #((top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                           (cons '() (cons e12674 e22673)))
                                         ((lambda (tmp2681)
                                            ((lambda (tmp2682)
                                               (if tmp2682
                                                   (apply
                                                     (lambda (body2684
                                                              binding2683)
                                                       (list
                                                         '#(syntax-object let ((top) #(ribcage #(body binding) #((top) (top)) #("i" "i")) #(ribcage () () ()) #(ribcage #(bindings) #((top)) #("i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(let* x v e1 e2) #((top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                         (list binding2683)
                                                         body2684))
                                                     tmp2682)
                                                   (syntax-error tmp2681)))
                                              ($syntax-dispatch
                                                tmp2681
                                                '(any any))))
                                           (list
                                             (f2678 (cdr bindings2679))
                                             (car bindings2679)))))))
                     f2678)
                    (map list x2676 v2675)))
                tmp2666)
              (syntax-error tmp2665)))
         ($syntax-dispatch
           tmp2665
           '(any #(each (any any)) any . each-any))))
      x2664))
  '*top*)
