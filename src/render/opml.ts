import * as convert from "xml-js";

import { Opml } from "../opml";
import { OpmlOutlineOptions } from "../typings";

export function renderOPML(opml: Opml): string {
  const xml: any = {
    _declaration: { _attributes: { version: "1.0", encoding: "utf-8" } },
    opml: {
      _attributes: {
        version: opml.version,
      },
      head: {},
      body: { outline: [] },
    },
  };

  const headKeys = Object.keys(opml.head);
  headKeys.forEach((key) => {
    const value = opml.head[key];
    if (value) {
      let text: string = value.toString();
      if (value instanceof Date) {
        text = value.toUTCString();
      } else if (key === "expansionState") {
        if (Array.isArray(value)) {
          text = value.map((v) => v.toString()).join(", ");
        }
      }
      xml.opml.head[key] = { _text: text };
    }
  });

  formatOutlines(xml.opml.body.outline, opml.outlines);

  return convert.js2xml(xml, { compact: true, ignoreComment: true, spaces: 4 });
}

function formatOutlines(xml: any[], outlines: OpmlOutlineOptions[]) {
  if (outlines) {
    for (let i = 0, len = outlines.length; i < len; i++) {
      const item = outlines[i];
      const outline = formatOutline(item);
      xml.push(outline);
      if (item.outlines) {
        outline.outline = [];
        formatOutlines(outline.outline, item.outlines);
      }
    }
  }
}

function formatOutline(outline: OpmlOutlineOptions): any {
  const xml: any = {
    _attributes: {},
  };
  const keys = Object.keys(outline);
  keys.forEach((key) => {
    if (key === "outlines") {
      return;
    }
    const value = outline[key as keyof OpmlOutlineOptions];
    if (value) {
      if (value instanceof Date) {
        xml._attributes[key] = value.toUTCString();
      } else {
        xml._attributes[key] = value.toString();
      }
    }
  });
  return xml;
}
