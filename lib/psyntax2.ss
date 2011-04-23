($sc-put-cte
  '#(syntax-object with-syntax ((top) #(ribcage #(with-syntax) #((top)) #(with-syntax))))
  (lambda (x2531)
    ((lambda (tmp2532)
       ((lambda (tmp2533)
          (if tmp2533
              (apply
                (lambda (_2536 e12535 e22534)
                  (cons
                    '#(syntax-object begin ((top) #(ribcage #(_ e1 e2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                    (cons e12535 e22534)))
                tmp2533)
              ((lambda (tmp2538)
                 (if tmp2538
                     (apply
                       (lambda (_2543 out2542 in2541 e12540 e22539)
                         (list
                           '#(syntax-object syntax-case ((top) #(ribcage #(_ out in e1 e2) #((top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                           in2541
                           '()
                           (list
                             out2542
                             (cons
                               '#(syntax-object begin ((top) #(ribcage #(_ out in e1 e2) #((top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                               (cons e12540 e22539)))))
                       tmp2538)
                     ((lambda (tmp2545)
                        (if tmp2545
                            (apply
                              (lambda (_2550 out2549 in2548 e12547 e22546)
                                (list
                                  '#(syntax-object syntax-case ((top) #(ribcage #(_ out in e1 e2) #((top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                  (cons
                                    '#(syntax-object list ((top) #(ribcage #(_ out in e1 e2) #((top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                    in2548)
                                  '()
                                  (list
                                    out2549
                                    (cons
                                      '#(syntax-object begin ((top) #(ribcage #(_ out in e1 e2) #((top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                      (cons e12547 e22546)))))
                              tmp2545)
                            (syntax-error tmp2532)))
                       ($syntax-dispatch
                         tmp2532
                         '(any #(each (any any)) any . each-any)))))
                ($syntax-dispatch
                  tmp2532
                  '(any ((any any)) any . each-any)))))
         ($syntax-dispatch tmp2532 '(any () any . each-any))))
      x2531))
  '*top*)
