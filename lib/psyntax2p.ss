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
($sc-put-cte
  '#(syntax-object datum ((top) #(ribcage #(datum) #((top)) #(datum))))
  (lambda (x2570)
    ((lambda (tmp2571)
       ((lambda (tmp2572)
          (if tmp2572
              (apply
                (lambda (dummy2574 x2573)
                  (list
                    '#(syntax-object syntax-object->datum ((top) #(ribcage #(dummy x) #(("m" top) (top)) #("i" "i")) #(ribcage () () ()) #(ribcage #(x) #(("m" top)) #("i")) #(top-ribcage *top* #t)))
                    (list
                      '#(syntax-object syntax ((top) #(ribcage #(dummy x) #(("m" top) (top)) #("i" "i")) #(ribcage () () ()) #(ribcage #(x) #(("m" top)) #("i")) #(top-ribcage *top* #t)))
                      x2573)))
                tmp2572)
              (syntax-error tmp2571)))
         ($syntax-dispatch tmp2571 '(any any))))
      x2570))
  '*top*)
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
($sc-put-cte
  '#(syntax-object cond ((top) #(ribcage #(cond) #((top)) #(cond))))
  (lambda (x2687)
    ((lambda (tmp2688)
       ((lambda (tmp2689)
          (if tmp2689
              (apply
                (lambda (_2692 m12691 m22690)
                  ((letrec ((f2693 (lambda (clause2695 clauses2694)
                                     (if (null? clauses2694)
                                         ((lambda (tmp2696)
                                            ((lambda (tmp2697)
                                               (if tmp2697
                                                   (apply
                                                     (lambda (e12699
                                                              e22698)
                                                       (cons
                                                         '#(syntax-object begin ((top) #(ribcage #(e1 e2) #((top) (top)) #("i" "i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                         (cons
                                                           e12699
                                                           e22698)))
                                                     tmp2697)
                                                   ((lambda (tmp2701)
                                                      (if tmp2701
                                                          (apply
                                                            (lambda (e02702)
                                                              (cons
                                                                '#(syntax-object let ((top) #(ribcage #(e0) #((top)) #("i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                                (cons
                                                                  (list
                                                                    (list
                                                                      '#(syntax-object t ((top) #(ribcage #(e0) #((top)) #("i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                                      e02702))
                                                                  '#(syntax-object ((if t t)) ((top) #(ribcage #(e0) #((top)) #("i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t))))))
                                                            tmp2701)
                                                          ((lambda (tmp2703)
                                                             (if tmp2703
                                                                 (apply
                                                                   (lambda (e02705
                                                                            e12704)
                                                                     (list
                                                                       '#(syntax-object let ((top) #(ribcage #(e0 e1) #((top) (top)) #("i" "i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                                       (list
                                                                         (list
                                                                           '#(syntax-object t ((top) #(ribcage #(e0 e1) #((top) (top)) #("i" "i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                                           e02705))
                                                                       (list
                                                                         '#(syntax-object if ((top) #(ribcage #(e0 e1) #((top) (top)) #("i" "i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                                         '#(syntax-object t ((top) #(ribcage #(e0 e1) #((top) (top)) #("i" "i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                                         (cons
                                                                           e12704
                                                                           '#(syntax-object (t) ((top) #(ribcage #(e0 e1) #((top) (top)) #("i" "i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))))))
                                                                   tmp2703)
                                                                 ((lambda (tmp2706)
                                                                    (if tmp2706
                                                                        (apply
                                                                          (lambda (e02709
                                                                                   e12708
                                                                                   e22707)
                                                                            (list
                                                                              '#(syntax-object if ((top) #(ribcage #(e0 e1 e2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                                              e02709
                                                                              (cons
                                                                                '#(syntax-object begin ((top) #(ribcage #(e0 e1 e2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                                                (cons
                                                                                  e12708
                                                                                  e22707))))
                                                                          tmp2706)
                                                                        ((lambda (_2711)
                                                                           (syntax-error
                                                                             x2687))
                                                                          tmp2696)))
                                                                   ($syntax-dispatch
                                                                     tmp2696
                                                                     '(any any
                                                                           .
                                                                           each-any)))))
                                                            ($syntax-dispatch
                                                              tmp2696
                                                              '(any #(free-id
                                                                      #(syntax-object => ((top) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t))))
                                                                    any)))))
                                                     ($syntax-dispatch
                                                       tmp2696
                                                       '(any)))))
                                              ($syntax-dispatch
                                                tmp2696
                                                '(#(free-id
                                                    #(syntax-object else ((top) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t))))
                                                   any
                                                   .
                                                   each-any))))
                                           clause2695)
                                         ((lambda (tmp2712)
                                            ((lambda (rest2713)
                                               ((lambda (tmp2714)
                                                  ((lambda (tmp2715)
                                                     (if tmp2715
                                                         (apply
                                                           (lambda (e02716)
                                                             (list
                                                               '#(syntax-object let ((top) #(ribcage #(e0) #((top)) #("i")) #(ribcage #(rest) #((top)) #("i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                               (list
                                                                 (list
                                                                   '#(syntax-object t ((top) #(ribcage #(e0) #((top)) #("i")) #(ribcage #(rest) #((top)) #("i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                                   e02716))
                                                               (list
                                                                 '#(syntax-object if ((top) #(ribcage #(e0) #((top)) #("i")) #(ribcage #(rest) #((top)) #("i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                                 '#(syntax-object t ((top) #(ribcage #(e0) #((top)) #("i")) #(ribcage #(rest) #((top)) #("i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                                 '#(syntax-object t ((top) #(ribcage #(e0) #((top)) #("i")) #(ribcage #(rest) #((top)) #("i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                                 rest2713)))
                                                           tmp2715)
                                                         ((lambda (tmp2717)
                                                            (if tmp2717
                                                                (apply
                                                                  (lambda (e02719
                                                                           e12718)
                                                                    (list
                                                                      '#(syntax-object let ((top) #(ribcage #(e0 e1) #((top) (top)) #("i" "i")) #(ribcage #(rest) #((top)) #("i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                                      (list
                                                                        (list
                                                                          '#(syntax-object t ((top) #(ribcage #(e0 e1) #((top) (top)) #("i" "i")) #(ribcage #(rest) #((top)) #("i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                                          e02719))
                                                                      (list
                                                                        '#(syntax-object if ((top) #(ribcage #(e0 e1) #((top) (top)) #("i" "i")) #(ribcage #(rest) #((top)) #("i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                                        '#(syntax-object t ((top) #(ribcage #(e0 e1) #((top) (top)) #("i" "i")) #(ribcage #(rest) #((top)) #("i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                                        (cons
                                                                          e12718
                                                                          '#(syntax-object (t) ((top) #(ribcage #(e0 e1) #((top) (top)) #("i" "i")) #(ribcage #(rest) #((top)) #("i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t))))
                                                                        rest2713)))
                                                                  tmp2717)
                                                                ((lambda (tmp2720)
                                                                   (if tmp2720
                                                                       (apply
                                                                         (lambda (e02723
                                                                                  e12722
                                                                                  e22721)
                                                                           (list
                                                                             '#(syntax-object if ((top) #(ribcage #(e0 e1 e2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage #(rest) #((top)) #("i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                                             e02723
                                                                             (cons
                                                                               '#(syntax-object begin ((top) #(ribcage #(e0 e1 e2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage #(rest) #((top)) #("i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t)))
                                                                               (cons
                                                                                 e12722
                                                                                 e22721))
                                                                             rest2713))
                                                                         tmp2720)
                                                                       ((lambda (_2725)
                                                                          (syntax-error
                                                                            x2687))
                                                                         tmp2714)))
                                                                  ($syntax-dispatch
                                                                    tmp2714
                                                                    '(any any
                                                                          .
                                                                          each-any)))))
                                                           ($syntax-dispatch
                                                             tmp2714
                                                             '(any #(free-id
                                                                     #(syntax-object => ((top) #(ribcage #(rest) #((top)) #("i")) #(ribcage () () ()) #(ribcage #(clause clauses) #((top) (top)) #("i" "i")) #(ribcage #(f) #((top)) #("i")) #(ribcage #(_ m1 m2) #((top) (top) (top)) #("i" "i" "i")) #(ribcage () () ()) #(ribcage #(x) #((top)) #("i")) #(top-ribcage *top* #t))))
                                                                   any)))))
                                                    ($syntax-dispatch
                                                      tmp2714
                                                      '(any))))
                                                 clause2695))
                                              tmp2712))
                                           (f2693
                                             (car clauses2694)
                                             (cdr clauses2694)))))))
                     f2693)
                    m12691
                    m22690))
                tmp2689)
              (syntax-error tmp2688)))
         ($syntax-dispatch tmp2688 '(any any . each-any))))
      x2687))
  '*top*)
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
