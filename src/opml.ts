import { renderOPML } from "./render/opml";
import { OpmlHeadOptions, OpmlOptions, OpmlOutlineOptions } from "./typings";

const defaultVersion = "2.0";

export class Opml {
  private _options: OpmlOptions;

  constructor(options?: OpmlOptions) {
    this._options = options ?? {
      version: defaultVersion,
      head: {},
      body: { outlines: [] },
    };
  }

  get version() {
    return this._options.version;
  }

  set version(version: string) {
    this._options.version = version;
  }

  get head(): OpmlHeadOptions {
    return this._options.head;
  }

  set head(head: OpmlHeadOptions) {
    this._options.head = head;
  }

  setHead<K extends keyof OpmlHeadOptions>(name: K, value: OpmlHeadOptions[K]) {
    this._options.head[name] = value;
  }

  get outlines(): OpmlOutlineOptions[] {
    return this._options.body.outlines;
  }

  set outlines(outlines: OpmlOutlineOptions[]) {
    this._options.body.outlines = outlines;
  }

  addOutline(outline: OpmlOutlineOptions) {
    this._options.body.outlines.push(outline);
  }

  toString() {
    return renderOPML(this);
  }
}
