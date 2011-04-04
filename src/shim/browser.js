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
        /*
         * Prepare XMLHttpRequest
         */
        url = url.getValue()
        var xhr = new XMLHttpRequest()
        xhr.open("GET", url, false)
        /*
         * Send XMLHttpRequest
         */
        try {
            xhr.send(null)
        } catch (e) {
            throw new FoxScheme.Error("Internet request failed: "+e.message, "load")
        }
        /*
         * XMLHttpRequest is now done
         */
        if(xhr.status >= 400) {
            throw new FoxScheme.Error([
                  "Failed to open "
                , url
                , ": Error "
                , xhr.status
                , " "
                , xhr.statusText
                ].join(""),
                "load")
        }
        var p = new FoxScheme.Parser(xhr.responseText)
        var o
        while((o = p.nextObject()) !== null) {
            evalproc.apply(this, [o])
        }
        return FoxScheme.nothing
    })

FoxScheme.nativeprocedures.defun("js:load", 1, 1,
    function(url) {
        if(document === undefined)
            throw new FoxScheme.Error("'document' not defined. Are you running in a browser?", "js:load")

        var head = document.getElementsByTagName("head")[0]

        var newNode = document.createElement("script")
        newNode.src = url.getValue()

        head.appendChild(newNode)

        return FoxScheme.nothing
    })
