($sc-put-cte
  '#(syntax-object with-implicit ((top) #(ribcage #(with-implicit) #((top)) #(with-implicit))))
  (lambda (x2554)
    ((lambda (tmp2555)
       ((lambda (tmp2556)
          (if (if tmp2556
                  (apply
                    (lambda (dummy2561 tid2560 id2559 e12558 e22557)
                      (andmap identifier? (cons tid2560 id2559)))
                    tmp2556)
                  '#f)
              (apply
                (lambda (dummy2567 tid2566 id2565 e12564 e22563)
                  (list
                    '#(syntax-object begin ((top) #(ribcage #(dummy tid id e1 e2) #(("m" top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #(("m" top)) #("i")) #(top-ribcage *top* #t)))
                    (list
                      '#(syntax-object unless ((top) #(ribcage #(dummy tid id e1 e2) #(("m" top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #(("m" top)) #("i")) #(top-ribcage *top* #t)))
                      (list
                        '#(syntax-object identifier? ((top) #(ribcage #(dummy tid id e1 e2) #(("m" top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #(("m" top)) #("i")) #(top-ribcage *top* #t)))
                        (list
                          '#(syntax-object syntax ((top) #(ribcage #(dummy tid id e1 e2) #(("m" top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #(("m" top)) #("i")) #(top-ribcage *top* #t)))
                          tid2566))
                      (cons
                        '#(syntax-object syntax-error ((top) #(ribcage #(dummy tid id e1 e2) #(("m" top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #(("m" top)) #("i")) #(top-ribcage *top* #t)))
                        (cons
                          (list
                            '#(syntax-object syntax ((top) #(ribcage #(dummy tid id e1 e2) #(("m" top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #(("m" top)) #("i")) #(top-ribcage *top* #t)))
                            tid2566)
                          '#(syntax-object ("non-identifier with-implicit template") ((top) #(ribcage #(dummy tid id e1 e2) #(("m" top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #(("m" top)) #("i")) #(top-ribcage *top* #t))))))
                    (cons
                      '#(syntax-object with-syntax ((top) #(ribcage #(dummy tid id e1 e2) #(("m" top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #(("m" top)) #("i")) #(top-ribcage *top* #t)))
                      (cons
                        (map (lambda (tmp2568)
                               (list
                                 tmp2568
                                 (list
                                   '#(syntax-object datum->syntax-object ((top) #(ribcage #(dummy tid id e1 e2) #(("m" top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #(("m" top)) #("i")) #(top-ribcage *top* #t)))
                                   (list
                                     '#(syntax-object syntax ((top) #(ribcage #(dummy tid id e1 e2) #(("m" top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #(("m" top)) #("i")) #(top-ribcage *top* #t)))
                                     tid2566)
                                   (list
                                     '#(syntax-object quote ((top) #(ribcage #(dummy tid id e1 e2) #(("m" top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #(("m" top)) #("i")) #(top-ribcage *top* #t)))
                                     tmp2568))))
                             id2565)
                        (cons e12564 e22563)))))
                tmp2556)
              (syntax-error tmp2555)))
         ($syntax-dispatch
           tmp2555
           '(any (any . each-any) any . each-any))))
      x2554))
  '*top*)
