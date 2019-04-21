import nil from "./nil";
import nothing from "./nothing";
import Pair from "./pair";

export type Expr = number | boolean | Pair | nil | nothing
export type List = Pair | nil;