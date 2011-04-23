($sc-put-cte
  '#(syntax-object and ((top) #(ribcage #(and) #((top)) #(and))))
  (lambda (x2617)
    ((lambda (tmp2618)
       ((lambda (tmp2619)
          (if tmp2619
              (apply
                (lambda (_2623 e12622 e22621 e32620)
                  (cons
                    '#(syntax-object if ((top) #(ribcage #(_ e1 e2 e3) #((top) (top) (top) (top)) #("i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                    (cons
                      e12622
                      (cons
                        (cons
                          '#(syntax-object and ((top) #(ribcage #(_ e1 e2 e3) #((top) (top) (top) (top)) #("i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                          (cons e22621 e32620))
                        '#(syntax-object (#f) ((top) #(ribcage #(_ e1 e2 e3) #((top) (top) (top) (top)) #("i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))))))
                tmp2619)
              ((lambda (tmp2625)
                 (if tmp2625
                     (apply (lambda (_2627 e2626) e2626) tmp2625)
                     ((lambda (tmp2628)
                        (if tmp2628
                            (apply
                              (lambda (_2629)
                                '#(syntax-object #t ((top) #(ribcage #(_) #((top)) #("i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t))))
                              tmp2628)
                            (syntax-error tmp2618)))
                       ($syntax-dispatch tmp2618 '(any)))))
                ($syntax-dispatch tmp2618 '(any any)))))
         ($syntax-dispatch tmp2618 '(any any any . each-any))))
      x2617))
  '*top*)
