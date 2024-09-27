import axios from "axios";
import * as convert from "xml-js";

import { Feed } from "../feed";
import { Opml } from "../opml";
import { FeedParseOptions } from "../typings";
import { isString } from "../utils";
import { parseAtom } from "./atom";
import { parseJSON } from "./json";
import { parseOPML } from "./opml";
import { parseRSS } from "./rss";

const DEFAULT_HEADERS = {
  "User-Agent": "@gaphub/feed-parser",
  Accept:
    "application/rss+xml, application/atom+xml, application/json, text/xml",
};
const DEFAULT_TIMEOUT = 60_000;
const DEFAULT_MAX_REDIRECTS = 5;

const defaultFeedParseOptions: FeedParseOptions = {
  timeout: DEFAULT_TIMEOUT,
  maxRedirects: DEFAULT_MAX_REDIRECTS,
};

export enum ContentType {
  XML,
  JSON,
}

export class FeedParser {
  private readonly etags = new Map<string, string>();
  private readonly lastModified = new Map<string, string>();

  /**
   * @deprecated
   */
  async parse(
    feedURLOrContent: string,
    options?: FeedParseOptions,
  ): Promise<Feed | null> {
    const opts = {
      ...defaultFeedParseOptions,
      ...options,
    };
    const content =
      (await this.getContentFromURL(feedURLOrContent, opts)) ?? "";
    return await this.parseString(content);
  }

  async parseURL(url: string | URL, options?: FeedParseOptions) {
    const opts = {
      ...defaultFeedParseOptions,
      ...options,
    };
    if (isString(url)) {
      // check the string is a valid URL
      url = new URL(url);
    }
    const content = (await this.getContentFromURL(url.toString(), opts)) ?? "";
    return await this.parseString(content);
  }

  parseString(content: string): Feed | null {
    try {
      const jsonFeed = JSON.parse(content);
      return parseJSON(jsonFeed);
    } catch {
      const xmlFeed: convert.ElementCompact = convert.xml2js(content, {
        compact: true,
      });
      if (xmlFeed.feed) {
        return parseAtom(xmlFeed);
      } else if (xmlFeed.rss) {
        return parseRSS(xmlFeed);
      }
    }
    return null;
  }

  async parseOPMLFromURL(
    url: string | URL,
    options?: FeedParseOptions,
  ): Promise<Opml | null> {
    const opts = {
      ...defaultFeedParseOptions,
      ...options,
    };
    const content = (await this.getContentFromURL(url.toString(), opts)) ?? "";
    return this.parseOPMLString(content);
  }

  parseOPMLString(content: string): Opml | null {
    if (!content) {
      return null;
    }
    return parseOPML(content);
  }

  private async getContentFromURL(
    feedURL: string,
    options: FeedParseOptions,
  ): Promise<string | null> {
    const headers: Record<string, string> = {
      ...DEFAULT_HEADERS,
      ...options?.headers,
    };
    if (this.etags.has(feedURL)) {
      headers["If-None-Match"] = this.etags.get(feedURL)!;
    }
    if (this.lastModified.has(feedURL)) {
      headers["If-Modified-Since"] = this.lastModified.get(feedURL)!;
    }
    const response = await axios.get<string>(feedURL, {
      headers,
      timeout: options.timeout,
      maxRedirects: options.maxRedirects,
      responseType: "text",
    });
    if (response.status === 304) {
      // Not modified
      return null;
    } else if (response.status >= 300) {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
    if (response.headers["etag"]) {
      this.etags.set(feedURL, response.headers["etag"]);
    }
    if (response.headers["last-modified"]) {
      this.lastModified.set(feedURL, response.headers["last-modified"]);
    }
    return response.data;
  }
}
