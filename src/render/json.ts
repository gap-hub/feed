import { defaultTextType } from "../config";
import { Feed } from "../feed";
import { FeedItem } from "../feed-item";
import {
  Category,
  Extension,
  combinedFeedFields,
  combinedFeedItemFields,
} from "../typings";
import { isString } from "../utils";

/**
 * Returns a JSON feed
 * @param ins
 */
export function renderJSON(ins: Feed) {
  const { options, items, extensions, customFields } = ins;

  const feed: any = {
    version: "https://jsonfeed.org/version/1.1",
    title: options.title,
  };

  if (options.link) {
    feed.home_page_url = options.link;
  }

  if (options.feedLinks && options.feedLinks.json) {
    feed.feed_url = options.feedLinks.json;
  }

  if (options.description) {
    feed.description = options.description;
  }

  if (options.image) {
    feed.icon = options.image;
  }

  if (options.favicon) {
    feed.favicon = options.favicon;
  }

  if (options.language) {
    feed.language = options.language;
  }

  if (options.authors) {
    feed.authors = [];
    options.authors.forEach((author) => {
      const item: any = {};
      if (author.name) {
        item.name = author.name;
      }
      if (author.link) {
        item.url = author.link;
      }
      if (author.avatar) {
        item.avatar = author.avatar;
      }
      feed.authors.push(item);
    });
  }

  extensions.map((e: Extension) => {
    feed[e.name] = e.objects;
  });

  Object.keys(customFields)
    .filter((key) => !combinedFeedFields.includes(key))
    .forEach((key) => {
      const value = customFields[key];
      if (value && value.length > 0) {
        feed[key] = value;
      }
    });

  feed.items = items.map((userFeedItem: FeedItem) => {
    const item = userFeedItem.options;
    const itemCustomFields = userFeedItem.customFields;
    const feedItem: any = {
      id: item.id,
    };

    if (item.content) {
      if (isString(item.content)) {
        feedItem[defaultTextType === "html" ? "content_html" : "content_text"] =
          item.content;
      } else if (item.content.type === "text") {
        feedItem.content_text = item.content.text;
      } else {
        feedItem.content_html = item.content.text;
      }
    }
    if (item.link) {
      feedItem.url = item.link;
    }
    if (item.title) {
      feedItem.title = isString(item.title) ? item.title : item.title.text;
    }
    if (item.description) {
      feedItem.summary = isString(item.description)
        ? item.description
        : item.description.text;
    }

    if (item.image) {
      feedItem.image = item.image;
    }

    if (item.date) {
      feedItem.date_modified = item.date.toISOString();
    }
    if (item.published) {
      feedItem.date_published = item.published.toISOString();
    }

    if (item.authors) {
      feedItem.authors = [];
      item.authors.forEach((author) => {
        const item: any = {};
        if (author.name) {
          item.name = author.name;
        }
        if (author.link) {
          item.url = author.link;
        }
        if (author.avatar) {
          item.avatar = author.avatar;
        }
        feedItem.authors.push(item);
      });
    }

    if (Array.isArray(item.category)) {
      feedItem.tags = [];
      item.category.map((category: Category) => {
        if (category.name) {
          feedItem.tags.push(category.name);
        }
      });
    }

    if (item.extensions) {
      item.extensions.map((e: Extension) => {
        feedItem[e.name] = e.objects;
      });
    }

    Object.keys(itemCustomFields)
      .filter((key) => !combinedFeedItemFields.includes(key))
      .forEach((key) => {
        const value = itemCustomFields[key];
        if (value && value.length > 0) {
          feedItem[key] = value;
        }
      });

    return feedItem;
  });

  return JSON.stringify(feed, null, 4);
}
