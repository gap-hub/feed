import { FeedParser } from "../parser";

describe("parser", () => {
  it("should parse valid feed", async () => {
    const parser = new FeedParser();

    const feed = await parser.parse("https://www.producthunt.com/feed");
    expect(feed).not.toBeNull();
    expect(feed!.options.title).toBe(
      "Product Hunt — The best new products, every day",
    );
    expect(feed!.items.length).toBeGreaterThan(0);
  });
});
