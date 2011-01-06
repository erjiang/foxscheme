/*
 * This is neither asynchronous nor XML, so we can't really call it AJAX, can
 * we? More like... J
 */
FoxScheme.nativeprocedures.defun("load", 1, 2,
    function(url, evalproc) {
        if(!(url instanceof FoxScheme.String))
            throw new FoxScheme.Error("Must specify a URL string to load from",
                "load")
        if(evalproc === undefined)
            evalproc = this.eval
        url = url.getValue()
        var xhr = new XMLHttpRequest()
        xhr.open("GET", url, false)
        try {
            xhr.send(null)
        } catch (e) {
            throw new FoxScheme.Error("Internet request failed: "+e.message, "load")
        }
        var p = new FoxScheme.Parser(xhr.responseText)
        var o
        while((o = p.nextObject()) !== FoxScheme.Parser.EOS) {
            evalproc.apply(this, [o])
        }
        return FoxScheme.nothing
    })
