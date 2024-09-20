export interface CustomField {
  [key: string]: CustomFieldValue;
}

export type CustomFieldValue = string | number | boolean | undefined;

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
