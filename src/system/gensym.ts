import Symbol from "./symbol";
let gensymcount = 0;
let printgensym = true;

export default class Gensym extends Symbol {
  _shortname: string;
  _name: string;

  constructor(shortname?: string, name?: string) {
    if (shortname === undefined) {
      shortname = "g" + gensymcount;
    }



    let tentativeName: string;
    if (name === undefined)
      tentativeName = "_" + shortname + "__fox-" + gensymcount;
    else
      tentativeName = name
    super(tentativeName);
    this._name = tentativeName;

    this._shortname = shortname

    gensymcount++;
  }
  setPrintGensym(newSetting: boolean) {
    printgensym = newSetting;
  }
  toString() {
    if (printgensym) {
      return ["#{", this._shortname, " ", this._name, "}"].join("")
    }
    else {
      return this._shortname
    }
  }
  name() {
    return this._name;
  }
}
