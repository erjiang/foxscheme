/*
 * FoxScheme
 *
 * Currently, this file combines the main user-callable classes of FoxScheme.
 * It is expected that the FoxScheme system is run after this.
 */
import {default as Interpreter} from "./system/interpreter";
import {default as Parser} from "./system/parser";
import {default as nativeprocedures} from "./system/native";
import {default as String} from "./system/string";
import {default as Char} from "./system/char";
import {default as Pair} from "./system/pair";
import {default as Vector} from "./system/vector";
import {default as Symbol} from "./system/symbol";
import {default as Gensym} from "./system/gensym";
import {default as nil} from "./system/nil";
import {default as nothing} from "./system/nothing";
import {defun as defun} from "./system/native";
import { Error as Error, Bug as Bug } from "./system/error";

const FoxScheme = {
    Interpreter,
    Parser,
    nativeprocedures,
    String,
    Char,
    Pair,
    Vector,
    Symbol,
    Gensym,
    nil,
    nothing,
    defun,
    Error,
    Bug
};

export {
    Interpreter,
    Parser,
    nativeprocedures,
    String,
    Char,
    Pair,
    Vector,
    Symbol,
    Gensym,
    nil,
    nothing,
    defun,
    Error,
    Bug
};

export default FoxScheme;
