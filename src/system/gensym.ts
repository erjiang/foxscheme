let gensymcount = 0;
let printgensym = true;

export default class Gensym {
  _shortname: string;
  _name: string;

  constructor(shortname?: string, name?: string) {
    if (shortname === undefined) {
      shortname = "g" + gensymcount;
    }

    this._shortname = shortname

    if (name === undefined)
      this._name = "_" + shortname + "__fox-" + gensymcount;
    else
      this._name = name

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
}