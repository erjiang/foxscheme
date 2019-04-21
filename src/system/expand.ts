/*
 * Expand
 *
 * Recursively expand an expression and make unique all local references by
 * replacing vars with gensym'd names.
 */
import { Expr } from "./types";
import Symbol from "./symbol";
import Hash from "./hash";

type Env = Hash;

export default function Expand() {
    /*
     * Unlike the interpreter, env maps symbol names to gensym'd symbols
     * (String -> Symbol)
     */
    var expand = function(expr: Expr, env?: Env) {
        if(env === undefined) {
            env = new Hash();
        }

        if(expr instanceof Symbol) {
            var sym = expr.name();
            var lookup
            if((lookup = env.get(sym)) !== undefined) {
                return lookup;
            }
            else return expr;
        }

        else if(expr instanceof Pair) {
            /*
             * TODO: Optimize directly-applied lambdas to let statements a la
             * Chez Scheme:
             *    ((lambda (x) x) 5) => (let ((x 5)) x)
             */
            if(expr.first() instanceof Symbol) {
                /*
                 * applying expand on the rator BEFORE checking to see if
                 * it's "lambda" or "let" allows us to redefine lambda
                 *
                 * We first process the BINDINGS, modifying newenv along the way,
                 * and then we process the BODY, wrapping it in BEGIN if necessary
                 */
                var rator = this.expand(expr.first(), env)
                // don't keep going if it's not syntax
                // TODO: better organize this part
                // (cons rator (map expand (cdr expr)))
                if(rator.name() !== "lambda" && rator.name() !== "let") {
                    var that = this
                    return new Pair(rator,
                            Util.map(function (x) {
                                return that.expand(x, env) }, expr.cdr()))
                }
                /* 
                 * Now that we know for sure it's lambda or let syntax, check
                 * to make sure it's complete
                 */
                if(expr.length() < 3)
                    throw new Error("Invalid syntax: "+expr)
                var newenv = env.clone()
                var bindings = expr.second()
                var newbindings
                var body
                if(rator.name() === "lambda") {
                    // (lambda x body ...) case
                    if(bindings instanceof Symbol) {
                        newbindings = new Gensym(bindings.name())
                        newenv.set(bindings.name(), newbindings)
                    }
                    // (lambda (a b c ...) body ...)
                    else if(bindings instanceof Pair) {
                        var bindarr = Util.arrayify(bindings)
                        var i = bindarr.length
                        while(i--) {
                            if(!(bindarr[i] instanceof Symbol))
                                throw new Error("Bindings contains non-symbol "+
                                        bindarr[i], "Expand")

                            var oldsym = bindarr[i].name()
                            bindarr[i] = new Gensym(oldsym)
                            newenv.set(oldsym, bindarr[i])
                            if(bindings.isProper()) {
                                newbindings = Util.listify(bindarr)
                            } else {
                                // TODO: Improper lambda bindings
                                throw new Bug("TODO: Improper lambda bindings ...", "Expand")
                            }
                        }
                    }
                    // (lambda () body)
                    else if(bindings === nil) {
                        newbindings = nil
                    }
                    else
                        throw new Error("Invalid parameter list in "+expr, "Expand")
                }
                /*
                 * Let bindings:
                 *
                 * (let ((x 5) (y 6))
                 *   (let ((z x) (w v))
                 *     (+ w x y z))) =>
                 *
                 * (let ((_g_x-1 5) (_g_y-2 6))
                 *   (let ((_g_z-3 _g_x-1) (_g_w-4 v))
                 *     (+ _g_w-4 _g_x-1 _g_y-2 _g_z-3)))
                 */
                else if(rator.name() === "let") {
                    if(bindings === nil)
                        body = nil
                    else {
                        var bindarr = Util.arrayify(bindings)
                        var i = bindarr.length
                        while(i--) {
                            // error checking
                            if(!(bindarr[i] instanceof Pair))
                                throw new Error("Invalid binding in let: "+bindarr[i], "Expand")
                            var lhs = bindarr[i].car()
                            if(!(lhs instanceof Symbol))
                                throw new Error("In let statement, cannot bind "+oldvar, "Expand")

                            // replace lhs with gensym, expand rhs
                            var newlhs = new Gensym(lhs.name())
                            var rhs = this.expand(bindarr[i].second(), env)
                            
                            // augment the environment and replace the binding
                            newenv.set(lhs.name(), newlhs)
                            //bindarr[i] = Util.listify([newlhs, rhs])
                            bindarr[i] = new Pair(newlhs, new Pair(rhs, nil))
                        }
                        newbindings = Util.listify(bindarr)
                    }
                }
                /*
                 * multiple bodies:
                 *   (lambda x body1 body2 ...)
                 *   => (lambda x (begin body1 body2 ...))
                 */
                if(expr.length() > 3) {
                    // body = (cons 'begin (map expand (cddr expr)))
                    var that = this;
                    body = new Pair(new Symbol("begin"),
                        Util.map(function(expr) {
                            return that.expand(expr, newenv) },
                            expr.cdr().cdr()))
                }
                // single body
                else if(expr.length() === 3) {
                    body = this.expand(expr.third(), newenv)
                }

                // optimize (let () x) => x
                if(rator.name() === "let" &&
                   bindings === nil)
                    return body

                return Util.listify([expr.car(), newbindings, body])
            }
            // if the first element is not a symbol, then it's not a macro
            else { // if not symbol
                var that = this;
                return Util.map(function (expr) {
                    return that.expand(expr, env) }, expr)
            }
        }

        else { // if not a symbol or pair
            return expr
        }
    }
    return {
        expand: expand
    }
}();
