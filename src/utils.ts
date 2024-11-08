import * as convert from "xml-js";

import { FeedItem } from "./feed-item";
import { Enclosure } from "./typings";

/**
 * Sanitize the URL
 * @param url - The URL to sanitize
 * @returns The sanitized URL
 */
export function sanitize(url: string | undefined): string | undefined {
  if (typeof url === "undefined") {
    return;
  }
  return url.replace(/&/g, "&amp;");
}

/**
 * Check if the value is a string
 * @param value - The value to check
 * @returns True if the value is a string, false otherwise
 */
export function isString(value: any): value is string {
  return typeof value === "string";
}

export function isNumber(value: any): value is number {
  return typeof value === "number";
}

/**
 * Check if the value is a valid URL
 * @param value - The value to check
 * @returns True if the value is a valid URL, false otherwise
 */
export function isURL(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if the tag name is a valid XML tag name
 * @param tagName - The tag name to check
 * @returns True if the tag name is valid, false otherwise
 */
export function isValidTagName(tagName: string): boolean {
  if (tagName.length === 0) {
    return false;
  }
  if (/^xml/i.test(tagName)) {
    return false;
  }
  return /^[a-zA-Z_][\w.-]*(:[\w.-]+)*$/.test(tagName);
}

export function parseItemEnclosure(
  enclosure: convert.ElementCompact,
  feedItem: FeedItem,
  urlKey: string = "url",
) {
  const originalType = enclosure._attributes?.type?.toString();
  let type = "image";
  if (originalType && originalType.includes("/")) {
    type = originalType.split("/")[0];
  }
  let length: number | undefined = undefined;
  if (enclosure._attributes?.length) {
    const num = parseInt(enclosure._attributes?.length.toString());
    if (!isNaN(num)) {
      length = num;
    }
  }
  const result: Enclosure = {
    url: enclosure._attributes?.[urlKey]?.toString() || "",
    type: originalType,
    length,
    title: enclosure._attributes?.title?.toString(),
  };
  feedItem.options.enclosure = result;
  if (type === "image") {
    feedItem.options.image = result;
  } else if (type === "audio") {
    feedItem.options.audio = result;
  } else if (type === "video") {
    feedItem.options.video = result;
  }
}
