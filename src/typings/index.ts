export interface Text {
  type?: "text" | "html";
  text: string;
}

export interface ItemOptions {
  title: Text;
  /**
   * The id of the feed item.
   *
   */
  id?: string;
  link: string;
  date: Date;

  description?: Text;
  content?: Text;
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
