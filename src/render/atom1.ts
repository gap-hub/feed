import * as convert from "xml-js";

import { defaultTextType, generator } from "../config";
import { Feed } from "../feed";
import { FeedItem } from "../feed-item";
import { Author, Category } from "../typings";
import { sanitize } from "../utils";

/**
 * Returns an Atom feed
 * @param ins
 */
export function renderAtom(ins: Feed) {
  const { options } = ins;

  const base: any = {
    _declaration: { _attributes: { version: "1.0", encoding: "utf-8" } },
  };
  if (ins.stylesheet) {
    base._instruction = {
      "xml-stylesheet": {
        _attributes: {
          href: sanitize(ins.stylesheet),
          type: "text/xsl",
        },
      },
    };
  }
  base.feed = {
    _attributes: { xmlns: "http://www.w3.org/2005/Atom" },
    id: options.id,
    title: options.title,
    updated: options.updated
      ? options.updated.toISOString()
      : new Date().toISOString(),
    generator: sanitize(options.generator || generator),
  };

  if (options.authors) {
    base.feed.author = formatAuthor(options.authors[0]);
  }

  base.feed.link = [];

  // link (rel="alternate")
  if (options.link) {
    base.feed.link.push({
      _attributes: { rel: "alternate", href: sanitize(options.link) },
    });
  }

  // link (rel="self")
  const atomLink = sanitize(
    options.feed || (options.feedLinks && options.feedLinks.atom),
  );

  if (atomLink) {
    base.feed.link.push({
      _attributes: { rel: "self", href: sanitize(atomLink) },
    });
  }

  // link (rel="hub")
  if (options.hub) {
    base.feed.link.push({
      _attributes: { rel: "hub", href: sanitize(options.hub) },
    });
  }

  /**************************************************************************
   * "feed" node: optional elements
   *************************************************************************/

  if (options.description) {
    base.feed.subtitle = options.description;
  }

  if (options.image) {
    base.feed.logo = options.image;
  }

  if (options.favicon) {
    base.feed.icon = options.favicon;
  }

  if (options.copyright) {
    base.feed.rights = options.copyright;
  }

  base.feed.category = [];

  ins.categories.map((category: string) => {
    base.feed.category.push({ _attributes: { term: category } });
  });

  base.feed.contributor = [];

  ins.contributors.map((contributor: Author) => {
    base.feed.contributor.push(formatAuthor(contributor));
  });

  // icon

  base.feed.entry = [];

  /**************************************************************************
   * "entry" nodes
   *************************************************************************/
  ins.items.map((feedItem: FeedItem) => {
    const item = feedItem.options;
    //
    // entry: required elements
    //

    const entry: convert.ElementCompact = {
      title: {
        _attributes: { type: item.title.type ?? defaultTextType },
        _cdata: item.title.text,
      },
      id: sanitize(item.id || item.link),
      link: [{ _attributes: { href: sanitize(item.link) } }],
      updated: item.date.toISOString(),
    };

    //
    // entry: recommended elements
    //
    if (item.description) {
      entry.summary = {
        _attributes: { type: item.description.type ?? defaultTextType },
        _cdata: item.description.text,
      };
    }

    if (item.content) {
      entry.content = {
        _attributes: { type: item.content.type ?? defaultTextType },
        _cdata: item.content.text,
      };
    }

    // entry author(s)
    if (Array.isArray(item.authors)) {
      entry.author = [];

      item.authors.map((author: Author) => {
        entry.author.push(formatAuthor(author));
      });
    }

    // content

    // link - relative link to article

    //
    // entry: optional elements
    //

    // category
    if (Array.isArray(item.category)) {
      entry.category = [];

      item.category.map((category: Category) => {
        entry.category.push(formatCategory(category));
      });
    }

    // contributor
    if (item.contributors && Array.isArray(item.contributors)) {
      entry.contributor = [];

      item.contributors.map((contributor: Author) => {
        entry.contributor.push(formatAuthor(contributor));
      });
    }

    // published
    if (item.published) {
      entry.published = item.published.toISOString();
    }

    // source

    // rights
    if (item.copyright) {
      entry.rights = item.copyright;
    }

    base.feed.entry.push(entry);
  });

  return convert.js2xml(base, {
    compact: true,
    ignoreComment: true,
    spaces: 4,
  });
}

/**
 * Returns a formatted author
 * @param author
 */
const formatAuthor = (author: Author) => {
  const { name, email, link } = author;

  const out: { name?: string; email?: string; uri?: string } = { name };
  if (email) {
    out.email = email;
  }

  if (link) {
    out.uri = sanitize(link);
  }

  return out;
};

/**
 * Returns a formatted category
 * @param category
 */
const formatCategory = (category: Category) => {
  const { name, scheme, term } = category;

  return {
    _attributes: {
      label: name,
      scheme,
      term,
    },
  };
};
