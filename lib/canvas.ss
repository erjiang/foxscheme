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

(define canvas:createImageData
  (lambda (x y)
    ((js:procedure
       "function(ccc, x, y) { return ccc.createImageData(x, y) }")
     (ccc) x y)))

(define canvas:setPixel
  (lambda (imgd x y r g b a)
    ((js:procedure
       "function(imgd, x, y, r, g, b, a) {
          var spot = (y*imgd.width + x)*4;
          imgd.data[spot  ] = r;
          imgd.data[spot+1] = g;
          imgd.data[spot+2] = b;
          imgd.data[spot+3] = a;
        }")
      imgd x y r g b a)))

(define canvas:putImageData
  (lambda (imgd x y)
    ((js:procedure
       "function(ccc, imgd, x, y) { ccc.putImageData(imgd, x, y); }")
     (ccc) imgd x y)))
