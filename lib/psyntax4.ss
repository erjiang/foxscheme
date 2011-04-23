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
