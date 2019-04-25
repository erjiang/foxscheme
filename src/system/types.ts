import nil, { Nil } from "./nil";
import nothing from "./nothing";
import Pair from "./pair";

export type Expr = number | boolean | Pair | Nil | Nothing
export type List = Pair | Nil;
