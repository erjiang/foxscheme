
/*
 * FoxScheme
 *
 * Currently, this file combines the main user-callable classes of FoxScheme.
 * It is expected that the FoxScheme system is run after this.
 */
export {default as Interpreter} from "./system/interpreter";
export {default as Parser} from "./system/interpreter";
export {default as nativeprocedures} from "./system/native";
export {defun as defun} from "./system/native";