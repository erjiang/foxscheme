(define dom:getElementById
  (js:procedure
    "function(id) {
       return document.getElementById(id.getValue())
    }"))

(define dom:appendChild
  (js:procedure
    "function(element, child) {
       return element.appendChild(child)
    }"))

(define dom:createElement
  (js:procedure
    "function(html) {
       return document.createElement(html.getValue());
    }"))

(define canvas:getContext
  (js:procedure
    "function(canvas) {
      return canvas.getContext('2d')
    }"))

(define current-canvas
  (let ((mycanvas (dom:appendChild
                    (dom:getElementById "guide")
                    (js:eval "var mycanvas = document.createElement('canvas');
                              mycanvas.width = 300;
                              mycanvas.height= 300;
                              mycanvas")
                             )))
    (lambda () mycanvas)))

(js:eval "alert('canvas loaded!')")

(define current-canvas-context
  (let ((context (canvas:getContext (current-canvas))))
          (lambda () context)))

(define ccc current-canvas-context)

(define canvas:fillStyle
  (lambda (color)
    ((js:procedure
       "function(ccc, color) {
          ccc.fillStyle = color.getValue()
       }") (ccc) color)))

(define canvas:fillRect
  (lambda (x1 y1 x2 y2)
    ((js:procedure
       "function(ccc, x1, y1, x2, y2) {
          return ccc.fillRect(x1, y1, x2, y2)
       }") (ccc) x1 y1 x2 y2)))
