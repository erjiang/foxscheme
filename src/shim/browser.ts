import {defun} from "../system/native";
import String from "../system/string";
import {Error} from "../system/error";
import nothing from "../system/nothing";
import * as FoxScheme from "../foxscheme";

declare global {
  interface Window { FoxScheme: any; $fs: any }
}

window.FoxScheme = FoxScheme;
window.$fs = window.FoxScheme;

/*
 * This is neither asynchronous nor XML, so we can't really call it AJAX, can
 * we? More like... J
 */
defun("load", 1, 2,
  function(url, evalproc) {
    if(!(url instanceof String))
      throw new Error("Must specify a URL string to load from",
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
      throw new Error("Internet request failed: "+e.message, "load")
    }
    /*
     * XMLHttpRequest is now done
     */
    if(xhr.status >= 400) {
      throw new Error([
          "Failed to open "
        , url
        , ": Error "
        , xhr.status
        , " "
        , xhr.statusText
        ].join(""),
        "load")
    }
    var p = new Parser(xhr.responseText);
    let o;
    while((o = p.nextObject()) !== Parser.EOS) {
      evalproc.apply(this, [o])
    }
    return nothing
  })

defun("js:load", 1, 1,
  function(url) {
    if(document === undefined)
      throw new Error("'document' not defined. Are you running in a browser?", "js:load");

    var head = document.getElementsByTagName("head")[0];

    var newNode = document.createElement("script");
    newNode.src = url.getValue();

    head.appendChild(newNode);

    return nothing;
  })