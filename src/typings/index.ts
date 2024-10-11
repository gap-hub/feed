export interface Text {
  type?: "text" | "html";
  text: string;
}

export interface ItemOptions {
  title: string | Text;
  id?: string;
  link: string;
  date: Date;

  description?: string | Text;
  content?: string | Text;
  category?: Category[];

  // guid?: string | Guid;

  image?: string | Enclosure;
  audio?: string | Enclosure;
  video?: string | Enclosure;
  enclosure?: Enclosure;

  authors?: Author[];
  contributors?: Author[];

  published?: Date;
  copyright?: string;

  extensions?: Extension[];
}

export interface Enclosure {
  url: string;
  type?: string;
  length?: number;
  title?: string;
  duration?: number;
}

export interface Author {
  name: string;
  email?: string;
  link?: string;
  avatar?: string;
}

export interface Category {
  name: string;
  domain?: string;
  scheme?: string;
  term?: string;
}

export interface FeedOptions {
  id: string;
  title: string;
  updated?: Date;
  generator?: string;
  language?: string;
  /**
   * Time to live. It's a number of minutes that indicates how long a channel can be cached before refreshing from the source.
   */
  ttl?: number;

  feed?: string;
  feedLinks?: any;
  hub?: string;
  docs?: string;

  authors?: Author[];
  link?: string;
  description?: string;
  image?: string;
  favicon?: string;
  copyright: string;
}

export interface Extension {
  name: string;
  objects: any;
}

export interface FeedParseOptions {
  timeout?: number; // timeout in milliseconds
  headers?: Record<string, string>;
  maxRedirects?: number;
}

export interface OpmlOptions {
  version: string;
  head: OpmlHeadOptions;
  body: OpmlBodyOptions;
}

export interface OpmlHeadOptions {
  title?: string;
  description?: string;
  dateCreated?: Date;
  dateModified?: Date;
  ownerName?: string;
  ownerEmail?: string;
  ownerId?: string;
  docs?: string;
  expansionState?: number[];
  vertScrollState?: number;
  windowTop?: number;
  windowLeft?: number;
  windowBottom?: number;
  windowRight?: number;
  [key: string]: any;
}

export interface OpmlBodyOptions {
  outlines: OpmlOutlineOptions[];
}

export interface BaseOpmlOutlineOptions {
  text: string;
  // type: string;
  isComment?: boolean;
  isBreakpoint?: boolean;
  category?: string;
  created?: Date;
  outlines?: OpmlOutlineOptions[];
}

export interface RSSOpmlOutlineOptions extends BaseOpmlOutlineOptions {
  type: "rss";
  xmlUrl: string;
  title?: string;
  description?: string;
  htmlUrl?: string;
  language?: string;
  version?: string;
}

export interface LinkOpmlOutlineOptions extends BaseOpmlOutlineOptions {
  type: "link";
  url: string;
}

export interface IncludeOpmlOutlineOptions extends BaseOpmlOutlineOptions {
  type: "include";
  url: string;
}

export interface OtherOpmlOutlineOptions extends BaseOpmlOutlineOptions {
  type?: Exclude<string, "rss" | "link" | "include">;
  [key: string]: any;
}

export type OpmlOutlineOptions =
  | RSSOpmlOutlineOptions
  | LinkOpmlOutlineOptions
  | IncludeOpmlOutlineOptions
  | OtherOpmlOutlineOptions;

export const atom1FeedFields: string[] = [
  "_attributes",
  "_declaration",
  "_instruction",
  "id",
  "title",
  "updated",
  "generator",
  "author",
  "link",
  "subtitle",
  "logo",
  "icon",
  "rights",
  "category",
  "contributor",
  "entry",
];

export const atom1FeedItemFields: string[] = [
  "title",
  "id",
  "link",
  "updated",
  "summary",
  "content",
  "author",
  "category",
  "contributor",
  "published",
  "rights",
];

export const rssFeedFields: string[] = [
  "_attributes",
  "_declaration",
  "_instruction",
  "title",
  "link",
  "description",
  "lastBuildDate",
  "docs",
  "generator",
  "language",
  "ttl",
  "image",
  "copyright",
  "category",
  "atom:link",
  "item",
];

export const rssFeedItemFields: string[] = [
  "title",
  "link",
  "guid",
  "id",
  "pubDate",
  "description",
  "content:encoded",
  "author",
  "category",
  "enclosure",
];

export const jsonFeedFields: string[] = [
  "version",
  "title",
  "home_page_url",
  "feed_url",
  "description",
  "icon",
  "favicon",
  "language",
  "authors",
  "items",
];

export const jsonFeedItemFields: string[] = [
  "id",
  "content_text",
  "content_html",
  "url",
  "title",
  "summary",
  "image",
  "date_modified",
  "date_published",
  "authors",
  "tags",
  "extensions",
];

export const combinedFeedFields: string[] = [
  ...rssFeedFields,
  ...atom1FeedFields,
  ...jsonFeedFields,
];

export const combinedFeedItemFields: string[] = [
  ...rssFeedItemFields,
  ...atom1FeedItemFields,
  ...jsonFeedItemFields,
];
