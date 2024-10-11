import { defaultTextType } from "../config";
import { Feed } from "../feed";
import { FeedItem } from "../feed-item";
import {
  Extension,
  Text,
  combinedFeedFields,
  combinedFeedItemFields,
} from "../typings";

const fields = {
  feed: combinedFeedFields,
  item: combinedFeedItemFields,
};

export function parseJSON(json: any): Feed {
  const feed = new Feed({
    id: json.id ?? "",
    title: json.title ?? "",
    copyright: "",
    link: json.home_page_url,
    description: json.description ?? "",
    image: json.icon,
    favicon: json.favicon,
    generator: json.generator ?? "",
    feedLinks: json.feed_url ? { json: json.feed_url } : undefined,
    language: json.language,
  });
  feed.options.authors = [];
  if (json.author) {
    feed.options.authors.push({
      name: json.author.name ?? "",
      email: json.author.email,
      link: json.author.url,
      avatar: json.author.avatar,
    });
  }
  if (Array.isArray(json.authors)) {
    json.authors.forEach((author: any) => {
      feed.options.authors?.push({
        name: author.name ?? "",
        email: author.email,
        link: author.url,
        avatar: author.avatar,
      });
    });
  }
  const [extensions, otherFields] = parseOtherFields(json, true);
  feed.extensions = extensions;
  feed.setCustomFields(otherFields);

  if (Array.isArray(json.items)) {
    json.items.forEach((item: any) => {
      const feedItem = new FeedItem({
        id: item.id ?? "",
        title: { text: item.title ?? "", type: defaultTextType },
        date: item.date_modified ? new Date(item.date_modified) : new Date(),
        link: item.url ?? "",
        description: { text: item.summary ?? "", type: defaultTextType },
        image: item.image,
        published: item.date_published
          ? new Date(item.date_published)
          : undefined,
      });
      let content: Text | undefined;
      if (item.content_text) {
        content = { text: item.content_text, type: "text" };
      } else if (item.content_html) {
        content = { text: item.content_html, type: "html" };
      }
      if (content) {
        feedItem.setContent(content);
      }

      if (item.author) {
        feedItem.addAuthor({
          name: item.author.name ?? "",
          email: item.author.email,
          link: item.author.url,
          avatar: item.author.avatar,
        });
      }
      if (Array.isArray(item.authors)) {
        item.authors.forEach((author: any) => {
          feedItem.addAuthor({
            name: author.name ?? "",
            email: author.email,
            link: author.url,
            avatar: author.avatar,
          });
        });
      }

      if (Array.isArray(item.tags)) {
        item.tags.forEach((tag: string) => {
          feedItem.addCategory(tag);
        });
      }

      const [extensions, otherFields] = parseOtherFields(item, false);
      feedItem.setExtensions(extensions);
      feedItem.setCustomFields(otherFields);

      feed.addItem(feedItem);
    });
  }

  return feed;
}

function parseOtherFields(
  json: any,
  isFeed: boolean,
): [Extension[], Record<string, string | string[]>] {
  const extensions: Extension[] = [];
  const otherFields: Record<string, string | string[]> = {};
  const builtinKeys: Array<string> = fields[isFeed ? "feed" : "item"];
  Object.keys(json).forEach((key) => {
    const value = json[key];
    if (builtinKeys.indexOf(key) !== -1) {
      return;
    }
    if (key.startsWith("_")) {
      extensions.push({ name: key, objects: value });
    } else {
      otherFields[key] = value;
    }
  });

  return [extensions, otherFields];
}
