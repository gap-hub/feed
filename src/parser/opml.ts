import * as convert from "xml-js";

import { Opml } from "../opml";
import {
  OpmlBodyOptions,
  OpmlHeadOptions,
  OpmlOutlineOptions,
} from "../typings";
import { isNumber } from "../utils";

export function parseOPML(text: string): Opml {
  const result: convert.ElementCompact = convert.xml2js(text, {
    compact: true,
  });
  if (!result?.opml) {
    throw new Error("Invalid OPML");
  }
  return new Opml({
    version: result.opml._attributes?.version ?? "",
    head: result.opml.head ? parseHead(result.opml.head) : {},
    body: result.opml.body ? parseBody(result.opml.body) : { outlines: [] },
  });
}

function parseHead(xml: convert.ElementCompact): OpmlHeadOptions {
  const head: OpmlHeadOptions = {};
  const keys = Object.keys(xml);
  keys.forEach((key) => {
    const value: string | number | undefined =
      xml[key]?._text || xml[key]?._cdata;
    if (!value) {
      return;
    }
    if (["dateCreated", "dateModified"].includes(key)) {
      head[key] = new Date(value);
    } else if (
      [
        "vertScrollState",
        "windowTop",
        "windowLeft",
        "windowBottom",
        "windowRight",
      ].includes(key)
    ) {
      const num = Number(value);
      if (!isNaN(num)) {
        head[key] = num;
      }
    } else if (key === "expansionState") {
      if (isNumber(value)) {
        head[key] = [value];
      } else {
        head[key] = value
          .split(",")
          .map((num) => Number(num.trim()))
          .filter((num) => !isNaN(num));
      }
    } else {
      head[key] = value;
    }
  });
  return head;
}

function parseBody(xml: convert.ElementCompact): OpmlBodyOptions {
  const body: OpmlBodyOptions = { outlines: [] };
  let outlinesXml = xml.outline;
  if (!Array.isArray(outlinesXml)) {
    outlinesXml = [outlinesXml];
  }
  const outlines: OpmlOutlineOptions[] = [];
  parseOutlines(outlinesXml, outlines);
  body.outlines = outlines;
  return body;
}

function parseOutlines(
  xml: convert.ElementCompact[],
  outlines: OpmlOutlineOptions[],
) {
  for (let i = 0, len = xml.length; i < len; i++) {
    const outlineXml = xml[i];
    const outline = parseOutline(outlineXml);
    outlines.push(outline);
    if (outlineXml.outline) {
      let children = outlineXml.outline;
      if (!Array.isArray(children)) {
        children = [children];
      }
      outline.outlines = [];
      parseOutlines(children, outline.outlines);
    }
  }
}

function parseOutline(xml: convert.ElementCompact): OpmlOutlineOptions {
  const outline: OpmlOutlineOptions = {
    text: "",
  };
  if (xml._attributes) {
    const keys = Object.keys(xml._attributes);
    keys.forEach((key) => {
      const value = xml._attributes![key];
      if (!value) {
        return;
      }
      if (key === "isComment" || key === "isBreakpoint") {
        outline[key] = value === "true";
      } else if (key === "created") {
        outline.created = new Date(value);
      } else {
        (outline as any)[key] = value;
      }
    });
  }
  return outline;
}
