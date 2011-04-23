($sc-put-cte
  '#(syntax-object or ((top) #(ribcage #(or) #((top)) #(or))))
  (lambda (x2604)
    ((lambda (tmp2605)
       ((lambda (tmp2606)
          (if tmp2606
              (apply
                (lambda (_2607)
                  '#(syntax-object #f ((top) #(ribcage #(_) #((top)) #("i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t))))
                tmp2606)
              ((lambda (tmp2608)
                 (if tmp2608
                     (apply (lambda (_2610 e2609) e2609) tmp2608)
                     ((lambda (tmp2611)
                        (if tmp2611
                            (apply
                              (lambda (_2615 e12614 e22613 e32612)
                                (list
                                  '#(syntax-object let ((top) #(ribcage #(_ e1 e2 e3) #((top) (top) (top) (top)) #("i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                  (list
                                    (list
                                      '#(syntax-object t ((top) #(ribcage #(_ e1 e2 e3) #((top) (top) (top) (top)) #("i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                      e12614))
                                  (list
                                    '#(syntax-object if ((top) #(ribcage #(_ e1 e2 e3) #((top) (top) (top) (top)) #("i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                    '#(syntax-object t ((top) #(ribcage #(_ e1 e2 e3) #((top) (top) (top) (top)) #("i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                    '#(syntax-object t ((top) #(ribcage #(_ e1 e2 e3) #((top) (top) (top) (top)) #("i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                    (cons
                                      '#(syntax-object or ((top) #(ribcage #(_ e1 e2 e3) #((top) (top) (top) (top)) #("i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                      (cons e22613 e32612)))))
                              tmp2611)
                            (syntax-error tmp2605)))
                       ($syntax-dispatch
                         tmp2605
                         '(any any any . each-any)))))
                ($syntax-dispatch tmp2605 '(any any)))))
         ($syntax-dispatch tmp2605 '(any))))
      x2604))
  '*top*)
