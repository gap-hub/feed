import * as convert from "xml-js";

import { defaultTextType } from "../config";
import { Feed } from "../feed";
import { FeedItem } from "../feed-item";
import {
  Author,
  Enclosure,
  combinedFeedFields,
  combinedFeedItemFields,
} from "../typings";

export function parseRSS(xml: convert.ElementCompact): Feed {
  if (xml["rdf:RDF"]) {
    return buildRSS1(xml);
  } else if (xml.rss?._attributes?.version?.match(/0\.9/)) {
    return buildRSS09(xml);
  }
  return buildRSS2(xml);
}

function buildRSS09(xml: convert.ElementCompact): Feed {
  let channel = xml.rss.channel;
  if (Array.isArray(channel) && channel.length > 0) {
    channel = channel[0];
  }
  const items = channel.item;
  const feed = buildRSS(channel, items);
  const stylesheetHref = parseStylesheet(xml);
  if (stylesheetHref) {
    feed.stylesheet = stylesheetHref;
  }
  return feed;
}

function buildRSS1(xml: convert.ElementCompact): Feed {
  let channel = xml["rdf:RDF"].channel;
  if (Array.isArray(channel) && channel.length > 0) {
    channel = channel[0];
  }
  const items = channel.item;
  const feed = buildRSS(channel, items);
  const stylesheetHref = parseStylesheet(xml);
  if (stylesheetHref) {
    feed.stylesheet = stylesheetHref;
  }
  return feed;
}

function buildRSS2(xml: convert.ElementCompact): Feed {
  let channel = xml.rss.channel;
  if (Array.isArray(channel) && channel.length > 0) {
    channel = channel[0];
  }
  const items = channel.item;
  const feed = buildRSS(channel, items);
  const stylesheetHref = parseStylesheet(xml);
  if (stylesheetHref) {
    feed.stylesheet = stylesheetHref;
  }
  return feed;
}

function buildRSS(
  channel: convert.ElementCompact,
  items: convert.ElementCompact,
): Feed {
  const feed = new Feed({
    id: "",
    title: channel?.title?._text ?? "",
    link: channel?.link?._text ?? "",
    description: channel?.description?._text ?? "",
    updated: channel?.lastBuildDate?._text
      ? new Date(channel.lastBuildDate._text)
      : new Date(),
    docs:
      channel?.docs?._text ?? "https://validator.w3.org/feed/docs/rss2.html",
    generator: channel?.generator?._text,
    copyright: channel?.copyright?._text,
    language: channel?.language?._text,
  });
  const ignoreKeys = [
    "id",
    "title",
    "link",
    "description",
    "lastBuildDate",
    "docs",
    "generator",
    "copyright",
    "language",
    "item",
  ];
  Object.keys(channel).forEach((key) => {
    if (ignoreKeys.includes(key)) {
      return;
    }
    if (key === "ttl") {
      if (channel?.ttl?._text) {
        const ttl = parseInt(channel?.ttl?._text);
        if (!isNaN(ttl)) {
          feed.options.ttl = ttl;
        }
      }
    } else if (key === "image") {
      if (channel.image) {
        feed.options.image = channel.image.url?._text;
      }
    } else if (key === "category") {
      if (channel.category) {
        if (Array.isArray(channel.category)) {
          channel.category.forEach((item) => {
            if (item._text) {
              feed.addCategory(item._text);
            }
          });
        } else if (channel.category._text) {
          feed.addCategory(channel.category._text);
        }
      }
    } else if (key === "atom:link") {
      if (Array.isArray(channel["atom:link"])) {
        channel["atom:link"].forEach((item) => {
          buildAtomLink(item, feed);
        });
      } else if (channel["atom:link"]?._attributes?.href) {
        buildAtomLink(channel["atom:link"], feed);
      }
    } else if (!combinedFeedFields.includes(key)) {
      const value = channel[key];
      if (Array.isArray(value)) {
        feed.setCustomField(
          key,
          value.map((item) => item?._text),
        );
      } else {
        feed.setCustomField(key, value?._text);
      }
    }
  });

  if (items) {
    if (Array.isArray(items)) {
      items.forEach((item) => {
        buildItem(item, feed);
      });
    } else {
      buildItem(items, feed);
    }
  }

  return feed;
}

function buildAtomLink(atomLink: convert.ElementCompact, feed: Feed) {
  if (atomLink?._attributes?.href) {
    const href = atomLink._attributes.href.toString();
    const rel = atomLink._attributes?.rel;
    if (rel === "self") {
      feed.options.feed = href;
    } else if (rel === "hub") {
      feed.options.hub = href;
    }
  }
}

function buildItem(item: convert.ElementCompact, feed: Feed) {
  const date = item.pubDate?._text ? new Date(item.pubDate._text) : new Date();
  const feedItem = new FeedItem({
    id: item.guid?._text || "",
    title: {
      text:
        (item.title?._cdata as string) || (item.title?._text as string) || "",
      type: defaultTextType,
    },
    link: item.link?._text || "",
    date,
    published: date,
    description: {
      text: item.description?._cdata || item.description?._text || "",
      type: defaultTextType,
    },
    content: {
      text:
        item["content:encoded"]?._cdata || item["content:encoded"]?._text || "",
      type: defaultTextType,
    },
  });

  if (item.author) {
    if (Array.isArray(item.author)) {
      item.author.forEach((author) => {
        if (author._text) {
          feedItem.addAuthor(parseItemAuthor(author._text));
        }
      });
    } else if (item.author._text) {
      feedItem.addAuthor(parseItemAuthor(item.author._text));
    }
  }

  if (item.category) {
    if (Array.isArray(item.category)) {
      item.category.forEach((category) => {
        if (category._text) {
          feedItem.addCategory({
            name: category._text,
            domain: category._attributes?.domain,
          });
        }
      });
    } else if (item.category._text) {
      feedItem.addCategory({
        name: item.category._text,
        domain: item.category._attributes?.domain,
      });
    }
  }

  if (item.enclosure) {
    parseItemEnclosure(item.enclosure, feedItem);
  }

  Object.keys(item)
    .filter((key) => !combinedFeedItemFields.includes(key))
    .forEach((key) => {
      const value = item[key];
      if (Array.isArray(value)) {
        feedItem.setCustomField(
          key,
          value.map((item) => item?._text),
        );
      } else {
        feedItem.setCustomField(key, value?._text);
      }
    });

  feed.addItem(feedItem);
}

function parseItemAuthor(author: string): Author {
  const authorRegex = /^(.*)\((.*)\)$/;
  const match = author.match(authorRegex);
  if (match) {
    return {
      email: match[1].trim(),
      name: match[2].trim(),
    };
  }
  return {
    name: author,
    email: "",
  };
}

function parseItemEnclosure(
  enclosure: convert.ElementCompact,
  feedItem: FeedItem,
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
    url: enclosure._attributes?.url?.toString() || "",
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

function parseStylesheet(xml: convert.ElementCompact): string | undefined {
  if (xml._instruction && xml._instruction["xml-stylesheet"]) {
    const attrs = xml._instruction["xml-stylesheet"].split(" ");
    const hrefAttr = attrs.find((attr) => attr.startsWith("href="))?.split("=");
    if (hrefAttr && hrefAttr.length > 1 && hrefAttr[1]) {
      return hrefAttr[1].replace(/["]/g, "");
    }
  }
  return undefined;
}
