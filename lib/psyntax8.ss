($sc-put-cte
  '#(syntax-object let ((top) #(ribcage #(let) #((top)) #(let))))
  (lambda (x2630)
    ((lambda (tmp2631)
       ((lambda (tmp2632)
          (if (if tmp2632
                  (apply
                    (lambda (_2637 x2636 v2635 e12634 e22633)
                      (andmap identifier? x2636))
                    tmp2632)
                  '#f)
              (apply
                (lambda (_2643 x2642 v2641 e12640 e22639)
                  (cons
                    (cons
                      '#(syntax-object lambda ((top) #(ribcage #(_ x v e1 e2) #((top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                      (cons x2642 (cons e12640 e22639)))
                    v2641))
                tmp2632)
              ((lambda (tmp2647)
                 (if (if tmp2647
                         (apply
                           (lambda (_2653 f2652 x2651 v2650 e12649 e22648)
                             (andmap identifier? (cons f2652 x2651)))
                           tmp2647)
                         '#f)
                     (apply
                       (lambda (_2660 f2659 x2658 v2657 e12656 e22655)
                         (cons
                           (list
                             '#(syntax-object letrec ((top) #(ribcage #(_ f x v e1 e2) #((top) (top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                             (list
                               (list
                                 f2659
                                 (cons
                                   '#(syntax-object lambda ((top) #(ribcage #(_ f x v e1 e2) #((top) (top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                   (cons x2658 (cons e12656 e22655)))))
                             f2659)
                           v2657))
                       tmp2647)
                     (syntax-error tmp2631)))
                ($syntax-dispatch
                  tmp2631
                  '(any any #(each (any any)) any . each-any)))))
         ($syntax-dispatch
           tmp2631
           '(any #(each (any any)) any . each-any))))
      x2630))
  '*top*)
