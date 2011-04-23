($sc-put-cte
  '#(syntax-object do ((top) #(ribcage #(do) #((top)) #(do))))
  (lambda (orig-x2727)
    ((lambda (tmp2728)
       ((lambda (tmp2729)
          (if tmp2729
              (apply
                (lambda (_2736 var2735 init2734 step2733 e02732 e12731
                         c2730)
                  ((lambda (tmp2737)
                     ((lambda (tmp2747)
                        (if tmp2747
                            (apply
                              (lambda (step2748)
                                ((lambda (tmp2749)
                                   ((lambda (tmp2751)
                                      (if tmp2751
                                          (apply
                                            (lambda ()
                                              (list
                                                '#(syntax-object let ((top) #(ribcage #(step) #((top)) #("i")) #(ribcage #(_ var init step e0 e1 c) #((top) (top) (top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(orig-x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                '#(syntax-object do ((top) #(ribcage #(step) #((top)) #("i")) #(ribcage #(_ var init step e0 e1 c) #((top) (top) (top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(orig-x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                (map list var2735 init2734)
                                                (list
                                                  '#(syntax-object if ((top) #(ribcage #(step) #((top)) #("i")) #(ribcage #(_ var init step e0 e1 c) #((top) (top) (top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(orig-x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                  (list
                                                    '#(syntax-object not ((top) #(ribcage #(step) #((top)) #("i")) #(ribcage #(_ var init step e0 e1 c) #((top) (top) (top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(orig-x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                    e02732)
                                                  (cons
                                                    '#(syntax-object begin ((top) #(ribcage #(step) #((top)) #("i")) #(ribcage #(_ var init step e0 e1 c) #((top) (top) (top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(orig-x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                    (append
                                                      c2730
                                                      (list
                                                        (cons
                                                          '#(syntax-object do ((top) #(ribcage #(step) #((top)) #("i")) #(ribcage #(_ var init step e0 e1 c) #((top) (top) (top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(orig-x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                          step2748)))))))
                                            tmp2751)
                                          ((lambda (tmp2756)
                                             (if tmp2756
                                                 (apply
                                                   (lambda (e12758 e22757)
                                                     (list
                                                       '#(syntax-object let ((top) #(ribcage #(e1 e2) #((top) (top)) #("i" "i")) #(ribcage #(step) #((top)) #("i")) #(ribcage #(_ var init step e0 e1 c) #((top) (top) (top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(orig-x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                       '#(syntax-object do ((top) #(ribcage #(e1 e2) #((top) (top)) #("i" "i")) #(ribcage #(step) #((top)) #("i")) #(ribcage #(_ var init step e0 e1 c) #((top) (top) (top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(orig-x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                       (map list
                                                            var2735
                                                            init2734)
                                                       (list
                                                         '#(syntax-object if ((top) #(ribcage #(e1 e2) #((top) (top)) #("i" "i")) #(ribcage #(step) #((top)) #("i")) #(ribcage #(_ var init step e0 e1 c) #((top) (top) (top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(orig-x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                         e02732
                                                         (cons
                                                           '#(syntax-object begin ((top) #(ribcage #(e1 e2) #((top) (top)) #("i" "i")) #(ribcage #(step) #((top)) #("i")) #(ribcage #(_ var init step e0 e1 c) #((top) (top) (top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(orig-x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                           (cons
                                                             e12758
                                                             e22757))
                                                         (cons
                                                           '#(syntax-object begin ((top) #(ribcage #(e1 e2) #((top) (top)) #("i" "i")) #(ribcage #(step) #((top)) #("i")) #(ribcage #(_ var init step e0 e1 c) #((top) (top) (top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(orig-x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                           (append
                                                             c2730
                                                             (list
                                                               (cons
                                                                 '#(syntax-object do ((top) #(ribcage #(e1 e2) #((top) (top)) #("i" "i")) #(ribcage #(step) #((top)) #("i")) #(ribcage #(_ var init step e0 e1 c) #((top) (top) (top) (top) (top) (top) (top)) #("i" "i" "i" "i" "i" "i" "i")) #(ribcage () () ()) #(ribcage #(orig-x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                                 step2748)))))))
                                                   tmp2756)
                                                 (syntax-error tmp2749)))
                                            ($syntax-dispatch
                                              tmp2749
                                              '(any . each-any)))))
                                     ($syntax-dispatch tmp2749 '())))
                                  e12731))
                              tmp2747)
                            (syntax-error tmp2737)))
                       ($syntax-dispatch tmp2737 'each-any)))
                    (map (lambda (v2741 s2740)
                           ((lambda (tmp2742)
                              ((lambda (tmp2743)
                                 (if tmp2743
                                     (apply (lambda () v2741) tmp2743)
                                     ((lambda (tmp2744)
                                        (if tmp2744
                                            (apply
                                              (lambda (e2745) e2745)
                                              tmp2744)
                                            ((lambda (_2746)
                                               (syntax-error orig-x2727))
                                              tmp2742)))
                                       ($syntax-dispatch tmp2742 '(any)))))
                                ($syntax-dispatch tmp2742 '())))
                             s2740))
                         var2735
                         step2733)))
                tmp2729)
              (syntax-error tmp2728)))
         ($syntax-dispatch
           tmp2728
           '(any #(each (any any . any))
                 (any . each-any)
                 .
                 each-any))))
      orig-x2727))
  '*top*)
