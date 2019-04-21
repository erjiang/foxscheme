import { Bug } from "./error";

export default class Symbol {
    _name: string;

    constructor(name: string) {
        // check to see if the symbol name is proper
        if (name === null)
            throw new Error("Tried to create a symbol without a name");
        if (name.indexOf(" ") !== -1)
            throw new Error("Invalid symbol name: \"" + name + "\"");

        var invalid = ["."];
        for (var i in invalid) {
            if (name === invalid[i])
                // this kind of thing should be caught by the parser...
                throw new Bug("Invalid symbol name: " + name, "Symbol")
        }

        // finish initialization
        this._name = name;
    }
    toString() { return this._name; }
    name() { return this._name; }
};
