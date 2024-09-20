import * as convert from "xml-js";

import { defaultTextType } from "../config";
import { Feed } from "../feed";
import { FeedItem } from "../feed-item";

export function parseAtom(xml: convert.ElementCompact): Feed {
  const feedXml = xml.feed;
  const feed = new Feed({
    id: feedXml.id?._text ?? "",
    title: feedXml.title?._text ?? "",
    updated: feedXml.updated?._text
      ? new Date(feedXml.updated?._text)
      : new Date(),
    copyright: feedXml.rights?._text ?? "",
    generator: feedXml.generator?._text,
    description: feedXml.subtitle?._text,
    image: feedXml.logo?._text,
    favicon: feedXml.icon?._text,
  });

  if (feedXml.author) {
    feed.options.authors = [
      {
        name: feedXml.author.name?._text ?? "",
        email: feedXml.author.email?._text ?? "",
        link: feedXml.author.uri?._text ?? "",
      },
    ];
  }

  if (feedXml.link) {
    if (Array.isArray(feedXml.link)) {
      feedXml.link.forEach((item: any) => {
        buildFeedLink(item, feed);
      });
    } else {
      buildFeedLink(feedXml.link, feed);
    }
  }

  if (feedXml.category) {
    if (Array.isArray(feedXml.category)) {
      feedXml.category.forEach((item: any) => {
        if (item?._attributes?.term) {
          feed.addCategory(item._attributes.term);
        }
      });
    } else if (feedXml.category?._attributes?.term) {
      feed.addCategory(feedXml.category._attributes.term);
    }
  }

  if (feedXml.contributor) {
    if (Array.isArray(feedXml.contributor)) {
      feedXml.contributor.forEach((item: any) => {
        if (item.name?._text) {
          feed.addContributor({
            name: item.name?._text,
            email: item.email?._text,
            link: item.uri?._text,
          });
        }
      });
    } else if (feedXml.contributor.name?._text) {
      feed.addContributor({
        name: feedXml.contributor.name?._text,
        email: feedXml.contributor.email?._text,
        link: feedXml.contributor.uri?._text,
      });
    }
  }

  if (feedXml.entry) {
    if (Array.isArray(feedXml.entry)) {
      feedXml.entry.forEach((item: any) => {
        buildFeedItem(item, feed);
      });
    }
  } else {
    buildFeedItem(feedXml.entry, feed);
  }

  return feed;
}

function buildFeedItem(entry: convert.ElementCompact, feed: Feed) {
  const item = new FeedItem({
    id: entry.id?._text ?? "",
    title: {
      text: entry.title?._cdata ?? entry.title?._text ?? "",
      type: entry.title?._attributes?.type ?? defaultTextType,
    },
    link: entry.link?._attributes?.href ?? "",
    date: entry.updated?._text ? new Date(entry.updated?._text) : new Date(),
    description: {
      text: entry.summary?._cdata ?? entry.summary?._text ?? "",
      type: entry.summary?._attributes?.type ?? defaultTextType,
    },
    content: {
      text: entry.content?._cdata ?? entry.content?._text ?? "",
      type: entry.content?._attributes?.type ?? defaultTextType,
    },
    published: entry.published?._text
      ? new Date(entry.published?._text)
      : new Date(),
    copyright: entry.rights?._text,
  });

  if (entry.author) {
    if (Array.isArray(entry.author)) {
      entry.author.forEach((author: any) => {
        if (author.name?._text) {
          item.addAuthor({
            name: author.name?._text,
            email: author.email?._text,
            link: author.uri?._text,
          });
        }
      });
    } else if (entry.author.name?._text) {
      item.addAuthor({
        name: entry.author.name?._text,
        email: entry.author.email?._text,
        link: entry.author.uri?._text,
      });
    }
  }

  if (entry.category) {
    if (Array.isArray(entry.category)) {
      entry.category.forEach((category: any) => {
        if (category?._attributes?.label) {
          item.addCategory({
            name: category._attributes.label,
            term: category?._attributes?.term,
            scheme: category?._attributes?.scheme,
          });
        }
      });
    } else if (entry.category?._attributes?.label) {
      item.addCategory({
        name: entry.category._attributes.label,
        term: entry.category?._attributes?.term,
        scheme: entry.category?._attributes?.scheme,
      });
    }
  }

  if (entry.contributor) {
    if (Array.isArray(entry.contributor)) {
      entry.contributor.forEach((contributor: any) => {
        if (contributor.name?._text) {
          item.addContributor({
            name: contributor.name._text,
            email: contributor.email?._text,
            link: contributor.uri?._text,
          });
        }
      });
    } else if (entry.contributor.name?._text) {
      item.addContributor({
        name: entry.contributor.name._text,
        email: entry.contributor.email?._text,
        link: entry.contributor.uri?._text,
      });
    }
  }

  feed.addItem(item);
}

function buildFeedLink(link: convert.ElementCompact, feed: Feed) {
  if (link?._attributes?.href) {
    const href = link._attributes.href.toString();
    const rel = link?._attributes?.rel;
    if (rel === "self") {
      feed.options.feed = href;
      feed.options.feedLinks = {
        ...feed.options.feedLinks,
        atom: href,
      };
    } else if (rel === "hub") {
      feed.options.hub = href;
    } else if (rel === "alternate") {
      feed.options.link = href;
    }
  }
}
