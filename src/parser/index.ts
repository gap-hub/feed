import axios from "axios";
import * as convert from "xml-js";

import { Feed } from "../feed";
import { FeedParseOptions } from "../typings";
import { isURL } from "../utils";
import { parseAtom } from "./atom";
import { parseJSON } from "./json";
import { parseRSS } from "./rss";

const DEFAULT_HEADERS = {
  "User-Agent": "@gaphub/feed-parser",
  Accept: "application/rss+xml, application/atom+xml, application/json",
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

  async parse(
    feedURLOrContent: string,
    options?: FeedParseOptions,
  ): Promise<Feed | null> {
    const opts = {
      ...defaultFeedParseOptions,
      ...options,
    };
    const content = await this.getContent(feedURLOrContent, opts);
    return await this.parseString(content);
  }

  async parseString(content: string): Promise<Feed | null> {
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

  private async getContent(
    urlOrContent: string,
    options: FeedParseOptions,
  ): Promise<string> {
    if (!isURL(urlOrContent)) {
      return urlOrContent;
    }
    return (await this.getContentFromURL(urlOrContent, options)) ?? "";
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
