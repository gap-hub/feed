import { FeedItem } from "./feed-item";
import { renderAtom, renderJSON, renderRSS } from "./render";
import { Author, Extension, FeedOptions, ItemOptions } from "./typings";
import { isString } from "./utils";

/**
 * Class used to generate Feeds
 */
export class Feed {
  options: FeedOptions;
  items: FeedItem[] = [];
  categories: string[] = [];
  contributors: Author[] = [];
  extensions: Extension[] = [];
  private _stylesheetHref?: string;

  constructor(options: FeedOptions) {
    this.options = options;
  }

  /**
   * Add a feed item
   * @param item
   */
  addItem(item: FeedItem | ItemOptions) {
    if (item instanceof FeedItem) {
      this.items.push(item);
    } else {
      this.items.push(new FeedItem(item));
    }
  }

  /**
   * Add a category
   * @param category
   */
  addCategory = (category: string) => this.categories.push(category);

  /**
   * Add a contributor
   * @param contributor
   */
  addContributor(contributor: Author | string) {
    if (isString(contributor)) {
      this.contributors.push({ name: contributor });
    } else {
      this.contributors.push(contributor);
    }
  }

  /**
   * Adds an extension
   * @param extension
   */
  addExtension = (extension: Extension) => this.extensions.push(extension);

  set stylesheet(href: string) {
    this._stylesheetHref = href;
  }

  get stylesheet(): string | undefined {
    return this._stylesheetHref;
  }

  /**
   * Returns a Atom 1.0 feed
   */
  atom1 = (): string => renderAtom(this);

  /**
   * Returns a RSS 2.0 feed
   */
  rss2 = (): string => renderRSS(this);

  /**
   * Returns a JSON1 feed
   */
  json1 = (): string => renderJSON(this);
}
