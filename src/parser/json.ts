import { defaultTextType } from "../config";
import { Feed } from "../feed";
import { FeedItem } from "../feed-item";
import { Extension, Text } from "../typings";

const fields = {
  feed: [
    "version",
    "title",
    "home_page_url",
    "feed_url",
    "description",
    "user_comment",
    "next_url",
    "icon",
    "favicon",
    "author",
    "authors",
    "language",
    "expired",
    "hubs",
    "items",
  ],
  item: [
    "id",
    "url",
    "external_url",
    "title",
    "content_text",
    "content_html",
    "summary",
    "image",
    "banner_image",
    "date_published",
    "date_modified",
    "author",
    "authors",
    "tags",
    "language",
  ],
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
  feed.extensions = parseJSONExtensions(json, true);

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

      feedItem.setExtensions(parseJSONExtensions(item, false));

      feed.addItem(feedItem);
    });
  }

  return feed;
}

function parseJSONExtensions(json: any, isFeed: boolean) {
  const extensions: Extension[] = [];
  Object.keys(json).forEach((key: string) => {
    const value = json[key];
    const builtinKeys: Array<string> = fields[isFeed ? "feed" : "item"];
    if (builtinKeys.indexOf(key) !== -1) {
      return;
    }
    extensions.push({ name: key, objects: value });
  });
  return extensions;
}
