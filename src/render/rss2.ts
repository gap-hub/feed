import * as convert from "xml-js";

import { generator } from "../config";
import { Feed } from "../feed";
import { FeedItem } from "../feed-item";
import {
  Category,
  Enclosure,
  combinedFeedFields,
  combinedFeedItemFields,
} from "../typings";
import { escapeXML, isString, isURL, isValidTagName } from "../utils";

/**
 * Returns a RSS 2.0 feed
 */
export function renderRSS(ins: Feed) {
  const { options, customFields } = ins;
  let isAtom = false;
  let isContent = false;

  const base: any = {
    _declaration: { _attributes: { version: "1.0", encoding: "utf-8" } },
  };
  if (ins.stylesheet) {
    base._instruction = {
      "xml-stylesheet": {
        _attributes: {
          href: escapeXML(ins.stylesheet),
          type: "text/xsl",
        },
      },
    };
  }
  base.rss = {
    _attributes: { version: "2.0" },
    channel: {
      title: { _text: escapeXML(options.title) },
      link: { _text: escapeXML(options.link) },
      description: { _text: escapeXML(options.description) },
      lastBuildDate: {
        _text: options.updated
          ? options.updated.toUTCString()
          : new Date().toUTCString(),
      },
      docs: {
        _text: options.docs
          ? escapeXML(options.docs)
          : "https://validator.w3.org/feed/docs/rss2.html",
      },
      generator: { _text: escapeXML(options.generator) || generator },
    },
  };

  /**
   * Channel language
   * https://validator.w3.org/feed/docs/rss2.html#ltlanguagegtSubelementOfLtchannelgt
   */
  if (options.language) {
    base.rss.channel.language = { _text: escapeXML(options.language) };
  }

  /**
   * Channel ttl
   * https://validator.w3.org/feed/docs/rss2.html#ltttlgtSubelementOfLtchannelgt
   */
  if (options.ttl) {
    base.rss.channel.ttl = { _text: options.ttl };
  }

  /**
   * Channel Image
   * https://validator.w3.org/feed/docs/rss2.html#ltimagegtSubelementOfLtchannelgt
   */
  if (options.image) {
    base.rss.channel.image = {
      title: { _text: escapeXML(options.title) },
      url: { _text: escapeXML(options.image) },
      link: { _text: escapeXML(options.link) },
    };
  }

  /**
   * Channel Copyright
   * https://validator.w3.org/feed/docs/rss2.html#optionalChannelElements
   */
  if (options.copyright) {
    base.rss.channel.copyright = { _text: escapeXML(options.copyright) };
  }

  /**
   * Channel Categories
   * https://validator.w3.org/feed/docs/rss2.html#comments
   */
  ins.categories.map((category) => {
    if (!base.rss.channel.category) {
      base.rss.channel.category = [];
    }
    base.rss.channel.category.push({ _text: escapeXML(category) });
  });

  /**
   * Feed URL
   * http://validator.w3.org/feed/docs/warning/MissingAtomSelfLink.html
   */
  const atomLink = options.feed || (options.feedLinks && options.feedLinks.rss);
  if (atomLink) {
    isAtom = true;
    base.rss.channel["atom:link"] = [
      {
        _attributes: {
          href: escapeXML(atomLink),
          rel: "self",
          type: "application/rss+xml",
        },
      },
    ];
  }

  /**
   * Hub for PubSubHubbub
   * https://code.google.com/p/pubsubhubbub/
   */
  if (options.hub) {
    isAtom = true;
    if (!base.rss.channel["atom:link"]) {
      base.rss.channel["atom:link"] = [];
    }
    base.rss.channel["atom:link"] = {
      _attributes: {
        href: escapeXML(options.hub),
        rel: "hub",
      },
    };
  }

  Object.keys(customFields)
    .filter((key) => !combinedFeedFields.includes(key))
    .forEach((key) => {
      if (!isValidTagName(key)) {
        throw new Error(`Invalid XML tag name: ${key}`);
      }
      const value = customFields[key];
      if (value && value.length > 0) {
        base.rss.channel[key] = value;
      }
    });

  /**
   * Channel Categories
   * https://validator.w3.org/feed/docs/rss2.html#hrelementsOfLtitemgt
   */
  base.rss.channel.item = [];

  ins.items.forEach((feedItem: FeedItem) => {
    const item: any = {};
    const entry = feedItem.options;

    if (entry.title) {
      item.title = {
        _cdata: isString(entry.title) ? entry.title : entry.title.text,
      };
    }

    if (entry.link) {
      item.link = { _text: escapeXML(entry.link) };
    }

    if (entry.id) {
      const isNotUrl = !isURL(entry.id);
      item.guid = { _text: escapeXML(entry.id) };
      if (isNotUrl) {
        item.guid._attributes = { isPermaLink: "false" };
      }
    } else if (entry.link) {
      item.guid = { _text: escapeXML(entry.link) };
    }

    if (entry.date) {
      item.pubDate = { _text: entry.date.toUTCString() };
    }

    if (entry.published) {
      item.pubDate = { _text: entry.published.toUTCString() };
    }

    if (entry.description) {
      item.description = {
        _cdata: isString(entry.description)
          ? entry.description
          : entry.description.text,
      };
    }

    if (entry.content) {
      isContent = true;
      item["content:encoded"] = {
        _cdata: isString(entry.content) ? entry.content : entry.content.text,
      };
    }
    /**
     * Item Author
     * https://validator.w3.org/feed/docs/rss2.html#ltauthorgtSubelementOfLtitemgt
     */
    if (Array.isArray(entry.authors)) {
      item.author = [];
      entry.authors.forEach((author) => {
        if (author.email && author.name) {
          item.author.push({
            _text: escapeXML(author.email + " (" + author.name + ")"),
          });
        }
      });
    }
    /**
     * Item Category
     * https://validator.w3.org/feed/docs/rss2.html#ltcategorygtSubelementOfLtitemgt
     */
    if (Array.isArray(entry.category)) {
      item.category = [];
      entry.category.forEach((category) => {
        item.category.push(formatCategory(category));
      });
    }

    /**
     * Item Enclosure
     * https://validator.w3.org/feed/docs/rss2.html#ltenclosuregtSubelementOfLtitemgt
     */
    if (entry.enclosure) {
      item.enclosure = formatEnclosure(entry.enclosure);
    }
    if (entry.image) {
      item.enclosure = formatEnclosure(entry.image, "image");
    }
    if (entry.audio) {
      item.enclosure = formatEnclosure(entry.audio, "audio");
    }
    if (entry.video) {
      item.enclosure = formatEnclosure(entry.video, "video");
    }

    Object.keys(feedItem.customFields)
      .filter((key) => !combinedFeedItemFields.includes(key))
      .forEach((key) => {
        if (!isValidTagName(key)) {
          throw new Error(`Invalid XML tag name: ${key}`);
        }
        const value = feedItem.customFields[key];
        if (value && value.length > 0) {
          item[key] = value;
        }
      });

    base.rss.channel.item.push(item);
  });

  if (isContent) {
    base.rss._attributes["xmlns:dc"] = "http://purl.org/dc/elements/1.1/";
    base.rss._attributes["xmlns:content"] =
      "http://purl.org/rss/1.0/modules/content/";
  }

  if (isAtom) {
    base.rss._attributes["xmlns:atom"] = "http://www.w3.org/2005/Atom";
  }
  return convert.js2xml(base, {
    compact: true,
    ignoreComment: true,
    spaces: 4,
  });
}

/**
 * Returns a formated enclosure
 * @param enclosure
 * @param mimeCategory
 */
const formatEnclosure = (
  enclosure: string | Enclosure,
  mimeCategory = "image",
) => {
  if (typeof enclosure === "string") {
    const type = new URL(enclosure).pathname.split(".").slice(-1)[0];
    return {
      _attributes: {
        length: 0,
        type: `${mimeCategory}/${type}`,
        url: escapeXML(enclosure),
      },
    };
  }

  const type = new URL(enclosure.url).pathname.split(".").slice(-1)[0];
  const { url, title, ...rest } = enclosure;
  return {
    _attributes: {
      length: 0,
      type: `${mimeCategory}/${type}`,
      url: escapeXML(url),
      title: escapeXML(title),
      ...rest,
    },
  };
};

/**
 * Returns a formated category
 * @param category
 */
const formatCategory = (category: Category) => {
  const { name, domain } = category;
  return {
    _text: escapeXML(name),
    _attributes: {
      domain,
    },
  };
};
