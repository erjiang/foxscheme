($sc-put-cte
  '#(syntax-object syntax-rules ((top) #(ribcage #(syntax-rules) #((top)) #(syntax-rules))))
  (lambda (x2575)
    (letrec ((clause2576 (lambda (y2592)
                           ((lambda (tmp2593)
                              ((lambda (tmp2594)
                                 (if tmp2594
                                     (apply
                                       (lambda (keyword2597 pattern2596
                                                template2595)
                                         (list
                                           (cons
                                             '#(syntax-object dummy ((top) #(ribcage #(keyword pattern template) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(y) #((top)) #("i")) #(ribcage (clause) ((top)) ("i")) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                             pattern2596)
                                           (list
                                             '#(syntax-object syntax ((top) #(ribcage #(keyword pattern template) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(y) #((top)) #("i")) #(ribcage (clause) ((top)) ("i")) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                             template2595)))
                                       tmp2594)
                                     ((lambda (tmp2598)
                                        (if tmp2598
                                            (apply
                                              (lambda (keyword2602
                                                       pattern2601
                                                       fender2600
                                                       template2599)
                                                (list
                                                  (cons
                                                    '#(syntax-object dummy ((top) #(ribcage #(keyword pattern fender template) #((top) (top) (top) (top)) #("i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(y) #((top)) #("i")) #(ribcage (clause) ((top)) ("i")) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                    pattern2601)
                                                  fender2600
                                                  (list
                                                    '#(syntax-object syntax ((top) #(ribcage #(keyword pattern fender template) #((top) (top) (top) (top)) #("i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(y) #((top)) #("i")) #(ribcage (clause) ((top)) ("i")) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                    template2599)))
                                              tmp2598)
                                            ((lambda (_2603)
                                               (syntax-error x2575))
                                              tmp2593)))
                                       ($syntax-dispatch
                                         tmp2593
                                         '((any . any) any any)))))
                                ($syntax-dispatch
                                  tmp2593
                                  '((any . any) any))))
                             y2592))))
      ((lambda (tmp2577)
         ((lambda (tmp2578)
            (if (if tmp2578
                    (apply
                      (lambda (_2581 k2580 cl2579)
                        (andmap identifier? k2580))
                      tmp2578)
                    '#f)
                (apply
                  (lambda (_2585 k2584 cl2583)
                    ((lambda (tmp2586)
                       ((lambda (tmp2588)
                          (if tmp2588
                              (apply
                                (lambda (cl2589)
                                  (list
                                    '#(syntax-object lambda ((top) #(ribcage #(cl) #((top)) #("i")) #(ribcage #(_ k cl) #((top) (top) (top)) #("i" "i" "i")) #(ribcage (clause) ((top)) ("i")) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                    '#(syntax-object (x) ((top) #(ribcage #(cl) #((top)) #("i")) #(ribcage #(_ k cl) #((top) (top) (top)) #("i" "i" "i")) #(ribcage (clause) ((top)) ("i")) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                    (cons
                                      '#(syntax-object syntax-case ((top) #(ribcage #(cl) #((top)) #("i")) #(ribcage #(_ k cl) #((top) (top) (top)) #("i" "i" "i")) #(ribcage (clause) ((top)) ("i")) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                      (cons
                                        '#(syntax-object x ((top) #(ribcage #(cl) #((top)) #("i")) #(ribcage #(_ k cl) #((top) (top) (top)) #("i" "i" "i")) #(ribcage (clause) ((top)) ("i")) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                        (cons k2584 cl2589)))))
                                tmp2588)
                              (syntax-error tmp2586)))
                         ($syntax-dispatch tmp2586 'each-any)))
                      (map clause2576 cl2583)))
                  tmp2578)
                (syntax-error tmp2577)))
           ($syntax-dispatch tmp2577 '(any each-any . each-any))))
        x2575)))
  '*top*)
